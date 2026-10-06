import { NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

export interface PlayerRecord {
  name: string;
  sessions: number;
  totalSeconds: number;
  firstSeen: string;
  lastSeen: string;
  online: boolean;
  /** Deaths from the server log; absent on older bridges. */
  deaths?: number;
  /** Infantry kills from the A3KF kill feed; absent until the feed has reported. */
  kills?: number;
}

export interface PlayersResponse {
  available: boolean;
  trackingSince: string | null;
  players: PlayerRecord[];
}

/** Players who have actually joined, from the server's connect/disconnect log lines. */
export async function GET() {
  const data = await bridgeFetch<{ trackingSince: string | null; players: PlayerRecord[] }>('/api/players');
  const body: PlayersResponse = data
    ? { available: true, trackingSince: data.trackingSince, players: data.players }
    : { available: false, trackingSince: null, players: [] };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
}
