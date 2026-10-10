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
import { ActivitySection, MapSection } from '@/components/dash/ActivitySection';
import { EventFeed } from '@/components/EventFeed';
import { TrainingPanel } from '@/components/TrainingPanel';
import type { CampaignEvent, EventsResponse } from '@/app/api/events/route';
import { DEFAULT_MODS, ArmaMod } from '@/data/defaultMods';
import { INITIAL_SERVER_STATS, SERVERS_LIST, ArmaServerStats, ServerDefinition, DOWNLOADS } from '@/data/defaultServer';
import { generateArma3PresetHtml } from '@/lib/presetGenerator';
import { formatAge, formatBool, formatNumber, formatUptime, has } from '@/lib/format';
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
  Radio,
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
  const [events, setEvents] = useState<CampaignEvent[]>([]);

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

  useEffect(() => {
    const load = async () => {
      try {
        const url = serverConfig.port ? `/api/events?limit=300&port=${serverConfig.port}` : '/api/events?limit=300';
        const res = await fetch(url);
        if (!res.ok) return;
        const data: EventsResponse = await res.json();
        if (data.available) setEvents(data.events);
      } catch {
        // Keep the last good feed.
      }
    };
    load();
    if (!autoRefresh) return;
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, serverConfig.port]);

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
  const loaded = stats.status !== 'loading';
  const maxPlayers = stats.maxPlayers || 32;
  const fps = online ? stats.serverFps ?? null : null;
  const hc = online ? stats.headlessClients ?? null : null;
  const cfg = stats.serverConfig;
  const perf = stats.performance ?? null;
  const perfStale = !!perf && perf.ageSeconds > STALE_SAMPLE_SECONDS;
  const address = `${stats.ip}:${stats.port}`;
  const uptime = online && has(stats.uptimeSeconds) ? stats.uptimeSeconds : null;

  const fpsTone = fps == null ? 'default' : fps >= 35 ? 'good' : fps >= 20 ? 'warn' : 'bad';
  const hcTone = !hc ? 'default' : hc.active >= hc.expected ? 'good' : hc.active > 0 ? 'warn' : 'bad';
  const iconClass = 'h-7 w-7';

  // Latest Antistasi rank per player (events are newest first).
  const ranks: Record<string, string> = {};
  for (const e of events) {
    if (e.type === 'promotion' && e.player && e.rank && !ranks[e.player]) ranks[e.player] = e.rank;
  }

  // Bridge config facts first, then what the Steam query tags report.
  const difficulty = cfg?.difficulty ?? stats.difficulty ?? null;
  const signatures = has(cfg?.verifySignatures)
    ? cfg!.verifySignatures! > 0 ? `v${cfg!.verifySignatures}` : 'Off'
    : has(stats.signaturesVerified) ? formatBool(stats.signaturesVerified) : null;

  const hostBlocks = [
    has(difficulty) && <StatBlock key="d" label="Difficulty" value={difficulty} />,
    has(stats.battleye) && <StatBlock key="b" label="BattlEye" value={formatBool(stats.battleye)} />,
    has(signatures) && <StatBlock key="s" label="Signatures" value={signatures} />,
    has(cfg?.voiceEnabled) && <StatBlock key="v" label="Voice" value={formatBool(cfg!.voiceEnabled)} />,
    has(cfg?.persistent) && <StatBlock key="p" label="Persistent" value={formatBool(cfg!.persistent, 'Yes', 'No')} />,
  ].filter(Boolean);

  const bookmarks: Bookmark[] = [
    { abbr: 'A3', name: 'Arma 3 Launcher', description: 'steam://run/107410', href: 'steam://run/107410' },
    { abbr: 'AU', name: 'Antistasi Ultimate', description: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3020755032' },
    { abbr: 'GH', name: 'Antistasi Ultimate source', description: 'github.com', href: 'https://github.com/SilenceIsFatto/A3-Antistasi-Ultimate' },
    { abbr: 'AC', name: 'ACE3 wiki', description: 'ace3.acemod.org', href: 'https://ace3.acemod.org/wiki/' },
    { abbr: 'SV', name: 'Server setup (ARM64)', description: 'github.com', href: 'https://github.com/mirrorsedgepro-stack/ArmA3-Ultimate-Antistasi-Arm64' },
    ...(stats.discordUrl ? [{ abbr: 'DC', name: 'Discord', description: 'Community', href: stats.discordUrl }] : []),
    ...(stats.teamspeakUrl ? [{ abbr: 'TS', name: 'TeamSpeak', description: 'Voice', href: stats.teamspeakUrl }] : []),
  ];

  const serverDescription = [stats.map, stats.version && `v${stats.version}`, address].filter(has).join(' · ');

  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
        <InfoWidgets
          stats={stats}
          isLoading={isLoading}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
          onRefresh={fetchServerStats}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
          <ServiceGroup id="overview" title="Server" columns="grid-cols-1">
            <ServiceCard
              icon={<Crosshair className={`${iconClass} text-arma-red`} />}
              name={stats.mission || 'Antistasi Ultimate'}
              description={serverDescription}
              status={<StatusDot status={stats.status} ping={stats.ping} />}
              onClick={online && stats.playerList?.length ? () => setIsPlayerModalOpen(true) : undefined}
              title={online && stats.playerList?.length ? "Show who's online" : undefined}
            >
              {online && (
                <StatRow>
                  <StatBlock label="Players" value={`${stats.players}/${maxPlayers}`} />
                  {fps != null && (
                    <StatBlock
                      label="FPS"
                      value={formatNumber(fps, 1)}
                      tone={fpsTone}
                      title={perf ? `Sampled ${formatAge(perf.ageSeconds)}` : undefined}
                    />
                  )}
                  {hc && <StatBlock label="HCs" value={`${hc.active}/${hc.expected}`} tone={hcTone} />}
                  {uptime != null && <StatBlock label="Uptime" value={formatUptime(uptime)} />}
                </StatRow>
              )}
            </ServiceCard>

            {(hostBlocks.length > 0 || has(stats.platform)) && (
              <ServiceCard
                icon={<HardDrive className={iconClass} />}
                name="Host"
                description={[stats.platform, stats.location].filter(has).join(' · ')}
              >
                {hostBlocks.length > 0 && <StatRow>{hostBlocks}</StatRow>}
              </ServiceCard>
            )}
          </ServiceGroup>

          <ServiceGroup id="join" title="Join" columns="grid-cols-1 sm:grid-cols-2">
            <ServiceCard
              icon={<Play className={`${iconClass} text-arma-red`} />}
              name="Launch & Connect"
              description="Step-by-step join guide"
              onClick={() => setIsConnectModalOpen(true)}
            >
              {online && (
                <StatRow>
                  {has(stats.passwordProtected) && (
                    <StatBlock label="Password" value={stats.passwordProtected ? 'Required' : 'None'} />
                  )}
                  <StatBlock label="Slots free" value={Math.max(0, maxPlayers - stats.players)} />
                </StatRow>
              )}
            </ServiceCard>

            <ServiceCard
              icon={copied ? <Check className={`${iconClass} text-emerald-400`} /> : <Copy className={iconClass} />}
              name={copied ? 'Copied!' : 'Copy address'}
              description={address}
              onClick={copyAddress}
              title="Copy IP:port for Direct Connect"
            />

            <ServiceCard
              icon={<Download className={iconClass} />}
              name="Mod preset"
              description={`${mods.length} mods · Launcher → Mods → Preset → Import`}
              onClick={handleDownloadPreset}
              title="Download the Arma 3 Launcher preset (.html)"
            />

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
              <ServiceCard
                icon={<Mic className={iconClass} />}
                name="TeamSpeak"
                description={stats.teamspeakAddress ? `${stats.teamspeakAddress} · TFAR voice` : 'Voice comms'}
                href={stats.teamspeakUrl}
                title="Open in TeamSpeak 3"
              />
            )}
            {stats.teamspeakUrl && (
              <ServiceCard
                icon={<Download className={iconClass} />}
                name="TeamSpeak 3 client"
                description={`${DOWNLOADS.ts3Version} for Windows · needed for TFAR (not TS5/TS6)`}
                href={DOWNLOADS.ts3Win64}
                title="Download TeamSpeak 3 (64-bit) from teamspeak.com"
              />
            )}
            {stats.teamspeakUrl && (
              <ServiceCard
                icon={<Radio className={iconClass} />}
                name="TFAR radio plugin"
                description="Double-click to install into TeamSpeak 3"
                href={DOWNLOADS.tfarPlugin}
                title="Download task_force_radio.ts3_plugin"
              />
            )}
          </ServiceGroup>
        </div>

        {perf && (
          <ServiceGroup id="campaign" title="Campaign" columns="grid-cols-1 lg:grid-cols-2">
            <ServiceCard
              icon={<Flag className={iconClass} />}
              name="Rebel faction"
              description={`Sampled ${formatAge(perf.ageSeconds)}${perfStale ? ' · last values while players were online' : ''}`}
            >
              <StatRow>
                <StatBlock label="War level" value={perf.warLevel} />
                <StatBlock label="HR" value={perf.hr} />
                <StatBlock label="Money" value={`€${formatNumber(perf.factionCash)}`} />
                <StatBlock label="Occ. aggro" value={perf.occAggro} />
                <StatBlock label="Inv. aggro" value={perf.invAggro} />
              </StatRow>
            </ServiceCard>
            <ServiceCard icon={<Swords className={iconClass} />} name="World" description="Simulation load on the server">
              <StatRow>
                <StatBlock label="Units" value={perf.allUnits} />
                <StatBlock label="Dead" value={perf.deadUnits} />
                <StatBlock label="Vehicles" value={perf.allVehicles} />
                <StatBlock label="Clients" value={perf.connectedClientsInclHCs} title="Including headless clients" />
              </StatRow>
            </ServiceCard>
          </ServiceGroup>
        )}

        <TrainingPanel autoRefresh={autoRefresh} />

        <MapSection autoRefresh={autoRefresh} port={serverConfig.port} />

        <ActivitySection>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-3">
              <PlayerHistoryGraph currentPlayers={online ? stats.players : null} maxPlayers={maxPlayers} serverName={stats.name} port={serverConfig.port} />
              <TopPlayers livePlayers={stats.playerList || []} ranks={ranks} port={serverConfig.port} />
            </div>
            <div className="lg:col-span-2">
              <EventFeed events={events} />
            </div>
          </div>
        </ActivitySection>

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

      {loaded && (
        <footer className="mt-8 border-t border-white/5 px-4 py-4 text-center text-[11px] text-slate-500">
          {online ? 'Live' : 'Server not answering'} · updated {new Date(stats.lastUpdated).toLocaleTimeString()} · layout
          inspired by{' '}
          <a href="https://github.com/gethomepage/homepage" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">
            homepage
          </a>
        </footer>
      )}

      {/* Modals */}
      <PlayerListModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        players={stats.playerList || []}
        serverName={serverConfig.name}
        mapName={stats.map}
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
