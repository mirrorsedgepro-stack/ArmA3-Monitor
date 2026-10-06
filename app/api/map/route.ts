import { NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

export interface MapPlayer {
  name: string;
  x: number;
  y: number;
  dir: number;
  vehicle: string | null;
  side: string | null;
}

export interface MapZone {
  marker: string;
  kind: 'airbase' | 'milbase' | 'outpost' | 'seaport' | 'factory' | 'resource' | 'city';
  x: number;
  y: number;
  side: string | null;
  label: string;
  changedAt: string | null;
}

export interface MapTown {
  name: string;
  type: string;
  x: number;
  y: number;
}

export interface MapResponse {
  available: boolean;
  world: { name: string; size: number; grid: number } | null;
  terrainAvailable: boolean;
  towns: MapTown[];
  zones: MapZone[];
  hq: { x: number; y: number } | null;
  players: MapPlayer[];
  trails: Record<string, [number, number][]>;
  playersAt: string | null;
  delaySeconds: number;
}

/** Live map state reported by the game server (zones, HQ, player positions). */
export async function GET() {
  const data = await bridgeFetch<Omit<MapResponse, 'available'>>('/api/map');
  const body: MapResponse = data?.world
    ? { available: true, ...data }
    : {
        available: false,
        world: null,
        terrainAvailable: false,
        towns: [],
        zones: [],
        hq: null,
        players: [],
        trails: {},
        playersAt: null,
        delaySeconds: 0,
      };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20' } });
}
