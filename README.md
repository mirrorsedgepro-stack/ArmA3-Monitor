# Arma 3 Server Portal & Mod Repository (Vercel Ready)

A modern, high-performance web portal for your Arma 3 dedicated server designed for instant deployment on [Vercel](https://vercel.com). Built with Next.js 15, TypeScript, and Tailwind CSS.

## Layout

The dashboard follows [gethomepage/homepage](https://github.com/gethomepage/homepage)'s design: a dark slate theme, a top row of information widgets, service-style cards with stat blocks, and bookmarks.

- **Info bar**: server status, players, server FPS, headless clients, uptime, local + Zulu clock, live/pause, refresh, settings.
- **Server**: the mission card (status pill with ping; players, FPS, HCs, uptime; click for the roster) and a host card (platform, difficulty, BattlEye, signatures, voice, persistence).
- **Join**: Launch & Connect guide, copy `IP:port`, download the Launcher mod preset, Discord/TeamSpeak when configured.
- **Campaign**: Antistasi war level, HR, money, aggression, and unit/vehicle counts from `logPerformance`.
- **Activity**: player-count history, top players (time played, sessions, deaths, Antistasi rank) and an event feed (player deaths, flag captures, counterattacks and their outcome, promotions, joins/leaves), all parsed from the server log by the telemetry bridge.
- **Mods**: the server's preset with real size, last update and subscriber counts from the Steam Workshop API.
- **Bookmarks**.

Only real data is shown: a value, card or section the server (or Steam) did not report is left out rather than filled with a placeholder. The building blocks live in `components/dash/`.

---

## ⚡ Key Features

- **🔴 Live Server Telemetry & Stats**:
  - Real-time online/offline status beacon with Zulu clock.
  - Active player count, max slots, and capacity indicator.
  - Interactive **Active Squad Roster** modal with player names, scores, and mission time.
  - Current mission name, game mode (COOP, PvP, etc.), and operational map (Altis, Takistan, Chernarus, Tanoa, etc.).
  - BattlEye status, server version, difficulty, and ping/latency indicator.
  - Auto-refresh polling every 25 seconds with manual refresh trigger.

- **📦 Complete Mod Repository & Addon Showcase**:
  - Filterable by categories: *Core Framework, Factions & Weapons, Terrains & Maps, Medical & Realism, Radio & Sound, QoL & Interface, Server & Admin*.
  - Search by mod name, Steam Workshop ID, author, or tags.
  - Required vs. Client-side Optional filters.
  - Steam 1-Click Launch buttons (`steam://url/CommunityFilePage/...`) & Workshop browser links.
  - Grid view and Compact Table view.

- **🎯 Official Arma 3 Launcher Preset Generator**:
  - **1-Click Download Preset (.html)**: Generates the official Bohemia Interactive XML/HTML preset file. Players can drag and drop this file directly into their Arma 3 Launcher to automatically subscribe, download, and load every server mod in the correct order.
  - **Preset Importer**: Upload or paste any exported Arma 3 Launcher `.html` preset to instantly sync your own server's modpack without editing code.

- **🎮 Direct Connect & Community Links**:
  - Steam Direct Connect (`steam://connect/IP:PORT`).
  - 1-click clipboard copy for IP and Port.
  - Discord and TeamSpeak 3 / TFAR integration.
  - Operational Rules of Engagement (ROE), ACE3 keybinds cheat sheet, and TFAR radio channel matrix.

- **☁️ Cloud & Vercel Optimized**:
  - Direct Valve A2S UDP query protocol support.
  - Automatic fallback to BattleMetrics REST API if outbound UDP is restricted by cloud serverless firewalls.
  - Built-in preview/demo mode so the site looks stunning out of the box.

---

## 🚀 Deploying to Vercel (1-Click)

### Method 1: Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Deploy from the project directory
vercel
```

### Method 2: Deploy via Git (GitHub / GitLab)

1. Push this directory to your GitHub or GitLab repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Arma 3 Server Portal"
   git remote add origin https://github.com/your-username/arma3-server-portal.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository. Vercel automatically detects Next.js.
4. Add the environment variables listed below in the **Environment Variables** section.
5. Click **Deploy**.

---

## ⚙️ Environment Variables

Configure these either in `.env.local` (for local development) or directly in **Vercel Project Settings &rarr; Environment Variables**:

| Variable | Description | Example Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SERVER_NAME` | Display name of your Arma 3 server/community | `Frenchy's Antistasi Ultimate [RHS] \| 32-Player Dedicated` |
| `NEXT_PUBLIC_SERVER_IP` | Public IP or domain name of your Arma 3 server | `180.181.238.103` |
| `NEXT_PUBLIC_GAME_PORT` | Game connection port | `2302` |
| `NEXT_PUBLIC_QUERY_PORT` | Steam A2S query port (normally Game Port + 1) | `2303` |
| `NEXT_PUBLIC_DISCORD_URL` | Community Discord invite link | `https://discord.gg/arma3` |
| `NEXT_PUBLIC_TS3_URL` | TeamSpeak 3 connection URL for TFAR/ACRE | `ts3server://voice.arma3aegis.net?port=9987` |
| `BATTLEMETRICS_SERVER_ID` | *(Optional)* BattleMetrics server ID for cloud querying | `2351240` |

---

## 🛠️ Customizing the Mod List

You can customize the loaded modpack in two simple ways:

### Option A: Edit `data/defaultMods.ts` (Permanent)
Open [`data/defaultMods.ts`](file:///c:/Users/JED-Tools2/Downloads/ArmA3/data/defaultMods.ts) and add or modify mods with their Steam Workshop IDs:
```typescript
{
  id: "450814997",
  name: "CBA_A3 - Community Base Addons v3",
  category: "core",
  required: true,
  size: "42.5 MB",
  author: "CBATeam",
  description: "Standard foundation framework...",
  steamUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=450814997"
}
```

### Option B: Use the Web UI Preset Importer (Instant)
1. Open the portal in your browser.
2. Click **"Manage / Import"** in the mod repository section.
3. Select **"Import Custom Preset"** and upload the `.html` preset exported from your own Arma 3 Launcher.
4. The webapp instantly parses all mod names, categories, and Steam IDs!

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── mods/route.ts        # Mod list JSON endpoint
│   │   ├── preset/route.ts      # Arma 3 Launcher .html preset generator & parser
│   │   └── server/route.ts      # Live server query (A2S + BattleMetrics fallback)
│   ├── globals.css              # Tactical HUD styling & scanlines
│   ├── layout.tsx               # Root layout & SEO metadata
│   └── page.tsx                 # Main operational dashboard
├── components/
│   ├── Header.tsx               # Status beacon, Zulu clock, direct connect
│   ├── ServerOverview.tsx       # Mission, map, player capacity, ping telemetry
│   ├── ModList.tsx              # Filterable mod grid & table with Steam links
│   ├── PlayerListModal.tsx      # Active squad roster modal
│   ├── PresetModal.tsx          # Launcher preset download & import manager
│   ├── ServerConfigModal.tsx    # Live target IP/port changer
│   └── ServerRules.tsx          # Rules of engagement, keybinds, TFAR channels
├── data/
│   ├── defaultMods.ts           # Curated tactical Arma 3 mod list
│   └── defaultServer.ts         # Server configuration & fallback telemetry
├── lib/
│   ├── a2s.ts                   # Steam A2S protocol client over UDP
│   ├── battlemetrics.ts         # BattleMetrics API client for serverless cloud queries
│   └── presetGenerator.ts       # Bohemia Interactive Launcher HTML preset generator
├── vercel.json                  # Vercel deployment configuration
└── package.json
```

---

## 💻 Local Development

```bash
# Run local dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to view the portal.
