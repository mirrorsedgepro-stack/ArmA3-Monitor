'use client';

import React, { useState, useMemo } from 'react';
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
  { id: 'core', title: 'CORE FRAMEWORKS & CAMPAIGN', description: 'Foundation frameworks and Antistasi Ultimate game mechanics' },
  { id: 'equipment', title: 'FACTIONS, WEAPONS & VEHICLES (RHS)', description: 'United States, Russian, Serbian, and GREF military hardware' },
  { id: 'realism', title: 'REALISM, BALLISTICS & MEDICAL (ACE3)', description: 'Advanced combat environment, wound simulation, D.I.R.T, and hit kinetics' },
  { id: 'audio', title: 'AUDIO, ACOUSTICS & SFX', description: 'JSRS Soundmod, Soundscape reverberation, footsteps, and supersonic cracks' },
  { id: 'qol', title: 'QUALITY OF LIFE & INTERFACE', description: 'Enhanced movement mantling, better inventory, minimap GPS, and animations' },
  { id: 'server', title: 'SERVER & MISSION ADMINISTRATION', description: 'Zeus Enhanced (ZEN) and mission execution extensions' },
  { id: 'terrain', title: 'TERRAINS & MAPS', description: 'Terrain textures and topographic environments' },
];

export function ModList({
  mods,
  serverName,
  onDownloadPreset,
  onOpenPresetModal,
  searchQuery,
  setSearchQuery,
}: ModListProps) {
  // Folders expansion state (Core & Equipment open by default)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    core: true,
    equipment: true,
    realism: false,
    audio: false,
    qol: false,
    server: false,
    terrain: false,
  });

  const [filterType, setFilterType] = useState<'all' | 'required' | 'optional'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedModId, setExpandedModId] = useState<string | null>(null);

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
    <section id="mods" className="space-y-4">
      {/* Manifest Master Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-arma-surface border border-arma-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-arma-card text-arma-amber border border-arma-border font-bold">
              [ADDON FOLDERS // ARCHIVE]
            </span>
            <span className="text-arma-textMuted font-bold">
              {totalRequired} REQUIRED &bull; {totalOptional} OPTIONAL &bull; 30 TOTAL
            </span>
          </div>
          <h2 className="text-xl font-bold text-arma-text font-mono tracking-tight uppercase mt-1">
            Server Addon Folders ({filteredMods.length} Visible)
          </h2>
          <p className="text-xs text-arma-textMuted leading-relaxed mt-0.5">
            Organized into collapsible category directories. Expand folders to review addon descriptions or export the complete launcher preset (.html).
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded arma-btn-secondary text-[11px]"
            title="Expand all category folders"
          >
            <Maximize2 className="w-3 h-3 text-arma-amber" />
            <span>EXPAND ALL</span>
          </button>

          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded arma-btn-secondary text-[11px]"
            title="Collapse all category folders"
          >
            <Minimize2 className="w-3 h-3 text-arma-textDim" />
            <span>COLLAPSE</span>
          </button>

          <button
            onClick={onDownloadPreset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded arma-btn-primary font-bold shadow-arma-amber"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT PRESET</span>
          </button>

          <button
            onClick={onOpenPresetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded arma-btn-secondary"
          >
            <Filter className="w-3.5 h-3.5 text-arma-khaki" />
            <span>IMPORT</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 font-mono text-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-arma-surface p-0.5 rounded border border-arma-border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-arma-amber text-black'
                  : 'text-arma-textMuted hover:text-arma-text'
              }`}
            >
              ALL ({mods.length})
            </button>
            <button
              onClick={() => setFilterType('required')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                filterType === 'required'
                  ? 'bg-arma-amber text-black'
                  : 'text-arma-textMuted hover:text-arma-text'
              }`}
            >
              REQUIRED ({totalRequired})
            </button>
            <button
              onClick={() => setFilterType('optional')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                filterType === 'optional'
                  ? 'bg-arma-amber text-black'
                  : 'text-arma-textMuted hover:text-arma-text'
              }`}
            >
              OPTIONAL ({totalOptional})
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-arma-textDim" />
          <input
            type="text"
            placeholder="SEARCH ADDON NAME, ID, TAG..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto-expand all folders when actively searching
              if (e.target.value.trim().length > 0) {
                expandAll();
              }
            }}
            className="w-full pl-8 pr-7 py-1.5 rounded bg-arma-surface border border-arma-border text-arma-text placeholder-arma-textDim text-xs focus:outline-none focus:border-arma-amber"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-arma-textDim hover:text-arma-text"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Category Folders */}
      <div className="space-y-2.5">
        {CATEGORY_FOLDERS.map((folder) => {
          const folderMods = groupedMods[folder.id] || [];
          if (folderMods.length === 0 && searchQuery) return null;
          if (folderMods.length === 0 && !searchQuery) return null;

          const isOpen = openFolders[folder.id] || false;
          const reqCount = folderMods.filter((m) => m.required).length;

          return (
            <div
              key={folder.id}
              className="rounded-lg bg-arma-surface border border-arma-border overflow-hidden transition-all"
            >
              {/* Folder Header (Click to Toggle) */}
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full p-3.5 bg-arma-surface hover:bg-arma-card flex items-center justify-between transition-colors text-left font-mono"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-arma-amber shrink-0">
                    {isOpen ? <FolderOpen className="w-4 h-4 text-arma-amber" /> : <Folder className="w-4 h-4 text-arma-khaki" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-arma-text uppercase tracking-wide truncate">
                        {folder.title}
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-arma-card text-arma-amber border border-arma-border shrink-0">
                        {folderMods.length} MODS
                      </span>
                      {reqCount > 0 && (
                        <span className="text-[10px] text-arma-khaki hidden sm:inline">
                          ({reqCount} REQ)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-arma-textMuted truncate mt-0.5">
                      {folder.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-arma-textDim text-xs shrink-0 ml-3">
                  <span className="text-[11px] hidden md:inline">
                    {isOpen ? 'COLLAPSE FOLDER' : 'EXPAND FOLDER'}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-arma-amber" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Folder Contents (Compact Tactical Table) */}
              {isOpen && (
                <div className="border-t border-arma-border bg-[#0d0f13] overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-arma-border bg-[#0a0c10] text-[10px] text-arma-textDim uppercase">
                        <th className="py-2.5 px-4 w-12 text-center">TYPE</th>
                        <th className="py-2.5 px-4">ADDON NAME &amp; DESCRIPTION</th>
                        <th className="py-2.5 px-4 w-28">EST. SIZE</th>
                        <th className="py-2.5 px-4 w-36">WORKSHOP ID</th>
                        <th className="py-2.5 px-4 w-28 text-right">ACTIONS</th>
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
                              <td className="py-2.5 px-4 text-center">
                                {mod.required ? (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-arma-amberDim text-arma-amber border border-arma-amber/30">
                                    REQ
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-arma-textDim">
                                    OPT
                                  </span>
                                )}
                              </td>

                              {/* Mod Name & Author */}
                              <td className="py-2.5 px-4">
                                <div className="font-bold text-arma-text hover:text-arma-amber transition-colors flex items-center gap-1.5">
                                  <span>{mod.name}</span>
                                  {mod.tags && mod.tags.length > 0 && (
                                    <span className="text-[10px] text-arma-textDim font-normal hidden lg:inline">
                                      #{mod.tags[0]}
                                    </span>
                                  )}
                                </div>
                                {mod.author && (
                                  <div className="text-[10px] text-arma-textDim">
                                    Author: {mod.author} {mod.version ? `(v${mod.version})` : ''}
                                  </div>
                                )}
                              </td>

                              {/* Size */}
                              <td className="py-2.5 px-4 text-arma-textMuted text-[11px]">
                                {mod.size || '—'}
                              </td>

                              {/* Workshop ID */}
                              <td className="py-2.5 px-4">
                                <button
                                  onClick={(e) => copyId(mod.id, e)}
                                  className="text-arma-khaki hover:text-arma-amber flex items-center gap-1 font-mono text-[11px]"
                                  title="Click to copy Steam ID"
                                >
                                  <span>{mod.id}</span>
                                  {copiedId === mod.id ? (
                                    <Check className="w-3 h-3 text-arma-green" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-arma-textDim opacity-60" />
                                  )}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center gap-1.5">
                                  <a
                                    href={`steam://url/CommunityFilePage/${mod.id}`}
                                    className="p-1 rounded bg-arma-card hover:bg-arma-surface text-arma-textMuted hover:text-arma-text"
                                    title="Open in Steam App"
                                  >
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={mod.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded bg-arma-card hover:bg-arma-amber hover:text-black text-arma-text font-bold text-[10px] inline-flex items-center gap-1"
                                  >
                                    <span>WEB</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              </td>
                            </tr>

                            {/* Optional Expandable Description Row */}
                            {isExpanded && mod.description && (
                              <tr className="bg-[#090b0f] text-xs">
                                <td colSpan={5} className="py-3 px-6 text-arma-textMuted border-b border-arma-border/80">
                                  <div className="flex items-start gap-2">
                                    <Info className="w-3.5 h-3.5 text-arma-amber shrink-0 mt-0.5" />
                                    <div>
                                      <p className="leading-relaxed text-arma-text">{mod.description}</p>
                                      {mod.tags && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {mod.tags.map((t, idx) => (
                                            <span key={idx} className="text-[10px] text-arma-textDim bg-arma-card px-1.5 py-0.2 rounded border border-arma-border">
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
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
