'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, Check, ChevronDown, Download, Play, HelpCircle, FileCode, Mic } from 'lucide-react';
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
  const [copiedTs, setCopiedTs] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

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

  const copyTs = () => {
    navigator.clipboard.writeText(stats.teamspeakAddress || '');
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 2000);
  };

  const downloadBatchScript = () => {
    const batContent = `@echo off
title Connecting to ${stats.name}...
color 0c
cls
echo ==============================================================================
echo       ${stats.name.toUpperCase()} - CONNECTION INFO
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
echo  5. Click JOIN - The Launcher will auto-match and subscribe to every required mod.
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

  const Copyable = ({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) => (
    <button
      onClick={onCopy}
      className="flex w-full min-w-0 items-center justify-between gap-2 rounded-sm bg-black/20 px-3 py-2 text-left hover:bg-black/30"
      title={`Copy ${label.toLowerCase()}`}
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="block truncate text-sm tabular-nums text-slate-100">{value}</span>
      </span>
      {copied ? <Check className="h-4 w-4 shrink-0 text-emerald-400" /> : <Copy className="h-4 w-4 shrink-0 text-slate-500" />}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-title"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-lg bg-slate-800 shadow-2xl ring-1 ring-white/10 sm:rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
          <div className="min-w-0">
            <h2 id="connect-title" className="text-base font-medium text-slate-100">Join the server</h2>
            <p className="truncate text-xs text-slate-400">{stats.name}</p>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-4 py-4">
          {/* Step 1 */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-arma-red text-[11px] text-white">1</span>
              Get the mods
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Download the preset, then in the Arma 3 Launcher open <strong className="text-slate-200">Mods → Preset → Import</strong> and
              subscribe to everything it lists.
            </p>
            <button
              onClick={() => {
                onDownloadPreset();
              }}
              className="flex w-full items-center justify-center gap-2 rounded px-3 py-2.5 text-sm arma-btn-secondary"
            >
              <Download className="h-4 w-4" />
              Download mod preset (.html)
            </button>
          </section>

          {/* Step 2 */}
          <section className="space-y-2 border-t border-white/5 pt-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-arma-red text-[11px] text-white">2</span>
              Open the launcher
            </h3>
            <a
              href="steam://run/107410"
              className="flex w-full items-center justify-center gap-2 rounded px-3 py-2.5 text-sm arma-btn-primary"
            >
              <Play className="h-4 w-4 fill-white" />
              Launch Arma 3 via Steam
            </a>
            <p className="text-xs text-slate-500">
              Plain <code className="rounded bg-black/30 px-1">steam://connect</code> links fail for modded Arma servers, so join through
              the launcher.
            </p>
          </section>

          {/* Step 3 */}
          <section className="space-y-2 border-t border-white/5 pt-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-arma-red text-[11px] text-white">3</span>
              Direct Connect
            </h3>
            <ol className="list-decimal space-y-0.5 pl-5 text-xs leading-relaxed text-slate-400">
              <li>
                In the launcher go to <strong className="text-slate-200">Servers → Direct Connect</strong>.
              </li>
              <li>Enter the IP and port below, then <strong className="text-slate-200">Join</strong>.</li>
              <li>
                Pick <strong className="text-slate-200">Setup DLCs and mods and join</strong> if it asks.
              </li>
            </ol>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="col-span-2">
                <Copyable label="Address" value={fullAddress} copied={copiedFull} onCopy={copyFull} />
              </div>
              <Copyable label="IP" value={stats.ip} copied={copiedIpOnly} onCopy={copyIp} />
              <Copyable label="Port" value={String(stats.port)} copied={copiedPortOnly} onCopy={copyPort} />
            </div>
          </section>

          {/* Step 4 */}
          {stats.teamspeakUrl && (
            <section className="space-y-2 border-t border-white/5 pt-4">
              <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-arma-red text-[11px] text-white">4</span>
                Join TeamSpeak
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                In-game radio (TFAR) runs over our TeamSpeak 3 server. Connect before you join; TFAR moves you into the{' '}
                <strong className="text-slate-200">TaskForceRadio</strong> channel when the mission starts.
              </p>
              <p className="rounded-sm bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-500/20">
                Use the <strong>TeamSpeak 3</strong> client (3.6.x, from teamspeak.com → Downloads). TeamSpeak 5 and 6 can&apos;t
                load the TFAR plugin, so the game never links to them.
              </p>
              <a
                href={stats.teamspeakUrl}
                className="flex w-full items-center justify-center gap-2 rounded px-3 py-2.5 text-sm arma-btn-primary"
              >
                <Mic className="h-4 w-4" />
                Connect with TeamSpeak 3
              </a>
              {stats.teamspeakAddress && (
                <Copyable label="TeamSpeak address" value={stats.teamspeakAddress} copied={copiedTs} onCopy={copyTs} />
              )}
              <p className="text-xs leading-relaxed text-slate-500">
                First time: install the TFAR plugin by double-clicking{' '}
                <code className="rounded bg-black/30 px-1">task_force_radio.ts3_plugin</code> in{' '}
                <code className="break-all rounded bg-black/30 px-1">steamapps\workshop\content\107410\894678801\teamspeak</code>, then
                enable it under <strong className="text-slate-300">Tools → Options → Addons</strong>. Run TeamSpeak and Arma the same
                way (neither as administrator), or TFAR can&apos;t connect them.
              </p>
            </section>
          )}

          {/* Extras */}
          <section className="space-y-2 border-t border-white/5 pt-4">
            <button
              onClick={downloadBatchScript}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs arma-btn-secondary"
            >
              <FileCode className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="min-w-0">
                <span className="block text-slate-200">Windows helper (.bat)</span>
                <span className="block text-slate-500">Opens the launcher and prints these steps</span>
              </span>
            </button>
            <button
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-xs arma-btn-secondary"
              aria-expanded={showTroubleshoot}
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-slate-200">Add to Steam favourites</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showTroubleshoot ? 'rotate-180' : ''}`} />
            </button>
            {showTroubleshoot && (
              <ol className="list-decimal space-y-0.5 pl-8 text-xs leading-relaxed text-slate-400">
                <li>
                  In Steam open <strong className="text-slate-200">View → Game Servers</strong>.
                </li>
                <li>
                  On <strong className="text-slate-200">Favorites</strong>, click <strong className="text-slate-200">+</strong>.
                </li>
                <li>
                  Enter the query address <code className="rounded bg-black/30 px-1 text-slate-200">{stats.ip}:{stats.queryPort}</code>.
                </li>
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
