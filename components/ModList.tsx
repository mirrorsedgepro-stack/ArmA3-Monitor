'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Box, 
  Shield, 
  Volume2, 
  Sliders, 
  Map, 
  Cpu, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { ArmaMod, CATEGORY_LABELS } from '@/data/defaultMods';

interface ModListProps {
  mods: ArmaMod[];
  serverName: string;
  onDownloadPreset: () => void;
  onOpenPresetModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function ModList({
  mods,
  serverName,
  onDownloadPreset,
  onOpenPresetModal,
  searchQuery,
  setSearchQuery,
}: ModListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'required' | 'optional'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCategoryBadge = (category: ArmaMod['category']) => {
    switch (category) {
      case 'core':
        return { label: 'CORE SYSTEM', style: 'bg-arma-card text-arma-amber border-arma-amber/30' };
      case 'equipment':
        return { label: 'FACTIONS & GEAR', style: 'bg-arma-card text-arma-khaki border-arma-khaki/30' };
      case 'realism':
        return { label: 'REALISM / MED', style: 'bg-arma-card text-red-400 border-red-500/30' };
      case 'audio':
        return { label: 'AUDIO & FX', style: 'bg-arma-card text-blue-400 border-blue-500/30' };
      case 'terrain':
        return { label: 'TERRAINS', style: 'bg-arma-card text-amber-500 border-amber-500/30' };
      default:
        return { label: 'QUALITY OF LIFE', style: 'bg-arma-card text-arma-textMuted border-arma-border' };
    }
  };

  const copyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const categories = [
    { id: 'all', label: 'ALL ADDONS' },
    { id: 'core', label: 'CORE' },
    { id: 'equipment', label: 'FACTIONS' },
    { id: 'realism', label: 'REALISM' },
    { id: 'audio', label: 'AUDIO' },
    { id: 'qol', label: 'QOL' },
  ];

  const filteredMods = useMemo(() => {
    return mods.filter((mod) => {
      if (selectedCategory !== 'all' && mod.category !== selectedCategory) return false;
      if (filterType === 'required' && !mod.required) return false;
      if (filterType === 'optional' && mod.required) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        mod.name.toLowerCase().includes(q) ||
        mod.id.includes(q) ||
        mod.author?.toLowerCase().includes(q) ||
        mod.description?.toLowerCase().includes(q) ||
        mod.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [mods, selectedCategory, filterType, searchQuery]);

  const totalRequired = mods.filter((m) => m.required).length;
  const totalOptional = mods.length - totalRequired;

  return (
    <section id="mods" className="space-y-4">
      {/* Manifest Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-arma-surface border border-arma-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-arma-card text-arma-amber border border-arma-border font-bold">
              [MANIFEST // WORKSHOP]
            </span>
            <span className="text-arma-textMuted">
              {totalRequired} Required &bull; {totalOptional} Optional
            </span>
          </div>
          <h2 className="text-xl font-bold text-arma-text font-mono tracking-tight uppercase mt-1">
            Arma 3 Addon Loadout ({mods.length} Mods)
          </h2>
          <p className="text-xs text-arma-textMuted leading-relaxed mt-0.5">
            Download the official launcher preset (.html) to load every required and optional mod in the verified execution order.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDownloadPreset}
            className="flex items-center gap-2 px-3.5 py-2 rounded arma-btn-primary text-xs font-mono font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT PRESET (.HTML)</span>
          </button>

          <button
            onClick={onOpenPresetModal}
            className="flex items-center gap-2 px-3 py-2 rounded arma-btn-secondary text-xs font-mono"
          >
            <Filter className="w-3.5 h-3.5 text-arma-khaki" />
            <span>IMPORT PRESET</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded transition-all shrink-0 font-bold ${
                selectedCategory === cat.id
                  ? 'bg-arma-amber text-black'
                  : 'bg-arma-surface text-arma-textMuted hover:text-arma-text border border-arma-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Search & Filter Toggles */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Required vs Optional Toggles */}
          <div className="flex items-center bg-arma-surface p-0.5 rounded border border-arma-border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-arma-card text-arma-text'
                  : 'text-arma-textMuted hover:text-arma-text'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterType('required')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                filterType === 'required'
                  ? 'bg-arma-card text-arma-text'
                  : 'text-arma-textMuted hover:text-arma-text'
              }`}
            >
              REQ
            </button>
            <button
              onClick={() => setFilterType('optional')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                filterType === 'optional'
                  ? 'bg-arma-card text-arma-text'
                  : 'text-arma-textMuted hover:text-arma-text'
              }`}
            >
              OPT
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-arma-textDim" />
            <input
              type="text"
              placeholder="SEARCH MANIFEST..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-6 py-1.5 rounded bg-arma-surface border border-arma-border text-arma-text placeholder-arma-textDim text-xs font-mono focus:outline-none focus:border-arma-amber transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-arma-textDim hover:text-arma-text font-mono"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Addon Cards Grid */}
      {filteredMods.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-lg bg-arma-surface border border-arma-border font-mono">
          <Layers className="w-8 h-8 text-arma-textDim mx-auto mb-2" />
          <p className="text-arma-text text-xs font-bold uppercase">NO ADDONS MATCHING &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterType('all');
            }}
            className="mt-2 text-xs text-arma-amber hover:underline font-bold"
          >
            RESET MANIFEST FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMods.map((mod) => {
            const badge = getCategoryBadge(mod.category);
            return (
              <div
                key={mod.id}
                className="group relative flex flex-col justify-between p-4 rounded-lg bg-arma-surface border border-arma-border hover:border-arma-borderHover transition-colors"
              >
                <div>
                  {/* Top Row: Category Badge + Status */}
                  <div className="flex items-center justify-between gap-2 mb-2 font-mono">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badge.style}`}>
                      {badge.label}
                    </span>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      {mod.required ? (
                        <span className="font-bold text-arma-amber">
                          [REQUIRED]
                        </span>
                      ) : (
                        <span className="text-arma-textDim font-bold">
                          [OPTIONAL]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Addon Title */}
                  <h3 className="text-sm font-bold text-arma-text group-hover:text-arma-amber transition-colors line-clamp-1 font-mono">
                    {mod.name}
                  </h3>

                  {/* Description */}
                  {mod.description && (
                    <p className="text-xs text-arma-textMuted mt-1.5 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  )}

                  {/* Tags */}
                  {mod.tags && mod.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5 font-mono">
                      {mod.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-arma-card text-arma-textDim border border-arma-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Workshop ID + Actions */}
                <div className="mt-3.5 pt-2.5 border-t border-arma-border/60 flex items-center justify-between text-xs font-mono text-arma-textMuted">
                  {/* Workshop ID Copy */}
                  <button
                    onClick={(e) => copyId(mod.id, e)}
                    className="hover:text-arma-amber transition-colors flex items-center gap-1"
                    title="Click to copy Steam Workshop ID"
                  >
                    {copiedId === mod.id ? (
                      <>
                        <Check className="w-3 h-3 text-arma-amber" />
                        <span className="text-arma-amber font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-arma-textDim" />
                        <span>ID: {mod.id}</span>
                      </>
                    )}
                  </button>

                  {/* Action Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`steam://url/CommunityFilePage/${mod.id}`}
                      className="p-1 rounded bg-arma-card hover:bg-arma-cardHover text-arma-textMuted hover:text-arma-text transition-colors"
                      title="Open in Steam Desktop Client"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </a>

                    <a
                      href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-arma-card hover:bg-arma-amber hover:text-black text-arma-text font-bold text-[11px] transition-colors"
                    >
                      <span>STEAM</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
