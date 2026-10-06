import { ArmaServerStats, ServerPlayer } from '@/data/defaultServer';

interface BattleMetricsServerResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      id: string;
      name: string;
      ip: string;
      port: number;
      portQuery: number;
      players: number;
      maxPlayers: number;
      rank: number;
      status: string;
      details: {
        map?: string;
        mission?: string;
        gameType?: string;
        version?: string;
        time?: string;
        modCount?: number;
      };
    };
    relationships?: {
      players?: {
        data?: Array<{ id: string; type: string }>;
      };
    };
  };
  included?: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
    };
  }>;
}

export async function queryBattleMetrics(serverIdOrIp: string, port?: number): Promise<Partial<ArmaServerStats> | null> {
  try {
    const isId = /^\d+$/.test(serverIdOrIp);
    let url = '';

    if (isId) {
      url = `https://api.battlemetrics.com/servers/${serverIdOrIp}?include=player`;
    } else {
      // Search by IP or Name
      const searchParam = encodeURIComponent(serverIdOrIp);
      url = `https://api.battlemetrics.com/servers?filter[game]=arma3&filter[search]=${searchParam}&page[size]=1&include=player`;
    }

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Arma3-Server-Portal/1.0',
      },
      next: { revalidate: 15 }, // Next.js ISR cache
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    let serverData: BattleMetricsServerResponse['data'];

    if (isId) {
      serverData = json.data;
    } else {
      if (!json.data || json.data.length === 0) return null;
      serverData = json.data[0];
    }

    if (!serverData || !serverData.attributes) return null;

    const attr = serverData.attributes;
    const players: ServerPlayer[] = [];

    if (json.included && Array.isArray(json.included)) {
      json.included.forEach((item: { type: string; id: string; attributes?: { name?: string } }, index: number) => {
        if (item.type === 'player' && item.attributes?.name) {
          players.push({
            id: index + 1,
            name: item.attributes.name,
            score: 0,
            timePlayedSeconds: 0,
          });
        }
      });
    }

    return {
      name: attr.name,
      ip: attr.ip,
      port: attr.port,
      queryPort: attr.portQuery || (port ? port + 1 : 2303),
      status: attr.status === 'online' ? 'online' : 'offline',
      players: attr.players,
      maxPlayers: attr.maxPlayers,
      map: attr.details?.map || '',
      mission: attr.details?.mission || '',
      gameType: attr.details?.gameType || '',
      version: attr.details?.version || '',
      battleye: null,
      playerList: players.length > 0 ? players : undefined,
      querySource: 'battlemetrics',
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('BattleMetrics query error:', err);
    return null;
  }
}
