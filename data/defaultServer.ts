export interface ServerPlayer {
  id: number;
  name: string;
  score: number;
  timePlayedSeconds: number;
}

export interface ArmaServerStats {
  name: string;
  ip: string;
  port: number;
  queryPort: number;
  status: 'online' | 'offline' | 'loading' | 'unreachable';
  ping: number;
  players: number;
  maxPlayers: number;
  playerList: ServerPlayer[];
  map: string;
  mission: string;
  gameType: string;
  version: string;
  battleye: boolean;
  passwordProtected: boolean;
  difficulty: string;
  timeOfDay: string;
  uptime: string;
  querySource: 'direct_a2s' | 'battlemetrics' | 'mock_active' | 'telemetry_bridge';
  lastUpdated: string;
  discordUrl?: string;
  teamspeakUrl?: string;
  rulesOfEngagement?: string[];
  // Extended Server Details
  location?: string;
  countryCode?: string;
  isp?: string;
  platform?: string;
  signatureVerification?: string;
  vonEnabled?: boolean;
  thirdPerson?: boolean;
  joinInProgress?: boolean;
  serverTags?: string;
  serverFps?: number;
  headlessClients?: {
    total: number;
    active: number;
    names: string[];
  };
  antistasi?: {
    serverFps?: number;
    players?: number;
    deadUnits?: number;
    allUnits?: number;
    factionCash?: number;
    hr?: number;
    occAggro?: number;
    invAggro?: number;
    warLevel?: number;
  } | null;
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
    tagline: "24/7 Persistent Guerilla Campaign (40 Mods)",
    maxPlayers: 32,
  },
];

export const DEFAULT_SERVER_CONFIG = {
  ...SERVERS_LIST[0],
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/arma3",
  teamspeakUrl: process.env.NEXT_PUBLIC_TS3_URL || "",
};

export const MOCK_SERVER_DATA: ArmaServerStats = {
  name: SERVERS_LIST[0].name,
  ip: SERVERS_LIST[0].ip,
  port: SERVERS_LIST[0].port,
  queryPort: SERVERS_LIST[0].queryPort,
  status: "online",
  ping: 28,
  players: 1,
  maxPlayers: 32,
  map: "Altis",
  mission: "Antistasi Ultimate - Altis",
  gameType: "Antistasi Ultimate",
  version: "2.22.154089",
  battleye: true,
  passwordProtected: false,
  difficulty: "Custom",
  timeOfDay: "08:30 (In-Game)",
  uptime: "6h 15m",
  querySource: "direct_a2s",
  lastUpdated: new Date().toISOString(),
  discordUrl: DEFAULT_SERVER_CONFIG.discordUrl,
  teamspeakUrl: DEFAULT_SERVER_CONFIG.teamspeakUrl,
  location: "Sydney, New South Wales, Australia",
  countryCode: "AU",
  isp: "Aussie Fibre Pty Ltd (AS4764)",
  platform: "Linux Dedicated Server (x86_64)",
  signatureVerification: "Strict (checkSignatures = 2)",
  vonEnabled: true,
  thirdPerson: true,
  joinInProgress: true,
  serverTags: "bf,r222,n0,s7,i1,mf,lf,vf,dt,tanti,g65545,h86f3694,f1,pl",
  serverFps: 50.0,
  headlessClients: {
    total: 3,
    active: 3,
    names: ["antistasi_server-hc-0", "antistasi_server-hc-1", "antistasi_server-hc-2"],
  },
  antistasi: {
    serverFps: 50.0,
    players: 1,
    deadUnits: 75,
    allUnits: 47,
    factionCash: 14552,
    hr: 32,
    occAggro: 87,
    invAggro: 0,
    warLevel: 2,
  },
  playerList: [
    { id: 1, name: "Frenchy", score: 0, timePlayedSeconds: 2160 }
  ]
};
