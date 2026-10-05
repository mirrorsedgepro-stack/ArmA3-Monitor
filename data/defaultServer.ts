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
  querySource: 'direct_a2s' | 'battlemetrics' | 'mock_active';
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
}

export interface ServerDefinition {
  id: string;
  name: string;
  ip: string;
  port: number;
  queryPort: number;
  mode: string;
  mission: string;
  map: string;
  hasModpack: boolean;
  bmId?: string;
  tagline: string;
}

export const SERVERS_LIST: ServerDefinition[] = [
  {
    id: 'antistasi',
    name: process.env.NEXT_PUBLIC_SERVER_NAME || "Frenchy's Antistasi Ultimate [RHS] | 32-Player Dedicated",
    ip: process.env.NEXT_PUBLIC_SERVER_IP || "180.181.238.103",
    port: parseInt(process.env.NEXT_PUBLIC_GAME_PORT || "2302", 10),
    queryPort: parseInt(process.env.NEXT_PUBLIC_QUERY_PORT || "2303", 10),
    mode: "Antistasi Ultimate",
    mission: "Antistasi Ultimate - Altis",
    map: "Altis",
    hasModpack: true,
    tagline: "24/7 Persistent Guerilla Campaign (42 Mods)",
  },
  {
    id: 'wasteland',
    name: "[AUS] Frenchy's A3Wasteland Altis | 32 Player",
    ip: "180.181.238.103",
    port: 2402,
    queryPort: 2403,
    mode: "A3Wasteland",
    mission: "A3Wasteland Altis v1.4d",
    map: "Altis",
    hasModpack: false,
    tagline: "24/7 Survival, Base Building & Faction Warfare",
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
  playerList: [
    { id: 1, name: "Frenchy", score: 0, timePlayedSeconds: 2160 }
  ]
};

export const MOCK_WASTELAND_DATA: ArmaServerStats = {
  name: SERVERS_LIST[1].name,
  ip: SERVERS_LIST[1].ip,
  port: SERVERS_LIST[1].port,
  queryPort: SERVERS_LIST[1].queryPort,
  status: "online",
  ping: 25,
  players: 0,
  maxPlayers: 32,
  map: "Altis",
  mission: "A3Wasteland Altis v1.4d",
  gameType: "A3Wasteland",
  version: "2.22.154089",
  battleye: true,
  passwordProtected: false,
  difficulty: "Custom",
  timeOfDay: "12:00 (In-Game)",
  uptime: "4h 30m",
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
  serverTags: "bf,r222,n0,s7,i3,mf,lf,vt,dt,tsandbox,g65545,h8343ea4f,f1,pl,e15",
  playerList: []
};
