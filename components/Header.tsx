'use client';

import React, { useState } from 'react';
import { Download, Copy, Check, RefreshCw, Settings, Terminal, Shield, Crosshair } from 'lucide-react';
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
    { id: 'overview', label: 'THEATER OVERVIEW' },
    { id: 'mods', label: 'ADDON MANIFEST' },
    { id: 'rules', label: 'COMBAT DIRECTIVES' },
  ];

  return (
    <header className="border-b border-arma-border bg-arma-surface/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Tactical C2 Ticker (Subdued Military Telemetry) */}
      <div className="bg-[#090b0e] border-b border-[#1c212c] py-1 px-4 text-[11px] font-mono text-arma-textMuted">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-arma-text">
              <span className={`w-2 h-2 rounded-xs ${isOnline ? 'bg-arma-green' : 'bg-red-500'}`} />
              <strong className="tracking-wider uppercase">{isOnline ? 'ACTIVE DEDICATED HOST' : 'STANDBY'}</strong>
            </span>
            <span className="text-[#333b47]">&bull;</span>
            <span className="hidden sm:inline text-arma-khaki font-medium">AO: {stats.map?.toUpperCase() || 'ALTIS'}</span>
            <span className="text-[#333b47] hidden sm:inline">&bull;</span>
            <span className="hidden md:inline text-arma-textMuted truncate max-w-sm">{stats.mission}</span>
          </div>

          <div className="flex items-center gap-3 text-arma-textDim">
            <span className="font-mono text-arma-textMuted">IP: {stats.ip}:{stats.port}</span>
            <span className="text-[#333b47]">&bull;</span>
            <span className="font-mono text-arma-amber font-semibold">{stats.players}/{stats.maxPlayers} SLOTS</span>
          </div>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Arma 3 Tactical Insignia */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-amber cursor-pointer hover:border-arma-amber transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Crosshair className="w-4 h-4 text-arma-amber" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-arma-text uppercase tracking-wider font-mono">
                    {stats.name}
                  </span>
                </div>
                <div className="text-[10px] text-arma-khaki font-mono uppercase tracking-widest">
                  Bohemia Interactive &bull; Dedicated Operation
                </div>
              </div>
            </div>

            {/* Tactical Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-arma-border text-xs font-mono">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveSection(link.id);
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    activeSection === link.id
                      ? 'text-arma-amber bg-arma-amberDim font-bold border border-arma-amber/30'
                      : 'text-arma-textMuted hover:text-arma-text hover:bg-arma-card'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Military Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Copy IP */}
            <button
              onClick={copyDirectConnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded arma-btn-secondary text-xs font-mono"
              title="Copy Server IP and Port"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-arma-amber" />
                  <span className="text-arma-amber font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-arma-textMuted" />
                  <span className="hidden sm:inline">{stats.ip}:{stats.port}</span>
                  <span className="sm:hidden font-bold">IP</span>
                </>
              )}
            </button>

            {/* Download Preset */}
            <button
              onClick={onDownloadPreset}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded arma-btn-secondary text-xs font-mono"
              title="Download official Arma 3 Launcher HTML Preset"
            >
              <Download className="w-3.5 h-3.5 text-arma-khaki" />
              <span>PRESET (.HTML)</span>
            </button>

            {/* Direct Connect (Arma Amber Primary CTA) */}
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded arma-btn-primary text-xs font-mono font-bold"
              title="Launch Arma 3 and connect automatically"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>DIRECT JOIN</span>
            </a>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-arma-amber' : ''}`} />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenConfig}
              className="p-1.5 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text"
              title="Configure target IP"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
