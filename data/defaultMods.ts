export interface ArmaMod {
  id: string; // Steam Workshop ID
  name: string;
  category: 'core' | 'equipment' | 'realism' | 'audio' | 'visuals' | 'qol' | 'terrain' | 'server';
  required: boolean;
  size?: string;
  author?: string;
  version?: string;
  description?: string;
  tags?: string[];
  thumbnailUrl?: string;
  steamUrl?: string;
}

export const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  core: { label: 'Core Framework', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  equipment: { label: 'RHS Factions', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  realism: { label: 'Movement & Gunplay', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  audio: { label: 'Audio & SFX', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  visuals: { label: 'Visuals & Blood', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  qol: { label: 'HUD & Logistics', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  terrain: { label: 'Terrains & Maps', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  server: { label: 'Server & Admin', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
};

export const DEFAULT_MODS: ArmaMod[] = [
  // ==========================================
  // 1. Core Framework & Missions
  // ==========================================
  {
    id: "450814997",
    name: "CBA_A3 (Community Base Addons)",
    category: "core",
    required: true,
    size: "42.5 MB",
    author: "CBATeam",
    version: "3.19.0",
    description: "Standard foundation framework required by almost every Arma 3 community addon.",
    tags: ["Framework", "Core", "Keybinds"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=450814997"
  },
  {
    id: "3020755032",
    name: "Antistasi The Mod - Ultimate",
    category: "core",
    required: true,
    size: "145.2 MB",
    author: "Antistasi Ultimate Team",
    version: "1.2.0",
    description: "Dynamic guerrilla and insurgent warfare overhaul. Capture outposts, steal resources, recruit AI, and liberate Altis.",
    tags: ["Antistasi", "Guerrilla", "Gamemode", "Campaign"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3020755032"
  },
  {
    id: "463939057",
    name: "ace (Advanced Combat Environment 3)",
    category: "core",
    required: true,
    size: "385.2 MB",
    author: "ACE3 Team",
    version: "3.21.2",
    description: "Comprehensive modular realism overhaul: interaction menus, advanced ballistics, windage, and logistics.",
    tags: ["Realism", "Interaction", "Ballistics", "Logistics"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=463939057"
  },
  {
    id: "3053169823",
    name: "ACE No Medical",
    category: "core",
    required: true,
    size: "1.2 MB",
    author: "ACE Team",
    version: "1.0.0",
    description: "Disables complex ACE medical mechanics while keeping interaction, ballistics, and tactical gear systems intact.",
    tags: ["Medical", "ACE", "QoL"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3053169823"
  },
  {
    id: "1779063631",
    name: "Zeus Enhanced",
    category: "core",
    required: true,
    size: "28.4 MB",
    author: "ZEN Team",
    version: "1.14.0",
    description: "Powerful real-time mission curation, admin tools, and Zeus scenario management interface.",
    tags: ["Zeus", "Admin", "Curation"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1779063631"
  },

  // ==========================================
  // 2. RHS Factions & Military Gear
  // ==========================================
  {
    id: "843425103",
    name: "RHS: Armed Forces of the Russian Federation (RHSAFRF)",
    category: "equipment",
    required: true,
    size: "5.4 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Russian Federation military armed forces equipment, heavy armor, helicopters, and firearms.",
    tags: ["RHS", "Russian Military", "Vehicles", "Weapons"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843425103"
  },
  {
    id: "843577117",
    name: "RHS: United States Armed Forces (RHSUSAF)",
    category: "equipment",
    required: true,
    size: "6.8 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Modern US Armed Forces infantry weaponry, combat uniforms, optics, wheeled and tracked armor, and aircraft.",
    tags: ["RHS", "US Military", "Infantry", "Armor"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843577117"
  },
  {
    id: "843593391",
    name: "RHS: Gendarmerie and Rebel Equipment (RHSGREF)",
    category: "equipment",
    required: true,
    size: "2.1 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Irregular, partisan, and militia factions with modified civilian and captured military hardware tailored for guerrilla warfare.",
    tags: ["RHS", "Guerrilla", "Partisans", "Militia"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843593391"
  },
  {
    id: "843632231",
    name: "RHS: Serbian Armed Forces (RHSSAF)",
    category: "equipment",
    required: true,
    size: "1.2 GB",
    author: "Red Hammer Studios",
    version: "0.5.6",
    description: "Serbian military hardware, camouflages, small arms, and combat gear.",
    tags: ["RHS", "Serbian Military", "Weapons", "Gear"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=843632231"
  },

  // ==========================================
  // 3. Movement, Animations & Gunplay
  // ==========================================
  {
    id: "333310405",
    name: "Enhanced Movement",
    category: "realism",
    required: true,
    size: "18.2 MB",
    author: "badbenson",
    version: "1.1.0",
    description: "Vaulting, climbing, and jumping mechanics across high walls, rooftops, and obstacles.",
    tags: ["Movement", "Parkour", "Climbing"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=333310405"
  },
  {
    id: "2034363662",
    name: "Enhanced Movement Rework",
    category: "realism",
    required: true,
    size: "12.5 MB",
    author: "Sceptre",
    version: "2.0.1",
    description: "Modernized traversal engine with refined animations, smooth mantling, and enhanced client performance.",
    tags: ["Movement", "Mantling", "Performance"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2034363662"
  },
  {
    id: "2198339170",
    name: "Alternative Running",
    category: "realism",
    required: true,
    size: "8.4 MB",
    author: "Macser",
    version: "1.0.4",
    description: "Smooth tactical jog and sprinting motion cycles with weapon-ready posture.",
    tags: ["Animation", "Running", "Locomotion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2198339170"
  },
  {
    id: "2993442344",
    name: "Death and Hit reactions",
    category: "realism",
    required: true,
    size: "4.2 MB",
    author: "Alien314",
    version: "1.3.2",
    description: "Dynamic kinematic stumbles, flinches, and realistic hit physical reactions under ballistic impact.",
    tags: ["Ragdoll", "Hit Reactions", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2993442344"
  },
  {
    id: "3165450999",
    name: "WBK Immersive Animations",
    category: "realism",
    required: true,
    size: "95.6 MB",
    author: "WebKnight",
    version: "2.0.0",
    description: "Cinematic first and third-person infantry movements, weapon draws, transitions, and natural idle poses.",
    tags: ["Animations", "WebKnight", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3165450999"
  },
  {
    id: "1841047025",
    name: "Prone Launcher",
    category: "realism",
    required: true,
    size: "1.1 MB",
    author: "Kerc Kasha",
    version: "1.0.2",
    description: "Enables firing AT and AA rocket launchers while in the prone posture.",
    tags: ["Gunplay", "Launchers", "Tactics"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1841047025"
  },
  {
    id: "3450227250",
    name: "Reload While Aiming",
    category: "realism",
    required: true,
    size: "2.5 MB",
    author: "Community",
    version: "1.0.0",
    description: "Allows retaining weapon sight picture and shoulder aim throughout the weapon reload animation.",
    tags: ["Gunplay", "Reload", "ADS"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3450227250"
  },
  {
    id: "2623341670",
    name: "Animated Recoil coefficient changer",
    category: "realism",
    required: true,
    size: "3.8 MB",
    author: "Community",
    version: "1.1.2",
    description: "Smooth physics-based recoil simulation adjusting barrel rise and weapon stability dynamically.",
    tags: ["Recoil", "Gunplay", "Ballistics"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2623341670"
  },
  {
    id: "567737932",
    name: "Reduced Weapon Sway",
    category: "realism",
    required: true,
    size: "0.8 MB",
    author: "Community",
    version: "1.0.0",
    description: "Calibrates weapon sway and breathing dispersion to realistic trained operator standards.",
    tags: ["Aim", "Sway", "Handling"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=567737932"
  },
  {
    id: "2011658088",
    name: "AI avoids prone",
    category: "realism",
    required: true,
    size: "0.5 MB",
    author: "Community",
    version: "1.0.0",
    description: "Prevents enemy AI from instantly dropping prone in tall grass, promoting active cover-to-cover fire-and-maneuver.",
    tags: ["AI", "Tactics", "Combat"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2011658088"
  },
  {
    id: "632435682",
    name: "Remove stamina",
    category: "realism",
    required: true,
    size: "0.4 MB",
    author: "Community",
    version: "1.0.0",
    description: "Removes standard vanilla fatigue and weapon shake caused by long distance sprinting.",
    tags: ["Stamina", "Sprint", "QoL"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=632435682"
  },
  {
    id: "782415569",
    name: "Remove stamina - ACE 3",
    category: "realism",
    required: true,
    size: "0.6 MB",
    author: "Community",
    version: "1.0.0",
    description: "Synchronizes stamina removal with ACE3 advanced weight and fatigue modules.",
    tags: ["ACE3", "Stamina", "Movement"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=782415569"
  },

  // ==========================================
  // 4. Audio & Soundscapes
  // ==========================================
  {
    id: "3407948300",
    name: "JSRS SOUNDMOD 2025",
    category: "audio",
    required: true,
    size: "2.8 GB",
    author: "LJFHutch / JSRS",
    version: "2025.1",
    description: "Complete tactical audio overhaul with authentic weapon reports, distant echoes, and mechanical acoustics.",
    tags: ["Audio", "JSRS", "Weapons", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3407948300"
  },
  {
    id: "825179978",
    name: "Enhanced Soundscape",
    category: "audio",
    required: true,
    size: "64.2 MB",
    author: "Laxemann",
    version: "1.2.0",
    description: "Dynamic environmental acoustics and reverb calculated from nearby buildings, forests, and valleys.",
    tags: ["Acoustics", "Reverb", "Audio"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=825179978"
  },
  {
    id: "2938312887",
    name: "Enhanced Soundscape Plus",
    category: "audio",
    required: true,
    size: "48.5 MB",
    author: "Laxemann / Community",
    version: "1.0.5",
    description: "Expanded situational audio layers, indoor weapon acoustics, and ambient combat reverberation.",
    tags: ["Soundscape", "Indoors", "Audio"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2938312887"
  },
  {
    id: "2129532219",
    name: "Project SFX: Remastered",
    category: "audio",
    required: true,
    size: "115.0 MB",
    author: "Community",
    version: "1.4.0",
    description: "High-fidelity battlefield audio including snap-flybys, supersonic bullet cracks, and debris impacts.",
    tags: ["SFX", "Bullet Cracks", "Battlefield"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2129532219"
  },
  {
    id: "2806487814",
    name: "Project SFX: Footsteps",
    category: "audio",
    required: true,
    size: "35.2 MB",
    author: "Community",
    version: "1.1.0",
    description: "Realistic footwear acoustic responses across gravel, pavement, grass, wood, and interior surfaces.",
    tags: ["Footsteps", "Acoustics", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2806487814"
  },

  // ==========================================
  // 5. Visuals, Particles & Blood
  // ==========================================
  {
    id: "2257686620",
    name: "Blastcore Murr Edition",
    category: "visuals",
    required: true,
    size: "420.0 MB",
    author: "Murr",
    version: "1.8.0",
    description: "Volumetric visual FX overhaul featuring cinematic explosions, weapon muzzle blasts, rocket smoke plumes, and fire particles.",
    tags: ["VFX", "Explosions", "Smoke", "Muzzle Flash"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2257686620"
  },
  {
    id: "2309871702",
    name: "Advance Aero Effects",
    category: "visuals",
    required: true,
    size: "18.5 MB",
    author: "Community",
    version: "1.2.0",
    description: "Vapor cones, wingtip vortices, sonic condensations, and realistic aircraft aerodynamic visual effects.",
    tags: ["Aerodynamics", "Jets", "VFX"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2309871702"
  },
  {
    id: "2886141254",
    name: "Improved Craters",
    category: "visuals",
    required: true,
    size: "45.0 MB",
    author: "Community",
    version: "1.0.3",
    description: "High-resolution 3D impact deformation and crater textures for heavy artillery, bombs, and explosive ordinance.",
    tags: ["Craters", "Terrain", "Explosives"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2886141254"
  },
  {
    id: "3235019725",
    name: "Some Effects Rework: Blood Impact",
    category: "visuals",
    required: true,
    size: "14.2 MB",
    author: "Community",
    version: "1.1.0",
    description: "Directional blood mist, arterial spray, and ground splatter corresponding to ballistic entry and exit wounds.",
    tags: ["Blood", "Splatter", "Immersion"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3235019725"
  },
  {
    id: "3518145984",
    name: "D.I.R.T. - Dynamic Textures",
    category: "visuals",
    required: true,
    size: "180.0 MB",
    author: "DIRT Team",
    version: "1.0.2",
    description: "Dynamic dirt, mud, dust, and weathering that builds up onto soldiers' uniforms and tactical gear during field combat.",
    tags: ["DIRT", "Mud", "Dynamic Textures"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3518145984"
  },
  {
    id: "3525653940",
    name: "D.I.R.T. - Blood Textures",
    category: "visuals",
    required: true,
    size: "65.0 MB",
    author: "DIRT Team",
    version: "1.0.0",
    description: "Persistent dynamic blood soaking, uniform stains, and medical dressing visuals.",
    tags: ["DIRT", "Blood Textures", "Medical"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=3525653940"
  },
  {
    id: "2041057379",
    name: "A3 Thermal Improvement",
    category: "visuals",
    required: true,
    size: "2.4 MB",
    author: "Fat_Lurch",
    version: "1.1.0",
    description: "Realistic infrared thermal vision simulation correcting contrast, heat signatures, and atmospheric dissipation.",
    tags: ["Thermal", "FLIR", "Optics"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2041057379"
  },

  // ==========================================
  // 6. HUD, Logistics & Quality of Life
  // ==========================================
  {
    id: "2791403093",
    name: "Better Inventory",
    category: "qol",
    required: true,
    size: "1.8 MB",
    author: "Community",
    version: "1.2.0",
    description: "Streamlined inventory UI with search filtering, mass sorting, and fast container management.",
    tags: ["Inventory", "UI", "QoL"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2791403093"
  },
  {
    id: "2390063219",
    name: "Inventory_Weight_Limit_Increase",
    category: "qol",
    required: true,
    size: "0.2 MB",
    author: "Community",
    version: "1.0.0",
    description: "Increases uniform, vest, and backpack carrying capacities for heavy guerrilla ordnance logistics.",
    tags: ["Capacity", "Weight", "Logistics"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2390063219"
  },
  {
    id: "837729515",
    name: "CH View Distance",
    category: "qol",
    required: true,
    size: "0.5 MB",
    author: "Champ",
    version: "1.3.1",
    description: "Dynamic in-game slider panel to adjust render view distance, terrain detail, and shadow distance on the fly.",
    tags: ["View Distance", "FPS", "Performance"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=837729515"
  },
  {
    id: "2467590475",
    name: "Enhanced Map Ace Version",
    category: "qol",
    required: true,
    size: "1.5 MB",
    author: "Community",
    version: "1.0.2",
    description: "Topographic map enhancement integrated with ACE navigation tools and clear contour lines.",
    tags: ["Map", "Navigation", "Topography"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2467590475"
  },
  {
    id: "2480263219",
    name: "Enhanced GPS",
    category: "qol",
    required: true,
    size: "3.2 MB",
    author: "Community",
    version: "1.1.0",
    description: "High-resolution microDAGR tactical GPS display with heading compass and situational terrain elevation.",
    tags: ["GPS", "Navigation", "HUD"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2480263219"
  },
  {
    id: "2800081814",
    name: "Dynamic Camo System",
    category: "qol",
    required: true,
    size: "4.8 MB",
    author: "Community",
    version: "1.0.4",
    description: "Calculates player camouflage rating dynamically based on uniform pattern, background foliage, and shadow cover.",
    tags: ["Stealth", "Camo", "Concealment"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2800081814"
  },
  {
    id: "2981582086",
    name: "Simplex Tools and Extensions",
    category: "qol",
    required: true,
    size: "6.5 MB",
    author: "Community",
    version: "1.0.1",
    description: "Tactical utility tools including wire cutters, fortification digging, logistics rigging, and equipment deployment.",
    tags: ["Tools", "Logistics", "Engineering"],
    steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=2981582086"
  }
];
