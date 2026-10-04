'use client';

import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Filter, 
  Layers, 
  Box, 
  Shield, 
  Volume2, 
  Sliders, 
  Map, 
  Cpu, 
  ArrowUpRight 
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

  const getCategoryIcon = (category: ArmaMod['category']) => {
    switch (category) {
      case 'core': return <Box className="w-4 h-4 text-emerald-400" />;
      case 'equipment': return <Shield className="w-4 h-4 text-sky-400" />;
      case 'terrain': return <Map className="w-4 h-4 text-amber-400" />;
      case 'realism': return <Sliders className="w-4 h-4 text-rose-400" />;
      case 'audio': return <Volume2 className="w-4 h-4 text-purple-400" />;
      case 'server': return <Cpu className="w-4 h-4 text-zinc-400" />;
      default: return <Layers className="w-4 h-4 text-zinc-400" />;
    }
  };

  const copyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Group definitions in Homepage layout style
  const groupsOrder: Array<{ id: ArmaMod['category']; title: string }> = [
    { id: 'core', title: 'Core Frameworks & Gamemode' },
    { id: 'equipment', title: 'Factions, Weapons & Equipment' },
    { id: 'realism', title: 'Realism, Ballistics & Medical' },
    { id: 'audio', title: 'Audio, Acoustics & SFX' },
    { id: 'qol', title: 'Quality of Life & Interface' },
    { id: 'terrain', title: 'Terrains & Maps' },
    { id: 'server', title: 'Server Utilities & Administration' },
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

  // Group the filtered mods
  const groupedMods = useMemo(() => {
    const map: Record<string, ArmaMod[]> = {};
    for (const mod of filteredMods) {
      if (!map[mod.category]) {
        map[mod.category] = [];
      }
      map[mod.category].push(mod);
    }
    return map;
  }, [filteredMods]);

  const totalRequired = mods.filter((m) => m.required).length;
  const totalOptional = mods.length - totalRequired;

  return (
    <div className="space-y-8">
      {/* Sub-header / Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100">
            Loaded Addons
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            ({filteredMods.length} of {mods.length})
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="inline-flex rounded-lg bg-zinc-900/80 p-0.5 border border-zinc-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({mods.length})
            </button>
            <button
              onClick={() => setFilterType('required')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'required'
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Required ({totalRequired})
            </button>
            <button
              onClick={() => setFilterType('optional')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'optional'
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Optional ({totalOptional})
            </button>
          </div>

          <button
            onClick={onOpenPresetModal}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 transition-colors"
          >
            Import / Manage
          </button>
        </div>
      </div>

      {/* Homepage-style Grouped Services / Cards */}
      {filteredMods.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80">
          <p className="text-zinc-300 text-sm font-medium">No mods found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs text-zinc-400 hover:text-zinc-200 underline"
          >
            Reset search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupsOrder.map((group) => {
            const groupList = groupedMods[group.id];
            if (!groupList || groupList.length === 0) return null;

            return (
              <div key={group.id} className="space-y-3">
                {/* Group Heading (Homepage style: subtle uppercase with line) */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {group.title}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-600">
                    ({groupList.length})
                  </span>
                  <div className="flex-1 h-px bg-zinc-800/60 ml-2" />
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupList.map((mod) => (
                    <div
                      key={mod.id}
                      className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/90 transition-all shadow-sm"
                    >
                      <div>
                        {/* Top: Icon + Title + Status */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800/70 border border-zinc-750 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-zinc-800 transition-colors">
                            {getCategoryIcon(mod.category)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                                {mod.name}
                              </h4>
                              {mod.required ? (
                                <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  required
                                </span>
                              ) : (
                                <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded text-zinc-500">
                                  optional
                                </span>
                              )}
                            </div>

                            {mod.description && (
                              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                                {mod.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer: Size, Workshop ID, and Steam Link */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => copyId(mod.id, e)}
                            className="font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                            title="Copy Steam Workshop ID"
                          >
                            <span>ID: {mod.id}</span>
                            {copiedId === mod.id && (
                              <Check className="w-3 h-3 text-emerald-400" />
                            )}
                          </button>
                          {mod.size && (
                            <>
                              <span>&bull;</span>
                              <span>{mod.size}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`steam://url/CommunityFilePage/${mod.id}`}
                            className="text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="Open in Steam Client"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-0.5 transition-colors"
                            title="Open Steam Workshop in Browser"
                          >
                            <span>Workshop</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
