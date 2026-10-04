'use client';

import React, { useState } from 'react';
import { X, Users, Search, Clock, Award, Shield } from 'lucide-react';
import { ServerPlayer } from '@/data/defaultServer';

interface PlayerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: ServerPlayer[];
  serverName: string;
}

export function PlayerListModal({ isOpen, onClose, players, serverName }: PlayerListModalProps) {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'Active';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-xl bg-tactical-900 border border-tactical-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-tactical-700 bg-tactical-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Active Tactical Roster
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-tactical-800 text-emerald-400 border border-tactical-700">
                  {players.length} Operators
                </span>
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-md">{serverName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="p-4 border-b border-tactical-800 bg-tactical-900/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search active soldier or callsign..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs font-mono">
              No players matching &quot;{filter}&quot;
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-tactical-950/60 border border-tactical-800 hover:border-emerald-500/30 hover:bg-tactical-850/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-mono text-zinc-500">
                      #{idx + 1}
                    </span>
                    <Shield className="w-4 h-4 text-emerald-400/70" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-200 font-mono">
                        {player.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                        <span>Squad Role: Inf / Recon</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    {player.score > 0 && (
                      <div className="flex items-center gap-1 text-amber-400" title="Combat Score">
                        <Award className="w-3.5 h-3.5" />
                        <span>{player.score}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-zinc-400" title="Time in Mission">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDuration(player.timePlayedSeconds)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-tactical-800 bg-tactical-950 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>Synced via Steam A2S Player query</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-tactical-800 hover:bg-tactical-700 text-zinc-200 transition-colors"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
