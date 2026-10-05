'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ServerOverview } from '@/components/ServerOverview';
import { ModList } from '@/components/ModList';
import { PlayerListModal } from '@/components/PlayerListModal';
import { PresetModal } from '@/components/PresetModal';
import { ServerConfigModal } from '@/components/ServerConfigModal';
import { ConnectModal } from '@/components/ConnectModal';
import { EventTracker } from '@/components/EventTracker';
import { DEFAULT_MODS, ArmaMod } from '@/data/defaultMods';
import { MOCK_SERVER_DATA, SERVERS_LIST, ArmaServerStats, ServerDefinition } from '@/data/defaultServer';
import { generateArma3PresetHtml } from '@/lib/presetGenerator';
import { ArrowUp, Compass, Layers, Flame } from 'lucide-react';

export default function Home() {
  const [serverConfig, setServerConfig] = useState<ServerDefinition>(SERVERS_LIST[0]);
  const [stats, setStats] = useState<ArmaServerStats>(MOCK_SERVER_DATA);
  const [mods, setMods] = useState<ArmaMod[]>(DEFAULT_MODS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Modals state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Track scroll position for smooth floating mechanics
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);

      const overviewEl = document.getElementById('overview');
      const eventsEl = document.getElementById('events');
      const modsEl = document.getElementById('mods');

      const scrollPos = window.scrollY + 200;

      if (modsEl && scrollPos >= modsEl.offsetTop) {
        setActiveSection('mods');
      } else if (eventsEl && scrollPos >= eventsEl.offsetTop) {
        setActiveSection('events');
      } else {
        setActiveSection('overview');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check initial load
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('arma3_server_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed && parsed.ip) {
          setServerConfig((prev) => ({ ...prev, ...parsed }));
        }
      }

      const savedMods = localStorage.getItem('arma3_custom_mods_v3');
      if (savedMods) {
        const parsed = JSON.parse(savedMods);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMods(parsed);
        }
      } else {
        localStorage.removeItem('arma3_custom_mods');
        setMods(DEFAULT_MODS);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const fetchServerStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ip: serverConfig.ip,
        port: serverConfig.port.toString(),
        queryPort: serverConfig.queryPort.toString(),
      });
      if (serverConfig.bmId) {
        params.append('bmId', serverConfig.bmId);
      }

      const res = await fetch(`/api/server?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const resolvedName = (serverConfig.name && serverConfig.name.trim().length > 2)
          ? serverConfig.name
          : (data.name && data.name.trim().length > 2 ? data.name : serverConfig.name);

        setStats({
          ...data,
          name: resolvedName,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch server stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [serverConfig]);

  useEffect(() => {
    fetchServerStats();

    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchServerStats();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchServerStats, autoRefresh]);

  const handleDownloadPreset = () => {
    const html = generateArma3PresetHtml('FAS', mods);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FAS_Preset.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyCustomMods = (newMods: ArmaMod[]) => {
    setMods(newMods);
    try {
      localStorage.setItem('arma3_custom_mods_v3', JSON.stringify(newMods));
    } catch {
      // ignore
    }
  };

  const handleSaveConfig = (newConfig: {
    name: string;
    ip: string;
    port: number;
    queryPort: number;
    bmId?: string;
  }) => {
    setServerConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
    try {
      localStorage.setItem('arma3_server_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    setTimeout(() => {
      fetchServerStats();
    }, 100);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-arma-bg text-arma-text arma-grid-bg flex flex-col justify-between selection:bg-arma-red selection:text-white">
      <div>
        {/* Tactical Command Bar */}
        <Header
          stats={stats}
          onRefresh={fetchServerStats}
          isLoading={isLoading}
          onOpenConfig={() => setIsConfigModalOpen(true)}
          onDownloadPreset={handleDownloadPreset}
          onOpenConnect={() => setIsConnectModalOpen(true)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Dashboard Content - Responsive mobile & desktop spacing */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-14 space-y-8 sm:space-y-16 lg:space-y-20">
          
          {/* Section 1: Server Overview */}
          <ServerOverview
            stats={stats}
            onOpenPlayerList={() => setIsPlayerModalOpen(true)}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            onDownloadPreset={handleDownloadPreset}
            onOpenConnect={() => setIsConnectModalOpen(true)}
            modCount={mods.length}
          />

          {/* Section 2: Tonight's Tactical Event Dispatch & Live Countdown */}
          <EventTracker
            onOpenConnect={() => setIsConnectModalOpen(true)}
            onDownloadPreset={handleDownloadPreset}
          />

          {/* Section 3: Addon Loadout & Workshop Manifest */}
          <ModList
            mods={mods}
            serverName={serverConfig.name}
            onDownloadPreset={handleDownloadPreset}
            onOpenPresetModal={() => setIsPresetModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

        </main>
      </div>

      {/* Floating Quick Navigation & Smooth Scrolling */}
      {showScrollTop && (
        <aside 
          aria-label="Quick Navigation"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-arma-surface/90 border border-arma-border backdrop-blur-md shadow-2xl font-mono text-xs"
        >
          <button
            onClick={() => scrollToSection('overview')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'overview'
                ? 'bg-arma-red text-white font-bold'
                : 'text-arma-textMuted hover:text-arma-text'
            }`}
            title="Jump to Server Overview"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OVERVIEW</span>
          </button>

          <button
            onClick={() => scrollToSection('events')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'events'
                ? 'bg-arma-red text-white font-bold'
                : 'text-arma-textMuted hover:text-arma-text'
            }`}
            title="Jump to Tonight's Event"
          >
            <Flame className="w-3.5 h-3.5 text-arma-red" />
            <span className="hidden sm:inline">EVENT</span>
          </button>

          <button
            onClick={() => scrollToSection('mods')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'mods'
                ? 'bg-arma-red text-white font-bold'
                : 'text-arma-textMuted hover:text-arma-text'
            }`}
            title="Jump to Mods"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MODS</span>
          </button>

          <div className="w-px h-5 bg-arma-border mx-0.5 sm:mx-1" />

          {/* Scroll to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-1.5 sm:p-2 rounded-lg bg-arma-card hover:bg-arma-surface text-arma-textMuted hover:text-arma-text transition-colors"
            title="Smooth Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Server Footer */}
      <footer className="mt-16 sm:mt-20 border-t border-arma-border bg-[#07090c] py-6 sm:py-8 text-xs font-mono text-arma-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-arma-text uppercase">{serverConfig.name}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-arma-khaki">24/7 DEDICATED SERVER</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden md:inline">SYDNEY, AUSTRALIA</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span>DIRECT CONNECT:</span>
            <code className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-arma-card border border-arma-border text-arma-red font-bold">
              {stats.ip}:{stats.port}
            </code>
            <span>&bull;</span>
            <span>STATUS: <strong className="text-arma-green uppercase">{stats.status}</strong></span>
          </div>

          <div className="text-arma-textDim text-[11px]">
            VALVE A2S PROTOCOL &bull; VERCEL DEPLOYMENT
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PlayerListModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        players={stats.playerList || []}
        serverName={serverConfig.name}
      />

      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        serverName={serverConfig.name}
        currentMods={mods}
        onApplyCustomMods={handleApplyCustomMods}
      />

      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        stats={stats}
        onDownloadPreset={handleDownloadPreset}
      />

      <ServerConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentConfig={serverConfig}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
