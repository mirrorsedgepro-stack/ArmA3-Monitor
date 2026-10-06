'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Trophy, 
  Medal, 
  Users, 
  Search, 
  Clock, 
  Shield, 
  Radio, 
  Flame,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { ServerPlayer } from '@/data/defaultServer';

export interface PlayerRecord {
  name: string;
  sessions: number;
  totalSeconds: number;
  firstSeen: string;
  lastSeen: string;
  online: boolean;
}

interface TopPlayersProps {
  livePlayers?: ServerPlayer[];
  onOpenPlayerList?: () => void;
}

type SortCriteria = 'hours' | 'sessions' | 'online' | 'name';

export function TopPlayers({ livePlayers = [], onOpenPlayerList }: TopPlayersProps) {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortCriteria>('hours');
  const [trackingSince, setTrackingSince] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        if (data.available && Array.isArray(data.players)) {
          setPlayers(data.players);
          setTrackingSince(data.trackingSince);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch players list:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 30000);
    return () => clearInterval(interval);
  }, [fetchPlayers]);

  // Merge live players from A2S query with persistent roster
  const mergedPlayers = useMemo(() => {
    const list: PlayerRecord[] = players.map(p => ({ ...p }));
    const liveNames = new Set(livePlayers.map(lp => lp.name.toLowerCase()));

    // Update online flags from live A2S
    list.forEach(p => {
      if (liveNames.has(p.name.toLowerCase())) {
        p.online = true;
      }
    });

    // Add any connected player not yet in the session list
    livePlayers.forEach(lp => {
      const exists = list.some(p => p.name.toLowerCase() === lp.name.toLowerCase());
      if (!exists && lp.name) {
        list.push({
          name: lp.name,
          sessions: 1,
          totalSeconds: lp.timePlayedSeconds || 60,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          online: true,
        });
      }
    });

    return list;
  }, [players, livePlayers]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = mergedPlayers.filter((p) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return p.name.toLowerCase().includes(q);
    });

    result.sort((a, b) => {
      if (sortBy === 'online') {
        if (a.online === b.online) return b.totalSeconds - a.totalSeconds;
        return a.online ? -1 : 1;
      }
      if (sortBy === 'sessions') return b.sessions - a.sessions;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.totalSeconds - a.totalSeconds;
    });

    return result;
  }, [mergedPlayers, search, sortBy]);

  const onlineCount = useMemo(() => {
    return mergedPlayers.filter(p => p.online).length;
  }, [mergedPlayers]);

  const formatHours = (seconds: number) => {
    const hrs = seconds / 3600;
    if (hrs < 0.1) return '<0.1h';
    return `${hrs.toFixed(1)}h`;
  };

  const formatLastSeen = (isoStr: string, isOnline: boolean) => {
    if (isOnline) return 'Online Now';
    if (!isoStr) return 'Unknown';
    try {
      const d = new Date(isoStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 5) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getRank = (idx: number, hours: number) => {
    if (hours > 10) return 'Veteran';
    if (hours > 3) return 'Regular';
    if (idx === 0) return 'Lead';
    return 'Operator';
  };

  return (
    <section id="players" className="space-y-6 sm:space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-arma-border pb-4 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-arma-khaki font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-arma-red" />
            <span>Session records</span>
          </div>
          <h2 className="text-base sm:text-lg font-medium text-arma-text">
            Top players
          </h2>
          <p className="text-xs sm:text-sm text-arma-textMuted mt-1">
            Real session records derived directly from server connection logs.
            {trackingSince && (
              <span className="text-arma-textDim ml-1">
                (Recorded since {new Date(trackingSince).toLocaleDateString()})
              </span>
            )}
          </p>
        </div>

        {/* Live status badge & filter controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-md bg-black/20 ring-1 ring-white/5 text-arma-text flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${onlineCount > 0 ? 'bg-arma-green animate-pulse' : 'bg-gray-500'}`} />
            <span><strong>{onlineCount}</strong> ONLINE NOW</span>
          </span>

          <button
            onClick={fetchPlayers}
            className="p-1.5 sm:p-2 rounded-md bg-arma-card hover:bg-arma-cardHover border border-arma-border text-arma-textMuted hover:text-arma-text transition-colors"
            title="Refresh player list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-arma-textMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by player callsign..."
            className="w-full pl-9 pr-4 py-2 hp-card text-arma-text placeholder-arma-textDim focus:outline-none focus:border-arma-red text-xs"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-arma-textDim hidden sm:inline">SORT BY:</span>
          <div className="grid grid-cols-3 sm:flex gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSortBy('hours')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                sortBy === 'hours'
                  ? 'bg-arma-red text-white font-bold'
                  : 'bg-arma-surface hover:bg-arma-card border border-arma-border text-arma-textMuted'
              }`}
            >
              TIME PLAYED
            </button>
            <button
              onClick={() => setSortBy('sessions')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                sortBy === 'sessions'
                  ? 'bg-arma-red text-white font-bold'
                  : 'bg-arma-surface hover:bg-arma-card border border-arma-border text-arma-textMuted'
              }`}
            >
              SESSIONS
            </button>
            <button
              onClick={() => setSortBy('online')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                sortBy === 'online'
                  ? 'bg-arma-red text-white font-bold'
                  : 'bg-arma-surface hover:bg-arma-card border border-arma-border text-arma-textMuted'
              }`}
            >
              STATUS
            </button>
          </div>
        </div>
      </div>

      {/* Players Grid / Table */}
      {filteredPlayers.length === 0 ? (
        <div className="hp-card p-8 sm:p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-arma-textDim mx-auto" />
          <div className="text-sm sm:text-base font-bold text-arma-text uppercase">
            {search ? 'No Players Found' : 'No Player Records Yet'}
          </div>
          <p className="text-xs text-arma-textMuted max-w-md mx-auto">
            {search
              ? `No registered players matching "${search}".`
              : 'Player sessions will appear here as players connect to the dedicated server.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredPlayers.map((player, idx) => {
            const initials = player.name.slice(0, 2).toUpperCase();
            const rank = getRank(idx, player.totalSeconds / 3600);

            return (
              <div
                key={player.name}
                className={`p-4 sm:p-5 rounded-md bg-arma-surface border transition-all flex flex-col justify-between shadow-md ${
                  player.online
                    ? 'border-arma-green/60 ring-1 ring-arma-green/20'
                    : 'border-arma-border hover:border-arma-borderHover'
                }`}
              >
                <div>
                  {/* Top info row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm shrink-0 border ${
                        player.online
                          ? 'bg-arma-green/10 text-arma-green border-arma-green/40'
                          : 'bg-arma-card text-arma-textDim border-arma-border'
                      }`}>
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm sm:text-base text-arma-text truncate">
                            {player.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-arma-khaki font-semibold">
                          {rank}
                        </div>
                      </div>
                    </div>

                    {/* Online status badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                      player.online
                        ? 'bg-arma-green/15 text-arma-green border-arma-green/40'
                        : 'bg-arma-card text-arma-textDim border-arma-border'
                    }`}>
                      {player.online ? 'ONLINE NOW' : formatLastSeen(player.lastSeen, false)}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-arma-border/60 text-xs">
                    <div className="p-2 rounded bg-black/20 border border-arma-border/50">
                      <div className="text-[10px] text-arma-textDim flex items-center gap-1">
                        <Clock className="w-3 h-3 text-arma-khaki" />
                        TIME PLAYED
                      </div>
                      <div className="text-sm font-bold text-arma-text mt-0.5">
                        {formatHours(player.totalSeconds)}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-black/20 border border-arma-border/50">
                      <div className="text-[10px] text-arma-textDim flex items-center gap-1">
                        <Flame className="w-3 h-3 text-arma-red" />
                        SESSIONS
                      </div>
                      <div className="text-sm font-bold text-arma-text mt-0.5">
                        {player.sessions}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer timestamp */}
                <div className="mt-3 pt-2 text-[10px] text-arma-textDim flex items-center justify-between">
                  <span>First joined:</span>
                  <span>{player.firstSeen ? new Date(player.firstSeen).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
