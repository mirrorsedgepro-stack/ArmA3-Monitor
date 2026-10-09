import dgram from 'dgram';
import { ArmaServerStats, ServerPlayer } from '@/data/defaultServer';

interface QueryResult {
  success: boolean;
  ping: number;
  data?: Partial<ArmaServerStats>;
  error?: string;
}

/**
 * Queries an Arma 3 server directly using Valve's A2S protocol over UDP.
 * Queries both A2S_INFO (server status, mission, map) and A2S_PLAYER (connected player list).
 */
export async function queryA2SServer(host: string, port: number, timeoutMs = 2500, gamePort?: number): Promise<QueryResult> {
  const socket = dgram.createSocket('udp4');
  let startTime = Date.now();
  let serverStats: Partial<ArmaServerStats> = {};
  let ping = 0;
  let hasInfo = false;
  const resolvedGamePort = gamePort ?? (port === 2303 ? 2302 : port - 1);

  return new Promise((resolve) => {
    let timer: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(timer);
      try {
        socket.removeAllListeners();
        socket.close();
      } catch {
        // ignore
      }
    };

    timer = setTimeout(() => {
      cleanup();
      if (hasInfo) {
        resolve({
          success: true,
          ping,
          data: {
            ...serverStats,
            ping,
            ip: host,
            port: resolvedGamePort,
            queryPort: port,
            status: 'online',
            querySource: 'direct_a2s',
            lastUpdated: new Date().toISOString(),
          },
        });
      } else {
        resolve({
          success: false,
          ping: 0,
          error: `Query timed out after ${timeoutMs}ms`,
        });
      }
    }, timeoutMs);

    socket.on('error', (err) => {
      cleanup();
      if (hasInfo) {
        resolve({ success: true, ping, data: serverStats });
      } else {
        resolve({ success: false, ping: 0, error: err.message });
      }
    });

    socket.on('message', (msg) => {
      try {
        // Handle challenge response (0x41)
        if (msg.length >= 9 && msg.readInt32LE(0) === -1 && msg[4] === 0x41) {
          const challenge = msg.subarray(5, 9);
          
          if (!hasInfo) {
            // Send A2S_INFO with challenge
            const req = Buffer.concat([
              Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]),
              Buffer.from('Source Engine Query\0', 'ascii'),
              challenge,
            ]);
            socket.send(req, 0, req.length, port, host);
          } else {
            // Send A2S_PLAYER with challenge
            const req = Buffer.concat([
              Buffer.from([0xff, 0xff, 0xff, 0xff, 0x55]),
              challenge,
            ]);
            socket.send(req, 0, req.length, port, host);
          }
          return;
        }

        // Handle A2S_INFO response (0x49)
        if (msg.length >= 5 && msg.readInt32LE(0) === -1 && msg[4] === 0x49) {
          ping = Date.now() - startTime;
          const parsed = parseA2SInfoResponse(msg);
          serverStats = { ...serverStats, ...parsed };
          hasInfo = true;

          // Request A2S_PLAYER to get active roster
          const playerReq = Buffer.concat([
            Buffer.from([0xff, 0xff, 0xff, 0xff, 0x55]),
            Buffer.from([0xff, 0xff, 0xff, 0xff]),
          ]);
          socket.send(playerReq, 0, playerReq.length, port, host);
          return;
        }

        // Handle A2S_PLAYER response (0x44)
        if (msg.length >= 5 && msg.readInt32LE(0) === -1 && msg[4] === 0x44) {
          const players = parseA2SPlayerResponse(msg);
          serverStats.playerList = players;
          if (players.length > 0 && (!serverStats.players || serverStats.players === 0)) {
            serverStats.players = players.length;
          }

          cleanup();
          resolve({
            success: true,
            ping,
            data: {
              ...serverStats,
              ping,
              ip: host,
              port: resolvedGamePort,
              queryPort: port,
              status: 'online',
              querySource: 'direct_a2s',
              lastUpdated: new Date().toISOString(),
            },
          });
          return;
        }
      } catch (err: unknown) {
        if (hasInfo) {
          cleanup();
          resolve({ success: true, ping, data: serverStats });
        } else {
          cleanup();
          resolve({ success: false, ping, error: (err as Error).message });
        }
      }
    });

    // Send initial A2S_INFO query
    const initialQuery = Buffer.concat([
      Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]),
      Buffer.from('Source Engine Query\0', 'ascii'),
    ]);

    socket.send(initialQuery, 0, initialQuery.length, port, host, (err) => {
      if (err) {
        cleanup();
        resolve({ success: false, ping: 0, error: err.message });
      }
    });
  });
}

function parseA2SInfoResponse(buf: Buffer): Partial<ArmaServerStats> {
  let offset = 5;

  const protocol = buf.readUInt8(offset++);
  const serverName = readNullTerminatedString(buf, offset);
  offset += Buffer.byteLength(serverName, 'utf8') + 1;

  const map = readNullTerminatedString(buf, offset);
  offset += Buffer.byteLength(map, 'utf8') + 1;

  const folder = readNullTerminatedString(buf, offset);
  offset += Buffer.byteLength(folder, 'utf8') + 1;

  const game = readNullTerminatedString(buf, offset);
  offset += Buffer.byteLength(game, 'utf8') + 1;

  const appId = buf.readInt16LE(offset);
  offset += 2;

  const players = buf.readUInt8(offset++);
  const maxPlayers = buf.readUInt8(offset++);
  const bots = buf.readUInt8(offset++);
  const serverType = String.fromCharCode(buf.readUInt8(offset++));
  const environment = String.fromCharCode(buf.readUInt8(offset++));
  const visibility = buf.readUInt8(offset++);
  const vac = buf.readUInt8(offset++);

  const version = readNullTerminatedString(buf, offset);
  offset += Buffer.byteLength(version, 'utf8') + 1;

  let tags = '';
  if (offset < buf.length) {
    const edf = buf.readUInt8(offset++);
    if (edf & 0x80) offset += 2;
    if (edf & 0x10) offset += 8;
    if (edf & 0x40) {
      offset += 2;
      const tvName = readNullTerminatedString(buf, offset);
      offset += Buffer.byteLength(tvName, 'utf8') + 1;
    }
    if (edf & 0x20 && offset < buf.length) {
      tags = readNullTerminatedString(buf, offset);
    }
  }

  // Arma 3 server tags: one-letter key + value, comma separated,
  // e.g. "bf,r222,n0,s7,i1,mf,lf,vf,dt,tanti,...,pl,...".
  const tag = parseArmaTags(tags);
  const bool = (v: string | undefined) => (v === 't' ? true : v === 'f' ? false : null);

  return {
    name: serverName,
    map: formatMapName(map),
    mission: game || undefined,
    players,
    maxPlayers,
    version,
    battleye: bool(tag.b),
    passwordProtected: visibility === 1,
    gameType: tag.t || undefined,
    platform: tag.p === 'l' ? 'Linux' : tag.p === 'w' ? 'Windows' : environment === 'l' ? 'Linux' : environment === 'w' ? 'Windows' : undefined,
    signaturesVerified: bool(tag.v),
    difficulty: tag.i != null ? DIFFICULTIES[tag.i] ?? null : null,
    serverTags: tags || undefined,
  };
}

const DIFFICULTIES: Record<string, string> = { '0': 'Recruit', '1': 'Regular', '2': 'Veteran', '3': 'Custom' };

function parseA2SPlayerResponse(buf: Buffer): ServerPlayer[] {
  const count = buf.readUInt8(5);
  let offset = 6;
  const players: ServerPlayer[] = [];

  for (let i = 0; i < count && offset < buf.length; i++) {
    const idx = buf.readUInt8(offset++);
    const name = readNullTerminatedString(buf, offset);
    offset += Buffer.byteLength(name, 'utf8') + 1;
    
    if (offset + 8 > buf.length) break;
    const score = buf.readInt32LE(offset);
    offset += 4;
    const duration = buf.readFloatLE(offset);
    offset += 4;

    if (name && name.trim().length > 0) {
      players.push({
        id: idx + 1,
        name: name.trim(),
        score,
        timePlayedSeconds: Math.round(duration),
      });
    }
  }

  return players;
}

function readNullTerminatedString(buf: Buffer, offset: number): string {
  let end = offset;
  while (end < buf.length && buf[end] !== 0) {
    end++;
  }
  return buf.subarray(offset, end).toString('utf8');
}

function parseArmaTags(tags: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of tags.split(',')) {
    if (part.length > 0 && !(part[0] in out)) out[part[0]] = part.slice(1);
  }
  return out;
}

function formatMapName(rawMap: string): string {
  if (!rawMap) return '';
  if (rawMap.includes('Everon')) return 'Everon';
  const clean = rawMap.toLowerCase().trim();
  const mapDictionary: Record<string, string> = {
    altis: 'Altis',
    chernarusredux: 'Chernarus Redux',
    stratis: 'Stratis',
    tanoa: 'Tanoa',
    malden: 'Malden 2035',
    enoch: 'Livonia',
    chernarus: 'Chernarus (Autumn)',
    chernarus_summer: 'Chernarus (Summer)',
    takistan: 'Takistan',
    zargabad: 'Zargabad',
    utes: 'Utes',
    kunduz: 'Kunduz',
    sahrani: 'Sahrani',
    eden: 'Everon',
    everon: 'Everon',
    anizay: 'Anizay',
  };
  return mapDictionary[clean] || rawMap.charAt(0).toUpperCase() + rawMap.slice(1);
}
