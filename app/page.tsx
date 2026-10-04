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
import { Sparkles, Terminal, Shield, ArrowUpRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0B0D17] text-white flex flex-col justify-between ga-bg-glow selection:bg-ga-mint selection:text-zinc-950">
      <div>
        {/* GameAnalytics Header */}
        <Header
          stats={stats}
          onRefresh={fetchServerStats}
          isLoading={isLoading}
          onOpenConfig={() => setIsConfigModalOpen(true)}
          onDownloadPreset={handleDownloadPreset}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
          
          {/* Section 1: Hero & Real-Time KPI Stats */}
          <ServerOverview
            stats={stats}
            onOpenPlayerList={() => setIsPlayerModalOpen(true)}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            onDownloadPreset={handleDownloadPreset}
            modCount={mods.length}
          />

          {/* Section 2: Modpack Suite & Steam Workshop Repository */}
          <ModList
            mods={mods}
            serverName={serverConfig.name}
            onDownloadPreset={handleDownloadPreset}
            onOpenPresetModal={() => setIsPresetModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Section 3: Server Guidelines, Keybindings & SOP */}
          <ServerRules rules={stats.rulesOfEngagement} />

        </main>
      </div>

      {/* GameAnalytics Style Footer */}
      <footer className="mt-20 border-t border-white/[0.08] bg-[#080911]/90 py-10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#161826] border border-white/10 flex items-center justify-center font-bold text-white text-[11px] font-mono">
              A3
            </div>
            <div>
              <div className="font-semibold text-white">{serverConfig.name}</div>
              <div className="text-zinc-500 text-[11px]">Arma 3 Server Portal &bull; Powered by Steam A2S Query</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="text-zinc-400">Direct Connect:</span>
            <code className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-ga-mint">
              {stats.ip}:{stats.port}
            </code>
            <span className="text-zinc-600 hidden sm:inline">&bull;</span>
            <span className="text-zinc-400">Status: <strong className="text-white uppercase">{stats.status}</strong></span>
          </div>

          <div className="text-zinc-500 text-[11px]">
            Vercel Serverless Ready
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
