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

export const DEFAULT_SERVER_CONFIG = {
  name: process.env.NEXT_PUBLIC_SERVER_NAME || "Frenchy's Antistasi Ultimate [RHS] | 32-Player Dedicated",
  ip: process.env.NEXT_PUBLIC_SERVER_IP || "180.181.238.103",
  port: parseInt(process.env.NEXT_PUBLIC_GAME_PORT || "2302", 10),
  queryPort: parseInt(process.env.NEXT_PUBLIC_QUERY_PORT || "2303", 10),
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/arma3",
  teamspeakUrl: process.env.NEXT_PUBLIC_TS3_URL || "",
};

export const MOCK_SERVER_DATA: ArmaServerStats = {
  name: DEFAULT_SERVER_CONFIG.name,
  ip: DEFAULT_SERVER_CONFIG.ip,
  port: DEFAULT_SERVER_CONFIG.port,
  queryPort: DEFAULT_SERVER_CONFIG.queryPort,
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
