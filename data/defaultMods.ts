export interface ArmaMod {
  id: string; // Steam Workshop ID
  name: string;
  category: 'core' | 'equipment' | 'terrain' | 'realism' | 'audio' | 'qol' | 'server';
  required: boolean;
  size?: string;
  author?: string;
  version?: string;
  description?: string;
  tags?: string[];
  thumbnailUrl?: string;
  steamUrl?: string;
}

export const CATEGORY_LABELS: Record<ArmaMod['category'], { label: string; color: string }> = {
  core: { label: 'Core System', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  equipment: { label: 'Factions & Weapons', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  terrain: { label: 'Terrains & Maps', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  realism: { label: 'Medical & Gameplay', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  audio: { label: 'Sound & FX', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  qol: { label: 'QoL & Interface', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  server: { label: 'Server & Admin', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
};

export const DEFAULT_MODS: ArmaMod[] = [
  {
    id: "3053169823",
    name: "Antistasi Ultimate - Mod",
    category: "core",
    required: true,
    size: "145.2 MB",
    author: "Antistasi Ultimate Team",
    version: "1.2.0",
    description: "Dynamic guerrilla and insurgent warfare overhaul. Capture outposts, steal resources, recruit AI, and liberate the island of Altis.",
    tags: ["Antistasi", "Guerrilla", "Gamemode", "Campaign"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3053169823"
  },
  {
    id: "450814997",
    name: "CBA_A3 - Community Base Addons v3",
    category: "core",
    required: true,
    size: "42.5 MB",
    author: "CBATeam",
    version: "3.19.0",
    description: "Standard foundation framework required by almost every Arma 3 community addon.",
    tags: ["Framework", "Events", "Keybinds"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=450814997"
  },
  {
    id: "463939057",
    name: "Advanced Combat Environment 3 (ACE3)",
    category: "realism",
    required: true,
    size: "385.2 MB",
    author: "ACE3 Team",
    version: "3.21.2",
    description: "Comprehensive modular realism overhaul: advanced medical system, interaction menus, windage, and realistic mechanics.",
    tags: ["Medical", "Ballistics", "Interaction", "Realism"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=463939057"
  },
  {
    id: "843577117",
    name: "RHS: United States Forces (RHSUSAF)",
    category: "equipment",
    required: true,
    size: "6.8 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Modern US Armed Forces infantry weaponry, gear, vehicles, and armored combat equipment.",
    tags: ["US Military", "Vehicles", "Infantry", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843577117"
  },
  {
    id: "843425103",
    name: "RHS: Armed Forces of the Russian Federation (RHSAFRF)",
    category: "equipment",
    required: true,
    size: "5.4 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Russian Federation military armed forces equipment, heavy armor, helicopters, and firearms.",
    tags: ["RU Military", "Tanks", "Helicopters", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843425103"
  },
  {
    id: "843593391",
    name: "RHS: Gendarmerie and Insurgent Forces (RHSGREF)",
    category: "equipment",
    required: true,
    size: "2.1 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Irregular, partisan, and militia factions with modified civilian and military hardware.",
    tags: ["Militia", "Insurgency", "Equipment"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843593391"
  },
  {
    id: "843693926",
    name: "RHS: Serbian Armed Forces (RHSSAF)",
    category: "equipment",
    required: true,
    size: "1.4 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Serbian military weaponry, uniforms, helmets, and transport assets for irregular ops.",
    tags: ["Serbian Armed Forces", "Factions", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843693926"
  },
  {
    id: "333310405",
    name: "Enhanced Movement",
    category: "qol",
    required: true,
    size: "6.5 MB",
    author: "badbenson",
    version: "1.1.2",
    description: "Allows soldiers to climb walls, mantle rooftops, jump over barricades, and crawl through windows.",
    tags: ["Parkour", "Mantling", "Movement"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=333310405"
  },
  {
    id: "2033368240",
    name: "Enhanced Movement Rework",
    category: "qol",
    required: true,
    size: "12.8 MB",
    author: "Sceptre",
    version: "1.4.0",
    description: "Polished re-implementation of mantling animations, sprint climbing, and stamina interaction.",
    tags: ["Movement", "Rework", "Climbing"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2033368240"
  },
  {
    id: "2011658088",
    name: "Remove Stamina - ACE 3",
    category: "qol",
    required: true,
    size: "1.2 MB",
    author: "Vojta",
    version: "1.0",
    description: "Disables ACE3 weapon sway penalty and excessive fatigue exhaustion during extended maneuvers.",
    tags: ["Stamina", "Sprint", "Quality of Life"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2011658088"
  },
  {
    id: "1779063631",
    name: "Zeus Enhanced (ZEN)",
    category: "server",
    required: false,
    size: "18.2 MB",
    author: "ZEN Team",
    version: "1.15.1",
    description: "Modernizes Game Master controls for real-time mission management and scenario telemetry.",
    tags: ["Zeus", "Admin Tools", "Game Master"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1779063631"
  },
  {
    id: "2791403093",
    name: "Better Inventory",
    category: "qol",
    required: false,
    size: "3.5 MB",
    author: "Seb",
    version: "1.3.0",
    description: "Streamlined inventory UI showing full gear slots, item weight breakdowns, and quick container transfers.",
    tags: ["UI", "Inventory", "HUD"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2791403093"
  },
  {
    id: "2482810515",
    name: "Enhanced GPS",
    category: "qol",
    required: false,
    size: "2.1 MB",
    author: "Sceptre",
    version: "1.1.0",
    description: "Transparent minimap GPS overlay with grid references, compass bearings, and custom waypoint markers.",
    tags: ["GPS", "Navigation", "HUD"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2482810515"
  },
  {
    id: "2493012920",
    name: "Enhanced Map Ace Version",
    category: "qol",
    required: false,
    size: "4.8 MB",
    author: "Sceptre",
    version: "1.2.0",
    description: "High-contrast tactical map grid with ACE compass alignment and topographic terrain contours.",
    tags: ["Map", "Navigation", "Topography"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2493012920"
  },
  {
    id: "2949704250",
    name: "Dying and Hit Reactions",
    category: "realism",
    required: true,
    size: "24.5 MB",
    author: "Frechdachs",
    version: "2.1.0",
    description: "Physics-driven hit impact stumble animations, kinetic stumble reactions, and combat shock.",
    tags: ["Immersion", "Hit Reactions", "Combat"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2949704250"
  },
  {
    id: "2403290947",
    name: "Alternative Running",
    category: "qol",
    required: false,
    size: "5.1 MB",
    author: "Wasteland Warrior",
    version: "1.0",
    description: "Tactical ready-low sprint and jog animation overhaul for natural soldier motion.",
    tags: ["Animations", "Sprint", "Locomotion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2403290947"
  },
  {
    id: "2390063219",
    name: "WBK Immersive Animations",
    category: "realism",
    required: false,
    size: "45.0 MB",
    author: "WebKnight",
    version: "1.3.0",
    description: "Dynamic weapon handling, inspect animations, and cinematic battlefield actions.",
    tags: ["Animations", "Immersion", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2390063219"
  },
  {
    id: "2041057379",
    name: "Prone Launcher",
    category: "qol",
    required: false,
    size: "1.5 MB",
    author: "Dankan37",
    version: "1.0",
    description: "Enables firing and reloading rocket launchers (RPG-7, SMAW, AT4) from the prone stance.",
    tags: ["Launchers", "AT", "Stance"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2041057379"
  },
  {
    id: "2309871702",
    name: "Simplex Tools and Extensions",
    category: "server",
    required: false,
    size: "8.4 MB",
    author: "Simplex Team",
    version: "1.0.5",
    description: "Server utility extensions for mission scripts, markers, and tactical battlefield management.",
    tags: ["Tools", "Scripting", "Server"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2309871702"
  },
  {
    id: "2257686620",
    name: "Dynamic Camo System",
    category: "realism",
    required: true,
    size: "6.2 MB",
    author: "vurtual",
    version: "1.2.0",
    description: "Dynamically calculates AI detection distance based on terrain texture, shadow lighting, and camo pattern match.",
    tags: ["Stealth", "AI", "Camo"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2257686620"
  },
  {
    id: "3450227250",
    name: "Reduced Weapon Sway",
    category: "qol",
    required: false,
    size: "1.1 MB",
    author: "Community",
    version: "1.0",
    description: "Reduces excessive weapon drift and sway while standing or moving for tighter firefights.",
    tags: ["Aim", "Sway", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3450227250"
  },
  {
    id: "2835948956",
    name: "ARCC - Advanced Recoil & Combat Control",
    category: "realism",
    required: false,
    size: "3.4 MB",
    author: "CombatDev",
    version: "1.1.0",
    description: "Procedural recoil impulse curves and barrel climb compensation.",
    tags: ["Recoil", "Ballistics", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2835948956"
  },
  {
    id: "861133567",
    name: "JSRS Soundmod 2025",
    category: "audio",
    required: false,
    size: "3.2 GB",
    author: "LordJarhead",
    version: "4.0.0.12",
    description: "Ultra-crisp weapon reports, sonic cracks, distant artillery reverberation, and environmental acoustics.",
    tags: ["Audio", "Weapons", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=861133567"
  },
  {
    id: "825179978",
    name: "Enhanced Soundscape Plus",
    category: "audio",
    required: false,
    size: "65.0 MB",
    author: "LAxemann",
    version: "1.4.0",
    description: "Positional echo reflections off mountains, forest canopies, open plains, and concrete urban corridors.",
    tags: ["Audio", "Echo", "Acoustics"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=825179978"
  },
  {
    id: "3151833535",
    name: "SFX Project: Remastered",
    category: "audio",
    required: false,
    size: "185.0 MB",
    author: "SFX Team",
    version: "2.0",
    description: "High-definition supersonic bullet flybys, ricochets, shrapnel zips, and shell casing drops.",
    tags: ["SFX", "Audio", "Bullets"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3151833535"
  },
  {
    id: "2793132644",
    name: "WebKnights Footsteps",
    category: "audio",
    required: false,
    size: "120.0 MB",
    author: "WebKnight",
    version: "1.1.0",
    description: "Heavier, immersive boots-on-ground audio varying by surface: gravel, mud, water, sheet metal, and tiles.",
    tags: ["Audio", "Footsteps", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2793132644"
  },
  {
    id: "2019904258",
    name: "Improved Craters",
    category: "qol",
    required: false,
    size: "35.0 MB",
    author: "Tepes",
    version: "1.2.0",
    description: "Deep procedural blast craters and scorched terrain decals from artillery, mortars, and bombs.",
    tags: ["VFX", "Craters", "Explosions"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2019904258"
  },
  {
    id: "837729515",
    name: "Some Effects Rework: Blood Impact",
    category: "realism",
    required: false,
    size: "18.5 MB",
    author: "Taro",
    version: "1.1",
    description: "Visceral kinetic bullet impact mist, entry wound decals, and arterial spurts.",
    tags: ["FX", "Blood", "Impacts"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=837729515"
  },
  {
    id: "2848972170",
    name: "D.I.R.T. (Dynamic Immersion & Realism Textures)",
    category: "realism",
    required: false,
    size: "210.0 MB",
    author: "Frechdachs",
    version: "0.5.2",
    description: "Soldier gear accumulates dirt, dust, mud splashes, and battle wear as missions progress.",
    tags: ["Visuals", "Dirt", "Textures", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2848972170"
  },
  {
    id: "2849000854",
    name: "D.I.R.T. Blood Compat",
    category: "realism",
    required: false,
    size: "4.5 MB",
    author: "Frechdachs",
    version: "0.2.0",
    description: "Compatibility bridge connecting D.I.R.T. uniform weathering with ACE3 medical blood splatter.",
    tags: ["Compat", "Blood", "D.I.R.T.", "ACE3"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2849000854"
  }
];
