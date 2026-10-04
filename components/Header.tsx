'use client';

import React, { useState } from 'react';
import { Server, Search, Download, Settings, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface HeaderProps {
  stats: ArmaServerStats;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenConfig: () => void;
  onDownloadPreset: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Header({
  stats,
  onRefresh,
  isLoading,
  onOpenConfig,
  onDownloadPreset,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const isOnline = stats.status === 'online';

  const copyDirectConnect = () => {
    navigator.clipboard.writeText(`${stats.ip}:${stats.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Minimalist logo / title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Server className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-zinc-100 tracking-tight">
                  {stats.name || "Arma 3 Server"}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {isOnline ? 'online' : 'offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search input (Homepage search bar style) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter mods, authors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Copy IP */}
            <button
              onClick={copyDirectConnect}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors"
              title="Click to copy IP:Port"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">{stats.ip}:{stats.port}</span>
                  <span className="sm:hidden">IP</span>
                </>
              )}
            </button>

            {/* Download Preset */}
            <button
              onClick={onDownloadPreset}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
              title="Download Arma 3 Launcher HTML Preset"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Preset (.html)</span>
            </button>

            {/* Direct Connect Link */}
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-xs transition-colors shadow-sm"
              title="Launch Arma 3 & Connect"
            >
              <span>Join</span>
            </a>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-zinc-200' : ''}`} />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenConfig}
              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
              title="Server Configuration"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
