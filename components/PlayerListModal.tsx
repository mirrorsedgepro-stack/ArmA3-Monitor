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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Active Players
                <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                  {players.length}
                </span>
              </h3>
              <p className="text-xs text-zinc-500 truncate max-w-sm">{serverName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search player name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Roster List */}
        <div className="overflow-y-auto p-3 space-y-1 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              No players found
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center text-xs font-mono text-zinc-500">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-zinc-200">
                      {player.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                    {player.score > 0 && (
                      <span className="text-zinc-400">{player.score} pts</span>
                    )}
                    <span>{formatDuration(player.timePlayedSeconds)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-500">
          <span>Synced via Steam A2S query</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
