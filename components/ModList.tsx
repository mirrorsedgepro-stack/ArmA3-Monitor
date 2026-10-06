'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Filter, 
  HardDrive, 
  CheckCircle2, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ArmaMod } from '@/data/defaultMods';

interface ModListProps {
  mods: ArmaMod[];
  serverName: string;
  onDownloadPreset: () => void;
  onOpenPresetModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

interface CategoryFolder {
  id: ArmaMod['category'];
  title: string;
  description: string;
}

const CATEGORY_FOLDERS: CategoryFolder[] = [
  { id: 'core', title: '1. CORE FRAMEWORK & MISSIONS', description: 'Foundation frameworks, Antistasi Ultimate, ACE3, ACE No Medical, and Zeus Enhanced' },
  { id: 'equipment', title: '2. RHS FACTIONS & MILITARY GEAR', description: 'RHSAFRF, RHSUSAF, RHSGREF, and RHSSAF military hardware' },
  { id: 'realism', title: '3. MOVEMENT, ANIMATIONS & GUNPLAY', description: 'Enhanced Movement, Alternative Running, WBK animations, hit reactions, and recoil mechanics' },
  { id: 'audio', title: '4. AUDIO & SOUNDSCAPES', description: 'JSRS Soundmod 2025, Enhanced Soundscape Plus, and Project SFX series' },
  { id: 'visuals', title: '5. VISUALS, PARTICLES & BLOOD', description: 'Blastcore Murr, Advance Aero Effects, Improved Craters, D.I.R.T, and A3 Thermal' },
  { id: 'qol', title: '6. HUD, LOGISTICS & QUALITY OF LIFE', description: 'Better Inventory, CH View Distance, Enhanced GPS, Dynamic Camo, and Simplex Tools' },
];

export function ModList({
  mods,
  serverName,
  onDownloadPreset,
  onOpenPresetModal,
  searchQuery,
  setSearchQuery,
}: ModListProps) {
  // Folders expansion state
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    core: true,
    equipment: true,
    realism: true,
    audio: false,
    visuals: false,
    qol: false,
  });

  const [filterType, setFilterType] = useState<'all' | 'required' | 'optional'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedModId, setExpandedModId] = useState<string | null>(null);

  // When search query changes, auto-expand folders that contain matches
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const updated: Record<string, boolean> = { ...openFolders };
      CATEGORY_FOLDERS.forEach((f) => {
        const matches = mods.some((m) => 
          m.category === f.id && (
            m.name.toLowerCase().includes(q) ||
            m.id.includes(q) ||
            m.author?.toLowerCase().includes(q) ||
            m.tags?.some((t) => t.toLowerCase().includes(q))
          )
        );
        if (matches) {
          updated[f.id] = true;
        }
      });
      setOpenFolders(updated);
    }
  }, [searchQuery, mods]);

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    CATEGORY_FOLDERS.forEach((f) => {
      allOpen[f.id] = true;
    });
    setOpenFolders(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    CATEGORY_FOLDERS.forEach((f) => {
      allClosed[f.id] = false;
    });
    setOpenFolders(allClosed);
  };

  const copyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredMods = useMemo(() => {
    return mods.filter((mod) => {
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
  }, [mods, filterType, searchQuery]);

  // Group mods by category
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
    <section id="mods" className="space-y-4 sm:space-y-8 scroll-mt-20 sm:scroll-mt-24">
      {/* Manifest Master Control Bar */}
      <div id="manifest-header" className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-8 hp-card shadow-lg">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="px-2.5 py-0.5 sm:py-1 rounded-md bg-arma-card text-arma-red border border-arma-border font-bold text-[11px] sm:text-xs">
              Addons
            </span>
            <span className="text-arma-textMuted font-bold text-[11px] sm:text-xs">
              {totalRequired} REQUIRED &bull; {totalOptional} OPTIONAL &bull; {mods.length} TOTAL
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-medium text-arma-text">
            Server Addons ({filteredMods.length} Visible)
          </h2>
          <p className="text-xs sm:text-sm text-arma-textMuted leading-relaxed max-w-2xl">
            Collapsible category directories. Tap folders to review details or export the full Bohemia Launcher preset (.html).
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md arma-btn-secondary text-xs hover:bg-arma-cardHover"
            title="Expand all category folders"
          >
            <Maximize2 className="w-3.5 h-3.5 text-arma-red" />
            <span>EXPAND</span>
          </button>

          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md arma-btn-secondary text-xs hover:bg-arma-cardHover"
            title="Collapse all category folders"
          >
            <Minimize2 className="w-3.5 h-3.5 text-arma-textDim" />
            <span>COLLAPSE</span>
          </button>

          <button
            onClick={onDownloadPreset}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md arma-btn-primary font-bold shadow-arma-red text-xs transition-all "
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span>EXPORT PRESET</span>
          </button>

          <button
            onClick={onOpenPresetModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md arma-btn-secondary text-xs hover:bg-arma-cardHover"
          >
            <Filter className="w-3.5 h-3.5 text-arma-khaki" />
            <span>IMPORT</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div id="manifest-search" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 text-xs">
        {/* Status Filters - Mobile touch scrollable */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs font-bold transition-all border whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-arma-red text-white border-arma-red shadow-sm'
                : 'bg-arma-surface text-arma-textMuted border-arma-border hover:text-arma-text hover:bg-arma-card'
            }`}
          >
            ALL ({mods.length})
          </button>
          <button
            onClick={() => setFilterType('required')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs font-bold transition-all border whitespace-nowrap ${
              filterType === 'required'
                ? 'bg-arma-red text-white border-arma-red shadow-sm'
                : 'bg-arma-surface text-arma-textMuted border-arma-border hover:text-arma-text hover:bg-arma-card'
            }`}
          >
            REQUIRED ({totalRequired})
          </button>
          <button
            onClick={() => setFilterType('optional')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs font-bold transition-all border whitespace-nowrap ${
              filterType === 'optional'
                ? 'bg-arma-red text-white border-arma-red shadow-sm'
                : 'bg-arma-surface text-arma-textMuted border-arma-border hover:text-arma-text hover:bg-arma-card'
            }`}
          >
            OPTIONAL ({totalOptional})
          </button>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-arma-textDim" />
          <input
            type="text"
            placeholder="SEARCH ADDON NAME, ID, TAG..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-8 py-2.5 sm:py-3 hp-card text-arma-text placeholder-arma-textDim text-xs sm:text-sm focus:outline-none focus:border-arma-red transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-arma-textDim hover:text-arma-text"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Category Folders */}
      <div className="space-y-3 sm:space-y-4">
        {CATEGORY_FOLDERS.map((folder) => {
          const folderMods = groupedMods[folder.id] || [];
          if (folderMods.length === 0 && searchQuery) return null;
          if (folderMods.length === 0 && !searchQuery) return null;

          const isOpen = openFolders[folder.id] || false;
          const reqCount = folderMods.filter((m) => m.required).length;

          return (
            <div
              key={folder.id}
              className="hp-card overflow-hidden transition-all shadow-md"
            >
              {/* Folder Header (Click to Toggle) */}
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full p-3.5 sm:p-5 bg-arma-surface hover:bg-arma-card flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="text-arma-red shrink-0 p-1.5 sm:p-2 rounded-md bg-black/20 ring-1 ring-white/5">
                    {isOpen ? <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-arma-red" /> : <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-arma-khaki" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                      <span className="text-xs sm:text-base font-bold text-arma-text uppercase tracking-wide truncate">
                        {folder.title}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded bg-arma-card text-arma-red border border-arma-border shrink-0">
                        {folderMods.length} MODS
                      </span>
                      {reqCount > 0 && (
                        <span className="text-[10px] sm:text-xs text-arma-khaki hidden sm:inline">
                          ({reqCount} REQ)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-arma-textMuted truncate mt-0.5 sm:mt-1">
                      {folder.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-arma-textDim text-xs shrink-0 ml-2 sm:ml-4">
                  <span className="text-xs font-bold hidden md:inline">
                    {isOpen ? 'COLLAPSE' : 'EXPAND'}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-arma-red" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Folder Contents */}
              {isOpen && (
                <div className="border-t border-arma-border bg-black/20">
                  {/* Desktop Table View (>= md) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-arma-border bg-black/20 text-[11px] text-arma-textDim uppercase tracking-wider">
                          <th className="py-3 px-5 w-16 text-center">TYPE</th>
                          <th className="py-3 px-5">ADDON NAME &amp; DETAILS</th>
                          <th className="py-3 px-5 w-32">EST. SIZE</th>
                          <th className="py-3 px-5 w-40">STEAM WORKSHOP ID</th>
                          <th className="py-3 px-5 w-32 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-arma-border/60">
                        {folderMods.map((mod) => {
                          const isExpanded = expandedModId === mod.id;
                          return (
                            <React.Fragment key={mod.id}>
                              <tr 
                                className={`hover:bg-arma-surface transition-colors cursor-pointer ${
                                  isExpanded ? 'bg-arma-card' : ''
                                }`}
                                onClick={() => setExpandedModId(isExpanded ? null : mod.id)}
                              >
                                {/* Type: REQ vs OPT */}
                                <td className="py-3.5 px-5 text-center">
                                  {mod.required ? (
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-arma-redDim text-arma-red border border-arma-red/40">
                                      REQ
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-arma-textDim">
                                      OPT
                                    </span>
                                  )}
                                </td>

                                {/* Mod Name & Author */}
                                <td className="py-3.5 px-5">
                                  <div className="font-bold text-arma-text hover:text-arma-red transition-colors flex items-center gap-2 text-sm">
                                    <span>{mod.name}</span>
                                    {mod.tags && mod.tags.length > 0 && (
                                      <span className="text-[10px] text-arma-textDim font-normal hidden lg:inline bg-arma-card px-1.5 py-0.5 rounded border border-arma-border">
                                        #{mod.tags[0]}
                                      </span>
                                    )}
                                  </div>
                                  {mod.author && (
                                    <div className="text-[11px] text-arma-textDim mt-0.5">
                                      Author: {mod.author} {mod.version ? `(v${mod.version})` : ''}
                                    </div>
                                  )}
                                </td>

                                {/* Size */}
                                <td className="py-3.5 px-5 text-arma-textMuted text-xs">
                                  {mod.size || '—'}
                                </td>

                                {/* Workshop ID */}
                                <td className="py-3.5 px-5">
                                  <button
                                    onClick={(e) => copyId(mod.id, e)}
                                    className="text-arma-khaki hover:text-arma-red flex items-center gap-1.5 text-xs"
                                    title="Click to copy Steam ID"
                                  >
                                    <span>{mod.id}</span>
                                    {copiedId === mod.id ? (
                                      <Check className="w-3.5 h-3.5 text-arma-green" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-arma-textDim opacity-60" />
                                    )}
                                  </button>
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="inline-flex items-center gap-2">
                                    <a
                                      href={`steam://url/CommunityFilePage/${mod.id}`}
                                      className="p-1.5 rounded-md bg-arma-card hover:bg-arma-surface text-arma-textMuted hover:text-arma-text border border-arma-border transition-colors"
                                      title="Open directly in Steam App"
                                    >
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </a>
                                    <a
                                      href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 rounded-md bg-arma-card hover:bg-arma-red hover:text-white text-arma-text font-bold text-xs inline-flex items-center gap-1 border border-arma-border transition-colors"
                                    >
                                      <span>WEB</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </td>
                              </tr>

                              {/* Description Row */}
                              {isExpanded && mod.description && (
                                <tr className="bg-black/20 text-xs">
                                  <td colSpan={5} className="py-4 px-8 text-arma-textMuted border-b border-arma-border/80">
                                    <div className="flex items-start gap-3">
                                      <Info className="w-4 h-4 text-arma-red shrink-0 mt-0.5" />
                                      <div className="space-y-2">
                                        <p className="leading-relaxed text-arma-text text-xs sm:text-sm">{mod.description}</p>
                                        {mod.tags && (
                                          <div className="flex flex-wrap gap-1.5 pt-1">
                                            {mod.tags.map((t, idx) => (
                                              <span key={idx} className="text-[10px] text-arma-textDim bg-arma-card px-2 py-0.5 rounded border border-arma-border">
                                                #{t}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Optimized Card View (< md) - Clean, touch friendly */}
                  <div className="md:hidden divide-y divide-arma-border/60">
                    {folderMods.map((mod) => {
                      const isExpanded = expandedModId === mod.id;
                      return (
                        <div 
                          key={mod.id} 
                          className="p-3.5 space-y-2.5"
                          onClick={() => setExpandedModId(isExpanded ? null : mod.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {mod.required ? (
                                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-arma-redDim text-arma-red border border-arma-red/40 shrink-0">
                                  REQ
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold text-arma-textDim px-1.5 py-0.5 rounded bg-arma-card border border-arma-border shrink-0">
                                  OPT
                                </span>
                              )}
                              <span className="font-bold text-arma-text text-xs leading-snug">
                                {mod.name}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`steam://url/CommunityFilePage/${mod.id}`}
                                className="p-1.5 rounded bg-arma-card text-arma-textMuted hover:text-arma-text border border-arma-border"
                                title="Open in Steam App"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 rounded bg-arma-card hover:bg-arma-red hover:text-white text-arma-text font-bold text-[10px] inline-flex items-center gap-1 border border-arma-border"
                              >
                                <span>WEB</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-arma-textMuted">
                            <button
                              onClick={(e) => copyId(mod.id, e)}
                              className="text-arma-khaki hover:text-arma-red flex items-center gap-1"
                            >
                              <span>ID: {mod.id}</span>
                              {copiedId === mod.id ? <Check className="w-3 h-3 text-arma-green" /> : <Copy className="w-3 h-3 opacity-60" />}
                            </button>
                            <span>{mod.size || '—'}</span>
                          </div>

                          {isExpanded && mod.description && (
                            <div className="pt-2 text-[11px] text-arma-textMuted border-t border-arma-border/50">
                              <p className="leading-relaxed">{mod.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
