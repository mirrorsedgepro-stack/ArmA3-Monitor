#!/usr/bin/env python3
"""Render our own base map tiles from the game server's map export (@a3gm MAPEXPORT, A3MX lines).

    scripts/basemap/.venv/bin/python scripts/basemap/render.py scripts/basemap/chernarusredux.a3mx.gz

Writes public/maps/<world>/{z}/{x}/{y}.png: 256 px tiles, zoom 0 = the whole world in one tile, the deepest zoom
at 2 m per pixel. Leaflet uses them with a CRS factor of 256 / worldSize (components/LiveMap.tsx).

The export holds terrain heights and sea depth on a 16 m grid, tree density on a 64 m grid, every road segment
(type, ends, width) and every building (centre, heading, footprint). The map is painted from those: sea by depth,
land by elevation with hill shading, forest, contour lines (10 m, bold every 50 m), coastline, roads by class and
buildings, then cut into a tile pyramid.
"""

import gzip
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_ROOT = os.path.join(HERE, "..", "..", "public", "maps")
M_PER_PX = 2.0          # deepest zoom
TILE = 256

# Palette (light topographic, readable under the live map's coloured markers)
SEA_SHALLOW = np.array([181, 208, 232], float)
SEA_DEEP = np.array([118, 158, 199], float)
LAND_STOPS = [(0, (236, 240, 222)), (60, (230, 234, 206)), (180, (226, 222, 192)), (350, (219, 206, 172)),
              (600, (205, 190, 160))]
FOREST = np.array([150, 190, 128], float)
CONTOUR = (150, 120, 90)
COAST = (78, 120, 160)
ROADS = {  # type: (fill, outline, width m, draw order)
    "MAIN ROAD": ((246, 174, 92), (150, 95, 40), 9, 3),
    "ROAD": ((255, 247, 200), (130, 120, 100), 6, 2),
    "TRACK": ((176, 140, 100), None, 3, 1),
}
BUILDING = (138, 132, 126)
BUILDING_EDGE = (95, 90, 86)


def load(path):
    rows_h, rows_d, rows_f, roads, buildings, meta = {}, {}, {}, [], [], {}
    with gzip.open(path, "rt", encoding="utf-8", errors="replace") as f:
        for line in f:
            p = line.rstrip("\n").split("|")
            if len(p) < 2 or p[0] != "A3MX":
                continue
            k = p[1]
            if k == "begin":
                meta = {"world": p[2], "size": float(p[3]), "cells": int(p[4])}
            elif k in ("h", "d"):
                (rows_h if k == "h" else rows_d).setdefault(int(p[2]), {})[int(p[3])] = p[4]
            elif k == "f":
                rows_f[int(p[2])] = p[3]
            elif k == "r":
                roads.append((p[2], float(p[3]), float(p[4]), float(p[5]), float(p[6]), float(p[7]), p[8] == "1"))
            elif k == "b":
                buildings.append((float(p[2]), float(p[3]), float(p[4]), float(p[5]), float(p[6])))
    n = meta["cells"]

    def grid(rows, cells):
        g = np.zeros((cells, cells), np.float32)
        for r, parts in rows.items():
            s = "".join(parts[i] for i in sorted(parts)) if isinstance(parts, dict) else parts
            vals = np.frombuffer(bytes.fromhex(s[: cells * 2]), np.uint8).astype(np.float32)
            g[r, : len(vals)] = vals
        return g  # row 0 = south

    h, d = grid(rows_h, n), grid(rows_d, n)
    elev = np.where(h > 0, (h - 1) * 1.5, -np.maximum(d - 1, 0))
    trees = grid(rows_f, len(rows_f)) if rows_f else None
    return meta, elev, trees, roads, buildings


def resize_float(a, px):
    """Bilinear upsample of a south-first grid to a north-first px x px image."""
    img = Image.fromarray(np.flipud(a).astype(np.float32), mode="F")
    return np.asarray(img.resize((px, px), Image.BILINEAR), np.float32)


def land_colour(e):
    out = np.zeros(e.shape + (3,), np.float32)
    stops = LAND_STOPS
    for (h0, c0), (h1, c1) in zip(stops, stops[1:]):
        t = np.clip((e - h0) / (h1 - h0), 0, 1)[..., None]
        band = (e >= h0) & (e < h1)
        out[band] = (np.array(c0) * (1 - t) + np.array(c1) * t)[band]
    out[e >= stops[-1][0]] = stops[-1][1]
    return out


def hillshade(elev, cell_m):
    gy, gx = np.gradient(elev, cell_m)          # rows south to north
    slope = np.arctan(np.hypot(gx, gy) * 1.6)
    aspect = np.arctan2(-gx, gy)
    az, alt = math.radians(315), math.radians(45)  # light from the north-west
    shade = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
    return np.clip(shade, 0, 1)


def contour_mask(e, step):
    k = np.floor(e / step)
    m = np.zeros(e.shape, bool)
    m[:, :-1] |= k[:, :-1] != k[:, 1:]
    m[:-1, :] |= k[:-1, :] != k[1:, :]
    return m


def main(path):
    meta, elev, trees, roads, buildings = load(path)
    size, world = meta["size"], meta["world"]
    px = int(size / M_PER_PX)
    print(f"{world}: {size:.0f} m, {elev.shape[0]} height cells, {len(roads)} roads, {len(buildings)} buildings -> {px} px")

    e = resize_float(elev, px)
    shade = resize_float(hillshade(elev, size / elev.shape[0]), px)
    land = e > 0
    rgb = land_colour(e)
    depth = np.clip(-e / 60.0, 0, 1)[..., None]
    rgb[~land] = (SEA_SHALLOW * (1 - depth) + SEA_DEEP * depth)[~land]
    # hill shading on land only (0.78 .. 1.06)
    rgb[land] *= (0.78 + 0.28 * shade)[land][..., None]
    if trees is not None:
        density = resize_float(np.clip((trees - 2) / 18.0, 0, 1), px)
        a = (np.clip(density, 0, 1) * 0.75)[..., None] * land[..., None]
        rgb = rgb * (1 - a) + FOREST * a * (0.82 + 0.25 * shade[..., None])
    # contours: 10 m faint, 50 m bold; coastline
    for step, alpha in ((10, 0.22), (50, 0.5)):
        m = contour_mask(e, step) & land
        rgb[m] = rgb[m] * (1 - alpha) + np.array(CONTOUR) * alpha
    coast = contour_mask(np.where(land, 1.0, -1.0), 1.0)
    rgb[coast] = COAST
    img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")
    del e, shade, rgb

    draw = ImageDraw.Draw(img)
    to_px = lambda x, y: (x / M_PER_PX, (size - y) / M_PER_PX)
    # roads: outlines first, then fills, minor classes under major ones
    for outline_pass in (True, False):
        for kind, (fill, edge, width_m, order) in sorted(ROADS.items(), key=lambda kv: kv[1][3]):
            w = max(1, int(round(width_m / M_PER_PX)))
            for t, x1, y1, x2, y2, rw, bridge in roads:
                if t != kind:
                    continue
                a, b = to_px(x1, y1), to_px(x2, y2)
                if outline_pass and edge:
                    draw.line([a, b], fill=edge, width=w + 2)
                elif not outline_pass:
                    draw.line([a, b], fill=fill, width=w)
    # buildings: rotated footprints (Arma headings are clockwise from north)
    for x, y, d, bw, bl in buildings:
        r = math.radians(d)
        c, s = math.cos(r), math.sin(r)
        pts = []
        for dx, dy in ((-bw / 2, -bl / 2), (bw / 2, -bl / 2), (bw / 2, bl / 2), (-bw / 2, bl / 2)):
            pts.append(to_px(x + dx * c + dy * s, y - dx * s + dy * c))
        draw.polygon(pts, fill=BUILDING, outline=BUILDING_EDGE)

    out = os.path.join(OUT_ROOT, world.lower())
    zmax = int(math.log2(px // TILE))
    level = img
    total = 0
    for z in range(zmax, -1, -1):
        n = 2 ** z
        if level.size[0] != n * TILE:
            level = level.resize((n * TILE, n * TILE), Image.LANCZOS)
        for tx in range(n):
            os.makedirs(os.path.join(out, str(z), str(tx)), exist_ok=True)
            for ty in range(n):
                tile = level.crop((tx * TILE, ty * TILE, (tx + 1) * TILE, (ty + 1) * TILE))
                tile = tile.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
                tile.save(os.path.join(out, str(z), str(tx), f"{ty}.png"), optimize=True)
                total += 1
        print(f"zoom {z}: {n * n} tiles")
    img.resize((1024, 1024), Image.LANCZOS).save(os.path.join(HERE, f"{world.lower()}_preview.png"))
    print(f"{total} tiles in {out}; preview in scripts/basemap/{world.lower()}_preview.png; max zoom {zmax}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "chernarusredux.a3mx.gz"))
