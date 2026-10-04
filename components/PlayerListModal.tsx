'use client';

import React, { useState } from 'react';
import { X, Users, Search, Clock, Shield } from 'lucide-react';
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
    if (!seconds) return 'ACTIVE';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}H ${mins}M`;
    return `${mins}M`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div 
        className="w-full max-w-xl rounded-lg bg-arma-surface border border-arma-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-arma-border bg-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-amber">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-arma-text uppercase flex items-center gap-2">
                ACTIVE SQUAD ROSTER
                <span className="text-xs px-1.5 py-0.2 rounded bg-arma-card text-arma-amber border border-arma-border">
                  {players.length} OPERATORS
                </span>
              </h3>
              <p className="text-[11px] text-arma-textMuted truncate max-w-sm uppercase">{serverName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors"
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
              placeholder="FILTER CALLSIGN..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded bg-arma-card border border-arma-border text-arma-text placeholder-arma-textDim text-xs focus:outline-none focus:border-arma-amber uppercase"
            />
          </div>
        </div>

        {/* Roster List */}
        <div className="overflow-y-auto p-3 space-y-1 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-arma-textDim text-xs uppercase">
              NO OPERATORS MATCHING &quot;{filter}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((player, idx) => (
                <div
                  key={player.id || idx}
                  className="flex items-center justify-between p-2.5 rounded bg-arma-card border border-arma-border hover:border-arma-borderHover transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 text-center text-xs font-bold text-arma-amber">
                      [{String(idx + 1).padStart(2, '0')}]
                    </span>
                    <Shield className="w-3.5 h-3.5 text-arma-khaki" />
                    <div>
                      <div className="text-xs font-bold text-arma-text uppercase">
                        {player.name}
                      </div>
                      <div className="text-[10px] text-arma-textMuted">
                        INFANTRY RECON &bull; ALTIS AO
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-arma-textMuted">
                    {player.score > 0 && (
                      <span className="text-arma-khaki font-bold">{player.score} PTS</span>
                    )}
                    <span className="flex items-center gap-1">
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
        <div className="p-3 border-t border-arma-border bg-[#0e1116] flex items-center justify-between text-xs text-arma-textMuted">
          <span>STEAM A2S QUERY</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded arma-btn-secondary text-xs font-bold"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
