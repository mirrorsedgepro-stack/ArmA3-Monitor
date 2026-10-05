'use client';

import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Users, 
  Search, 
  Clock, 
  Target, 
  Shield, 
  Heart, 
  Crosshair, 
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  Radio,
  Flame,
  UserCheck
} from 'lucide-react';
import { ServerPlayer } from '@/data/defaultServer';
import { LeaderboardPlayer, DEFAULT_LEADERBOARD_PLAYERS } from '@/data/defaultLeaderboard';

interface TopPlayersProps {
  livePlayers?: ServerPlayer[];
  onOpenPlayerList?: () => void;
}

type SortCriteria = 'score' | 'hours' | 'missions' | 'online';

export function TopPlayers({ livePlayers = [], onOpenPlayerList }: TopPlayersProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortCriteria>('score');

  // Merge live players from A2S query with persistent leaderboard veterans
  const mergedPlayers = useMemo(() => {
    const list: LeaderboardPlayer[] = [...DEFAULT_LEADERBOARD_PLAYERS];

    // Check which veterans are currently online from live query
    livePlayers.forEach((lp) => {
      const existingIdx = list.findIndex(
        (p) => p.name.toLowerCase() === lp.name.toLowerCase()
      );

      if (existingIdx !== -1) {
        list[existingIdx] = {
          ...list[existingIdx],
          isOnline: true,
          lastSeen: 'Online Now',
          score: Math.max(list[existingIdx].score, lp.score),
          playtimeHours: Math.round((list[existingIdx].playtimeHours + (lp.timePlayedSeconds / 3600)) * 10) / 10,
        };
      } else {
        // Live player not in veteran roster - add them dynamically as an active combatant
        list.push({
          id: `live-${lp.id || lp.name}`,
          name: lp.name,
          rank: 'Operator',
          role: 'Active Field Combatant',
          score: lp.score || 150,
          playtimeHours: Math.round((lp.timePlayedSeconds / 3600) * 10) / 10 || 1.2,
          missionsCompleted: 1,
          favoriteWeapon: 'Service Rifle',
          isOnline: true,
          avatarInitials: lp.name.slice(0, 2).toUpperCase(),
          badge: 'ACTIVE SESSION',
          lastSeen: 'Online Now',
        });
      }
    });

    return list;
  }, [livePlayers]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = mergedPlayers.filter((p) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q) ||
        p.favoriteWeapon.toLowerCase().includes(q)
      );
    });

    result.sort((a, b) => {
      if (sortBy === 'online') {
        if (a.isOnline === b.isOnline) return b.score - a.score;
        return a.isOnline ? -1 : 1;
      }
      if (sortBy === 'hours') return b.playtimeHours - a.playtimeHours;
      if (sortBy === 'missions') return b.missionsCompleted - a.missionsCompleted;
      return b.score - a.score;
    });

    return result;
  }, [mergedPlayers, search, sortBy]);

  // Podium (Top 3)
  const topThree = useMemo(() => {
    const sorted = [...mergedPlayers].sort((a, b) => b.score - a.score);
    return {
      first: sorted[0] || null,
      second: sorted[1] || null,
      third: sorted[2] || null,
    };
  }, [mergedPlayers]);

  const activeOnlineCount = mergedPlayers.filter((p) => p.isOnline).length;

  return (
    <section id="players" className="scroll-mt-24 space-y-6 sm:space-y-8 font-mono">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-arma-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-arma-red/15 text-arma-red border border-arma-red/30 tracking-wider">
              SQUADRON MERIT &amp; COMBAT TELEMETRY
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-arma-card text-arma-khaki border border-arma-border">
              ANTISTASI VETERANS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-arma-text uppercase tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 shrink-0" />
            <span>TOP OPERATORS &amp; LEADERBOARD</span>
          </h2>
          <p className="text-xs sm:text-sm text-arma-textMuted mt-1">
            Campaign combat ratings, accumulated flight/field hours, and active combat personnel.
          </p>
        </div>

        {/* Quick Online Player Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPlayerList}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-arma-card hover:bg-arma-surface border border-arma-border text-xs text-arma-textMuted hover:text-arma-text transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-arma-red" />
            <span>CONNECTED ROSTER:</span>
            <strong className="text-arma-green">{activeOnlineCount} ONLINE</strong>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
        {/* 2nd Place: Silver */}
        {topThree.second && (
          <div className="order-2 md:order-1 rounded-xl bg-arma-surface/90 border border-slate-400/40 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-md group hover:border-slate-300 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-300/15 border border-slate-300/40 flex items-center justify-center text-slate-300 font-black text-xs">
                    #2
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    SILVER OPERATOR
                  </span>
                </div>
                <Medal className="w-5 h-5 text-slate-300" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#141820] border border-slate-400/40 flex items-center justify-center text-sm font-black text-slate-200">
                  {topThree.second.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-arma-text uppercase truncate">
                      {topThree.second.name}
                    </h3>
                    {topThree.second.isOnline && (
                      <span className="w-2 h-2 rounded-full bg-arma-green animate-pulse" title="Online" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{topThree.second.role}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2 rounded bg-arma-card border border-arma-border/60">
                  <div className="text-[10px] text-arma-textDim uppercase">SCORE</div>
                  <div className="text-sm font-black text-arma-text">{topThree.second.score.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-arma-card border border-arma-border/60">
                  <div className="text-[10px] text-arma-textDim uppercase">HOURS</div>
                  <div className="text-sm font-black text-arma-khaki">{topThree.second.playtimeHours}h</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-arma-border/60 text-[10px] text-arma-textMuted flex items-center justify-between">
              <span className="truncate">{topThree.second.favoriteWeapon}</span>
              <span className="text-slate-300 font-bold">{topThree.second.missionsCompleted} Ops</span>
            </div>
          </div>
        )}

        {/* 1st Place: Gold Champion Spotlight */}
        {topThree.first && (
          <div className="order-1 md:order-2 rounded-xl bg-gradient-to-b from-amber-500/10 via-arma-surface to-arma-surface border-2 border-amber-500/60 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-xl group hover:border-amber-400 transition-all md:-translate-y-1">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 font-black text-sm shadow-sm">
                    #1
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    CAMPAIGN CHAMPION
                  </span>
                </div>
                <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-lg bg-[#141820] border-2 border-amber-500/60 flex items-center justify-center text-base font-black text-amber-400 shadow-inner">
                  {topThree.first.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-arma-text uppercase truncate">
                      {topThree.first.name}
                    </h3>
                    {topThree.first.isOnline && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-arma-green/20 text-arma-green border border-arma-green/40 font-bold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-amber-400/90 font-bold truncate">{topThree.first.role}</div>
                  <div className="text-[10px] text-arma-textMuted uppercase mt-0.5">{topThree.first.badge}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="p-2 rounded bg-arma-card border border-amber-500/30">
                  <div className="text-[9px] text-arma-textDim uppercase">SCORE</div>
                  <div className="text-sm font-black text-amber-400">{topThree.first.score.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-arma-card border border-amber-500/30">
                  <div className="text-[9px] text-arma-textDim uppercase">HOURS</div>
                  <div className="text-sm font-black text-arma-khaki">{topThree.first.playtimeHours}h</div>
                </div>
                <div className="p-2 rounded bg-arma-card border border-amber-500/30">
                  <div className="text-[9px] text-arma-textDim uppercase">OPS</div>
                  <div className="text-sm font-black text-arma-text">{topThree.first.missionsCompleted}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/30 text-[11px] text-arma-textMuted flex items-center justify-between">
              <span className="truncate text-arma-text font-semibold">{topThree.first.favoriteWeapon}</span>
              <span className="text-amber-400 font-bold">{topThree.first.kills} Kills</span>
            </div>
          </div>
        )}

        {/* 3rd Place: Bronze */}
        {topThree.third && (
          <div className="order-3 md:order-3 rounded-xl bg-arma-surface/90 border border-amber-700/40 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-md group hover:border-amber-600 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-700/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-700/15 border border-amber-700/40 flex items-center justify-center text-amber-600 font-black text-xs">
                    #3
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    BRONZE OPERATOR
                  </span>
                </div>
                <Medal className="w-5 h-5 text-amber-600" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#141820] border border-amber-700/40 flex items-center justify-center text-sm font-black text-amber-600">
                  {topThree.third.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-arma-text uppercase truncate">
                      {topThree.third.name}
                    </h3>
                    {topThree.third.isOnline && (
                      <span className="w-2 h-2 rounded-full bg-arma-green animate-pulse" title="Online" />
                    )}
                  </div>
                  <div className="text-[11px] text-amber-600/90 truncate">{topThree.third.role}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2 rounded bg-arma-card border border-arma-border/60">
                  <div className="text-[10px] text-arma-textDim uppercase">SCORE</div>
                  <div className="text-sm font-black text-arma-text">{topThree.third.score.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-arma-card border border-arma-border/60">
                  <div className="text-[10px] text-arma-textDim uppercase">HOURS</div>
                  <div className="text-sm font-black text-arma-khaki">{topThree.third.playtimeHours}h</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-arma-border/60 text-[10px] text-arma-textMuted flex items-center justify-between">
              <span className="truncate">{topThree.third.favoriteWeapon}</span>
              <span className="text-amber-600 font-bold">{topThree.third.missionsCompleted} Ops</span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table Controls & Search */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-arma-surface border border-arma-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-arma-textDim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH OPERATOR, ROLE, OR WEAPON..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-arma-card border border-arma-border text-arma-text placeholder-arma-textDim text-xs focus:outline-none focus:border-arma-red uppercase"
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-arma-textDim uppercase mr-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              SORT:
            </span>
            {(
              [
                { id: 'score', label: 'SCORE' },
                { id: 'hours', label: 'HOURS' },
                { id: 'missions', label: 'MISSIONS' },
                { id: 'online', label: 'ONLINE' },
              ] as Array<{ id: SortCriteria; label: string }>
            ).map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all ${
                  sortBy === btn.id
                    ? 'bg-arma-red text-white shadow-sm'
                    : 'bg-arma-card text-arma-textMuted hover:text-arma-text hover:bg-arma-cardHover border border-arma-border'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Full Roster List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-arma-border text-arma-textDim uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">RANK</th>
                <th className="py-2.5 px-3">OPERATOR &amp; ROLE</th>
                <th className="py-2.5 px-3 text-right">SCORE</th>
                <th className="py-2.5 px-3 text-right">PLAYTIME</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">OPS COMPLETED</th>
                <th className="py-2.5 px-3 hidden md:table-cell">FAVORITE WEAPON</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arma-border/50">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-arma-textDim">
                    NO OPERATORS MATCHING &quot;{search}&quot;
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player, idx) => {
                  const isTopThree = idx < 3 && !search;
                  return (
                    <tr
                      key={player.id}
                      className="hover:bg-arma-card/50 transition-colors group"
                    >
                      {/* Rank Index */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`font-black ${
                            idx === 0
                              ? 'text-amber-400'
                              : idx === 1
                              ? 'text-slate-300'
                              : idx === 2
                              ? 'text-amber-600'
                              : 'text-arma-textMuted'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                      </td>

                      {/* Operator Details */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-arma-card border border-arma-border flex items-center justify-center text-[11px] font-bold text-arma-text shrink-0">
                            {player.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-arma-text group-hover:text-arma-red transition-colors uppercase">
                                {player.name}
                              </span>
                              {player.badge && (
                                <span className="hidden lg:inline text-[9px] px-1.5 py-0.2 rounded bg-arma-card text-arma-khaki border border-arma-border">
                                  {player.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-arma-textMuted truncate">
                              {player.rank} &bull; {player.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-3 text-right font-black text-arma-text whitespace-nowrap">
                        {player.score.toLocaleString()}
                      </td>

                      {/* Playtime */}
                      <td className="py-3 px-3 text-right text-arma-khaki font-bold whitespace-nowrap">
                        {player.playtimeHours}h
                      </td>

                      {/* Missions */}
                      <td className="py-3 px-3 text-right text-arma-textMuted hidden sm:table-cell whitespace-nowrap">
                        {player.missionsCompleted} Ops
                      </td>

                      {/* Primary Gear */}
                      <td className="py-3 px-3 text-arma-textDim text-[11px] hidden md:table-cell truncate max-w-[180px]">
                        {player.favoriteWeapon}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {player.isOnline ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-arma-green/15 text-arma-green border border-arma-green/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
                            ONLINE
                          </span>
                        ) : (
                          <span className="text-[10px] text-arma-textDim">
                            {player.lastSeen || 'Offline'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
