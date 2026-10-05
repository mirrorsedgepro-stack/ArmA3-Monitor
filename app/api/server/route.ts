import { NextRequest, NextResponse } from 'next/server';
import { queryA2SServer } from '@/lib/a2s';
import { queryBattleMetrics } from '@/lib/battlemetrics';
import { DEFAULT_SERVER_CONFIG, INITIAL_SERVER_STATS, ArmaServerStats } from '@/data/defaultServer';
import { bridgeFetch } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

/**
 * Live server status. Sources, in order:
 *   1. Telemetry bridge on the game host (A2S + log-derived FPS/HC/config facts)
 *   2. Direct UDP A2S from this function
 *   3. BattleMetrics
 * No mock fallback: if every source fails the server is reported offline.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('ip') || DEFAULT_SERVER_CONFIG.ip;
  const gamePort = parseInt(searchParams.get('port') || `${DEFAULT_SERVER_CONFIG.port}`, 10);
  const queryPort = parseInt(searchParams.get('queryPort') || `${DEFAULT_SERVER_CONFIG.queryPort}`, 10);
  const bmId = searchParams.get('bmId') || process.env.BATTLEMETRICS_SERVER_ID;

  // Static, verified facts only - no players, no telemetry.
  const base: ArmaServerStats = {
    ...INITIAL_SERVER_STATS,
    ip: host,
    port: gamePort,
    queryPort,
    status: 'offline',
    lastUpdated: new Date().toISOString(),
  };

  const json = (body: ArmaServerStats, maxAge: number) =>
    NextResponse.json(body, {
      headers: { 'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}` },
    });

  // 1. Telemetry bridge (only meaningful for the default host)
  if (host === DEFAULT_SERVER_CONFIG.ip) {
    const bridge = await bridgeFetch<Partial<ArmaServerStats>>('/api/telemetry');
    if (bridge && bridge.status) {
      return json({ ...base, ...bridge, querySource: 'telemetry_bridge', lastUpdated: new Date().toISOString() } as ArmaServerStats, 5);
    }
  }

  // 2. Direct A2S
  try {
    const a2s = await queryA2SServer(host, queryPort, 2000, gamePort);
    if (a2s.success && a2s.data) {
      return json({
        ...base,
        ...a2s.data,
        status: 'online',
        ping: a2s.ping,
        querySource: 'direct_a2s',
        lastUpdated: new Date().toISOString(),
      }, 10);
    }
  } catch (err) {
    console.warn('A2S query failed:', err);
  }

  // 3. BattleMetrics
  try {
    const bm = await queryBattleMetrics(bmId || host, gamePort);
    if (bm) {
      return json({
        ...base,
        ...bm,
        status: 'online',
        querySource: 'battlemetrics',
        lastUpdated: new Date().toISOString(),
      }, 15);
    }
  } catch (err) {
    console.warn('BattleMetrics query failed:', err);
  }

  return json({ ...base, status: 'offline', players: 0, playerList: [], ping: null }, 5);
}
