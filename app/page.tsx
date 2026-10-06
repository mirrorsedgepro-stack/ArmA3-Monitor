'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ModList } from '@/components/ModList';
import { PlayerListModal } from '@/components/PlayerListModal';
import { PresetModal } from '@/components/PresetModal';
import { ServerConfigModal } from '@/components/ServerConfigModal';
import { ConnectModal } from '@/components/ConnectModal';
import { TopPlayers } from '@/components/TopPlayers';
import { PlayerHistoryGraph } from '@/components/PlayerHistoryGraph';
import { InfoWidgets } from '@/components/dash/InfoWidgets';
import { ServiceGroup } from '@/components/dash/ServiceGroup';
import { ServiceCard } from '@/components/dash/ServiceCard';
import { StatBlock, StatRow } from '@/components/dash/StatBlock';
import { StatusDot } from '@/components/dash/StatusDot';
import { Bookmarks, Bookmark } from '@/components/dash/Bookmarks';
import { DEFAULT_MODS, ArmaMod } from '@/data/defaultMods';
import { INITIAL_SERVER_STATS, SERVERS_LIST, ArmaServerStats, ServerDefinition } from '@/data/defaultServer';
import { generateArma3PresetHtml } from '@/lib/presetGenerator';
import { formatAge, formatBool, formatNumber, formatUptime, UNKNOWN } from '@/lib/format';
import {
  Check,
  Copy,
  Crosshair,
  Download,
  Flag,
  HardDrive,
  Layers,
  MessageCircle,
  Mic,
  Play,
  Swords,
  Users,
} from 'lucide-react';

/** Antistasi logs performance every 30 s while players are on; older than this is stale. */
const STALE_SAMPLE_SECONDS = 300;

export default function Home() {
  const [serverConfig, setServerConfig] = useState<ServerDefinition>(SERVERS_LIST[0]);
  const [stats, setStats] = useState<ArmaServerStats>(INITIAL_SERVER_STATS);
  const [mods, setMods] = useState<ArmaMod[]>(DEFAULT_MODS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Modals state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

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

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${stats.ip}:${stats.port}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context); the address is shown on the card.
    }
  };

  const online = stats.status === 'online';
  const maxPlayers = stats.maxPlayers || 32;
  const fps = online ? stats.serverFps ?? stats.performance?.serverFps ?? null : null;
  const hc = online ? stats.headlessClients : null;
  const cfg = stats.serverConfig;
  const perf = stats.performance;
  const perfStale = !perf || perf.ageSeconds > STALE_SAMPLE_SECONDS;
  const address = `${stats.ip}:${stats.port}`;

  const fpsTone = fps == null ? 'default' : fps >= 35 ? 'good' : fps >= 20 ? 'warn' : 'bad';
  const hcTone = !hc ? 'default' : hc.active >= hc.expected ? 'good' : hc.active > 0 ? 'warn' : 'bad';
  const iconClass = 'h-7 w-7';

  const bookmarks: Bookmark[] = [
    { abbr: 'A3', name: 'Arma 3 Launcher', description: 'steam://run/107410', href: 'steam://run/107410' },
    { abbr: 'AU', name: 'Antistasi Ultimate', description: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3020755032' },
    { abbr: 'GH', name: 'Antistasi Ultimate source', description: 'github.com', href: 'https://github.com/SilenceIsFatto/A3-Antistasi-Ultimate' },
    { abbr: 'AC', name: 'ACE3 wiki', description: 'ace3.acemod.org', href: 'https://ace3.acemod.org/wiki/' },
    { abbr: 'SV', name: 'Server setup (ARM64)', description: 'github.com', href: 'https://github.com/mirrorsedgepro-stack/ArmA3-Ultimate-Antistasi-Arm64' },
    ...(stats.discordUrl ? [{ abbr: 'DC', name: 'Discord', description: 'Community', href: stats.discordUrl }] : []),
    ...(stats.teamspeakUrl ? [{ abbr: 'TS', name: 'TeamSpeak', description: 'Voice', href: stats.teamspeakUrl }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <InfoWidgets
          stats={stats}
          isLoading={isLoading}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
          onRefresh={fetchServerStats}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ServiceGroup id="overview" title="Server" columns="grid-cols-1">
            <ServiceCard
              icon={<Crosshair className={`${iconClass} text-arma-red`} />}
              name={stats.mission || 'Antistasi Ultimate'}
              description={`${stats.map || UNKNOWN} · ${stats.version ? `v${stats.version}` : 'version unknown'} · ${address}`}
              status={<StatusDot status={stats.status} ping={stats.ping} />}
              onClick={() => setIsPlayerModalOpen(true)}
              title="Show who's online"
            >
              <StatRow>
                <StatBlock label="Players" value={online ? `${stats.players}/${maxPlayers}` : UNKNOWN} />
                <StatBlock
                  label="Server FPS"
                  value={formatNumber(fps, 1)}
                  tone={fpsTone}
                  title={perf ? `Sampled ${formatAge(perf.ageSeconds)}` : 'Antistasi only logs FPS while players are online'}
                />
                <StatBlock label="HCs" value={hc ? `${hc.active}/${hc.expected}` : UNKNOWN} tone={hcTone} />
                <StatBlock label="Uptime" value={online ? formatUptime(stats.uptimeSeconds) : UNKNOWN} />
              </StatRow>
            </ServiceCard>

            <ServiceCard
              icon={<HardDrive className={iconClass} />}
              name="Host"
              description={stats.platform || stats.location || UNKNOWN}
            >
              <StatRow>
                <StatBlock label="Difficulty" value={cfg?.difficulty ?? UNKNOWN} />
                <StatBlock label="BattlEye" value={formatBool(stats.battleye)} />
                <StatBlock
                  label="Signatures"
                  value={cfg?.verifySignatures == null ? UNKNOWN : cfg.verifySignatures > 0 ? `v${cfg.verifySignatures}` : 'Off'}
                />
                <StatBlock label="Voice" value={formatBool(cfg?.voiceEnabled ?? null)} />
                <StatBlock label="Persistent" value={formatBool(cfg?.persistent ?? null, 'Yes', 'No')} />
              </StatRow>
            </ServiceCard>
          </ServiceGroup>

          <ServiceGroup id="join" title="Join" columns="grid-cols-1 sm:grid-cols-2">
            <ServiceCard
              icon={<Play className={`${iconClass} text-arma-red`} />}
              name="Launch & Connect"
              description="Step-by-step join guide"
              onClick={() => setIsConnectModalOpen(true)}
            >
              <StatRow>
                <StatBlock
                  label="Password"
                  value={stats.passwordProtected == null ? UNKNOWN : stats.passwordProtected ? 'Required' : 'None'}
                />
                <StatBlock label="Slots free" value={online ? Math.max(0, maxPlayers - stats.players) : UNKNOWN} />
              </StatRow>
            </ServiceCard>

            <ServiceCard
              icon={copied ? <Check className={`${iconClass} text-emerald-400`} /> : <Copy className={iconClass} />}
              name={copied ? 'Copied!' : 'Copy address'}
              description={address}
              onClick={copyAddress}
              title="Copy IP:port for Direct Connect"
            >
              <StatRow>
                <StatBlock label="Game port" value={stats.port} />
                <StatBlock label="Query port" value={stats.queryPort} />
              </StatRow>
            </ServiceCard>

            <ServiceCard
              icon={<Download className={iconClass} />}
              name="Mod preset"
              description="Launcher → Mods → Preset → Import"
              onClick={handleDownloadPreset}
              title="Download the Arma 3 Launcher preset (.html)"
            >
              <StatRow>
                <StatBlock label="Mods" value={mods.length} />
                <StatBlock label="Required" value={mods.filter((m) => m.required).length} />
              </StatRow>
            </ServiceCard>

            {stats.discordUrl ? (
              <ServiceCard
                icon={<MessageCircle className={iconClass} />}
                name="Discord"
                description="Squad up, report issues"
                href={stats.discordUrl}
              />
            ) : (
              <ServiceCard
                icon={<Layers className={iconClass} />}
                name="Browse mods"
                description="Full list with Workshop links"
                href="#mods"
              />
            )}
            {stats.teamspeakUrl && (
              <ServiceCard icon={<Mic className={iconClass} />} name="TeamSpeak" description="Voice comms" href={stats.teamspeakUrl} />
            )}
          </ServiceGroup>
        </div>

        <ServiceGroup id="campaign" title="Campaign" columns="grid-cols-1 lg:grid-cols-2">
          <ServiceCard
            icon={<Flag className={iconClass} />}
            name="Rebel faction"
            description={
              perf
                ? `Sampled ${formatAge(perf.ageSeconds)}${perfStale ? ' · stale' : ''}`
                : 'No sample yet: Antistasi only logs while players are online'
            }
          >
            <StatRow>
              <StatBlock label="War level" value={perf ? perf.warLevel : UNKNOWN} />
              <StatBlock label="HR" value={perf ? perf.hr : UNKNOWN} />
              <StatBlock label="Money" value={perf ? `€${formatNumber(perf.factionCash)}` : UNKNOWN} />
              <StatBlock label="Occ. aggro" value={perf ? perf.occAggro : UNKNOWN} />
              <StatBlock label="Inv. aggro" value={perf ? perf.invAggro : UNKNOWN} />
            </StatRow>
          </ServiceCard>
          <ServiceCard
            icon={<Swords className={iconClass} />}
            name="World"
            description="Simulation load on the server"
          >
            <StatRow>
              <StatBlock label="Units" value={perf ? perf.allUnits : UNKNOWN} />
              <StatBlock label="Dead" value={perf ? perf.deadUnits : UNKNOWN} />
              <StatBlock label="Vehicles" value={perf ? perf.allVehicles : UNKNOWN} />
              <StatBlock label="Clients" value={perf ? perf.connectedClientsInclHCs : UNKNOWN} title="Including headless clients" />
            </StatRow>
          </ServiceCard>
        </ServiceGroup>

        <ServiceGroup title="Activity" icon={<Users className="h-5 w-5 text-slate-400" />} className="space-y-4">
          <div className="space-y-6">
            <PlayerHistoryGraph currentPlayers={stats.players} maxPlayers={maxPlayers} serverName={stats.name} />
            <TopPlayers livePlayers={stats.playerList || []} onOpenPlayerList={() => setIsPlayerModalOpen(true)} />
          </div>
        </ServiceGroup>

        <ServiceGroup title="Mods" icon={<Layers className="h-5 w-5 text-slate-400" />}>
          <ModList
            mods={mods}
            serverName={serverConfig.name}
            onDownloadPreset={handleDownloadPreset}
            onOpenPresetModal={() => setIsPresetModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </ServiceGroup>

        <Bookmarks title="Bookmarks" items={bookmarks} />
      </main>

      <footer className="mt-8 border-t border-white/5 py-4 text-center text-[11px] text-slate-500">
        {online ? 'Live' : 'Last known'} data via {stats.querySource.replace('_', ' ')} · updated{' '}
        {stats.status === 'loading' ? '…' : new Date(stats.lastUpdated).toLocaleTimeString()} · layout inspired by{' '}
        <a href="https://github.com/gethomepage/homepage" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">
          homepage
        </a>
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
