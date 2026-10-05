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
  onOpenConnect: () => void;
  modCount: number;
}

export function ServerOverview({
  stats,
  onOpenPlayerList,
  onOpenConfig,
  onDownloadPreset,
  onOpenConnect,
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
    <div id="overview" className="space-y-6 sm:space-y-10">
      {/* Tactical Operation Hero Panel (Expansive & Mobile Responsive) */}
      <div className="rounded-xl bg-arma-surface border border-arma-border p-5 sm:p-8 lg:p-12 relative overflow-hidden shadow-xl">
        {/* Subtle Background Crimson Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-arma-red/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6 sm:space-y-8">
          {/* Top Status & Map Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-arma-redDim text-arma-red border border-arma-red/40 font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm text-[11px] sm:text-xs">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-arma-green animate-pulse' : 'bg-red-500'}`} />
              {isOnline ? 'SERVER ONLINE' : 'SERVER OFFLINE'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-arma-card text-arma-green border border-arma-green/40 flex items-center gap-1.5 font-bold uppercase text-[11px] sm:text-xs shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
              24/7 DEDICATED
            </span>
            <span className="px-2.5 py-1 rounded-md bg-arma-card text-arma-khaki border border-arma-border flex items-center gap-1.5 font-bold uppercase text-[11px] sm:text-xs">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-arma-red" />
              MAP: {stats.map || 'ALTIS'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-arma-card text-arma-textMuted border border-arma-border uppercase font-semibold text-[11px] sm:text-xs">
              MODE: {stats.gameType}
            </span>
            {stats.location && (
              <span className="px-2.5 py-1 rounded-md bg-arma-card text-arma-textDim border border-arma-border flex items-center gap-1.5 hidden md:inline-flex text-[11px] sm:text-xs">
                <Globe className="w-3.5 h-3.5 text-arma-textMuted" />
                {stats.location}
              </span>
            )}
          </div>

          {/* Server Title & Address */}
          <div className="space-y-2 sm:space-y-3 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-arma-text font-mono tracking-tight uppercase leading-tight">
              {stats.mission}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-arma-textMuted font-mono">
              <span>SERVER: <strong className="text-arma-text">{stats.name}</strong></span>
              <span className="text-arma-border">&bull;</span>
              <span>ADDRESS: <code className="text-arma-red font-bold">{stats.ip}:{stats.port}</code></span>
              <span className="text-arma-border hidden sm:inline">&bull;</span>
              <span className="text-arma-green font-bold hidden sm:inline">24/7 ONLINE</span>
            </div>
          </div>

          {/* Spread-out Action Command Center Buttons (Full-width on mobile, spacious grid on desktop) */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch gap-3 sm:gap-4 lg:gap-5">
              {/* Primary Direct Connect - Opens Deployment Guide Modal */}
              <button
                onClick={onOpenConnect}
                className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg arma-btn-primary text-sm font-mono font-black shadow-arma-red tracking-wide transition-all hover:scale-[1.02] active:scale-[0.99] text-center w-full sm:w-auto cursor-pointer"
              >
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>HOW TO CONNECT / JOIN</span>
              </button>

              {/* Copy IP */}
              <button
                onClick={copyIp}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-lg arma-btn-secondary text-sm font-mono font-bold transition-all hover:bg-arma-cardHover w-full sm:w-auto"
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
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-lg arma-btn-secondary text-sm font-mono font-bold transition-all hover:bg-arma-cardHover w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-arma-khaki" />
                <span>DOWNLOAD LAUNCHER PRESET</span>
              </button>

              {/* Players Button */}
              <button
                onClick={onOpenPlayerList}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-lg bg-arma-card hover:bg-arma-cardHover border border-arma-border text-arma-textMuted hover:text-arma-text text-sm font-mono font-semibold transition-all w-full sm:w-auto"
              >
                <Users className="w-4 h-4 text-arma-red" />
                <span>PLAYERS ({stats.players}/{stats.maxPlayers})</span>
              </button>
            </div>

            {/* Quick jump cue */}
            <div className="mt-5 sm:mt-6 flex items-center gap-2 text-xs font-mono text-arma-textDim">
              <button 
                onClick={scrollToMods}
                className="hover:text-arma-red flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <Layers className="w-3.5 h-3.5 text-arma-khaki group-hover:text-arma-red" />
                <span>View {modCount} Server Mods Below</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:text-arma-red" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Technical Telemetry Data Panels (Responsive 2-col on mobile, 4-col on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Panel 1: Active Players */}
        <div 
          onClick={onOpenPlayerList}
          className="p-4 sm:p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-red/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-arma-textMuted mb-1.5 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold text-arma-text">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-arma-red" />
                PLAYERS
              </span>
              <span className="text-[10px] sm:text-[11px] text-arma-red group-hover:underline font-bold hidden xs:inline">
                VIEW LIST &rarr;
              </span>
            </div>

            <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2 font-mono">
              <span className="text-2xl sm:text-4xl font-black text-arma-text tracking-tight">
                {stats.players}
              </span>
              <span className="text-xs sm:text-sm text-arma-textDim font-bold">
                / {stats.maxPlayers}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 sm:mt-4 w-full bg-[#0a0c10] rounded-xs h-1.5 sm:h-2 overflow-hidden border border-arma-border">
              <div 
                className="bg-arma-red h-1.5 sm:h-2 rounded-xs transition-all duration-300"
                style={{ width: `${Math.max(playerPercent, stats.players > 0 ? 6 : 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-arma-border/60 flex items-center justify-between text-[11px] sm:text-xs font-mono text-arma-textMuted">
            <span className="hidden sm:inline">ONLINE</span>
            <span className="text-arma-text font-bold truncate max-w-[120px]">
              {stats.playerList && stats.playerList.length > 0 ? stats.playerList[0].name : "None online"}
            </span>
          </div>
        </div>

        {/* Panel 2: Verified Addons */}
        <div 
          onClick={scrollToMods}
          className="p-4 sm:p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-khaki/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-arma-textMuted mb-1.5 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold text-arma-text">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-arma-khaki" />
                MODPACK
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-arma-card text-arma-green border border-arma-green/30">
                VERIFIED
              </span>
            </div>

            <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2 font-mono">
              <span className="text-2xl sm:text-4xl font-black text-arma-text tracking-tight">
                {modCount}
              </span>
              <span className="text-xs sm:text-sm text-arma-textDim font-bold">
                MODS
              </span>
            </div>

            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-arma-textMuted font-mono truncate">
              RHS, ACE3, Antistasi
            </p>
          </div>

          <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-arma-border/60 flex items-center justify-between text-[11px] sm:text-xs font-mono text-arma-textMuted">
            <span className="hidden sm:inline">PRESET</span>
            <span className="text-arma-red font-bold group-hover:underline">VIEW &rarr;</span>
          </div>
        </div>

        {/* Panel 3: Direct Steam A2S Query */}
        <div className="p-4 sm:p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-arma-textMuted mb-1.5 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold text-arma-text">
                <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-arma-red" />
                LATENCY
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-arma-green font-bold">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-arma-green animate-pulse" />
                LIVE
              </span>
            </div>

            <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2 font-mono">
              <span className="text-2xl sm:text-4xl font-black text-arma-text tracking-tight">
                {stats.ping || 28}
              </span>
              <span className="text-xs sm:text-sm text-arma-textDim font-bold">
                MS
              </span>
            </div>

            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-arma-textMuted font-mono truncate">
              PORT: <span className="text-arma-text font-bold">{stats.port}</span>
            </p>
          </div>

          <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-arma-border/60 flex items-center justify-between text-[11px] sm:text-xs font-mono text-arma-textMuted">
            <span className="hidden sm:inline">PROTOCOL</span>
            <span className="text-arma-text font-bold">VALVE A2S</span>
          </div>
        </div>

        {/* Panel 4: Security & Engine Version */}
        <div className="p-4 sm:p-6 rounded-xl bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-arma-textMuted mb-1.5 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold text-arma-text">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-arma-khaki" />
                BUILD
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-arma-card text-arma-green border border-arma-green/30">
                ACTIVE
              </span>
            </div>

            <div className="mt-2 sm:mt-3 font-mono">
              <div className="text-xl sm:text-3xl font-black text-arma-text tracking-tight truncate">
                v{stats.version}
              </div>
            </div>

            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-arma-textMuted font-mono truncate">
              NO PASSWORD &bull; BATTLEYE
            </p>
          </div>

          <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-arma-border/60 flex items-center justify-between text-[11px] sm:text-xs font-mono text-arma-textMuted">
            <span className="hidden sm:inline">OS</span>
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
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Server className="w-4 h-4 text-arma-red shrink-0" />
            <span className="font-bold text-arma-text uppercase tracking-wider text-xs sm:text-sm truncate">
              SERVER DETAILS &amp; DIAGNOSTICS
            </span>
            <span className="text-arma-textDim text-xs hidden md:inline">({stats.platform || 'Linux 64-bit'} &bull; Sydney, AU)</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-arma-red font-bold text-xs shrink-0 ml-2">
            <span className="hidden xs:inline">{showDiagnostics ? 'COLLAPSE' : 'EXPAND'}</span>
            {showDiagnostics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDiagnostics && (
          <div className="p-4 sm:p-6 border-t border-arma-border bg-[#0d0f13] space-y-4 sm:space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Host & Location */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border space-y-1 sm:space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-arma-khaki" />
                  LOCATION &amp; NETWORK
                </div>
                <div className="text-arma-text font-bold text-xs sm:text-sm">{stats.location || 'Sydney, Australia'}</div>
                <div className="text-arma-textMuted text-[11px] sm:text-xs">{stats.isp || 'Aussie Fibre Pty Ltd (AS4764)'}</div>
              </div>

              {/* Server Engine & Platform */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border space-y-1 sm:space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-arma-red" />
                  SERVER SYSTEM
                </div>
                <div className="text-arma-text font-bold text-xs sm:text-sm">{stats.platform || 'Linux Dedicated Server (x86_64)'}</div>
                <div className="text-arma-textMuted text-[11px] sm:text-xs">Protocol: r222 &bull; Build: {stats.version}</div>
              </div>

              {/* Signature Security */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border space-y-1 sm:space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-arma-green" />
                  SERVER SIGNATURES
                </div>
                <div className="text-arma-text font-bold text-xs sm:text-sm">{stats.signatureVerification || 'Strict (checkSignatures = 2)'}</div>
                <div className="text-arma-textMuted text-[11px] sm:text-xs">Only verified .bisign keys allowed</div>
              </div>

              {/* Voice Over Net */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border space-y-1 sm:space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-arma-red" />
                  IN-GAME VOICE (VON)
                </div>
                <div className="text-arma-text font-bold text-xs sm:text-sm">Enabled (High Quality Codec)</div>
                <div className="text-arma-textMuted text-[11px] sm:text-xs">In-game direct communication active</div>
              </div>

              {/* Perspective & Gameplay */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border space-y-1 sm:space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-arma-khaki" />
                  CAMERA PERSPECTIVE
                </div>
                <div className="text-arma-text font-bold text-xs sm:text-sm">1st &amp; 3rd Person View Allowed</div>
                <div className="text-arma-textMuted text-[11px] sm:text-xs">Crosshair enabled &bull; JIP Allowed</div>
              </div>

              {/* Connected Player Detail */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border space-y-1 sm:space-y-1.5">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-arma-green" />
                  CONNECTED PLAYER
                </div>
                {stats.playerList && stats.playerList.length > 0 ? (
                  <>
                    <div className="text-arma-red font-bold text-xs sm:text-sm">{stats.playerList[0].name}</div>
                    <div className="text-arma-textMuted text-[11px] sm:text-xs">
                      Session Time: {formatDuration(stats.playerList[0].timePlayedSeconds)} &bull; Score: {stats.playerList[0].score}
                    </div>
                  </>
                ) : (
                  <div className="text-arma-textMuted text-[11px] sm:text-xs">No players currently connected</div>
                )}
              </div>
            </div>

            {/* Raw Server Tag Matrix (break-all prevents horizontal mobile overflow) */}
            <div className="pt-2 sm:pt-3 text-[10px] sm:text-[11px] text-arma-textDim flex flex-wrap items-center gap-2 border-t border-arma-border/50">
              <span className="font-bold text-arma-textMuted">RAW BI ENGINE TAGS:</span>
              <code className="bg-arma-surface px-2 py-0.5 rounded border border-arma-border text-arma-textMuted font-mono break-all">
                {stats.serverTags || 'bf,r222,n0,s7,i1,mf,lf,vf,dt,tanti,g65545,h86f3694,f1,pl'}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
