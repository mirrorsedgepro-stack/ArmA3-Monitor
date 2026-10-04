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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#101320] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0E101D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ga-mint/10 border border-ga-mint/20 flex items-center justify-center text-ga-mint">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Connected Squad Roster
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-ga-mint/10 text-ga-mint border border-ga-mint/20">
                  {players.length} Active
                </span>
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-sm">{serverName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="p-4 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search soldier or callsign..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-ga-mint/50"
            />
          </div>
        </div>

        {/* Roster List */}
        <div className="overflow-y-auto p-4 space-y-1.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">
              No players currently matching &quot;{filter}&quot;
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-mono text-zinc-500 font-semibold">
                      0{idx + 1}
                    </span>
                    <Shield className="w-4 h-4 text-ga-mint/80" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {player.name}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Infantry Operator &bull; Altis Campaign
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    {player.score > 0 && (
                      <span className="text-amber-400 font-medium">{player.score} pts</span>
                    )}
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {formatDuration(player.timePlayedSeconds)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0E101D] flex items-center justify-between text-xs text-zinc-400">
          <span>Synced directly via Steam A2S Player query</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg ga-btn-secondary text-xs"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
