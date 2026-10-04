'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Settings, 
  Terminal, 
  Crosshair
} from 'lucide-react';
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

  // Clean, display-friendly server title (prevents single-letter clipping)
  const displayTitle = 
    stats.name && stats.name.trim().length > 2
      ? (stats.name.length > 32 ? "Frenchy's Antistasi" : stats.name)
      : "Frenchy's Antistasi";

  return (
    <header className="border-b border-arma-border bg-arma-surface/95 backdrop-blur-md sticky top-0 z-50">
      {/* Main Command Bar with responsive mobile height and spacing */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Left: Arma 3 Tactical Insignia and Brand Title */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div 
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-arma-card border border-arma-border group-hover:border-arma-red transition-colors flex items-center justify-center text-arma-red shadow-inner shrink-0">
                <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-arma-red" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-xs sm:text-base text-arma-text uppercase tracking-wider font-mono truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                    {displayTitle}
                  </span>
                  <span 
                    className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-arma-green animate-pulse' : 'bg-red-500'}`} 
                    title={isOnline ? 'Server Online' : 'Server Standby'}
                  />
                </div>
                <div className="text-[9px] sm:text-[10px] text-arma-khaki font-mono uppercase tracking-widest mt-0.5 truncate max-w-[140px] sm:max-w-none">
                  Dedicated &bull; {stats.ip}:{stats.port}
                </div>
              </div>
            </div>

            {/* Tactical Navigation Links (Desktop only) */}
            <nav className="hidden lg:flex items-center space-x-2 pl-6 border-l border-arma-border text-xs font-mono shrink-0">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveSection(link.id);
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-2 rounded-md transition-all ${
                    activeSection === link.id
                      ? 'text-arma-red bg-arma-redDim font-bold border border-arma-red/40 shadow-sm'
                      : 'text-arma-textMuted hover:text-arma-text hover:bg-arma-card'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Spread-out Military Actions (Mobile Touch Friendly) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Copy IP Button */}
            <button
              onClick={copyDirectConnect}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded arma-btn-secondary text-xs font-mono transition-all"
              title="Copy Server IP and Port"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-arma-green" />
                  <span className="text-arma-green font-bold text-[11px] sm:text-xs">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-arma-textMuted" />
                  <span className="hidden sm:inline">{stats.ip}:{stats.port}</span>
                  <span className="sm:hidden font-bold text-[11px]">IP</span>
                </>
              )}
            </button>

            {/* Download Preset (.html) - Visible on tablet/desktop */}
            <button
              onClick={onDownloadPreset}
              className="hidden md:flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded arma-btn-secondary text-xs font-mono transition-all"
              title="Download official Arma 3 Launcher HTML Preset"
            >
              <Download className="w-3.5 h-3.5 text-arma-khaki" />
              <span>PRESET (.HTML)</span>
            </button>

            {/* Direct Connect (Primary Red CTA) */}
            <a
              href={`steam://connect/${stats.ip}:${stats.port}`}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded arma-btn-primary text-xs font-mono font-bold shadow-arma-red transition-all"
              title="Launch Arma 3 and connect automatically"
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">DIRECT JOIN</span>
              <span className="sm:hidden">JOIN</span>
            </a>

            {/* Utilities: Refresh & Settings */}
            <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5 sm:pl-2 border-l border-arma-border">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-1.5 sm:p-2 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text disabled:opacity-50 transition-colors"
                title="Refresh live telemetry"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-arma-red' : ''}`} />
              </button>

              <button
                onClick={onOpenConfig}
                className="p-1.5 sm:p-2 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text transition-colors"
                title="Server settings"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
