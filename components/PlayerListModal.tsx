'use client';

import React, { useState } from 'react';
import { X, Users, Search, Clock, Shield } from 'lucide-react';
import { ServerPlayer } from '@/data/defaultServer';

interface PlayerListModalProps {
  mapName?: string;
  isOpen: boolean;
  onClose: () => void;
  players: ServerPlayer[];
  serverName: string;
}

export function PlayerListModal({ isOpen, onClose, players, serverName, mapName }: PlayerListModalProps) {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'ACTIVE';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}H ${mins}M`;
    return `${mins}M`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl rounded-md bg-slate-800 ring-1 ring-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-arma-border bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-red shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-arma-text uppercase flex items-center gap-2">
                ONLINE PLAYERS
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-arma-card text-arma-red border border-arma-border font-bold">
                  {players.length} ONLINE
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-arma-textMuted truncate uppercase">{serverName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="p-3 border-b border-arma-border bg-arma-surface">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-arma-textDim" />
            <input
              type="text"
              placeholder="SEARCH PLAYERS..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded bg-arma-card border border-arma-border text-arma-text placeholder-arma-textDim text-xs focus:outline-none focus:border-arma-red uppercase"
            />
          </div>
        </div>

        {/* Roster List */}
        <div className="overflow-y-auto p-3 space-y-1 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-arma-textDim text-xs uppercase">
              NO PLAYERS MATCHING &quot;{filter}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="flex items-center justify-between p-2.5 rounded bg-arma-card border border-arma-border hover:border-arma-borderHover transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 text-center text-xs font-bold text-arma-red shrink-0">
                      [{String(idx + 1).padStart(2, '0')}]
                    </span>
                    <Shield className="w-3.5 h-3.5 text-arma-khaki shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-arma-text uppercase truncate">
                        {player.name}
                      </div>
                      <div className="text-[10px] text-arma-textMuted">
                        Playing on {mapName || 'the server'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-arma-textMuted shrink-0 ml-2">
                    {player.score > 0 && (
                      <span className="text-arma-khaki font-bold">{player.score} PTS</span>
                    )}
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-arma-textDim" />
                      {formatDuration(player.timePlayedSeconds)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-arma-border bg-black/20 flex items-center justify-between text-xs text-arma-textMuted">
          <span className="text-[11px]">STEAM A2S PROTOCOL</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded arma-btn-secondary text-xs font-bold"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
