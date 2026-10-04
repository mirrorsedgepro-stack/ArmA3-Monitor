'use client';

import React, { useState } from 'react';
import { Download, Copy, Check, RefreshCw, Settings, ExternalLink, Terminal, ChevronRight } from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface HeaderProps {
  stats: ArmaServerStats;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenConfig: () => void;
  onDownloadPreset: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export function Header({
  stats,
  onRefresh,
  isLoading,
  onOpenConfig,
  onDownloadPreset,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const isOnline = stats.status === 'online';

  const copyDirectConnect = () => {
    navigator.clipboard.writeText(`${stats.ip}:${stats.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'mods', label: 'Addons & Mods' },
    { id: 'rules', label: 'Server SOP' },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#0B0D17]/90 backdrop-blur-xl sticky top-0 z-50 transition-all">
      {/* Top micro-announcement banner (GameAnalytics style) */}
      <div className="bg-gradient-to-r from-ga-indigo/20 via-ga-surface to-ga-mint/10 border-b border-white/[0.05] py-1.5 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-ga-mint animate-pulse" />
          <span className="text-zinc-300 font-medium">
            Live Arma 3 Server: <strong className="text-white">{stats.name}</strong>
          </span>
          <span className="text-zinc-500 hidden sm:inline">&bull;</span>
          <span className="text-ga-mint font-mono text-[11px] hidden sm:inline">
            Direct IP: {stats.ip}:{stats.port}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity with GameAnalytics-inspired geometric logo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg bg-[#161826] border border-white/10 flex items-center justify-center shadow-ga-card overflow-hidden group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {/* GameAnalytics signature colored corner bars */}
                <div className="absolute top-0 right-0 w-3 h-1 bg-ga-mint" />
                <div className="absolute bottom-0 left-0 w-3 h-1 bg-ga-indigo" />
                <div className="w-4 h-4 text-white font-black text-xs flex items-center justify-center">
                  <span className="tracking-tighter text-white font-mono font-bold">A3</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white tracking-tight">
                    ArmaAnalytics
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-ga-mint/10 text-ga-mint border border-ga-mint/20">
                    Live Hub
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-white/[0.08]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveSection(link.id);
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-white bg-white/[0.08]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Actions & CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Server Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-ga-mint' : 'bg-red-500'}`} />
              <span className="text-zinc-300 font-mono text-[11px]">
                {stats.players}/{stats.maxPlayers} Online
              </span>
            </div>

            {/* Copy IP Button */}
            <button
              onClick={copyDirectConnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ga-btn-secondary text-xs font-mono"
              title="Copy IP:Port to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-ga-mint" />
                  <span className="text-ga-mint font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">{stats.ip}:{stats.port}</span>
                  <span className="sm:hidden">IP</span>
                </>
              )}
            </button>

            {/* Preset Download CTA */}
            <button
              onClick={onDownloadPreset}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg ga-btn-secondary text-xs"
              title="Download official Arma 3 Launcher HTML Preset"
            >
              <Download className="w-3.5 h-3.5 text-ga-mint" />
              <span>Preset (.html)</span>
            </button>

            {/* Direct Connect (Primary GameAnalytics Mint Button) */}
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg ga-btn-primary text-xs"
              title="Launch Arma 3 & Connect"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Direct Join</span>
            </a>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg ga-btn-secondary text-zinc-400 hover:text-white disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-ga-mint' : ''}`} />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenConfig}
              className="p-1.5 rounded-lg ga-btn-secondary text-zinc-400 hover:text-white"
              title="Configure Server IP"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
