import { NextRequest, NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

export type ServerEventType =
  | 'death'
  | 'join'
  | 'leave'
  | 'kill';

export interface ServerEvent {
  id: string;
  t: string;
  type: ServerEventType;
  player?: string | null;
  // kill (from the A3KF server hook)
  kind?: 'man' | 'veh';
  victim?: string;
  victimSide?: string | null;
  victimIsPlayer?: boolean;
  killer?: string | null;
  killerSide?: string | null;
  killerIsPlayer?: boolean;
  weapon?: string | null;
  distance?: number | null;
}

export interface EventsResponse {
  available: boolean;
  trackingSince: string | null;
  events: ServerEvent[];
}

/** Event feed (joins, leaves, deaths, kills) parsed from the game server's log by the telemetry bridge. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(500, parseInt(searchParams.get('limit') || '200', 10) || 200));
  const telemetryPort = searchParams.get('telemetryPort');
  const data = await bridgeFetch<{ trackingSince: string | null; events: ServerEvent[] }>(`/api/events?limit=${limit}`, 3000, telemetryPort);
  const body: EventsResponse = data
    ? { available: true, trackingSince: data.trackingSince, events: data.events }
    : { available: false, trackingSince: null, events: [] };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' } });
}
