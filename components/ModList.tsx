'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Download, 
  Layers, 
  Copy, 
  Check, 
  Filter, 
  Grid, 
  List, 
  HardDrive, 
  CheckCircle2, 
  HelpCircle,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { ArmaMod, CATEGORY_LABELS } from '@/data/defaultMods';

interface ModListProps {
  mods: ArmaMod[];
  serverName: string;
  onDownloadPreset: () => void;
  onOpenPresetModal: () => void;
}

export function ModList({ mods, serverName, onDownloadPreset, onOpenPresetModal }: ModListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [requiredOnly, setRequiredOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const list: Array<{ id: string; label: string; count: number }> = [
      { id: 'all', label: 'All Mods', count: mods.length },
    ];
    Object.entries(CATEGORY_LABELS).forEach(([key, val]) => {
      const count = mods.filter((m) => m.category === key).length;
      if (count > 0) {
        list.push({ id: key, label: val.label, count });
      }
    });
    return list;
  }, [mods]);

  const filteredMods = useMemo(() => {
    return mods.filter((mod) => {
      const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
      const matchesRequired = !requiredOnly || mod.required;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mod.name.toLowerCase().includes(q) ||
        mod.id.includes(q) ||
        mod.author?.toLowerCase().includes(q) ||
        mod.tags?.some((t) => t.toLowerCase().includes(q)) ||
        mod.description?.toLowerCase().includes(q);

      return matchesCategory && matchesRequired && matchesSearch;
    });
  }, [mods, selectedCategory, requiredOnly, searchQuery]);

  const copyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const totalRequired = mods.filter((m) => m.required).length;
  const totalOptional = mods.length - totalRequired;

  return (
    <section className="space-y-6">
      {/* Section Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-tactical-900 border border-tactical-700 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Repository Sync
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {totalRequired} Required &bull; {totalOptional} Optional
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Loaded Server Mods &amp; Addons ({mods.length})
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Subscribe to all mods directly via Steam Workshop, or download the official Launcher preset for 1-click automatic synchronization.
          </p>
        </div>

        {/* Action Buttons: Download Preset / Import */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onDownloadPreset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-tactical-glow transition-all"
            title="Download .html preset for Arma 3 Launcher"
          >
            <Download className="w-4 h-4" />
            <span>Download Preset (.html)</span>
          </button>

          <button
            onClick={onOpenPresetModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-tactical-800 hover:bg-tactical-750 text-zinc-200 border border-tactical-600 font-mono text-xs font-semibold hover:text-white transition-colors"
            title="Upload or paste custom preset HTML"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Manage / Import</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-tactical-glow'
                  : 'bg-tactical-900 text-zinc-400 hover:text-zinc-200 border border-tactical-700 hover:border-tactical-600'
              }`}
            >
              {cat.label} <span className="opacity-70 font-normal">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Search, View Modes & Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by mod name, Steam ID, tag, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-tactical-900 border border-tactical-700 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Required Filter Toggle */}
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer select-none bg-tactical-900 border border-tactical-700 px-3 py-2 rounded-lg hover:border-tactical-600">
              <input
                type="checkbox"
                checked={requiredOnly}
                onChange={(e) => setRequiredOnly(e.target.checked)}
                className="rounded border-tactical-700 text-emerald-500 focus:ring-emerald-400 h-4 w-4 bg-tactical-950"
              />
              <span>Required Only</span>
            </label>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-tactical-900 border border-tactical-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-tactical-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-tactical-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mods Display */}
      {filteredMods.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl bg-tactical-900 border border-tactical-800">
          <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-300 font-mono text-sm">No mods matching current search criteria</p>
          <p className="text-zinc-500 text-xs mt-1">Try clearing your filters or search keywords</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setRequiredOnly(false);
            }}
            className="mt-4 px-3 py-1.5 text-xs font-mono rounded bg-tactical-800 text-emerald-400 border border-tactical-700 hover:bg-tactical-750"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMods.map((mod) => {
            const catBadge = CATEGORY_LABELS[mod.category] || CATEGORY_LABELS.core;
            return (
              <div
                key={mod.id}
                className="group relative flex flex-col justify-between p-5 rounded-xl bg-tactical-900 border border-tactical-700 hover:border-emerald-500/40 hover:bg-tactical-850/80 transition-all shadow-md"
              >
                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${catBadge.color}`}>
                      {catBadge.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {mod.required ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          REQUIRED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          OPTIONAL
                        </span>
                      )}

                      {mod.size && (
                        <span className="text-[10px] font-mono text-zinc-400 bg-tactical-950 px-1.5 py-0.5 rounded border border-tactical-800 flex items-center gap-1">
                          <HardDrive className="w-2.5 h-2.5 text-zinc-500" />
                          {mod.size}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mod Title */}
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {mod.name}
                  </h4>

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
                          className="text-[10px] font-mono text-zinc-400 bg-tactical-950/80 px-1.5 py-0.5 rounded border border-tactical-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer details & Actions */}
                <div className="mt-4 pt-3 border-t border-tactical-800 flex items-center justify-between text-xs">
                  {/* Workshop ID Copy */}
                  <button
                    onClick={(e) => copyId(mod.id, e)}
                    className="flex items-center gap-1.5 font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
                    title="Copy Steam Workshop ID"
                  >
                    {copiedId === mod.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied ID</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>ID: {mod.id}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Direct Steam Launch protocol */}
                    <a
                      href={`steam://url/CommunityFilePage/${mod.id}`}
                      className="p-1.5 rounded bg-tactical-800 hover:bg-tactical-700 text-zinc-300 hover:text-emerald-400 transition-colors"
                      title="Open in Steam Client"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    {/* Workshop Browser Link */}
                    <a
                      href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-tactical-800 hover:bg-emerald-600 hover:text-black text-zinc-200 font-mono text-[11px] font-semibold transition-all"
                    >
                      <span>Workshop</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-xl border border-tactical-700 bg-tactical-900 shadow-md">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-tactical-700 bg-tactical-950 text-zinc-400 uppercase text-[11px]">
                <th className="py-3 px-4">Mod Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Est. Size</th>
                <th className="py-3 px-4">Workshop ID</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tactical-800 text-zinc-300">
              {filteredMods.map((mod) => {
                const catBadge = CATEGORY_LABELS[mod.category] || CATEGORY_LABELS.core;
                return (
                  <tr key={mod.id} className="hover:bg-tactical-850/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-sans text-sm">{mod.name}</div>
                      {mod.author && <div className="text-[11px] text-zinc-500 font-mono">By {mod.author}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {mod.required ? (
                        <span className="text-emerald-400 font-bold">REQUIRED</span>
                      ) : (
                        <span className="text-zinc-500">OPTIONAL</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {mod.size || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => copyId(mod.id, e)}
                        className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                      >
                        <span>{mod.id}</span>
                        {copiedId === mod.id && <Check className="w-3 h-3 text-emerald-400" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`steam://url/CommunityFilePage/${mod.id}`}
                          className="px-2 py-1 rounded bg-tactical-800 hover:bg-tactical-700 text-zinc-300 text-[11px]"
                          title="Open in Steam App"
                        >
                          Steam
                        </a>
                        <a
                          href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-tactical-800 hover:bg-emerald-600 hover:text-black text-zinc-200 text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Web</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
