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
  Filter,
  Sparkles,
  CheckCircle2
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

  const getCategoryStyles = (category: ArmaMod['category']) => {
    switch (category) {
      case 'core':
        return {
          icon: <Box className="w-5 h-5 text-ga-mint" />,
          badge: 'bg-ga-mint/10 text-ga-mint border-ga-mint/20',
          iconBg: 'bg-ga-mint/10 border-ga-mint/20',
        };
      case 'equipment':
        return {
          icon: <Shield className="w-5 h-5 text-ga-blue" />,
          badge: 'bg-ga-blue/10 text-ga-blue border-ga-blue/20',
          iconBg: 'bg-ga-blue/10 border-ga-blue/20',
        };
      case 'realism':
        return {
          icon: <Sliders className="w-5 h-5 text-rose-400" />,
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          iconBg: 'bg-rose-500/10 border-rose-500/20',
        };
      case 'audio':
        return {
          icon: <Volume2 className="w-5 h-5 text-purple-400" />,
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          iconBg: 'bg-purple-500/10 border-purple-500/20',
        };
      case 'terrain':
        return {
          icon: <Map className="w-5 h-5 text-amber-400" />,
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          iconBg: 'bg-amber-500/10 border-amber-500/20',
        };
      default:
        return {
          icon: <Layers className="w-5 h-5 text-zinc-400" />,
          badge: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
          iconBg: 'bg-zinc-500/10 border-zinc-500/20',
        };
    }
  };

  const copyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const categories = [
    { id: 'all', label: 'All Addons' },
    { id: 'core', label: 'Core System' },
    { id: 'equipment', label: 'Factions & Weapons' },
    { id: 'realism', label: 'Realism & Medical' },
    { id: 'audio', label: 'Audio & Acoustics' },
    { id: 'qol', label: 'Quality of Life' },
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
    <section id="mods" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-ga-surface to-ga-card border border-white/[0.08] shadow-ga-card">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-ga-mint/10 text-ga-mint border border-ga-mint/20">
              Mod Repository
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {totalRequired} Required &bull; {totalOptional} Optional
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Loaded Server Addons &amp; Modifications ({mods.length})
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            All addons verified and configured for active multiplayer operations. Download the official launcher preset for instant 1-click subscription and order loading.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onDownloadPreset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg ga-btn-primary text-xs font-semibold shadow-ga-mint"
          >
            <Download className="w-4 h-4" />
            <span>Download Preset (.html)</span>
          </button>

          <button
            onClick={onOpenPresetModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg ga-btn-secondary text-xs"
          >
            <Filter className="w-4 h-4 text-ga-blue" />
            <span>Manage / Import</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Search & Filter Toggles */}
        <div className="flex items-center gap-2.5">
          {/* Required vs Optional Toggles */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-lg border border-white/[0.08] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-white/[0.1] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('required')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'required'
                  ? 'bg-white/[0.1] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Required
            </button>
            <button
              onClick={() => setFilterType('optional')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'optional'
                  ? 'bg-white/[0.1] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Optional
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search mods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-ga-mint/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mod Cards Grid (GameAnalytics Product Grid Aesthetic) */}
      {filteredMods.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-ga-surface/50 border border-white/[0.08]">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-300 text-sm font-medium">No addons found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterType('all');
            }}
            className="mt-3 text-xs text-ga-mint hover:underline font-medium"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMods.map((mod) => {
            const styles = getCategoryStyles(mod.category);
            return (
              <div
                key={mod.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#131627]/80 hover:bg-[#181C32]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-200 shadow-ga-card"
              >
                <div>
                  {/* Top Row: Icon + Category Badge + Required Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${styles.iconBg} transition-transform group-hover:scale-105`}>
                      {styles.icon}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${styles.badge}`}>
                        {CATEGORY_LABELS[mod.category]?.label || mod.category}
                      </span>

                      {mod.required ? (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-ga-mint/10 text-ga-mint border border-ga-mint/20">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mod Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-ga-mint transition-colors line-clamp-1">
                    {mod.name}
                  </h3>

                  {/* Description */}
                  {mod.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  )}

                  {/* Tags */}
                  {mod.tags && mod.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {mod.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-400 border border-white/[0.06]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                  {/* Workshop ID Copy */}
                  <button
                    onClick={(e) => copyId(mod.id, e)}
                    className="font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                    title="Click to copy Steam Workshop ID"
                  >
                    {copiedId === mod.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-ga-mint" />
                        <span className="text-ga-mint font-medium">Copied ID</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>ID: {mod.id}</span>
                      </>
                    )}
                  </button>

                  {/* Action Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`steam://url/CommunityFilePage/${mod.id}`}
                      className="p-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors"
                      title="Open in Steam Desktop Client"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-ga-mint hover:text-zinc-950 text-zinc-300 font-medium text-[11px] transition-all"
                    >
                      <span>Workshop</span>
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
