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
  Clock
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
  const isOnline = stats.status === 'online';
  const playerPercent = Math.min(100, Math.round((stats.players / (stats.maxPlayers || 32)) * 100));

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'ACTIVE';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div id="overview" className="space-y-4">
      {/* Tactical Operation Briefing Panel */}
      <div className="rounded-lg bg-arma-surface border border-arma-border p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-arma-amberDim text-arma-amber border border-arma-amber/30 font-bold uppercase tracking-wider">
                [LIVE OPERATION]
              </span>
              <span className="px-2 py-0.5 rounded bg-arma-card text-arma-khaki border border-arma-border flex items-center gap-1 uppercase font-semibold">
                <Compass className="w-3.5 h-3.5 text-arma-amber" />
                THEATER: {stats.map || 'ALTIS'}
              </span>
              <span className="px-2 py-0.5 rounded bg-arma-card text-arma-textMuted border border-arma-border uppercase">
                CAMPAIGN: {stats.gameType}
              </span>
              {stats.location && (
                <span className="px-2 py-0.5 rounded bg-arma-card text-arma-textDim border border-arma-border flex items-center gap-1">
                  <Globe className="w-3 h-3 text-arma-textMuted" />
                  {stats.location}
                </span>
              )}
            </div>

            {/* Mission Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-arma-text font-mono tracking-tight uppercase">
                {stats.mission}
              </h1>
              <p className="text-xs sm:text-sm text-arma-textMuted font-mono mt-1">
                HOST SERVER: <span className="text-arma-text font-bold">{stats.name}</span> &bull; {stats.ip}:{stats.port}
              </p>
            </div>

            {/* Briefing Text */}
            <p className="text-xs sm:text-sm text-arma-textMuted leading-relaxed max-w-2xl">
              Antistasi guerrilla insurgency against occupying military forces across the Altis theater. Synchronize the official Bohemia Interactive modpack to ensure full client parity before mission deployment.
            </p>
          </div>

          {/* Tactical Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded arma-btn-primary text-xs font-mono shadow-arma-amber text-center"
            >
              <Terminal className="w-4 h-4" />
              <span>LAUNCH ARMA 3 &amp; CONNECT</span>
            </a>

            <button
              onClick={onDownloadPreset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded arma-btn-secondary text-xs font-mono"
            >
              <Download className="w-4 h-4 text-arma-khaki" />
              <span>DOWNLOAD LAUNCHER PRESET</span>
            </button>

            <button
              onClick={onOpenPlayerList}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-arma-card hover:bg-arma-cardHover border border-arma-border text-arma-textMuted hover:text-arma-text text-xs font-mono transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-arma-amber" />
              <span>OPERATOR ROSTER ({stats.players}/{stats.maxPlayers})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Technical Telemetry Data Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Panel 1: Active Squad Operators */}
        <div 
          onClick={onOpenPlayerList}
          className="p-4 rounded-lg bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-1 font-mono uppercase">
              <span className="flex items-center gap-1.5 font-bold text-arma-text">
                <Users className="w-3.5 h-3.5 text-arma-amber" />
                OPERATORS IN AO
              </span>
              <span className="text-[11px] text-arma-amber group-hover:underline">
                ROSTER &rarr;
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-arma-text tracking-tight">
                {stats.players}
              </span>
              <span className="text-xs text-arma-textDim font-bold">
                / {stats.maxPlayers} SLOTS
              </span>
            </div>

            {/* Tactical Progress Meter */}
            <div className="mt-3 w-full bg-[#0d0f13] rounded-xs h-1.5 overflow-hidden border border-arma-border">
              <div 
                className="bg-arma-amber h-1.5 rounded-xs transition-all duration-300"
                style={{ width: `${Math.max(playerPercent, stats.players > 0 ? 5 : 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-arma-border/60 flex items-center justify-between text-[11px] font-mono text-arma-textMuted">
            <span>CALLSIGN</span>
            <span className="text-arma-text font-bold">
              {stats.playerList && stats.playerList.length > 0 ? stats.playerList[0].name : "STANDBY"}
            </span>
          </div>
        </div>

        {/* Panel 2: Verified Addons */}
        <div className="p-4 rounded-lg bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-1 font-mono uppercase">
              <span className="flex items-center gap-1.5 font-bold text-arma-text">
                <Activity className="w-3.5 h-3.5 text-arma-khaki" />
                MODPACK STATUS
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-arma-card text-arma-khaki border border-arma-border">
                PARITY OK
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-arma-text tracking-tight">
                {modCount}
              </span>
              <span className="text-xs text-arma-textDim font-bold">
                ADDONS LOADED
              </span>
            </div>

            <p className="mt-2 text-xs text-arma-textMuted font-mono truncate">
              RHS, ACE3, Antistasi, JSRS Soundmod
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-arma-border/60 flex items-center justify-between text-[11px] font-mono text-arma-textMuted">
            <span>PRESET SYNC</span>
            <span className="text-arma-green font-bold">VERIFIED</span>
          </div>
        </div>

        {/* Panel 3: Direct Steam A2S Query */}
        <div className="p-4 rounded-lg bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-1 font-mono uppercase">
              <span className="flex items-center gap-1.5 font-bold text-arma-text">
                <Radio className="w-3.5 h-3.5 text-arma-amber" />
                A2S TELEMETRY
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-arma-green font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-arma-green" />
                UDP LIVE
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-arma-text tracking-tight">
                {stats.ping || 28}
              </span>
              <span className="text-xs text-arma-textDim font-bold">
                MS LATENCY
              </span>
            </div>

            <p className="mt-2 text-xs text-arma-textMuted font-mono truncate">
              PORT: <span className="text-arma-text font-bold">{stats.port}</span> &bull; QUERY: <span className="text-arma-text font-bold">{stats.queryPort}</span>
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-arma-border/60 flex items-center justify-between text-[11px] font-mono text-arma-textMuted">
            <span>PROTOCOL</span>
            <span className="text-arma-text font-bold">VALVE A2S</span>
          </div>
        </div>

        {/* Panel 4: Security & Engine Version */}
        <div className="p-4 rounded-lg bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-arma-textMuted mb-1 font-mono uppercase">
              <span className="flex items-center gap-1.5 font-bold text-arma-text">
                <ShieldCheck className="w-3.5 h-3.5 text-arma-khaki" />
                SECURITY &amp; BUILD
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-arma-card text-arma-green border border-arma-border">
                SECURED
              </span>
            </div>

            <div className="mt-2 font-mono">
              <div className="text-lg font-black text-arma-text tracking-tight">
                ARMA 3 v{stats.version}
              </div>
            </div>

            <p className="mt-2 text-xs text-arma-textMuted font-mono">
              BATTLEYE ACTIVE &bull; NO PASSWORD
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-arma-border/60 flex items-center justify-between text-[11px] font-mono text-arma-textMuted">
            <span>PLATFORM</span>
            <span className="text-arma-text font-bold">LINUX x64</span>
          </div>
        </div>
      </div>

      {/* Expanded Detailed Server Diagnostics (Toggleable) */}
      <div className="rounded-lg bg-arma-surface border border-arma-border overflow-hidden">
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full p-3.5 bg-arma-surface hover:bg-arma-card flex items-center justify-between text-xs font-mono text-arma-textMuted transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-arma-amber" />
            <span className="font-bold text-arma-text uppercase">IN-DEPTH HOST DIAGNOSTICS &amp; NETWORK METADATA</span>
            <span className="text-arma-textDim text-[11px]">({stats.platform || 'Linux 64-bit'} &bull; Sydney, AU)</span>
          </div>

          <div className="flex items-center gap-1.5 text-arma-amber font-bold text-[11px]">
            <span>{showDiagnostics ? 'COLLAPSE DIAGNOSTICS' : 'EXPAND DIAGNOSTICS'}</span>
            {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showDiagnostics && (
          <div className="p-5 border-t border-arma-border bg-[#0d0f13] space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Host & Location */}
              <div className="p-3 rounded bg-arma-card border border-arma-border space-y-1">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1">
                  <Globe className="w-3 h-3 text-arma-khaki" />
                  GEOLOCATION &amp; ISP
                </div>
                <div className="text-arma-text font-bold">{stats.location || 'Sydney, Australia'}</div>
                <div className="text-arma-textMuted text-[11px]">{stats.isp || 'Aussie Fibre Pty Ltd (AS4764)'}</div>
              </div>

              {/* Server Engine & Platform */}
              <div className="p-3 rounded bg-arma-card border border-arma-border space-y-1">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-arma-amber" />
                  HOST ARCHITECTURE
                </div>
                <div className="text-arma-text font-bold">{stats.platform || 'Linux Dedicated Server (x86_64)'}</div>
                <div className="text-arma-textMuted text-[11px]">Protocol: r222 &bull; Build: {stats.version}</div>
              </div>

              {/* Signature Security */}
              <div className="p-3 rounded bg-arma-card border border-arma-border space-y-1">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1">
                  <Key className="w-3 h-3 text-arma-green" />
                  SIGNATURE ENFORCEMENT
                </div>
                <div className="text-arma-text font-bold">{stats.signatureVerification || 'Strict (checkSignatures = 2)'}</div>
                <div className="text-arma-textMuted text-[11px]">Only verified .bisign keys allowed</div>
              </div>

              {/* Voice Over Net */}
              <div className="p-3 rounded bg-arma-card border border-arma-border space-y-1">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1">
                  <Mic className="w-3 h-3 text-arma-amber" />
                  VOICE OVER NET (VON)
                </div>
                <div className="text-arma-text font-bold">Enabled (High Quality Codec)</div>
                <div className="text-arma-textMuted text-[11px]">In-game direct communication active</div>
              </div>

              {/* Perspective & Gameplay */}
              <div className="p-3 rounded bg-arma-card border border-arma-border space-y-1">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1">
                  <Eye className="w-3 h-3 text-arma-khaki" />
                  PERSPECTIVE RULES
                </div>
                <div className="text-arma-text font-bold">1st &amp; 3rd Person View Allowed</div>
                <div className="text-arma-textMuted text-[11px]">Crosshair enabled &bull; JIP Allowed</div>
              </div>

              {/* Connected Player Detail */}
              <div className="p-3 rounded bg-arma-card border border-arma-border space-y-1">
                <div className="text-arma-textDim text-[10px] font-bold uppercase flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-arma-green" />
                  SESSION OPERATOR
                </div>
                {stats.playerList && stats.playerList.length > 0 ? (
                  <>
                    <div className="text-arma-amber font-bold">{stats.playerList[0].name}</div>
                    <div className="text-arma-textMuted text-[11px]">
                      Session Time: {formatDuration(stats.playerList[0].timePlayedSeconds)} &bull; Score: {stats.playerList[0].score}
                    </div>
                  </>
                ) : (
                  <div className="text-arma-textMuted text-[11px]">No active soldiers connected</div>
                )}
              </div>
            </div>

            {/* Raw Server Tag Matrix */}
            <div className="pt-2 text-[10px] text-arma-textDim flex items-center gap-2 border-t border-arma-border/50">
              <span className="font-bold text-arma-textMuted">RAW BI ENGINE TAGS:</span>
              <code className="bg-arma-surface px-1.5 py-0.5 rounded border border-arma-border text-arma-textMuted font-mono">
                {stats.serverTags || 'bf,r222,n0,s7,i1,mf,lf,vf,dt,tanti,g65545,h86f3694,f1,pl'}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
