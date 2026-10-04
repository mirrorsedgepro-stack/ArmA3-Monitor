'use client';

import React from 'react';
import { 
  Users, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Clock, 
  Radio, 
  Terminal, 
  ExternalLink, 
  Compass, 
  Headphones, 
  MessageSquare,
  Server,
  Zap
} from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface ServerOverviewProps {
  stats: ArmaServerStats;
  onOpenPlayerList: () => void;
  onOpenConfig: () => void;
  modCount: number;
}

export function ServerOverview({ stats, onOpenPlayerList, onOpenConfig, modCount }: ServerOverviewProps) {
  const isOnline = stats.status === 'online';
  const playerPercentage = Math.min(100, Math.round((stats.players / (stats.maxPlayers || 64)) * 100));

  const getMapBannerUrl = (mapName: string) => {
    const lower = mapName.toLowerCase();
    if (lower.includes('altis')) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
    if (lower.includes('takistan') || lower.includes('zargabad') || lower.includes('anizay')) {
      return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
    }
    if (lower.includes('chernarus') || lower.includes('livonia') || lower.includes('enoch')) {
      return 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80';
    }
    if (lower.includes('tanoa') || lower.includes('cam lao nam')) {
      return 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f9?auto=format&fit=crop&w=1200&q=80';
  };

  return (
    <div className="space-y-6">
      {/* Tactical Hero Banner */}
      <div className="relative rounded-xl overflow-hidden border border-tactical-700 bg-tactical-900 shadow-2xl">
        {/* Background Image with Tactical Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 filter blur-[1px] transition-all"
          style={{ backgroundImage: `url(${getMapBannerUrl(stats.map)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tactical-950 via-tactical-950/85 to-tactical-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase ${
                isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                {isOnline ? 'OPERATION ACTIVE' : 'SERVER STANDBY'}
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono text-zinc-300 bg-tactical-800/80 border border-tactical-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                AO: {stats.map}
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono text-zinc-300 bg-tactical-800/80 border border-tactical-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                MODE: {stats.gameType}
              </span>

              {stats.querySource === 'mock_active' && (
                <span 
                  onClick={onOpenConfig}
                  className="cursor-pointer px-2.5 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                  title="Click to enter your live server IP"
                >
                  ⚡ Preview Preset (Click to link IP)
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {stats.mission}
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base font-medium flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Host IP: <strong className="text-zinc-200 font-mono">{stats.ip}:{stats.port}</strong> (Query: <span className="text-zinc-300 font-mono">{stats.queryPort}</span>)</span>
            </p>
          </div>

          {/* Quick Connect Primary CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-sm tracking-wide shadow-tactical-glow transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <Terminal className="w-4 h-4" />
              <span>LAUNCH ARMA &amp; JOIN</span>
            </a>

            <div className="flex gap-2">
              {stats.discordUrl && (
                <a
                  href={stats.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-zinc-200 border border-tactical-600 font-mono text-xs font-semibold transition-all hover:text-white"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Discord</span>
                </a>
              )}

              {stats.teamspeakUrl && (
                <a
                  href={stats.teamspeakUrl}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-tactical-800 hover:bg-tactical-700 text-zinc-200 border border-tactical-600 font-mono text-xs font-semibold transition-all hover:text-white"
                >
                  <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TeamSpeak / TFAR</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Players Card */}
        <div 
          onClick={onOpenPlayerList}
          className="cursor-pointer group p-5 rounded-xl bg-tactical-900 border border-tactical-700 hover:border-emerald-500/50 hover:bg-tactical-850 transition-all shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Active Squad
            </span>
            <span className="text-xs font-mono text-emerald-400 group-hover:underline">
              View Roster &rarr;
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {stats.players}
            </span>
            <span className="text-sm font-mono text-zinc-500">
              / {stats.maxPlayers} SLOTS
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-tactical-950 rounded-full h-2 overflow-hidden border border-tactical-800">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${playerPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-mono text-zinc-400">
            <span>{playerPercentage}% Capacity</span>
            <span>{stats.maxPlayers - stats.players} Open Slots</span>
          </div>
        </div>

        {/* Loaded Mods Card */}
        <div className="p-5 rounded-xl bg-tactical-900 border border-tactical-700 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Active Addons
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Steam Synced
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {modCount}
            </span>
            <span className="text-sm font-mono text-zinc-500">
              MODS LOADED
            </span>
          </div>

          <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
            ACE3, RHS Escalation, TFAR Radio, CUP Terrains and KAT Medical integrated.
          </p>
        </div>

        {/* Security & System Card */}
        <div className="p-5 rounded-xl bg-tactical-900 border border-tactical-700 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Defense &amp; Engine
            </span>
            {stats.passwordProtected ? (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                <Lock className="w-3 h-3" /> Password
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <Unlock className="w-3 h-3" /> Open Entry
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-mono text-zinc-300">
              BattlEye: <span className="font-bold text-emerald-400">ACTIVE</span>
            </div>
            <div className="text-xs font-mono text-zinc-400 bg-tactical-950 px-2 py-1 rounded border border-tactical-800">
              v{stats.version}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-tactical-800 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Ping / Latency</span>
            <span className="text-emerald-400 font-bold">{stats.ping > 0 ? `${stats.ping} ms` : 'Live'}</span>
          </div>
        </div>

        {/* Operational Environment Card */}
        <div className="p-5 rounded-xl bg-tactical-900 border border-tactical-700 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              Environment
            </span>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
              {stats.difficulty}
            </span>
          </div>

          <div className="mt-3">
            <div className="text-lg font-bold font-mono text-zinc-100">
              {stats.timeOfDay || '06:00 (In-Game)'}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Mission Duration: <strong className="text-zinc-200 font-mono">{stats.uptime || '3h 45m'}</strong>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-tactical-800 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Telemetry Source</span>
            <span className="text-zinc-300 uppercase">{stats.querySource.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
