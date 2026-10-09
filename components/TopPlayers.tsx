'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ServerPlayer } from '@/data/defaultServer';
import type { PlayerRecord, PlayersResponse } from '@/app/api/players/route';
import { StatBlock, StatRow } from '@/components/dash/StatBlock';
import { formatSince, formatUptime } from '@/lib/format';

interface TopPlayersProps {
  livePlayers?: ServerPlayer[];
  /** Latest Antistasi rank per player, from promotion events. */
  ranks?: Record<string, string>;
  port?: number;
}

type SortCriteria = 'hours' | 'kills' | 'sessions' | 'deaths' | 'recent';

const SORTS: { id: SortCriteria; label: string }[] = [
  { id: 'hours', label: 'Time played' },
  { id: 'kills', label: 'Kills' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'deaths', label: 'Deaths' },
  { id: 'recent', label: 'Last seen' },
];

/**
 * Player leaderboard built only from sessions recorded in the server log.
 * Renders nothing until the bridge has returned at least one player.
 */
export function TopPlayers({ livePlayers = [], ranks = {}, port }: TopPlayersProps) {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortCriteria>('hours');

  const fetchPlayers = useCallback(async () => {
    try {
      const url = port ? `/api/players?port=${port}` : '/api/players';
      const res = await fetch(url);
      if (!res.ok) return;
      const data: PlayersResponse = await res.json();
      if (data.available && Array.isArray(data.players)) setPlayers(data.players);
    } catch {
      // Keep the last good list.
    }
  }, [port]);

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 30000);
    return () => clearInterval(interval);
  }, [fetchPlayers]);

  const hasDeaths = players.some((p) => typeof p.deaths === 'number');
  const hasKills = players.some((p) => typeof p.kills === 'number');
  const live = useMemo(() => new Set(livePlayers.map((p) => p.name.toLowerCase())), [livePlayers]);

  const shown = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = players
      .map((p) => ({ ...p, online: p.online || live.has(p.name.toLowerCase()) }))
      .filter((p) => !q || p.name.toLowerCase().includes(q));
    list.sort((a, b) => {
      if (sortBy === 'sessions') return b.sessions - a.sessions;
      if (sortBy === 'deaths') return (b.deaths ?? 0) - (a.deaths ?? 0);
      if (sortBy === 'kills') return (b.kills ?? 0) - (a.kills ?? 0);
      if (sortBy === 'recent') return Number(b.online) - Number(a.online) || b.lastSeen.localeCompare(a.lastSeen);
      return b.totalSeconds - a.totalSeconds;
    });
    return list;
  }, [players, live, search, sortBy]);

  if (players.length === 0) return null;

  return (
    <div id="players" className="space-y-2 scroll-mt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-medium text-slate-200">Players</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {players.length > 6 && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a player"
                className="w-full rounded bg-white/5 py-1.5 pl-8 pr-2 text-base text-slate-200 ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none sm:w-44 sm:text-xs"
              />
            </div>
          )}
          <div className="flex gap-1 overflow-x-auto">
            {SORTS.filter((s) => (s.id !== 'deaths' || hasDeaths) && (s.id !== 'kills' || hasKills)).map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`whitespace-nowrap rounded px-2 py-1 text-[11px] ${sortBy === s.id ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, idx) => {
          const rank = ranks[p.name];
          return (
            <li key={p.name} className="hp-card list-none">
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <span className="w-5 shrink-0 text-center text-xs tabular-nums text-slate-500">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-200">{p.name}</div>
                  {rank && <div className="text-xs text-slate-400">{rank}</div>}
                </div>
                {p.online ? (
                  <span className="flex shrink-0 items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    ONLINE
                  </span>
                ) : (
                  <span className="shrink-0 text-[11px] text-slate-500" title={new Date(p.lastSeen).toLocaleString()}>
                    {formatSince(p.lastSeen)}
                  </span>
                )}
              </div>
              <StatRow>
                <StatBlock label="Played" value={formatUptime(p.totalSeconds)} />
                {typeof p.kills === 'number' && <StatBlock label="Kills" value={p.kills} />}
                {typeof p.deaths === 'number' && <StatBlock label="Deaths" value={p.deaths} />}
                <StatBlock label="Sessions" value={p.sessions} />
              </StatRow>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No players match “{search}”.</p>}
    </div>
  );
}
