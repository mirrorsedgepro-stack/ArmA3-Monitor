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
import { Shield, Sparkles, RefreshCw, Layers, CheckCircle2, ChevronRight, Terminal, Globe, Server } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<ArmaServerStats>(MOCK_SERVER_DATA);
  const [mods, setMods] = useState<ArmaMod[]>(DEFAULT_MODS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
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

  // Load saved config & mods from localStorage if available
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

  // Initial fetch and auto-refresh poll every 25 seconds
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
    // Re-trigger query
    setTimeout(() => {
      fetchServerStats();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-tactical-950 tactical-grid flex flex-col justify-between">
      <div>
        {/* Top Military HUD Navigation */}
        <Header
          stats={stats}
          onRefresh={fetchServerStats}
          isLoading={isLoading}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />

        {/* Main Operational Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* Quick Telemetry & Auto-refresh status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-tactical-900/60 border border-tactical-800 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400">LAST TELEMETRY:</span>
              <span className="text-emerald-400">
                {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Just now'}
              </span>
              <span className="text-zinc-600 hidden sm:inline">&bull;</span>
              <span className="text-zinc-400 hidden sm:inline">
                SOURCE: <strong className="text-zinc-300 uppercase">{stats.querySource}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-zinc-200">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-tactical-700 text-emerald-500 focus:ring-emerald-400 h-3.5 w-3.5 bg-tactical-950"
                />
                <span>Auto-poll (25s)</span>
              </label>

              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Edit Target IP</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Section 1: Server Overview & Real-Time Stats */}
          <ServerOverview
            stats={stats}
            onOpenPlayerList={() => setIsPlayerModalOpen(true)}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            modCount={mods.length}
          />

          {/* Section 2: All Loaded Mods & Addon Repository */}
          <ModList
            mods={mods}
            serverName={serverConfig.name}
            onDownloadPreset={handleDownloadPreset}
            onOpenPresetModal={() => setIsPresetModalOpen(true)}
          />

          {/* Section 3: Server SOP, Keybindings & Radio Frequencies */}
          <ServerRules rules={stats.rulesOfEngagement} />

        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-tactical-800 bg-tactical-950 py-8 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-zinc-400 font-bold">{serverConfig.name}</span>
            <span>&bull;</span>
            <span>Vercel Production Deployment</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Direct Connect:</span>
            <code className="text-emerald-400 bg-tactical-900 px-2 py-1 rounded border border-tactical-800">
              {stats.ip}:{stats.port}
            </code>
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
