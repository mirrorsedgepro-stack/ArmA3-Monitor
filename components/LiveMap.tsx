'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapResponse, MapZone } from '@/app/api/map/route';
import type { TerrainResponse } from '@/app/api/map/terrain/route';
import { formatSince } from '@/lib/format';

const SIDE_COLORS: Record<string, string> = {
  GUER: '#22c55e', // rebels
  WEST: '#ef4444', // occupants
  EAST: '#f97316', // invaders
  CIV: '#94a3b8',
};
const SIDE_LABELS: Record<string, string> = { GUER: 'Rebels', WEST: 'Occupants', EAST: 'Invaders', CIV: 'Civilian' };

const ZONE_RADIUS: Record<MapZone['kind'], number> = {
  airbase: 7,
  milbase: 6,
  outpost: 5,
  seaport: 4,
  factory: 4,
  resource: 4,
  city: 3,
};
const ZONE_KIND_LABELS: Record<MapZone['kind'], string> = {
  airbase: 'Airbase',
  milbase: 'Military base',
  outpost: 'Outpost',
  seaport: 'Seaport',
  factory: 'Factory',
  resource: 'Resource',
  city: 'Town',
};

const SEA = '#0c1a2b';
const SEA_LIGHT = '#a6c4de'; // matches the tiles' sea

/** Shaded relief from the server's height grid (rows south to north). */
function renderTerrain(t: TerrainResponse): string {
  const n = t.grid;
  const h = new Float32Array(n * n);
  for (let r = 0; r < n; r++) {
    const row = t.rows[r];
    for (let c = 0; c < n; c++) {
      const v = parseInt(row.substr(c * 2, 2), 16);
      h[r * n + c] = v === 0 ? -1 : (v - 1) * 1.5;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(n, n);
  const cell = t.size / n;
  const at = (r: number, c: number) => h[Math.min(n - 1, Math.max(0, r)) * n + Math.min(n - 1, Math.max(0, c))];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const i = ((n - 1 - r) * n + c) * 4; // canvas y runs north to south
      const z = h[r * n + c];
      let R: number, G: number, B: number;
      if (z < 0) {
        // shallow water next to land is lighter
        const coast = at(r + 1, c) >= 0 || at(r - 1, c) >= 0 || at(r, c + 1) >= 0 || at(r, c - 1) >= 0;
        [R, G, B] = coast ? [20, 42, 64] : [12, 26, 43];
      } else {
        // hillshade, light from the north-west
        const dx = (Math.max(0, at(r, c + 1)) - Math.max(0, at(r, c - 1))) / (2 * cell);
        const dy = (Math.max(0, at(r + 1, c)) - Math.max(0, at(r - 1, c))) / (2 * cell);
        const shade = Math.max(0, Math.min(1, 0.62 + (-dx + dy) * 2.2));
        const e = Math.min(1, z / 300);
        const base = [52 + 70 * e, 64 + 52 * e, 52 + 40 * e];
        [R, G, B] = base.map((b) => b * (0.55 + 0.75 * shade));
      }
      img.data[i] = R;
      img.data[i + 1] = G;
      img.data[i + 2] = B;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

/**
 * Live map of the server: terrain, Antistasi zone ownership, rebel HQ and player positions.
 * Renders nothing until the game server has reported its map.
 */
export function LiveMap({ autoRefresh = true }: { autoRefresh?: boolean }) {
  const [data, setData] = useState<MapResponse | null>(null);
  const [terrain, setTerrain] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const lf = useRef<{ L: typeof Leaflet; map: Leaflet.Map; layers: Leaflet.LayerGroup; towns: Leaflet.LayerGroup } | null>(
    null,
  );
  const terrainLayer = useRef<Leaflet.ImageOverlay | null>(null);
  const tileLayer = useRef<{ version: string; layer: Leaflet.TileLayer } | null>(null);
  const fitted = useRef(false);

  // Poll the map state.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch('/api/map');
        if (!res.ok) return;
        const d: MapResponse = await res.json();
        if (alive && d.available) setData(d);
      } catch {
        // keep last good state
      }
    };
    load();
    if (!autoRefresh) return () => { alive = false; };
    const t = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [autoRefresh]);

  const tileVersion = data?.tiles?.ready ? data.tiles.version : null;

  // Terrain once per world (only needed until the detailed tiles exist).
  const worldName = data?.world?.name;
  const terrainAvailable = data?.terrainAvailable;
  useEffect(() => {
    if (!worldName || !terrainAvailable || tileVersion) return;
    let alive = true;
    fetch('/api/map/terrain')
      .then((r) => (r.ok ? r.json() : null))
      .then((t: TerrainResponse | null) => {
        if (alive && t?.rows?.length) setTerrain(renderTerrain(t));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [worldName, terrainAvailable, tileVersion]);

  // Create the Leaflet map once data exists.
  const size = data?.world?.size;
  useEffect(() => {
    if (!size || !container.current || lf.current) return;
    let cancelled = false;
    import('leaflet').then((mod) => {
      if (cancelled || !container.current) return;
      const L = mod.default ?? mod;
      const bounds = L.latLngBounds([0, 0], [size, size]);
      // Game metres as lat (north) / lng (east); the whole world is 256 px at zoom 0, which is
      // also the bridge's tile scheme (tile y=0 at the north edge).
      const scale = 256 / size;
      const crs = L.extend({}, L.CRS.Simple, { transformation: new L.Transformation(scale, 0, -scale, 256) });
      const map = L.map(container.current, {
        crs,
        minZoom: 1,
        maxZoom: 7,
        // Whole zoom levels: tiles draw at native size (sharp, and no hairline seams between them).
        zoomSnap: 1,
        attributionControl: false,
        maxBounds: bounds.pad(0.1),
        maxBoundsViscosity: 0.8,
      });
      map.fitBounds(bounds);
      fitted.current = false;
      const towns = L.layerGroup();
      const updateTowns = () => {
        if (map.getZoom() >= 3) towns.addTo(map);
        else towns.remove();
      };
      map.on('zoomend', updateTowns);
      updateTowns();
      lf.current = { L, map, layers: L.layerGroup().addTo(map), towns };
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [size]);

  useEffect(
    () => () => {
      lf.current?.map.remove();
      lf.current = null;
    },
    [],
  );

  // Base map: Arma-style tiles once the bridge has rendered them, shaded relief until then.
  useEffect(() => {
    const m = lf.current;
    if (!m || !size) return;
    if (tileVersion) {
      if (tileLayer.current?.version !== tileVersion) {
        tileLayer.current?.layer.remove();
        const layer = m.L.tileLayer(`/api/map/tiles/${tileVersion}/{z}/{x}/{y}.png`, {
          tileSize: 256,
          minZoom: 0,
          maxZoom: 7,
          maxNativeZoom: 6,
          noWrap: true,
          bounds: m.L.latLngBounds([0, 0], [size, size]),
        }).addTo(m.map);
        layer.bringToBack();
        tileLayer.current = { version: tileVersion, layer };
      }
      terrainLayer.current?.remove();
      terrainLayer.current = null;
    } else if (terrain && !terrainLayer.current) {
      terrainLayer.current = m.L.imageOverlay(terrain, [[0, 0], [size, size]], { interactive: false }).addTo(m.map);
      terrainLayer.current.bringToBack();
    }
  }, [terrain, size, ready, tileVersion]);

  // Zones, towns, HQ, players.
  useEffect(() => {
    const m = lf.current;
    if (!m || !data) return;
    const { L, map, layers, towns } = m;
    layers.clearLayers();

    // First draw: frame the area that has towns and zones rather than the whole (mostly sea) square.
    if (!fitted.current) {
      const pts = [...data.towns, ...data.zones].map((p) => [p.y, p.x] as [number, number]);
      if (pts.length > 1) {
        map.fitBounds(L.latLngBounds(pts).pad(0.06));
        fitted.current = true;
      }
    }
    towns.clearLayers();

    for (const t of data.towns) {
      if (!['NameCityCapital', 'NameCity', 'NameVillage'].includes(t.type)) continue;
      L.marker([t.y, t.x], {
        interactive: false,
        icon: L.divIcon({
          className: '',
          html: `<span class="map-town ${t.type === 'NameVillage' ? 'map-town-small' : ''}">${escapeHtml(t.name)}</span>`,
          iconSize: [0, 0],
        }),
      }).addTo(towns);
    }

    for (const z of data.zones) {
      const color = (z.side && SIDE_COLORS[z.side]) || '#64748b';
      const owner = (z.side && SIDE_LABELS[z.side]) || 'Unknown';
      const since = z.changedAt ? ` · since ${formatSince(z.changedAt)}` : '';
      L.circleMarker([z.y, z.x], {
        radius: ZONE_RADIUS[z.kind] ?? 4,
        color: z.kind === 'airbase' || z.kind === 'milbase' ? '#e2e8f0' : color,
        weight: z.kind === 'airbase' || z.kind === 'milbase' ? 1.5 : 1,
        fillColor: color,
        fillOpacity: z.kind === 'city' ? 0.5 : 0.85,
      })
        .bindTooltip(`<b>${escapeHtml(z.label)}</b><br>${ZONE_KIND_LABELS[z.kind] ?? z.kind} · ${owner}${since}`, {
          direction: 'top',
        })
        .addTo(layers);
    }

    if (data.hq) {
      L.marker([data.hq.y, data.hq.x], {
        icon: L.divIcon({ className: '', html: '<span class="map-hq">HQ</span>', iconSize: [0, 0] }),
      })
        .bindTooltip('<b>Rebel HQ</b>', { direction: 'top' })
        .addTo(layers);
    }

    for (const trail of Object.values(data.trails)) {
      if (trail.length < 2) continue;
      L.polyline(
        trail.map(([x, y]) => [y, x] as [number, number]),
        { color: '#38bdf8', weight: 2, opacity: 0.45, interactive: false },
      ).addTo(layers);
    }

    for (const p of data.players) {
      L.circleMarker([p.y, p.x], { radius: 6, color: '#f8fafc', weight: 2, fillColor: '#38bdf8', fillOpacity: 1 })
        .bindTooltip(`${escapeHtml(p.name)}${p.vehicle ? ` <span class="map-veh">· ${escapeHtml(p.vehicle)}</span>` : ''}`, {
          permanent: true,
          direction: 'right',
          offset: [6, 0],
          className: 'map-player',
        })
        .addTo(layers);
    }
  }, [data, ready]);

  if (!data) return null;

  const owned = (side: string) => data.zones.filter((z) => z.kind !== 'city' && z.side === side).length;
  const military = data.zones.filter((z) => z.kind !== 'city').length;

  return (
    <div className="hp-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-200">{data.world?.name}</div>
          <div className="text-xs text-slate-500">
            {data.players.length > 0
              ? `${data.players.length} player${data.players.length === 1 ? '' : 's'} · positions ${
                  data.delaySeconds > 0 ? `delayed ${Math.round(data.delaySeconds / 60)} min · ` : ''
                }${formatSince(data.playersAt)}`
              : 'No players in the field'}
            {data.tiles?.rendering && (
              <span>
                {' '}
                · drawing detailed map{data.tiles.progress != null ? ` ${Math.round(data.tiles.progress * 100)}%` : ''}…
              </span>
            )}
          </div>
        </div>
        {military > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
            {(['GUER', 'WEST', 'EAST'] as const).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: SIDE_COLORS[s] }} />
                {SIDE_LABELS[s]} {owned(s)}
              </span>
            ))}
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border-2 border-slate-100 bg-sky-400" />
              Players
            </span>
          </div>
        )}
      </div>
      <div
        ref={container}
        className={`aspect-square w-full border-t border-white/5 sm:aspect-auto sm:h-[60vh] sm:max-h-[640px] sm:min-h-[360px] ${
          tileVersion ? 'map-light' : ''
        }`}
        style={{ background: tileVersion ? SEA_LIGHT : SEA }}
        aria-label={`Map of ${data.world?.name ?? 'the server'}`}
      />
    </div>
  );
}
