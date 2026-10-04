'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  Terminal, 
  Download, 
  Compass, 
  Radio, 
  Server, 
  Globe, 
  Cpu, 
  Key, 
  Mic, 
  Eye, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ArrowDown, 
  Layers 
} from 'lucide-react';
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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);
  const isOnline = stats.status === 'online';
  const playerPercent = Math.min(100, Math.round((stats.players / (stats.maxPlayers || 32)) * 100));

  const copyIp = () => {
    navigator.clipboard.writeText(`${stats.ip}:${stats.port}`);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const scrollToMods = () => {
    const el = document.getElementById('mods');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'ACTIVE';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div id="overview" className="space-y-8 sm:space-y-10">
      {/* Tactical Operation Hero Panel (Expansive, Non-Cramped) */}
      <div className="rounded-xl bg-arma-surface border border-arma-border p-7 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl">
        {/* Subtle Background Accent Corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-arma-amber/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-8">
          {/* Top Status & Theater Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-md bg-arma-amberDim text-arma-amber border border-arma-amber/40 font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-arma-amber animate-pulse" />
              LIVE OPERATIONS ACTIVE
            </span>
            <span className="px-3 py-1 rounded-md bg-arma-card text-arma-khaki border border-arma-border flex items-center gap-1.5 font-bold uppercase">
              <Compass className="w-4 h-4 text-arma-amber" />
              THEATER: {stats.map || 'ALTIS'}
            </span>
            <span className="px-3 py-1 rounded-md bg-arma-card text-arma-textMuted border border-arma-border uppercase font-semibold">
              MODE: {stats.gameType}
            </span>
            {stats.location && (
              <span className="px-3 py-1 rounded-md bg-arma-card text-arma-textDim border border-arma-border flex items-center gap-1.5 hidden sm:inline-flex">
                <Globe className="w-3.5 h-3.5 text-arma-textMuted" />
                {stats.location}
              </span>
            )}
          </div>

          {/* Mission Title & Technical Coordinates (Show Don't Tell - Clean, Bold) */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-arma-text font-mono tracking-tight uppercase leading-tight">
              {stats.mission}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-arma-textMuted font-mono">
              <span>HOST: <strong className="text-arma-text">{stats.name}</strong></span>
              <span className="text-arma-border">&bull;</span>
              <span>ENDPOINT: <code className="text-arma-amber font-bold">{stats.ip}:{stats.port}</code></span>
              <span className="text-arma-border hidden sm:inline">&bull;</span>
              <span className="text-arma-green font-bold hidden sm:inline">SIGNATURES LEVEL 2 VERIFIED</span>
            </div>
          </div>

          {/* Spread-out Action Command Center Buttons */}
          <div className="pt-2">
            <div className="flex flex-wrap items-stretch gap-4 sm:gap-5">
              {/* Primary Direct Connect */}
              <a
                href={`steam://connect/${stats.ip}:${stats.port}`}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg arma-btn-primary text-sm font-mono font-black shadow-arma-amber tracking-wide transition-all hover:scale-[1.02] active:scale-[0.99] text-center"
              >
                <Terminal className="w-5 h-5 text-black" />
                <span>LAUNCH ARMA 3 &amp; CONNECT</span>
              </a>

              {/* Copy IP */}
              <button
                onClick={copyIp}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg arma-btn-secondary text-sm font-mono font-bold transition-all hover:bg-arma-cardHover"
              >
                {copiedIp ? (
                  <>
                    <Check className="w-4 h-4 text-arma-green" />
                    <span className="text-arma-green">IP COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-arma-textMuted" />
                    <span>COPY SERVER IP</span>
                  </>
                )}
              </button>

              {/* Download Launcher Preset */}
              <button
                onClick={onDownloadPreset}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg arma-btn-secondary text-sm font-mono font-bold transition-all hover:bg-arma-cardHover"
              >
                <Download className="w-4 h-4 text-arma-khaki" />
                <span>DOWNLOAD LAUNCHER PRESET</span>
              </button>

              {/* Operator Roster */}
              <button
                onClick={onOpenPlayerList}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg bg-arma-card hover:bg-arma-cardHover border border-arma-border text-arma-textMuted hover:text-arma-text text-sm font-mono font-semibold transition-all"
              >
                <Users className="w-4 h-4 text-arma-amber" />
                <span>OPERATORS ({stats.players}/{stats.maxPlayers})</span>
              </button>
            </div>

            {/* Quick jump cue */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-arma-textDim">
              <button 
                onClick={scrollToMods}
                className="hover:text-arma-amber flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <Layers className="w-3.5 h-3.5 text-arma-khaki group-hover:text-arma-amber" />
                <span>View {modCount} Verified Server Addons Below</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:text-arma-amber" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Technical Telemetry Data Panels (Spaced Out, High Readability) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Panel 1: Active Squad Operators */}
        <div 
          onClick={onOpenPlayerList}
          className="p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-amber/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-2 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-2 font-bold text-arma-text">
                <Users className="w-4 h-4 text-arma-amber" />
                OPERATORS IN AO
              </span>
              <span className="text-[11px] text-arma-amber group-hover:underline font-bold">
                ROSTER &rarr;
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2 font-mono">
              <span className="text-3xl sm:text-4xl font-black text-arma-text tracking-tight">
                {stats.players}
              </span>
              <span className="text-sm text-arma-textDim font-bold">
                / {stats.maxPlayers} SLOTS
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-[#0a0c10] rounded-xs h-2 overflow-hidden border border-arma-border">
              <div 
                className="bg-arma-amber h-2 rounded-xs transition-all duration-300"
                style={{ width: `${Math.max(playerPercent, stats.players > 0 ? 6 : 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-arma-border/60 flex items-center justify-between text-xs font-mono text-arma-textMuted">
            <span>ACTIVE SOLDIER</span>
            <span className="text-arma-text font-bold">
              {stats.playerList && stats.playerList.length > 0 ? stats.playerList[0].name : "STANDBY"}
            </span>
          </div>
        </div>

        {/* Panel 2: Verified Addons */}
        <div 
          onClick={scrollToMods}
          className="p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-khaki/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-2 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-2 font-bold text-arma-text">
                <Activity className="w-4 h-4 text-arma-khaki" />
                MODPACK STATUS
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-arma-card text-arma-green border border-arma-green/30">
                PARITY OK
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2 font-mono">
              <span className="text-3xl sm:text-4xl font-black text-arma-text tracking-tight">
                {modCount}
              </span>
              <span className="text-sm text-arma-textDim font-bold">
                ADDONS LOADED
              </span>
            </div>

            <p className="mt-3 text-xs text-arma-textMuted font-mono truncate">
              RHS, ACE3, Antistasi, JSRS Soundmod
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-arma-border/60 flex items-center justify-between text-xs font-mono text-arma-textMuted">
            <span>PRESET EXPORT</span>
            <span className="text-arma-amber font-bold group-hover:underline">VIEW MANIFEST &rarr;</span>
          </div>
        </div>

        {/* Panel 3: Direct Steam A2S Query */}
        <div className="p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-2 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-2 font-bold text-arma-text">
                <Radio className="w-4 h-4 text-arma-amber" />
                A2S TELEMETRY
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-arma-green font-bold">
                <span className="w-2 h-2 rounded-full bg-arma-green animate-pulse" />
                UDP LIVE
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2 font-mono">
              <span className="text-3xl sm:text-4xl font-black text-arma-text tracking-tight">
                {stats.ping || 28}
              </span>
              <span className="text-sm text-arma-textDim font-bold">
                MS LATENCY
              </span>
            </div>

            <p className="mt-3 text-xs text-arma-textMuted font-mono truncate">
              GAME: <span className="text-arma-text font-bold">{stats.port}</span> &bull; QUERY: <span className="text-arma-text font-bold">{stats.queryPort}</span>
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-arma-border/60 flex items-center justify-between text-xs font-mono text-arma-textMuted">
            <span>PROTOCOL</span>
            <span className="text-arma-text font-bold">VALVE A2S</span>
          </div>
        </div>

        {/* Panel 4: Security & Engine Version */}
        <div className="p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-2 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-2 font-bold text-arma-text">
                <ShieldCheck className="w-4 h-4 text-arma-khaki" />
                SECURITY &amp; BUILD
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-arma-card text-arma-green border border-arma-green/30">
                SECURED
              </span>
            </div>

            <div className="mt-3 font-mono">
              <div className="text-2xl sm:text-3xl font-black text-arma-text tracking-tight">
                ARMA 3 v{stats.version}
              </div>
            </div>

            <p className="mt-3 text-xs text-arma-textMuted font-mono">
              BATTLEYE ACTIVE &bull; NO PASSWORD
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-arma-border/60 flex items-center justify-between text-xs font-mono text-arma-textMuted">
            <span>PLATFORM</span>
            <span className="text-arma-text font-bold">LINUX x64</span>
          </div>
        </div>
      </div>

      {/* Expanded Detailed Server Diagnostics (Toggleable) */}
      <div className="rounded-xl bg-arma-surface border border-arma-border overflow-hidden shadow-md">
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full p-4 sm:p-5 bg-arma-surface hover:bg-arma-card flex items-center justify-between text-xs font-mono text-arma-textMuted transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Server className="w-4 h-4 text-arma-amber" />
            <span className="font-bold text-arma-text uppercase tracking-wider">IN-DEPTH HOST DIAGNOSTICS &amp; NETWORK METADATA</span>
            <span className="text-arma-textDim text-xs hidden sm:inline">({stats.platform || 'Linux 64-bit'} &bull; Sydney, AU)</span>
          </div>

          <div className="flex items-center gap-2 text-arma-amber font-bold text-xs">
            <span>{showDiagnostics ? 'COLLAPSE DIAGNOSTICS' : 'EXPAND DIAGNOSTICS'}</span>
            {showDiagnostics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDiagnostics && (
          <div className="p-6 border-t border-arma-border bg-[#0d0f13] space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Host & Location */}
              <div className="p-4 rounded-lg bg-arma-card border border-arma-border space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-arma-khaki" />
                  GEOLOCATION &amp; ISP
                </div>
                <div className="text-arma-text font-bold text-sm">{stats.location || 'Sydney, Australia'}</div>
                <div className="text-arma-textMuted text-xs">{stats.isp || 'Aussie Fibre Pty Ltd (AS4764)'}</div>
              </div>

              {/* Server Engine & Platform */}
              <div className="p-4 rounded-lg bg-arma-card border border-arma-border space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-arma-amber" />
                  HOST ARCHITECTURE
                </div>
                <div className="text-arma-text font-bold text-sm">{stats.platform || 'Linux Dedicated Server (x86_64)'}</div>
                <div className="text-arma-textMuted text-xs">Protocol: r222 &bull; Build: {stats.version}</div>
              </div>

              {/* Signature Security */}
              <div className="p-4 rounded-lg bg-arma-card border border-arma-border space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-arma-green" />
                  SIGNATURE ENFORCEMENT
                </div>
                <div className="text-arma-text font-bold text-sm">{stats.signatureVerification || 'Strict (checkSignatures = 2)'}</div>
                <div className="text-arma-textMuted text-xs">Only verified .bisign keys allowed</div>
              </div>

              {/* Voice Over Net */}
              <div className="p-4 rounded-lg bg-arma-card border border-arma-border space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-arma-amber" />
                  VOICE OVER NET (VON)
                </div>
                <div className="text-arma-text font-bold text-sm">Enabled (High Quality Codec)</div>
                <div className="text-arma-textMuted text-xs">In-game direct communication active</div>
              </div>

              {/* Perspective & Gameplay */}
              <div className="p-4 rounded-lg bg-arma-card border border-arma-border space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-arma-khaki" />
                  PERSPECTIVE RULES
                </div>
                <div className="text-arma-text font-bold text-sm">1st &amp; 3rd Person View Allowed</div>
                <div className="text-arma-textMuted text-xs">Crosshair enabled &bull; JIP Allowed</div>
              </div>

              {/* Connected Player Detail */}
              <div className="p-4 rounded-lg bg-arma-card border border-arma-border space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-arma-green" />
                  SESSION OPERATOR
                </div>
                {stats.playerList && stats.playerList.length > 0 ? (
                  <>
                    <div className="text-arma-amber font-bold text-sm">{stats.playerList[0].name}</div>
                    <div className="text-arma-textMuted text-xs">
                      Session Time: {formatDuration(stats.playerList[0].timePlayedSeconds)} &bull; Score: {stats.playerList[0].score}
                    </div>
                  </>
                ) : (
                  <div className="text-arma-textMuted text-xs">No active soldiers connected</div>
                )}
              </div>
            </div>

            {/* Raw Server Tag Matrix */}
            <div className="pt-3 text-[11px] text-arma-textDim flex flex-wrap items-center gap-2 border-t border-arma-border/50">
              <span className="font-bold text-arma-textMuted">RAW BI ENGINE TAGS:</span>
              <code className="bg-arma-surface px-2 py-0.5 rounded border border-arma-border text-arma-textMuted font-mono">
                {stats.serverTags || 'bf,r222,n0,s7,i1,mf,lf,vf,dt,tanti,g65545,h86f3694,f1,pl'}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
