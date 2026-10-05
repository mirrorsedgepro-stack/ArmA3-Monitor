import { NextRequest, NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

export interface HistoryResponse {
  available: boolean;
  trackingSince: string | null;
  bucketMinutes: number;
  points: { t: string; players: number }[];
}

/** Player-count history derived from real session logs on the game host. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hours = Math.max(1, Math.min(720, parseInt(searchParams.get('hours') || '24', 10) || 24));
  const bucket = Math.max(1, Math.min(240, parseInt(searchParams.get('bucket') || '30', 10) || 30));
  const data = await bridgeFetch<{ trackingSince: string | null; bucketMinutes: number; points: { t: string; players: number }[] }>(
    `/api/history?hours=${hours}&bucket=${bucket}`,
  );
  const body: HistoryResponse = data
    ? { available: true, trackingSince: data.trackingSince, bucketMinutes: data.bucketMinutes, points: data.points }
    : { available: false, trackingSince: null, bucketMinutes: bucket, points: [] };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
}
