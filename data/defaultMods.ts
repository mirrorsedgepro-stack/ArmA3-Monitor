export interface ArmaMod {
  id: string; // Steam Workshop ID
  name: string;
  category: 'core' | 'equipment' | 'realism' | 'audio' | 'visuals' | 'qol' | 'terrain' | 'server';
  required: boolean;
  thumbnailUrl?: string;
  steamUrl?: string;
}

export const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  core: { label: 'Core Framework', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  equipment: { label: 'Factions & Gear', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  realism: { label: 'Movement & Gunplay', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  audio: { label: 'Audio & SFX', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  visuals: { label: 'Visuals & Blood', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  qol: { label: 'HUD & Logistics', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  terrain: { label: 'Terrains & Maps', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  server: { label: 'Server & Admin', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
};

export const DEFAULT_MODS: ArmaMod[] = [
  // ==========================================
  // 1. Core Framework & Missions (5 mods)
  // ==========================================
  {
    id: "450814997",
    name: "CBA_A3",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=450814997"
  },
  {
    id: "3020755032",
    name: "Antistasi Ultimate - Mod",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3020755032"
  },
  {
    id: "894678801",
    name: "Task Force Arrowhead Radio (BETA!!!)",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=894678801"
  },
  {
    id: "463939057",
    name: "ace",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=463939057"
  },
  {
    id: "3053169823",
    name: "ACE No Medical",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3053169823"
  },
  {
    id: "1779063631",
    name: "Zeus Enhanced",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1779063631"
  },

  // ==========================================
  // 2. RHS Factions & Military Gear (4 mods)
  // ==========================================
  {
    id: "843425103",
    name: "RHSAFRF",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843425103"
  },
  {
    id: "843577117",
    name: "RHSUSAF",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843577117"
  },
  {
    id: "843593391",
    name: "RHSGREF",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843593391"
  },
  {
    id: "843632231",
    name: "RHSSAF",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843632231"
  },

  // ==========================================
  // 3. Movement, Animations & Gunplay (14 mods)
  // ==========================================
  {
    id: "333310405",
    name: "Enhanced Movement",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=333310405"
  },
  {
    id: "2034363662",
    name: "Enhanced Movement Rework",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2034363662"
  },
  {
    id: "2198339170",
    name: "Alternative Running",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2198339170"
  },
  {
    id: "2993442344",
    name: "Death and Hit reactions",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2993442344"
  },
  {
    id: "3165450999",
    name: "WBK Immersive Animations",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3165450999"
  },
  {
    id: "1841047025",
    name: "Prone Launcher",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1841047025"
  },
  {
    id: "3450227250",
    name: "Reload While Aiming",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3450227250"
  },
  {
    id: "2623341670",
    name: "Animated Recoil coefficient changer",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2623341670"
  },
  {
    id: "567737932",
    name: "Reduced Weapon Sway",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=567737932"
  },
  {
    id: "2011658088",
    name: "AI avoids prone",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2011658088"
  },
  {
    id: "632435682",
    name: "Remove stamina",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=632435682"
  },
  {
    id: "782415569",
    name: "Remove stamina - ACE 3",
    category: "realism",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=782415569"
  },

  // ==========================================
  // 4. Audio & Soundscapes (5 mods)
  // ==========================================
  {
    id: "3407948300",
    name: "JSRS SOUNDMOD 2025",
    category: "audio",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3407948300"
  },
  {
    id: "825179978",
    name: "Enhanced Soundscape",
    category: "audio",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=825179978"
  },
  {
    id: "2938312887",
    name: "Enhanced Soundscape Plus",
    category: "audio",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2938312887"
  },
  {
    id: "2129532219",
    name: "Project SFX: Remastered",
    category: "audio",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2129532219"
  },
  {
    id: "2806487814",
    name: "Project SFX: Footsteps",
    category: "audio",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2806487814"
  },

  // ==========================================
  // 5. Visuals, Particles & Blood (7 mods)
  // ==========================================
  {
    id: "2257686620",
    name: "Blastcore Murr Edition",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2257686620"
  },
  {
    id: "2309871702",
    name: "Advance Aero Effects",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2309871702"
  },
  {
    id: "2886141254",
    name: "Improved Craters",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2886141254"
  },
  {
    id: "3235019725",
    name: "Some Effects Rework: Blood Impact",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3235019725"
  },
  {
    id: "3518145984",
    name: "D.I.R.T. - Dynamic Textures",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3518145984"
  },
  {
    id: "3525653940",
    name: "D.I.R.T. - Blood Textures",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3525653940"
  },
  {
    id: "2041057379",
    name: "A3 Thermal Improvement",
    category: "visuals",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2041057379"
  },

  // ==========================================
  // 6. HUD, Logistics & Quality of Life (7 mods)
  // ==========================================
  {
    id: "2791403093",
    name: "Better Inventory",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2791403093"
  },
  {
    id: "2390063219",
    name: "Inventory_Weight_Limit_Increase",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2390063219"
  },
  {
    id: "837729515",
    name: "CH View Distance",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=837729515"
  },
  {
    id: "2467590475",
    name: "Enhanced Map Ace Version",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2467590475"
  },
  {
    id: "2480263219",
    name: "Enhanced GPS",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2480263219"
  },
  {
    id: "2800081814",
    name: "Dynamic Camo System",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2800081814"
  },
  {
    id: "2981582086",
    name: "Simplex Tools and Extensions",
    category: "qol",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2981582086"
  },
  // Chernarus Redux + CUP + Antistasi Ultimate extenders
  {
    id: "583496184",
    name: "CUP Terrains - Core",
    category: "terrain",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=583496184"
  },
  {
    id: "583544987",
    name: "CUP Terrains - Maps",
    category: "terrain",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=583544987"
  },
  {
    id: "1981964169",
    name: "CUP Terrains - Maps 2.0",
    category: "terrain",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1981964169"
  },
  {
    id: "853743366",
    name: "CUP Terrains - CWA",
    category: "terrain",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=853743366"
  },
  {
    id: "1128256978",
    name: "Chernarus Redux",
    category: "terrain",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1128256978"
  },
  {
    id: "497660133",
    name: "CUP Weapons",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=497660133"
  },
  {
    id: "497661914",
    name: "CUP Units",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=497661914"
  },
  {
    id: "541888371",
    name: "CUP Vehicles",
    category: "equipment",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=541888371"
  },
  {
    id: "3414068749",
    name: "A3UE - Faction Madness",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3414068749"
  },
  {
    id: "3792065519",
    name: "[A3UE] - Frontlines & Patrols (A3U v12.0)",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792065519"
  },
  {
    id: "3457274925",
    name: "A3UE Active-Anti-artillery-Defence-System",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3457274925"
  },
  {
    id: "3558334679",
    name: "A3UE - Point Campfire",
    category: "core",
    required: true,
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3558334679"
  }
];
