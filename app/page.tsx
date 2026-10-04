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

        {/* Tactical Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
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

      {/* Military Command Footer */}
      <footer className="mt-16 border-t border-arma-border bg-[#090b0e] py-6 text-xs font-mono text-arma-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-arma-text uppercase">{serverConfig.name}</span>
            <span>&bull;</span>
            <span className="text-arma-khaki">ARMA 3 DEDICATED OPERATIONS</span>
          </div>

          <div className="flex items-center gap-3">
            <span>DIRECT CONNECT:</span>
            <code className="px-2 py-0.5 rounded bg-arma-card border border-arma-border text-arma-amber font-bold">
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
