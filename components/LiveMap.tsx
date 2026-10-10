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

/**
 * Detailed base maps from jetelain/Arma3Map (https://github.com/jetelain/Arma3Map), keyed by
 * lower-case worldName. Coordinates are game metres, like ours; the projection values come from
 * that project's maps/<world>.js. Worlds without an entry fall back to the server's height grid.
 */
const BASEMAPS: Record<
  string,
  {
    url: string;
    factorX: number;
    factorY: number;
    tileSize: number;
    maxNativeZoom: number;
    sea: string;
    attribution: string;
    /** Metres the tiles cover when less than the world (the rest is painted: sea to the east, `land` to the north). */
    extent?: number;
    land?: string;
  }
> = {
  altis: {
    url: 'https://jetelain.github.io/Arma3Map/maps/altis/{z}/{x}/{y}.png',
    factorX: 0.006839,
    factorY: 0.006836,
    tileSize: 212,
    maxNativeZoom: 6,
    sea: '#aec0d5',
    attribution:
      '&copy; Bohemia Interactive (<a href="https://www.bohemia.net/community/licenses/arma-public-license" target="_blank" rel="noreferrer">APL</a>) · map tiles <a href="https://github.com/jetelain/Arma3Map" target="_blank" rel="noreferrer">jetelain/Arma3Map</a>',
  },
  // Chernarus Redux is Chernarus on a 16384 m world: every town sits where it does on classic Chernarus (all 46
  // checked against the server's map feed), so its "chernarus_a3s" tiles line up; they cover the first 15360 m.
  // Our own tiles, rendered from the server's terrain export (scripts/basemap/render.py)
  chernarusredux: {
    url: '/maps/chernarusredux/{z}/{x}/{y}.png',
    factorX: 256 / 16384,
    factorY: 256 / 16384,
    tileSize: 256,
    maxNativeZoom: 5,
    sea: '#769ec7',
    land: '#a5bf89',
    attribution:
      'Map rendered from server terrain data &copy; Bohemia Interactive, CUP Team (<a href="https://www.bohemia.net/community/licenses/arma-public-license" target="_blank" rel="noreferrer">APL</a>)',
  },
};

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
export function LiveMap({ autoRefresh = true, port }: { autoRefresh?: boolean; port?: number }) {
  const [data, setData] = useState<MapResponse | null>(null);
  const [terrain, setTerrain] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const lf = useRef<{ L: typeof Leaflet; map: Leaflet.Map; layers: Leaflet.LayerGroup; towns: Leaflet.LayerGroup } | null>(
    null,
  );
  const terrainLayer = useRef<Leaflet.ImageOverlay | null>(null);
  const tileLayer = useRef<Leaflet.TileLayer | null>(null);
  const fitted = useRef(false);

  // Poll the map state.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const url = port ? `/api/map?port=${port}` : '/api/map';
        const res = await fetch(url);
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
  }, [autoRefresh, port]);

  const worldName = data?.world?.name;
  const basemap = worldName ? BASEMAPS[worldName.toLowerCase()] : undefined;

  // Shaded relief from the server's height grid, only for worlds without a detailed base map.
  const terrainAvailable = data?.terrainAvailable;
  useEffect(() => {
    if (!worldName || !terrainAvailable || basemap) return;
    let alive = true;
    const url = port ? `/api/map/terrain?port=${port}` : '/api/map/terrain';
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((t: TerrainResponse | null) => {
        if (alive && t?.rows?.length) setTerrain(renderTerrain(t));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [worldName, terrainAvailable, basemap, port]);

  // Create the Leaflet map once data exists.
  const size = data?.world?.size;
  useEffect(() => {
    if (!size || !worldName || !container.current || lf.current) return;
    let cancelled = false;
    import('leaflet').then((mod) => {
      if (cancelled || !container.current) return;
      const L = mod.default ?? mod;
      const bounds = L.latLngBounds([0, 0], [size, size]);
      // Game metres as lat (north) / lng (east). With a base map, use its projection so its tiles
      // line up; otherwise the whole world is 256 px at zoom 0.
      const transformation = basemap
        ? new L.Transformation(basemap.factorX, 0, -basemap.factorY, basemap.tileSize)
        : new L.Transformation(256 / size, 0, -256 / size, 256);
      const crs = L.extend({}, L.CRS.Simple, { transformation });
      const map = L.map(container.current, {
        crs,
        minZoom: 1,
        maxZoom: 7,
        // Whole zoom levels: tiles draw at native size (sharp, and no hairline seams between them).
        zoomSnap: 1,
        attributionControl: !!basemap,
        maxBounds: bounds.pad(0.1),
        maxBoundsViscosity: 0.8,
      });
      map.fitBounds(bounds);
      map.attributionControl?.setPrefix(false);
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
  }, [size, worldName, basemap]);

  useEffect(
    () => () => {
      lf.current?.map.remove();
      lf.current = null;
    },
    [],
  );

  // Base map: jetelain's detailed tiles when this world has them, shaded relief otherwise.
  useEffect(() => {
    const m = lf.current;
    if (!m || !size) return;
    if (basemap) {
      if (!tileLayer.current) {
        tileLayer.current = m.L.tileLayer(basemap.url, {
          tileSize: basemap.tileSize,
          minZoom: 0,
          maxZoom: 7,
          maxNativeZoom: basemap.maxNativeZoom,
          noWrap: true,
          bounds: m.L.latLngBounds([0, 0], [basemap.extent ?? size, basemap.extent ?? size]),
          attribution: basemap.attribution,
        }).addTo(m.map);
        tileLayer.current.bringToBack();
        // The base map's tiles run a few pixels past the world's east and north edges, where they
        // are blank; paint those strips in the sea colour just above the tiles.
        const pane = m.map.createPane('worldEdge');
        pane.style.zIndex = '250';
        pane.style.pointerEvents = 'none';
        const edge = basemap.extent ?? size; // where the tiles end
        const far = size * 2;
        for (const [rect, colour] of [
          [[[-size, edge], [far, far]], basemap.sea], // east
          [[[edge, -size], [far, edge]], basemap.land ?? basemap.sea], // north
        ] as [[number, number][], string][]) {
          m.L.rectangle(m.L.latLngBounds(rect), {
            pane: 'worldEdge',
            stroke: false,
            fillColor: colour,
            fillOpacity: 1,
            interactive: false,
          }).addTo(m.map);
        }
      }
    } else if (terrain && !terrainLayer.current) {
      terrainLayer.current = m.L.imageOverlay(terrain, [[0, 0], [size, size]], { interactive: false }).addTo(m.map);
      terrainLayer.current.bringToBack();
    }
  }, [terrain, size, ready, basemap]);

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
        map.fitBounds(L.latLngBounds(pts).pad(0.02));
        fitted.current = true;
      }
    }
    towns.clearLayers();

    // The detailed base maps already print town names.
    for (const t of basemap ? [] : data.towns) {
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
  }, [data, ready, basemap]);

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
          basemap ? 'map-light' : ''
        }`}
        style={{ background: basemap ? basemap.sea : SEA }}
        aria-label={`Map of ${data.world?.name ?? 'the server'}`}
      />
    </div>
  );
}
