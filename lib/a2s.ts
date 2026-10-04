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
 */
export async function queryA2SServer(host: string, port: number, timeoutMs = 2500): Promise<QueryResult> {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');
    let startTime = Date.now();
    let challenge: Buffer | null = null;
    let timer: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(timer);
      try {
        socket.removeAllListeners();
        socket.close();
      } catch {
        // ignore close errors
      }
    };

    timer = setTimeout(() => {
      cleanup();
      resolve({
        success: false,
        ping: 0,
        error: `Query timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    socket.on('error', (err) => {
      cleanup();
      resolve({
        success: false,
        ping: 0,
        error: err.message,
      });
    });

    socket.on('message', (msg) => {
      const ping = Date.now() - startTime;

      try {
        // Check for challenge response (0x41)
        if (msg.length >= 9 && msg.readInt32LE(0) === -1 && msg[4] === 0x41) {
          challenge = msg.subarray(5, 9);
          // Resend A2S_INFO query with received challenge
          const req = Buffer.concat([
            Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]),
            Buffer.from('Source Engine Query\0', 'ascii'),
            challenge,
          ]);
          startTime = Date.now();
          socket.send(req, 0, req.length, port, host);
          return;
        }

        // Check for A2S_INFO response (0x49)
        if (msg.length >= 5 && msg.readInt32LE(0) === -1 && msg[4] === 0x49) {
          const parsed = parseA2SInfoResponse(msg);
          cleanup();
          resolve({
            success: true,
            ping,
            data: {
              ...parsed,
              ping,
              ip: host,
              port,
              status: 'online',
              querySource: 'direct_a2s',
              lastUpdated: new Date().toISOString(),
            },
          });
          return;
        }
      } catch (err: unknown) {
        cleanup();
        resolve({
          success: false,
          ping,
          error: (err as Error).message,
        });
      }
    });

    // Send initial A2S_INFO query
    // Header (4 x 0xFF), 'T' (0x54), "Source Engine Query\0"
    const initialQuery = Buffer.concat([
      Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]),
      Buffer.from('Source Engine Query\0', 'ascii'),
    ]);

    socket.send(initialQuery, 0, initialQuery.length, port, host, (err) => {
      if (err) {
        cleanup();
        resolve({
          success: false,
          ping: 0,
          error: err.message,
        });
      }
    });
  });
}

function parseA2SInfoResponse(buf: Buffer): Partial<ArmaServerStats> {
  let offset = 5; // Skip header (4) + header type (1)

  const protocol = buf.readUInt8(offset);
  offset += 1;

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

  const players = buf.readUInt8(offset);
  offset += 1;

  const maxPlayers = buf.readUInt8(offset);
  offset += 1;

  const bots = buf.readUInt8(offset);
  offset += 1;

  const serverType = String.fromCharCode(buf.readUInt8(offset));
  offset += 1;

  const environment = String.fromCharCode(buf.readUInt8(offset));
  offset += 1;

  const visibility = buf.readUInt8(offset); // 1 = password
  offset += 1;

  const vac = buf.readUInt8(offset); // 1 = secured
  offset += 1;

  const version = readNullTerminatedString(buf, offset);
  offset += Buffer.byteLength(version, 'utf8') + 1;

  let tags = '';
  let mission = game || 'Arma 3 Mission';

  // Read EDF (Extra Data Flag) if available
  if (offset < buf.length) {
    const edf = buf.readUInt8(offset);
    offset += 1;

    // 0x80 = Port
    if (edf & 0x80) {
      offset += 2;
    }
    // 0x10 = SteamID
    if (edf & 0x10) {
      offset += 8;
    }
    // 0x40 = SourceTV
    if (edf & 0x40) {
      offset += 2;
      const tvName = readNullTerminatedString(buf, offset);
      offset += Buffer.byteLength(tvName, 'utf8') + 1;
    }
    // 0x20 = Keywords / Tags (contains Arma 3 mission name, battleye info, etc.)
    if (edf & 0x20 && offset < buf.length) {
      tags = readNullTerminatedString(buf, offset);
      // In Arma 3 tags typically look like: "b,r214,n0,s10,i1,tcoop,g65545,c...,mAltis,..."
      // Parse mission name or battleye flag if present
      if (tags) {
        mission = parseArmaTags(tags, map) || mission;
      }
    }
  }

  return {
    name: serverName,
    map: formatMapName(map),
    mission: mission || 'Arma 3 Operation',
    players,
    maxPlayers,
    version,
    battleye: tags.includes('b,') || tags.startsWith('b') || vac === 1,
    passwordProtected: visibility === 1,
    gameType: extractGameType(tags),
  };
}

function readNullTerminatedString(buf: Buffer, offset: number): string {
  let end = offset;
  while (end < buf.length && buf[end] !== 0) {
    end++;
  }
  return buf.subarray(offset, end).toString('utf8');
}

function parseArmaTags(tags: string, defaultMap: string): string {
  const parts = tags.split(',');
  for (const part of parts) {
    if (part.startsWith('m') && part.length > 1) {
      // mission tag
      return part.substring(1);
    }
  }
  return '';
}

function extractGameType(tags: string): string {
  if (tags.includes('tcoop') || tags.includes('coop')) return 'COOP';
  if (tags.includes('tvt') || tags.includes('pvp')) return 'PvP';
  if (tags.includes('tkoth') || tags.includes('koth')) return 'King of the Hill';
  if (tags.includes('twarlords')) return 'Warlords';
  if (tags.includes('trp')) return 'Roleplay';
  return 'Tactical MilSim';
}

function formatMapName(rawMap: string): string {
  if (!rawMap) return 'Altis';
  const clean = rawMap.toLowerCase().trim();
  const mapDictionary: Record<string, string> = {
    altis: 'Altis',
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
    anizay: 'Anizay',
    al_rayak: 'Al Rayak',
    cam_lao_nam: 'Cam Lao Nam (S.O.G.)',
  };
  return mapDictionary[clean] || rawMap.charAt(0).toUpperCase() + rawMap.slice(1);
}
