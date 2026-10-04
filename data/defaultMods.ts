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
  realism: { label: 'Medical & Mechanics', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  audio: { label: 'Radio & Sound', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  qol: { label: 'QoL & Interface', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  server: { label: 'Server & Admin', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
};

export const DEFAULT_MODS: ArmaMod[] = [
  {
    id: "450814997",
    name: "CBA_A3 - Community Base Addons v3",
    category: "core",
    required: true,
    size: "42.5 MB",
    author: "CBATeam",
    version: "3.16.0",
    description: "Standard foundation framework required by almost every Arma 3 community addon.",
    tags: ["Framework", "Events", "Keybinds"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=450814997"
  },
  {
    id: "463939057",
    name: "ACE3 (Advanced Combat Environment)",
    category: "realism",
    required: true,
    size: "385.2 MB",
    author: "ACE3 Team",
    version: "3.18.1",
    description: "Complete overhaul of Arma 3 gameplay: advanced ballistics, realistic medical system, interaction menus, explosives, and windage.",
    tags: ["Medical", "Ballistics", "Interaction", "Realism"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=463939057"
  },
  {
    id: "893505103",
    name: "Task Force Arrowhead Radio (BETA)",
    category: "audio",
    required: true,
    size: "115.8 MB",
    author: "TFAR Team",
    version: "1. - 0.9.12",
    description: "Provides realistic direct-frequency radio communication through TeamSpeak 3 with terrain occlusion, radio signal degradation, and underwater speech effects.",
    tags: ["Radio", "Comms", "TeamSpeak"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=893505103"
  },
  {
    id: "843577117",
    name: "RHS: United States Armed Forces (RHSUSAF)",
    category: "equipment",
    required: true,
    size: "6.8 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "High-fidelity recreation of current US Army and Marine Corps weaponry, vehicles (M1A2 Abrams, Strykers, Bradleys, UH-60), and uniforms.",
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
    description: "Russian Federation military forces: T-90, BTR-82A, Ka-52, AK-74M, AK-12 series, ratnik equipment, and heavy armor.",
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
    description: "Irregular, partisan, and militia factions with modified civilian and cold-war military hardware.",
    tags: ["Militia", "Insurgency", "Equipment"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843593391"
  },
  {
    id: "583496184",
    name: "CUP Terrains - Core",
    category: "terrain",
    required: true,
    size: "11.2 GB",
    author: "CUP Team",
    version: "1.17.1",
    description: "Core assets, textures, and structures needed to run legacy terrains from Arma 1, Arma 2, and community maps.",
    tags: ["Terrains", "Textures", "Buildings"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=583496184"
  },
  {
    id: "583510805",
    name: "CUP Terrains - Maps 2.0",
    category: "terrain",
    required: true,
    size: "4.7 GB",
    author: "CUP Team",
    version: "1.17.1",
    description: "Features legendary tactical battlegrounds including Chernarus Autumn/Summer, Takistan, Zargabad, and Utes.",
    tags: ["Chernarus", "Takistan", "Zargabad"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=583510805"
  },
  {
    id: "1529043424",
    name: "KAT - Advanced Medical",
    category: "realism",
    required: true,
    size: "185.0 MB",
    author: "KAT Team",
    version: "2.12.0",
    description: "Deep airway management, pulse oximetry, intubation, surgical kits, pneumothorax needles, blood types, and defib units expanding ACE3.",
    tags: ["Medical", "Airway", "Surgical", "ACE3 Addon"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1529043424"
  },
  {
    id: "1779063631",
    name: "Zeus Enhanced (ZEN)",
    category: "server",
    required: false,
    size: "18.2 MB",
    author: "ZEN Team",
    version: "1.14.0",
    description: "Dramatically modernizes Game Master controls for real-time mission creators with scripted scenarios and mission telemetry.",
    tags: ["Zeus", "Mission Making", "Admin Tools"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1779063631"
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
    id: "861133567",
    name: "JSRS Soundmod",
    category: "audio",
    required: false,
    size: "3.2 GB",
    author: "LordJarhead",
    version: "6.22.0",
    description: "Ultra-crisp weapon reports, sonic snaps, distant artillery thuds, shell casings falling, and reverberant echo tails. Fully client-side.",
    tags: ["Sound", "Immersion", "Weapons", "Client-Side"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=861133567"
  },
  {
    id: "820924072",
    name: "Blastcore Edited (Standalone)",
    category: "qol",
    required: false,
    size: "245.0 MB",
    author: "Opticalsnare / roflcopter",
    version: "1.4.0",
    description: "Volumetric smoke clouds, sparks, incendiary blast shockwaves, and particle enhancements. Client-side cosmetic.",
    tags: ["FX", "Explosions", "Smoke", "Client-Side"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=820924072"
  },
  {
    id: "751965557",
    name: "DUI - Squad Radar",
    category: "qol",
    required: false,
    size: "4.8 MB",
    author: "diwako",
    version: "1.7.0",
    description: "Minimalist compass radar displaying team member bearings, bearing numbers, and medical status icons for squad coordination.",
    tags: ["HUD", "Squad", "Radar", "Client-Side"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=751965557"
  }
];
