export interface ServerPlayer {
  id: number;
  name: string;
  score: number;
  timePlayedSeconds: number;
}

/** Antistasi A3A_fnc_logPerformance sample. Only logged while players are connected. */
export interface PerformanceSample {
  serverFps: number;
  connectedClientsInclHCs: number;
  deadUnits: number;
  allUnits: number;
  allVehicles: number;
  factionCash: number;
  hr: number;
  occAggro: number;
  invAggro: number;
  warLevel: number;
  sampledAt: string;
  ageSeconds: number;
}

/** Facts parsed from the server's configs/main.cfg by the telemetry bridge. */
export interface ServerConfigFacts {
  battlEye: number | null;
  verifySignatures: number | null;
  maxPlayers: number | null;
  voiceEnabled: boolean | null;
  persistent: boolean | null;
  difficulty: string | null;
}

export interface ArmaServerStats {
  name: string;
  ip: string;
  port: number;
  queryPort: number;
  status: 'online' | 'offline' | 'loading' | 'unreachable';
  ping: number | null;
  players: number;
  maxPlayers: number;
  playerList: ServerPlayer[];
  map: string;
  mission: string;
  gameType: string;
  version: string;
  battleye: boolean | null;
  passwordProtected: boolean | null;
  querySource: 'direct_a2s' | 'battlemetrics' | 'telemetry_bridge' | 'none';
  lastUpdated: string;
  discordUrl?: string;
  teamspeakUrl?: string;
  /** What players type into TeamSpeak's Connect dialog */
  teamspeakAddress?: string;
  // Verified static facts about the host (ipinfo for 180.181.238.103)
  location?: string;
  countryCode?: string;
  isp?: string;
  // Optional protocol & tag facts
  // From the Steam query tags (direct A2S fallback)
  signaturesVerified?: boolean | null;
  difficulty?: string | null;
  serverTags?: string;
  // Only available through the telemetry bridge (null/undefined = unknown)
  platform?: string;
  uptimeSeconds?: number | null;
  serverFps?: number | null;
  performance?: PerformanceSample | null;
  headlessClients?: { expected: number; active: number; updatedAt: string | null } | null;
  serverConfig?: ServerConfigFacts | null;
}

export interface ServerDefinition {
  id: string;
  name: string;
  ip: string;
  port: number;
  queryPort: number;
  telemetryPort?: number;
  mode: string;
  mission: string;
  map: string;
  hasModpack: boolean;
  bmId?: string;
  tagline: string;
  maxPlayers?: number;
}

export const SERVERS_LIST: ServerDefinition[] = [
  {
    id: 'antistasi',
    name: process.env.NEXT_PUBLIC_SERVER_NAME || "Frenchy's Antistasi Ultimate [RHS] | 32-Player Dedicated",
    ip: process.env.NEXT_PUBLIC_SERVER_IP || "180.181.238.103",
    port: parseInt(process.env.NEXT_PUBLIC_GAME_PORT || "2302", 10),
    queryPort: parseInt(process.env.NEXT_PUBLIC_QUERY_PORT || "2303", 10),
    telemetryPort: parseInt(process.env.NEXT_PUBLIC_TELEMETRY_PORT || "2310", 10),
    mode: "Antistasi Ultimate",
    mission: "Antistasi Ultimate - Altis",
    map: "Altis",
    hasModpack: true,
    tagline: "Persistent Guerilla Campaign (53 Mods)",
    maxPlayers: 32,
  },
  {
    id: 'wasteland',
    name: "Frenchy's A3Wasteland 64 Player",
    ip: process.env.NEXT_PUBLIC_SERVER_IP || "180.181.238.103",
    port: 2402,
    queryPort: 2403,
    telemetryPort: 2410,
    mode: "Wasteland",
    mission: "ArmA3_Wasteland.Altis",
    map: "Altis",
    hasModpack: false,
    tagline: "Survival Sandbox with MariaDB Persistence",
    maxPlayers: 64,
  },
];

// Player downloads for TFAR voice. The TeamSpeak 3 client is linked from TeamSpeak's own servers (its
// licence doesn't allow re-hosting); the TFAR plugin (APL-SA) is hosted here, the same build as the server's
// Workshop mod (894678801, plugin 1.-1.0.341).
export const DOWNLOADS = {
  ts3Win64: "https://files.teamspeak-services.com/releases/client/3.6.2/TeamSpeak3-Client-win64-3.6.2.exe",
  ts3Win32: "https://files.teamspeak-services.com/releases/client/3.6.2/TeamSpeak3-Client-win32-3.6.2.exe",
  ts3Version: "3.6.2",
  tfarPlugin: "/downloads/task_force_radio.ts3_plugin",
  tfarVersion: "1.-1.0.341",
  tfarLicense: "https://www.bistudio.com/community/licenses/arma-public-license-share-alike",
  tfarSource: "https://github.com/michail-nikolaev/task-force-arma-3-radio",
};

// The community TeamSpeak runs next to the game servers (ArmaA's `teamspeak` service).
export const TEAMSPEAK_HOST = process.env.NEXT_PUBLIC_TS3_HOST || SERVERS_LIST[0].ip;
export const TEAMSPEAK_PORT = parseInt(process.env.NEXT_PUBLIC_TS3_PORT || "9987", 10);
// A full NEXT_PUBLIC_TS3_URL may point anywhere, so only show an address we built ourselves.
const teamspeakAddress = process.env.NEXT_PUBLIC_TS3_URL
  ? ""
  : TEAMSPEAK_PORT === 9987 ? TEAMSPEAK_HOST : `${TEAMSPEAK_HOST}:${TEAMSPEAK_PORT}`;

export const DEFAULT_SERVER_CONFIG = {
  ...SERVERS_LIST[0],
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL || "",
  teamspeakUrl: process.env.NEXT_PUBLIC_TS3_URL || `ts3server://${TEAMSPEAK_HOST}?port=${TEAMSPEAK_PORT}`,
  teamspeakAddress,
};

/**
 * Placeholder shown before the first real query returns.
 * Contains no players and no telemetry - never display it as live data.
 */
export const INITIAL_SERVER_STATS: ArmaServerStats = {
  name: SERVERS_LIST[0].name,
  ip: SERVERS_LIST[0].ip,
  port: SERVERS_LIST[0].port,
  queryPort: SERVERS_LIST[0].queryPort,
  status: 'loading',
  ping: null,
  players: 0,
  maxPlayers: SERVERS_LIST[0].maxPlayers || 32,
  playerList: [],
  map: SERVERS_LIST[0].map,
  mission: SERVERS_LIST[0].mission,
  gameType: SERVERS_LIST[0].mode,
  version: '',
  battleye: null,
  passwordProtected: null,
  querySource: 'none',
  lastUpdated: new Date(0).toISOString(),
  discordUrl: DEFAULT_SERVER_CONFIG.discordUrl,
  teamspeakUrl: DEFAULT_SERVER_CONFIG.teamspeakUrl,
  teamspeakAddress: DEFAULT_SERVER_CONFIG.teamspeakAddress,
  location: 'Sydney, New South Wales, Australia',
  isp: 'Aussie Fibre Pty Ltd (AS4764)',
};
