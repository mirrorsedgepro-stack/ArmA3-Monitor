'use client';

import React, { useEffect, useState } from 'react';
import { Crosshair, Cpu, RefreshCw, Server, Settings, Timer, Users } from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';
import { formatNumber, formatUptime } from '@/lib/format';

interface ResourceProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  /** 0-100; omit for no bar. */
  percent?: number | null;
  barClass?: string;
}

/** homepage's "resources" widget: icon, value + label, thin usage bar. */
function Resource({ icon, value, label, percent, barClass = 'bg-slate-400' }: ResourceProps) {
  return (
    <div className="flex min-w-[7.5rem] items-center gap-2">
      <div className="text-slate-400">{icon}</div>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-baseline gap-1 text-xs">
          <span className="tabular-nums text-slate-200">{value}</span>
          <span className="text-slate-500">{label}</span>
        </div>
        <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-black/30">
          {percent != null && (
            <div className={`h-1 rounded-full ${barClass}`} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
          )}
        </div>
      </div>
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

interface InfoWidgetsProps {
  stats: ArmaServerStats;
  isLoading: boolean;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  onOpenConfig: () => void;
}

export function InfoWidgets({ stats, isLoading, autoRefresh, onToggleAutoRefresh, onRefresh, onOpenConfig }: InfoWidgetsProps) {
  const now = useClock();
  const online = stats.status === 'online';
  const max = stats.maxPlayers || 32;
  // serverFps is null once Antistasi's last sample is older than 90 s.
  const fps = online ? stats.serverFps ?? null : null;
  const uptime = online ? stats.uptimeSeconds ?? null : null;
  const hc = online ? stats.headlessClients : null;
  // "Name | 32-Player Dedicated" -> heading "Name", the rest as subtitle.
  const [title, ...rest] = stats.name.split('|').map((s) => s.trim());
  const subtitle = rest.join(' · ');

  const fpsBar = fps == null ? 'bg-slate-400' : fps >= 35 ? 'bg-emerald-500' : fps >= 20 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <header className="flex flex-col gap-4 border-b border-white/5 pb-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10 text-arma-red">
          <Crosshair className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-medium text-slate-200 sm:text-lg" title={stats.name}>{title}</h1>
          <p className="truncate text-xs text-slate-400">
            {[subtitle, `${stats.ip}:${stats.port}`, stats.map].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-6">
        <Resource
          icon={<Server className="h-4 w-4" />}
          value={stats.status === 'loading' ? '…' : online ? 'Online' : 'Offline'}
          label="status"
          percent={stats.status === 'loading' ? null : 100}
          barClass={online ? 'bg-emerald-500' : 'bg-red-500'}
        />
        {online && (
          <Resource
            icon={<Users className="h-4 w-4" />}
            value={`${stats.players}/${max}`}
            label="players"
            percent={(stats.players / max) * 100}
            barClass="bg-sky-500"
          />
        )}
        {fps != null && (
          <Resource
            icon={<Cpu className="h-4 w-4" />}
            value={formatNumber(fps, 1)}
            label="server fps"
            percent={(fps / 50) * 100}
            barClass={fpsBar}
          />
        )}
        {hc && (
          <Resource
            icon={<Cpu className="h-4 w-4" />}
            value={`${hc.active}/${hc.expected}`}
            label="HCs"
            percent={hc.expected ? (hc.active / hc.expected) * 100 : null}
            barClass={hc.active < hc.expected ? 'bg-amber-500' : 'bg-emerald-500'}
          />
        )}
        {uptime != null && <Resource icon={<Timer className="h-4 w-4" />} value={formatUptime(uptime)} label="uptime" />}

        <div className="hidden text-right sm:block" suppressHydrationWarning>
          <div className="text-xl font-light tabular-nums text-slate-200">
            {now ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500">
            {now ? `${now.toISOString().slice(11, 16)}Z · ${now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}` : ''}
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-end gap-1 sm:col-span-1">
          <button
            type="button"
            onClick={onToggleAutoRefresh}
            className={`rounded px-2 py-1.5 text-[10px] font-bold uppercase ${autoRefresh ? 'bg-emerald-500/15 text-emerald-400' : 'arma-btn-secondary'}`}
            title={autoRefresh ? 'Auto-refresh every 20 s (click to pause)' : 'Auto-refresh paused (click to resume)'}
          >
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded p-1.5 arma-btn-secondary disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button type="button" onClick={onOpenConfig} className="rounded p-1.5 arma-btn-secondary" title="Server settings">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
