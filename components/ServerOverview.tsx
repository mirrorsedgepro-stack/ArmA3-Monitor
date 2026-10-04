'use client';

import React from 'react';
import { Users, Activity, ShieldCheck, MapPin, Terminal, Download, Sparkles, ArrowRight, Zap, Radio } from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface ServerOverviewProps {
  stats: ArmaServerStats;
  onOpenPlayerList: () => void;
  onOpenConfig: () => void;
  onDownloadPreset: () => void;
  modCount: number;
}

export function ServerOverview({
  stats,
  onOpenPlayerList,
  onOpenConfig,
  onDownloadPreset,
  modCount,
}: ServerOverviewProps) {
  const isOnline = stats.status === 'online';
  const playerPercent = Math.min(100, Math.round((stats.players / (stats.maxPlayers || 32)) * 100));

  return (
    <div id="overview" className="space-y-8 pt-4">
      {/* GameAnalytics Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#141727]/90 to-[#101320]/90 border border-white/[0.08] shadow-ga-card p-6 sm:p-10">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-ga-indigo/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-ga-mint/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Hero Announcement Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs">
            <span className="w-2 h-2 rounded-full bg-ga-mint animate-pulse" />
            <span className="text-zinc-300 font-medium">
              Live Operations: <strong className="text-white">{stats.mission}</strong>
            </span>
            <span className="text-zinc-500">&bull;</span>
            <span className="text-ga-mint font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {stats.map}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Arma 3 Server Intelligence &amp;{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ga-mint via-teal-300 to-ga-blue">
              Addon Management
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Real-time telemetry, live squad rosters, and complete Steam Workshop synchronization for{' '}
            <strong className="text-zinc-200">{stats.name}</strong>. Connect directly or load all {modCount} mods with one click.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg ga-btn-primary text-sm font-semibold shadow-ga-mint"
            >
              <Terminal className="w-4 h-4" />
              <span>Direct Join Server</span>
            </a>

            <button
              onClick={onDownloadPreset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg ga-btn-secondary text-sm"
            >
              <Download className="w-4 h-4 text-ga-mint" />
              <span>Download Launcher Preset (.html)</span>
            </button>

            <button
              onClick={onOpenPlayerList}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-sm transition-colors"
            >
              <Users className="w-4 h-4 text-ga-blue" />
              <span>Squad Roster ({stats.players}/{stats.maxPlayers})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar (GameAnalytics Signature Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Players */}
        <div 
          onClick={onOpenPlayerList}
          className="p-5 rounded-xl bg-ga-surface/80 border border-white/[0.08] hover:border-white/[0.16] hover:bg-ga-card/80 transition-all cursor-pointer shadow-ga-card group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-ga-mint" />
                Active Players
              </span>
              <span className="text-[11px] text-ga-mint group-hover:underline">
                View &rarr;
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {stats.players}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                / {stats.maxPlayers} slots
              </span>
            </div>

            {/* Clean Progress Bar */}
            <div className="mt-3 w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-ga-mint h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(playerPercent, stats.players > 0 ? 5 : 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>In-Game Soldier</span>
            <span className="text-zinc-200 font-medium">
              {stats.playerList && stats.playerList.length > 0 ? stats.playerList[0].name : "None connected"}
            </span>
          </div>
        </div>

        {/* Metric 2: Verified Addons */}
        <div className="p-5 rounded-xl bg-ga-surface/80 border border-white/[0.08] hover:border-white/[0.16] transition-all shadow-ga-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-ga-blue" />
                Modpack Parity
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-ga-blue/10 text-ga-blue border border-ga-blue/20">
                Synchronized
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {modCount}
              </span>
              <span className="text-xs text-zinc-500">Steam Addons</span>
            </div>

            <p className="mt-2 text-xs text-zinc-400 line-clamp-1">
              RHS Escalation, ACE3, Antistasi Ultimate, Soundmods
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Preset Format</span>
            <span className="text-zinc-200 font-mono">BI Launcher .html</span>
          </div>
        </div>

        {/* Metric 3: Ping & Network */}
        <div className="p-5 rounded-xl bg-ga-surface/80 border border-white/[0.08] hover:border-white/[0.16] transition-all shadow-ga-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-ga-mint" />
                Network Query
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-ga-mint font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-ga-mint" />
                Live A2S
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {stats.ping || 28}
              </span>
              <span className="text-xs text-zinc-500 font-mono">ms latency</span>
            </div>

            <p className="mt-2 text-xs text-zinc-400 line-clamp-1">
              Direct UDP: <span className="font-mono text-zinc-300">{stats.ip}:{stats.port}</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Steam Query Port</span>
            <span className="text-zinc-200 font-mono">{stats.queryPort}</span>
          </div>
        </div>

        {/* Metric 4: Engine & Security */}
        <div className="p-5 rounded-xl bg-ga-surface/80 border border-white/[0.08] hover:border-white/[0.16] transition-all shadow-ga-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ga-indigo" />
                Security &amp; Engine
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-ga-mint/10 text-ga-mint border border-ga-mint/20">
                BattlEye Active
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-white font-mono tracking-tight">
                v{stats.version}
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-400">
              Antistasi Campaign &bull; Public Access
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Environment</span>
            <span className="text-zinc-200 font-medium">Dedicated Host</span>
          </div>
        </div>
      </div>
    </div>
  );
}
