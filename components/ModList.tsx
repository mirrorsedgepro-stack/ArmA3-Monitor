'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Copy, Download, ExternalLink, FileUp, Search, X } from 'lucide-react';
import { ArmaMod } from '@/data/defaultMods';
import type { ModsResponse, WorkshopDetails } from '@/app/api/mods/route';
import { formatBytes, formatNumber, formatSince } from '@/lib/format';
import { StatBlock } from '@/components/dash/StatBlock';

interface ModListProps {
  mods: ArmaMod[];
  serverName: string;
  onDownloadPreset: () => void;
  onOpenPresetModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

// Display grouping chosen by the server operator (not data from Steam).
const CATEGORIES: { id: ArmaMod['category']; title: string }[] = [
  { id: 'core', title: 'Core & mission' },
  { id: 'equipment', title: 'RHS factions & gear' },
  { id: 'realism', title: 'Movement, animation & gunplay' },
  { id: 'audio', title: 'Audio' },
  { id: 'visuals', title: 'Visual effects' },
  { id: 'qol', title: 'HUD, logistics & quality of life' },
  { id: 'terrain', title: 'Terrains' },
  { id: 'server', title: 'Server & admin' },
];

export function ModList({ mods, onDownloadPreset, onOpenPresetModal, searchQuery, setSearchQuery }: ModListProps) {
  const [details, setDetails] = useState<Record<string, WorkshopDetails>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({ core: true });
  const [filterType, setFilterType] = useState<'all' | 'required' | 'optional'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mods')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ModsResponse | null) => {
        if (d?.available) setDetails(d.details);
      })
      .catch(() => {});
  }, []);

  const q = searchQuery.toLowerCase().trim();
  const filtered = useMemo(
    () =>
      mods.filter((m) => {
        if (filterType === 'required' && !m.required) return false;
        if (filterType === 'optional' && m.required) return false;
        if (!q) return true;
        return m.name.toLowerCase().includes(q) || m.id.includes(q) || details[m.id]?.title.toLowerCase().includes(q);
      }),
    [mods, filterType, q, details],
  );

  const groups = CATEGORIES.map((c) => ({ ...c, mods: filtered.filter((m) => m.category === c.id) })).filter(
    (g) => g.mods.length > 0,
  );

  const required = mods.filter((m) => m.required).length;
  const optional = mods.length - required;
  const sizeOf = (list: ArmaMod[]) => {
    // Only report a total when Steam returned a size for every mod in the list.
    if (!list.every((m) => details[m.id]?.fileSize)) return null;
    return list.reduce((sum, m) => sum + details[m.id].fileSize, 0);
  };
  const totalSize = sizeOf(mods.filter((m) => m.required));
  const allOpen = groups.length > 0 && groups.every((g) => open[g.id]);

  const copyId = (id: string) => {
    navigator.clipboard?.writeText(id).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <section id="mods" className="scroll-mt-6 space-y-3">
      {/* Summary + actions */}
      <div className="hp-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <StatBlock label="Mods" value={mods.length} />
          {optional > 0 && <StatBlock label="Required" value={required} />}
          {totalSize != null && <StatBlock label="Size" value={formatBytes(totalSize)} title="Total size of the required mods on Steam Workshop" />}
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:flex">
          <button
            onClick={onDownloadPreset}
            className="flex items-center justify-center gap-1.5 rounded px-3 py-2 text-xs arma-btn-primary"
          >
            <Download className="h-3.5 w-3.5" />
            Download preset
          </button>
          <button
            onClick={onOpenPresetModal}
            className="flex items-center justify-center gap-1.5 rounded px-3 py-2 text-xs arma-btn-secondary"
          >
            <FileUp className="h-3.5 w-3.5" />
            Import preset
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mods by name or Workshop ID"
            className="w-full rounded-md bg-white/5 py-2 pl-9 pr-9 text-base text-slate-200 ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-white/25 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {optional > 0 &&
            (['all', 'required', 'optional'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`rounded px-3 py-2 text-xs capitalize ${filterType === f ? 'bg-white/15 text-white' : 'arma-btn-secondary'}`}
              >
                {f}
              </button>
            ))}
          <button
            onClick={() => setOpen(allOpen ? {} : Object.fromEntries(groups.map((g) => [g.id, true])))}
            className="rounded px-3 py-2 text-xs arma-btn-secondary whitespace-nowrap"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </div>

      {groups.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No mods match “{searchQuery}”.</p>}

      {/* Category groups */}
      <div className="space-y-2">
        {groups.map((g) => {
          const isOpen = !!q || !!open[g.id];
          const groupSize = sizeOf(g.mods);
          return (
            <div key={g.id} className="hp-card overflow-hidden">
              <button
                onClick={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-white/5"
                aria-expanded={isOpen}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-200">{g.title}</span>
                  <span className="text-xs text-slate-500">
                    {g.mods.length} mod{g.mods.length === 1 ? '' : 's'}
                    {groupSize != null && ` · ${formatBytes(groupSize)}`}
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <ul className="divide-y divide-white/5 border-t border-white/5">
                  {g.mods.map((m) => {
                    const d = details[m.id];
                    const meta = [
                      d?.fileSize ? formatBytes(d.fileSize) : null,
                      d?.updatedAt ? `updated ${formatSince(d.updatedAt)}` : null,
                      d?.subscriptions != null ? `${formatNumber(d.subscriptions)} subs` : null,
                    ].filter(Boolean);
                    return (
                      <li key={m.id} className="flex items-center gap-2 px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <a
                            href={m.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${m.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-sm text-slate-200 hover:text-white"
                          >
                            <span className="truncate">{m.name}</span>
                            {!m.required && (
                              <span className="shrink-0 rounded bg-white/10 px-1 text-[10px] uppercase text-slate-400">opt</span>
                            )}
                            <ExternalLink className="h-3 w-3 shrink-0 text-slate-500" />
                          </a>
                          {meta.length > 0 && (
                            <div className="flex flex-wrap gap-x-2 text-xs text-slate-500">
                              {meta.map((t) => (
                                <span key={t as string}>{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => copyId(m.id)}
                          className="flex shrink-0 items-center gap-1 rounded px-2 py-1.5 text-[11px] tabular-nums text-slate-400 arma-btn-secondary"
                          title="Copy Workshop ID"
                        >
                          {copiedId === m.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span className="hidden sm:inline">{m.id}</span>
                        </button>
                        <a
                          href={`steam://url/CommunityFilePage/${m.id}`}
                          className="shrink-0 rounded px-2 py-1.5 text-[11px] arma-btn-secondary"
                          title="Open in the Steam app"
                        >
                          Steam
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
