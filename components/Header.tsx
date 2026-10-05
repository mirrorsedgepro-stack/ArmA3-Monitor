'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Settings, 
  Terminal, 
  Crosshair,
  Flame
} from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface HeaderProps {
  stats: ArmaServerStats;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenConfig: () => void;
  onDownloadPreset: () => void;
  onOpenConnect: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export function Header({
  stats,
  onRefresh,
  isLoading,
  onOpenConfig,
  onDownloadPreset,
  onOpenConnect,
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
    { id: 'events', label: 'OPERATIONS // 19:30' },
    { id: 'mods', label: 'ADDON MANIFEST' },
    { id: 'rules', label: 'COMBAT DIRECTIVES' },
  ];

  return (
    <header className="border-b border-arma-border bg-arma-surface/95 backdrop-blur-md sticky top-0 z-50">
      {/* Main Command Bar with guaranteed space for brand and no letter clipping */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Left: Tactical Insignia and Brand Identity (shrink-0 guarantees it can NEVER be crushed into 'F') */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div 
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-arma-card border border-arma-border group-hover:border-arma-red transition-colors flex items-center justify-center text-arma-red shadow-inner shrink-0">
                <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-arma-red" />
              </div>

              <div className="shrink-0 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-base text-arma-text uppercase tracking-wider font-mono whitespace-nowrap">
                    <span className="sm:hidden">ARMA 3 &bull; PORTAL</span>
                    <span className="hidden sm:inline">Frenchy&apos;s Antistasi</span>
                  </span>
                  <span 
                    className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-arma-green animate-pulse' : 'bg-red-500'}`} 
                    title={isOnline ? 'Server Online' : 'Server Standby'}
                  />
                </div>
                <div className="text-[9px] sm:text-[10px] text-arma-khaki font-mono uppercase tracking-widest mt-0.5 whitespace-nowrap">
                  <span className="sm:hidden">{stats.ip}:{stats.port}</span>
                  <span className="hidden sm:inline">Dedicated &bull; {stats.ip}:{stats.port}</span>
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
                  className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap ${
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

          {/* Right: Military Actions (Clean & Non-Crowded on Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Copy IP Button - Hidden on mobile to prevent crushing logo, visible on >= sm */}
            <button
              onClick={copyDirectConnect}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded arma-btn-secondary text-xs font-mono transition-all shrink-0"
              title="Copy Server IP and Port"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-arma-green" />
                  <span className="text-arma-green font-bold text-xs">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-arma-textMuted" />
                  <span>{stats.ip}:{stats.port}</span>
                </>
              )}
            </button>

            {/* Download Preset (.html) - Tablet & Desktop */}
            <button
              onClick={onDownloadPreset}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded arma-btn-secondary text-xs font-mono transition-all shrink-0"
              title="Download official Arma 3 Launcher HTML Preset"
            >
              <Download className="w-3.5 h-3.5 text-arma-khaki" />
              <span>PRESET (.HTML)</span>
            </button>

            {/* Direct Connect (Primary Red CTA) - Opens deployment dispatch modal */}
            <button
              onClick={onOpenConnect}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded arma-btn-primary text-xs font-mono font-bold shadow-arma-red transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
              title="Open Direct Connect & Deployment Guide"
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">DIRECT JOIN</span>
              <span className="sm:hidden">JOIN</span>
            </button>

            {/* Utilities: Refresh (desktop) & Settings */}
            <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5 sm:pl-2 border-l border-arma-border shrink-0">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="hidden sm:flex p-2 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text disabled:opacity-50 transition-colors"
                title="Refresh live telemetry"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-arma-red' : ''}`} />
              </button>

              <button
                onClick={onOpenConfig}
                className="p-1.5 sm:p-2 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text transition-colors shrink-0"
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
