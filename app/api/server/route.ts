import { NextRequest, NextResponse } from 'next/server';
import { queryA2SServer } from '@/lib/a2s';
import { queryBattleMetrics } from '@/lib/battlemetrics';
import { DEFAULT_SERVER_CONFIG, MOCK_SERVER_DATA, MOCK_WASTELAND_DATA, MOCK_REFORGER_DATA, SERVERS_LIST, ArmaServerStats } from '@/data/defaultServer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('ip') || DEFAULT_SERVER_CONFIG.ip;
  const gamePort = parseInt(searchParams.get('port') || `${DEFAULT_SERVER_CONFIG.port}`, 10);
  const queryPort = parseInt(searchParams.get('queryPort') || `${DEFAULT_SERVER_CONFIG.queryPort}`, 10);
  const bmId = searchParams.get('bmId') || process.env.BATTLEMETRICS_SERVER_ID;
  const mockFallback = searchParams.get('mock') !== 'false';

  const isReforger = gamePort === 2001 || queryPort === 17777;
  const isWasteland = gamePort === 2402 || queryPort === 2403;
  const baseMock = isReforger ? MOCK_REFORGER_DATA : (isWasteland ? MOCK_WASTELAND_DATA : MOCK_SERVER_DATA);

  let serverStats: ArmaServerStats = {
    ...baseMock,
    ip: host,
    port: gamePort,
    queryPort: queryPort,
  };

  // Attempt 1: Direct UDP A2S query (fast timeout)
  try {
    const a2sRes = await queryA2SServer(host, queryPort, 2000, gamePort);
    if (a2sRes.success && a2sRes.data) {
      serverStats = {
        ...serverStats,
        ...a2sRes.data,
        status: 'online',
        ping: a2sRes.ping,
        querySource: 'direct_a2s',
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(serverStats, {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      });
    }
  } catch (err) {
    console.warn('A2S query attempted and failed:', err);
  }

  // Attempt 2: BattleMetrics API lookup (works through restrictive serverless cloud UDP firewalls)
  try {
    const target = bmId || host;
    const bmRes = await queryBattleMetrics(target, gamePort);
    if (bmRes) {
      serverStats = {
        ...serverStats,
        ...bmRes,
        status: 'online',
        querySource: 'battlemetrics',
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(serverStats, {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
        },
      });
    }
  } catch (err) {
    console.warn('BattleMetrics fallback failed:', err);
  }

  // Attempt 3: If mockFallback is allowed, return simulated active server telemetry
  // (Ideal for local testing, initial preview before deploying live server config)
  if (mockFallback) {
    return NextResponse.json({
      ...serverStats,
      querySource: 'mock_active',
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=5',
      },
    });
  }

  // Server truly offline or unreachable
  return NextResponse.json({
    ...serverStats,
    status: 'offline',
    players: 0,
    playerList: [],
    ping: 0,
    lastUpdated: new Date().toISOString(),
  });
}
