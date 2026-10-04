'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Radio, Terminal, Settings, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface HeaderProps {
  stats: ArmaServerStats;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenConfig: () => void;
}

export function Header({ stats, onRefresh, isLoading, onOpenConfig }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [zuluTime, setZuluTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setZuluTime(`${hours}:${minutes}:${seconds} ZULU`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyDirectConnect = () => {
    const text = `${stats.ip}:${stats.port}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOnline = stats.status === 'online';

  return (
    <header className="border-b border-tactical-700 bg-tactical-950/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Branding & Military insignia */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-tactical-900 border border-tactical-700 shadow-inner group">
              <Shield className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Arma 3 Operations Hub
                </span>
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
                  {zuluTime || '00:00:00 ZULU'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide text-zinc-100 truncate max-w-xs sm:max-w-md md:max-w-xl">
                {stats.name}
              </h1>
            </div>
          </div>

          {/* Right: Server Telemetry status & Actions */}
          <div className="flex items-center space-x-3">
            {/* Live Status indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-tactical-900 border border-tactical-700 font-mono text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-tactical-glow animate-pulse' : 'bg-red-500'}`} />
              <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {isOnline ? 'SERVER ONLINE' : 'SERVER OFFLINE'}
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300 font-bold">{stats.players}/{stats.maxPlayers}</span>
            </div>

            {/* Direct Connect Quick Copy */}
            <button
              onClick={copyDirectConnect}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-mono rounded bg-tactical-850 hover:bg-tactical-800 text-zinc-200 border border-tactical-700 hover:border-tactical-600 transition-all shadow-sm"
              title="Copy IP:Port to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">{stats.ip}:{stats.port}</span>
                  <span className="sm:hidden">IP</span>
                </>
              )}
            </button>

            {/* Direct Steam Launch */}
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold font-mono rounded bg-emerald-600 hover:bg-emerald-500 text-black transition-all shadow-tactical-glow"
              title="Launch Arma 3 and connect automatically"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>DIRECT JOIN</span>
            </a>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded bg-tactical-900 hover:bg-tactical-800 text-zinc-300 border border-tactical-700 transition-colors disabled:opacity-50"
              title="Refresh server telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Server Settings / Custom IP modal */}
            <button
              onClick={onOpenConfig}
              className="p-2 rounded bg-tactical-900 hover:bg-tactical-800 text-zinc-300 border border-tactical-700 hover:text-emerald-400 transition-colors"
              title="Configure Server IP & Query Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
