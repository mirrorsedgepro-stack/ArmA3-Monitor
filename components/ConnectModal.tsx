'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  AlertTriangle, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  Layers,
  HelpCircle,
  FileCode
} from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ArmaServerStats;
  onDownloadPreset: () => void;
}

export function ConnectModal({
  isOpen,
  onClose,
  stats,
  onDownloadPreset,
}: ConnectModalProps) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedIpOnly, setCopiedIpOnly] = useState(false);
  const [copiedPortOnly, setCopiedPortOnly] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  if (!isOpen) return null;

  const fullAddress = `${stats.ip}:${stats.port}`;

  const copyFull = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const copyIp = () => {
    navigator.clipboard.writeText(stats.ip);
    setCopiedIpOnly(true);
    setTimeout(() => setCopiedIpOnly(false), 2000);
  };

  const copyPort = () => {
    navigator.clipboard.writeText(stats.port.toString());
    setCopiedPortOnly(true);
    setTimeout(() => setCopiedPortOnly(false), 2000);
  };

  const downloadBatchScript = () => {
    const batContent = `@echo off
title Connecting to Frenchy's Antistasi Ultimate...
color 0c
cls
echo ==============================================================================
echo       FRENCHY'S ANTISTASI ULTIMATE [RHS] - TACTICAL DISPATCH
echo ==============================================================================
echo  Server Target : ${stats.ip}:${stats.port}
echo  Query Port    : ${stats.queryPort}
echo ==============================================================================
echo.
echo [1/2] Opening Arma 3 Launcher via Steam...
start steam://run/107410
echo.
echo [2/2] INSTRUCTIONS TO JOIN:
echo  1. In the Arma 3 Launcher, navigate to the SERVERS tab.
echo  2. Click DIRECT CONNECT (in the bottom toolbar).
echo  3. Enter IP: ${stats.ip}
echo  4. Enter Port: ${stats.port}
echo  5. Click JOIN - The Launcher will auto-match and subscribe to all 42 mods!
echo.
echo ==============================================================================
pause
`;

    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Connect_${stats.ip.replace(/\./g, '_')}_${stats.port}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-arma-card border border-arma-border rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Tactical Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-arma-surface border-b border-arma-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-arma-red/15 border border-arma-red/40 flex items-center justify-center text-arma-red">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-arma-text uppercase font-mono tracking-wider">
                Direct Combat Deployment
              </h2>
              <p className="text-[10px] sm:text-xs text-arma-khaki font-mono">
                {stats.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* Steam Bug Explanation Callout */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-arma-red/10 border border-arma-red/30 space-y-1.5">
            <div className="flex items-center gap-2 text-arma-red font-mono font-bold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-arma-red" />
              <span>STEAM BROWSER PROTOCOL NOTICE</span>
            </div>
            <p className="text-xs text-arma-text leading-relaxed font-sans">
              Clicking direct web links (<code className="text-arma-red font-mono px-1 py-0.5 bg-black/40 rounded">steam://connect</code>) fails on modded servers with <strong className="text-arma-red font-mono">&quot;Wrong Game ID / Invalid App ID&quot;</strong> due to Steam client limitations with 64-bit AppIDs and mod requirements. 
              Use the official <strong>Arma 3 Launcher Direct Connect</strong> below for seamless entry with automatic mod loading.
            </p>
          </div>

          {/* Primary Recommended Method: 2-Step Launcher Connect */}
          <div className="border border-arma-border rounded-lg bg-arma-surface/60 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-arma-red tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-arma-green" />
                VERIFIED JOIN METHOD (RECOMMENDED)
              </span>
              <span className="text-[10px] font-mono text-arma-khaki uppercase bg-arma-card px-2 py-0.5 rounded border border-arma-border">
                AUTO-SYNC 42 MODS
              </span>
            </div>

            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-arma-text">
                <span className="w-5 h-5 rounded-full bg-arma-red text-white flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>OPEN OFFICIAL ARMA 3 LAUNCHER</span>
              </div>
              <div className="pl-7">
                <a
                  href="steam://run/107410"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg arma-btn-primary text-xs font-mono font-bold shadow-arma-red transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>LAUNCH ARMA 3 VIA STEAM</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
                <p className="text-[11px] text-arma-textMuted mt-1.5 font-sans">
                  This launches the official launcher using valid AppID <code className="text-arma-text font-mono">107410</code> (no errors).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 pt-2 border-t border-arma-border/60">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-arma-text">
                <span className="w-5 h-5 rounded-full bg-arma-red text-white flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>COPY SERVER CONNECTION INFO</span>
              </div>
              
              <div className="pl-7 space-y-3">
                {/* Full endpoint row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-arma-card border border-arma-border rounded-lg px-3.5 py-2.5 font-mono text-sm text-arma-red font-bold flex items-center justify-between">
                    <span>{fullAddress}</span>
                    <span className="text-[10px] text-arma-textMuted uppercase font-normal">GAME PORT</span>
                  </div>
                  <button
                    onClick={copyFull}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg arma-btn-secondary text-xs font-mono font-bold transition-all shrink-0"
                  >
                    {copiedFull ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-arma-green" />
                        <span className="text-arma-green">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-arma-textMuted" />
                        <span>COPY ADDRESS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Individual IP & Port breakdown for Direct Connect dialog */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-arma-card/80 border border-arma-border/70 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-arma-textMuted uppercase">Server IP</div>
                      <div className="font-bold text-arma-text">{stats.ip}</div>
                    </div>
                    <button
                      onClick={copyIp}
                      className="p-1.5 rounded hover:bg-arma-surface text-arma-textMuted hover:text-arma-text transition-colors"
                      title="Copy IP Only"
                    >
                      {copiedIpOnly ? <Check className="w-3.5 h-3.5 text-arma-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 rounded bg-arma-card/80 border border-arma-border/70 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-arma-textMuted uppercase">Port</div>
                      <div className="font-bold text-arma-text">{stats.port}</div>
                    </div>
                    <button
                      onClick={copyPort}
                      className="p-1.5 rounded hover:bg-arma-surface text-arma-textMuted hover:text-arma-text transition-colors"
                      title="Copy Port Only"
                    >
                      {copiedPortOnly ? <Check className="w-3.5 h-3.5 text-arma-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-3 rounded bg-black/40 border border-arma-border/60 text-xs text-arma-textMuted space-y-1 font-mono">
                  <div className="text-arma-khaki font-bold uppercase text-[11px]">&gt; IN ARMA 3 LAUNCHER:</div>
                  <div>1. Go to <strong className="text-white">SERVERS</strong> tab in the left sidebar.</div>
                  <div>2. Click <strong className="text-white">DIRECT CONNECT</strong> (bottom right corner).</div>
                  <div>3. Paste <strong className="text-arma-red">{stats.ip}</strong> and port <strong className="text-arma-red">{stats.port}</strong>.</div>
                  <div>4. Click <strong className="text-arma-green">JOIN</strong> &bull; Select <em className="text-white">&quot;Setup DLCs and mods and join&quot;</em>.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Quick Methods: Preset HTML & Windows Batch Script */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* HTML Preset */}
            <div className="p-4 rounded-lg bg-arma-surface border border-arma-border flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-arma-text">
                  <Layers className="w-4 h-4 text-arma-red" />
                  <span>OFFICIAL MOD PRESET (.HTML)</span>
                </div>
                <p className="text-[11px] text-arma-textMuted font-sans">
                  Drag and drop this file into your Arma 3 Launcher to subscribe and load all 42 required mods with 1 click.
                </p>
              </div>
              <button
                onClick={() => {
                  onDownloadPreset();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg arma-btn-secondary text-xs font-mono font-bold w-full transition-all"
              >
                <Download className="w-3.5 h-3.5 text-arma-khaki" />
                <span>DOWNLOAD PRESET (.HTML)</span>
              </button>
            </div>

            {/* 1-Click Batch Script */}
            <div className="p-4 rounded-lg bg-arma-surface border border-arma-border flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-arma-text">
                  <FileCode className="w-4 h-4 text-arma-red" />
                  <span>WINDOWS 1-CLICK LAUNCH SCRIPT</span>
                </div>
                <p className="text-[11px] text-arma-textMuted font-sans">
                  Download a <code className="text-arma-text font-mono">.bat</code> helper that opens the launcher with server parameters and details.
                </p>
              </div>
              <button
                onClick={downloadBatchScript}
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg arma-btn-secondary text-xs font-mono font-bold w-full transition-all"
              >
                <Download className="w-3.5 h-3.5 text-arma-khaki" />
                <span>DOWNLOAD CONNECT.BAT</span>
              </button>
            </div>
          </div>

          {/* Steam Favorites Section */}
          <div className="p-3.5 rounded-lg bg-arma-surface/40 border border-arma-border text-xs font-mono text-arma-textMuted space-y-2">
            <button
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="flex items-center justify-between w-full text-left font-bold text-arma-text hover:text-arma-red transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-arma-khaki" />
                <span>HOW TO ADD TO STEAM FAVORITES PERMANENTLY</span>
              </span>
              <span className="text-[11px] text-arma-khaki">{showTroubleshoot ? 'HIDE ▲' : 'SHOW ▼'}</span>
            </button>

            {showTroubleshoot && (
              <div className="pt-2 text-[11px] text-arma-textMuted space-y-1 border-t border-arma-border/60">
                <p>1. In your desktop Steam client, click <strong className="text-arma-text">View</strong> in the top menu.</p>
                <p>2. Select <strong className="text-arma-text">Game Servers</strong> (or Servers).</p>
                <p>3. Navigate to the <strong className="text-arma-text">Favorites</strong> tab and click the <strong className="text-arma-text">+ (Add Server)</strong> button.</p>
                <p>4. Enter the Steam Query address: <code className="text-arma-red font-bold">{stats.ip}:{stats.queryPort}</code></p>
                <p>5. Click <strong className="text-arma-text">OK</strong>. Frenchy&apos;s Antistasi will now permanently appear in your Steam and in-game server favorites!</p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-arma-surface border-t border-arma-border flex items-center justify-between text-xs font-mono">
          <span className="text-arma-textMuted text-[11px]">
            PORTAL &bull; {stats.ip}:{stats.port}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded arma-btn-secondary text-xs font-mono font-bold"
          >
            CLOSE DISPATCH
          </button>
        </div>
      </div>
    </div>
  );
}
