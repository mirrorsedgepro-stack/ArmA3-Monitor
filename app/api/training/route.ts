import { NextRequest, NextResponse } from 'next/server';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

/** gameplay: players online, spark1 trains alone; cluster: both Sparks train over CX7; idle-empty: server empty. */
export type TrainingMode = 'gameplay' | 'cluster' | 'idle-empty';

export interface TrainingResponse {
  available: boolean;
  observedAt?: string;
  mode?: TrainingMode;
  playersOnline?: number;
  trainer?: {
    state?: 'waiting' | 'loading' | 'training' | 'regrouping' | 'evaluating' | 'exporting' | 'done' | 'error';
    cycle?: number;
    step?: number;
    total_steps?: number;
    loss?: number;
    eta_s?: number;
    nodes?: number;
    samples?: number;
    real_samples?: number;
    held_out?: number;
    samples_per_s?: number;
    updated?: number;
    started?: number;
    eval_loss?: number;
    eval_score?: number;
    available?: number;
    waiting_for?: number;
    trained_on?: number;
    resumed?: boolean;
  };
  error?: string | null;
  lastExport?: { gguf?: string; cycle?: number; samples?: number; eval_loss?: number; eval_score?: number; created?: number };
  deployed?: { model?: string; since?: number; score?: number; latency?: number; previous?: string };
  peer?: { state?: 'off' | 'starting' | 'joined' | 'leaving'; since?: number };
  generating?: boolean;
  data?: { conversations?: number; generated?: number; contacts?: number; voice_clips?: number };
  history?: { t: number; cycle?: number; step?: number; loss?: number; nodes?: number }[];
  events?: { t: number; text: string }[];
}

/** OVERLORD's training state, from the Game Master via the telemetry bridge. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const telemetryPort = searchParams.get('telemetryPort');
  const data = await bridgeFetch<TrainingResponse>('/api/training', 4000, telemetryPort);
  const body: TrainingResponse = data ?? { available: false };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20' } });
}
