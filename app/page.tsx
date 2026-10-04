'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ServerOverview } from '@/components/ServerOverview';
import { ModList } from '@/components/ModList';
import { PlayerListModal } from '@/components/PlayerListModal';
import { PresetModal } from '@/components/PresetModal';
import { ServerConfigModal } from '@/components/ServerConfigModal';
import { ServerRules } from '@/components/ServerRules';
import { DEFAULT_MODS, ArmaMod } from '@/data/defaultMods';
import { MOCK_SERVER_DATA, DEFAULT_SERVER_CONFIG, ArmaServerStats } from '@/data/defaultServer';
import { generateArma3PresetHtml } from '@/lib/presetGenerator';
import { ArrowUp, Compass, Layers, Shield } from 'lucide-react';

export default function Home() {
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
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Server configuration
  const [serverConfig, setServerConfig] = useState<{
    name: string;
    ip: string;
    port: number;
    queryPort: number;
    bmId?: string;
  }>({
    name: DEFAULT_SERVER_CONFIG.name,
    ip: DEFAULT_SERVER_CONFIG.ip,
    port: DEFAULT_SERVER_CONFIG.port,
    queryPort: DEFAULT_SERVER_CONFIG.queryPort,
    bmId: '',
  });

  // Track scroll position for smooth floating mechanics
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const overviewEl = document.getElementById('overview');
      const modsEl = document.getElementById('mods');
      const rulesEl = document.getElementById('rules');

      const scrollPos = window.scrollY + 200;

      if (rulesEl && scrollPos >= rulesEl.offsetTop) {
        setActiveSection('rules');
      } else if (modsEl && scrollPos >= modsEl.offsetTop) {
        setActiveSection('mods');
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
        setServerConfig(JSON.parse(savedConfig));
      }
      const savedMods = localStorage.getItem('arma3_custom_mods');
      if (savedMods) {
        const parsed = JSON.parse(savedMods);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMods(parsed);
        }
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
        setStats((prev) => ({
          ...prev,
          ...data,
          name: serverConfig.name || data.name,
        }));
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
    }, 25000);

    return () => clearInterval(interval);
  }, [fetchServerStats, autoRefresh]);

  const handleDownloadPreset = () => {
    const html = generateArma3PresetHtml(serverConfig.name, mods);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${serverConfig.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Preset.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyCustomMods = (newMods: ArmaMod[]) => {
    setMods(newMods);
    try {
      localStorage.setItem('arma3_custom_mods', JSON.stringify(newMods));
    } catch {
      // ignore
    }
  };

  const handleSaveConfig = (newConfig: typeof serverConfig) => {
    setServerConfig(newConfig);
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
    <div className="min-h-screen bg-arma-bg text-arma-text arma-grid-bg flex flex-col justify-between selection:bg-arma-amber selection:text-black">
      <div>
        {/* Tactical Command Bar */}
        <Header
          stats={stats}
          onRefresh={fetchServerStats}
          isLoading={isLoading}
          onOpenConfig={() => setIsConfigModalOpen(true)}
          onDownloadPreset={handleDownloadPreset}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Tactical Dashboard Content - Generous Vertical Spacing & Rhythm */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16 lg:space-y-20">
          
          {/* Section 1: Operation Briefing & Technical Telemetry */}
          <ServerOverview
            stats={stats}
            onOpenPlayerList={() => setIsPlayerModalOpen(true)}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            onDownloadPreset={handleDownloadPreset}
            modCount={mods.length}
          />

          {/* Section 2: Addon Loadout & Workshop Manifest */}
          <ModList
            mods={mods}
            serverName={serverConfig.name}
            onDownloadPreset={handleDownloadPreset}
            onOpenPresetModal={() => setIsPresetModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Section 3: Combat Directives & Keybinds */}
          <ServerRules rules={stats.rulesOfEngagement} />

        </main>
      </div>

      {/* Floating Tactical Navigation & Smooth Scrolling HUD */}
      {showScrollTop && (
        <aside 
          aria-label="Tactical Quick Navigation"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-xl bg-arma-surface/90 border border-arma-border backdrop-blur-md shadow-2xl font-mono text-xs"
        >
          <button
            onClick={() => scrollToSection('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'overview'
                ? 'bg-arma-amber text-black font-bold'
                : 'text-arma-textMuted hover:text-arma-text'
            }`}
            title="Jump to Theater Overview"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OVERVIEW</span>
          </button>

          <button
            onClick={() => scrollToSection('mods')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'mods'
                ? 'bg-arma-amber text-black font-bold'
                : 'text-arma-textMuted hover:text-arma-text'
            }`}
            title="Jump to Addons"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ADDONS</span>
          </button>

          <button
            onClick={() => scrollToSection('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSection === 'rules'
                ? 'bg-arma-amber text-black font-bold'
                : 'text-arma-textMuted hover:text-arma-text'
            }`}
            title="Jump to Directives"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RULES</span>
          </button>

          <div className="w-px h-5 bg-arma-border mx-1" />

          {/* Scroll to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 rounded-lg bg-arma-card hover:bg-arma-surface text-arma-textMuted hover:text-arma-text transition-colors"
            title="Smooth Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Military Command Footer */}
      <footer className="mt-20 border-t border-arma-border bg-[#07090c] py-8 text-xs font-mono text-arma-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-arma-text uppercase">{serverConfig.name}</span>
            <span>&bull;</span>
            <span className="text-arma-khaki">ARMA 3 DEDICATED OPERATIONS</span>
            <span>&bull;</span>
            <span>SYDNEY, AUSTRALIA</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>DIRECT CONNECT:</span>
            <code className="px-2.5 py-1 rounded bg-arma-card border border-arma-border text-arma-amber font-bold">
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

      <ServerConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentConfig={serverConfig}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
