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
}

export const DEFAULT_SERVER_CONFIG = {
  name: process.env.NEXT_PUBLIC_SERVER_NAME || "[TF-AEGIS] Operation Thunderfall | Tactical Realism | ACE3 + RHS + TFAR",
  ip: process.env.NEXT_PUBLIC_SERVER_IP || "144.76.57.12",
  port: parseInt(process.env.NEXT_PUBLIC_GAME_PORT || "2302", 10),
  queryPort: parseInt(process.env.NEXT_PUBLIC_QUERY_PORT || "2303", 10),
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/arma3",
  teamspeakUrl: process.env.NEXT_PUBLIC_TS3_URL || "ts3server://voice.arma3aegis.net?port=9987",
};

export const MOCK_SERVER_DATA: ArmaServerStats = {
  name: DEFAULT_SERVER_CONFIG.name,
  ip: DEFAULT_SERVER_CONFIG.ip,
  port: DEFAULT_SERVER_CONFIG.port,
  queryPort: DEFAULT_SERVER_CONFIG.queryPort,
  status: "online",
  ping: 42,
  players: 18,
  maxPlayers: 48,
  map: "Takistan",
  mission: "Liberation RX - Operation Crescent Moon v2.4",
  gameType: "COOP",
  version: "2.16.151978",
  battleye: true,
  passwordProtected: false,
  difficulty: "Veteran",
  timeOfDay: "05:45 AM (Dawn)",
  uptime: "4h 22m",
  querySource: "mock_active",
  lastUpdated: new Date().toISOString(),
  discordUrl: DEFAULT_SERVER_CONFIG.discordUrl,
  teamspeakUrl: DEFAULT_SERVER_CONFIG.teamspeakUrl,
  playerList: [
    { id: 1, name: "CPT. Miller [1-1 HQ]", score: 1420, timePlayedSeconds: 8420 },
    { id: 2, name: "SSG. Ramirez [1-1-A]", score: 1150, timePlayedSeconds: 7910 },
    { id: 3, name: "CPL. Ghost [Sniper/Recon]", score: 980, timePlayedSeconds: 7420 },
    { id: 4, name: "Doc_Vance [Combat Medic]", score: 1650, timePlayedSeconds: 8200 },
    { id: 5, name: "SGT. Kowalski [Automatic Rifleman]", score: 870, timePlayedSeconds: 6310 },
    { id: 6, name: "Viper_Lead [Rotary Transport]", score: 720, timePlayedSeconds: 5900 },
    { id: 7, name: "EOD_Wrench [Engineer]", score: 640, timePlayedSeconds: 4800 },
    { id: 8, name: "PFC. Jensen [Grenadier]", score: 530, timePlayedSeconds: 4100 },
    { id: 9, name: "Ironclad [Armor Crewman]", score: 1100, timePlayedSeconds: 6700 },
    { id: 10, name: "Dustoff_2 [MEDEVAC Pilot]", score: 890, timePlayedSeconds: 5200 },
    { id: 11, name: "Shadow_4 [Marksman]", score: 450, timePlayedSeconds: 3100 },
    { id: 12, name: "Sapper_Dan [Combat Engineer]", score: 610, timePlayedSeconds: 3900 },
    { id: 13, name: "Hammer_Actual [JTAC/FAC]", score: 1310, timePlayedSeconds: 7800 },
    { id: 14, name: "Spectre_Lead [CAS Pilot]", score: 940, timePlayedSeconds: 4900 },
    { id: 15, name: "Ranger_Rick [Rifleman]", score: 320, timePlayedSeconds: 2100 },
    { id: 16, name: "Delta_Nine [Spotter]", score: 490, timePlayedSeconds: 3600 },
    { id: 17, name: "PFC. Walker [AT Specialist]", score: 780, timePlayedSeconds: 4500 },
    { id: 18, name: "Rookie_Blue [Rifleman]", score: 180, timePlayedSeconds: 1200 },
  ],
  rulesOfEngagement: [
    "Strict Roleplay / MilSim communication over TFAR radio frequencies. Maintain radio discipline.",
    "Positive ID required prior to weapons release. Friendly fire will result in an immediate kick/ban.",
    "Armor, Fixed-Wing, and Rotary assets require proper crew certification and JTAC clearance.",
    "All infantry squads must embed at least 1 certified Combat Life Saver (CLS) or Medic.",
    "Zeus Game Masters have final authority on mission scenario flow and live ordnance drops.",
    "No trolling, griefing, or unauthorized asset destruction in Base Operations Area (FOB)."
  ]
};
