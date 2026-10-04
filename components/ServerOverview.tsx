'use client';

import React from 'react';
import { Users, Server, Activity, ShieldCheck, MapPin, Radio, Terminal } from 'lucide-react';
import { ArmaServerStats } from '@/data/defaultServer';

interface ServerOverviewProps {
  stats: ArmaServerStats;
  onOpenPlayerList: () => void;
  onOpenConfig: () => void;
  modCount: number;
}

export function ServerOverview({ stats, onOpenPlayerList, onOpenConfig, modCount }: ServerOverviewProps) {
  const isOnline = stats.status === 'online';
  const playerPercent = Math.min(100, Math.round((stats.players / (stats.maxPlayers || 32)) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Operation / Server Card */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-medium tracking-wide uppercase text-[11px] text-zinc-400">Operation</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
              <MapPin className="w-3 h-3 text-zinc-400" />
              {stats.map}
            </span>
          </div>
          <div className="text-sm font-semibold text-zinc-100 line-clamp-1">
            {stats.mission || "Antistasi Ultimate"}
          </div>
          <div className="text-xs text-zinc-400 mt-1 line-clamp-1">
            {stats.gameType || "Tactical Gameplay"}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Host</span>
          <span className="text-zinc-300">{stats.ip}:{stats.port}</span>
        </div>
      </div>

      {/* 2. Players Card */}
      <div 
        onClick={onOpenPlayerList}
        className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-medium tracking-wide uppercase text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              Players
            </span>
            <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
              Roster &rarr;
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">
              {stats.players}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              / {stats.maxPlayers} slots
            </span>
          </div>

          {/* Minimalist progress bar */}
          <div className="mt-2.5 w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(playerPercent, stats.players > 0 ? 4 : 0)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Active Squad</span>
          <span className="text-zinc-300 font-medium">
            {stats.playerList && stats.playerList.length > 0 ? stats.playerList[0].name : "Empty"}
          </span>
        </div>
      </div>

      {/* 3. Addons / Mods Card */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-medium tracking-wide uppercase text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              Mods Loaded
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Workshop
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">
              {modCount}
            </span>
            <span className="text-xs text-zinc-500">addons</span>
          </div>

          <div className="text-xs text-zinc-400 mt-1 line-clamp-1">
            RHS, ACE3, Antistasi Ultimate, Soundmods
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Preset Sync</span>
          <span className="text-emerald-400 font-medium">Synchronized</span>
        </div>
      </div>

      {/* 4. Telemetry / Engine Card */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-medium tracking-wide uppercase text-[11px] text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              Engine
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {stats.ping > 0 ? `${stats.ping}ms` : 'online'}
            </span>
          </div>

          <div className="text-sm font-semibold text-zinc-100 font-mono">
            Arma 3 v{stats.version}
          </div>

          <div className="text-xs text-zinc-400 mt-1">
            BattlEye {stats.battleye ? 'Protected' : 'Standard'} &bull; Query {stats.queryPort}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Status</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Healthy
          </span>
        </div>
      </div>
    </div>
  );
}
