import { NextRequest, NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

export interface TerrainResponse {
  world: string;
  size: number;
  grid: number;
  /** `grid` rows, south to north, 2 hex chars per cell: 00 = sea, else 1 + height / 1.5 m. */
  rows: string[];
}

/** Height grid the game server sampled from its own terrain. Changes only with the map. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const port = searchParams.get('port');
  const telemetryPort = searchParams.get('telemetryPort') || (port === '2402' ? '2410' : null);
  const data = await bridgeFetch<TerrainResponse>('/api/map/terrain', 10000, telemetryPort);
  if (!data?.rows?.length) {
    return NextResponse.json({ error: 'Terrain not available' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
