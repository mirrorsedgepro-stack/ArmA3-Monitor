import { NextRequest, NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

export type CampaignEventType =
  | 'death'
  | 'capture'
  | 'counterattack'
  | 'defended'
  | 'lost'
  | 'promotion'
  | 'join'
  | 'leave'
  | 'kill';

export interface CampaignEvent {
  id: string;
  t: string;
  type: CampaignEventType;
  player?: string | null;
  place?: string;
  marker?: string;
  grid?: string;
  by?: string | null;
  enemy?: string;
  rank?: string;
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
  events: CampaignEvent[];
}

/** Campaign event feed parsed from the game server's log by the telemetry bridge. */
export async function GET(request: NextRequest) {
  const limit = Math.max(1, Math.min(500, parseInt(new URL(request.url).searchParams.get('limit') || '200', 10) || 200));
  const data = await bridgeFetch<{ trackingSince: string | null; events: CampaignEvent[] }>(`/api/events?limit=${limit}`);
  const body: EventsResponse = data
    ? { available: true, trackingSince: data.trackingSince, events: data.events }
    : { available: false, trackingSince: null, events: [] };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' } });
}
