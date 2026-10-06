'use client';

import React, { useState } from 'react';
import { ArrowUpCircle, Flag, LogIn, LogOut, Shield, ShieldAlert, Skull, Swords } from 'lucide-react';
import type { CampaignEvent, CampaignEventType } from '@/app/api/events/route';
import { formatSince } from '@/lib/format';

const COMBAT: CampaignEventType[] = ['death', 'capture', 'counterattack', 'defended', 'lost'];
const PLAYERS: CampaignEventType[] = ['join', 'leave', 'promotion'];

type Filter = 'all' | 'combat' | 'players';

function describe(e: CampaignEvent): { icon: React.ReactNode; text: React.ReactNode } | null {
  const who = (name?: string | null) => <span className="font-medium text-slate-100">{name}</span>;
  switch (e.type) {
    case 'death':
      return { icon: <Skull className="h-4 w-4 text-red-400" />, text: <>{who(e.player)} was killed</> };
    case 'capture':
      return {
        icon: <Flag className="h-4 w-4 text-emerald-400" />,
        text: (
          <>
            {who(e.player || e.by)} captured {who(e.place)}
            {e.grid && <span className="text-slate-500"> · grid {e.grid}</span>}
          </>
        ),
      };
    case 'counterattack':
      return {
        icon: <Swords className="h-4 w-4 text-amber-400" />,
        text: <>{e.enemy ?? 'Enemy'} counterattack on {who(e.place)}</>,
      };
    case 'defended':
      return { icon: <Shield className="h-4 w-4 text-emerald-400" />, text: <>Counterattack on {who(e.place)} repelled</> };
    case 'lost':
      return { icon: <ShieldAlert className="h-4 w-4 text-red-400" />, text: <>{who(e.place)} lost to a counterattack</> };
    case 'promotion':
      return { icon: <ArrowUpCircle className="h-4 w-4 text-sky-400" />, text: <>{who(e.player)} promoted to {e.rank}</> };
    case 'join':
      return { icon: <LogIn className="h-4 w-4 text-slate-400" />, text: <>{who(e.player)} joined</> };
    case 'leave':
      return { icon: <LogOut className="h-4 w-4 text-slate-500" />, text: <>{who(e.player)} left</> };
    default:
      return null;
  }
}

/** Campaign event feed. Renders nothing when the server has reported no events. */
export function EventFeed({ events }: { events: CampaignEvent[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [limit, setLimit] = useState(12);

  if (events.length === 0) return null;

  const shown = events.filter((e) =>
    filter === 'all' ? true : filter === 'combat' ? COMBAT.includes(e.type) : PLAYERS.includes(e.type),
  );

  return (
    <div className="hp-card flex flex-col">
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-2">
        <span className="text-sm font-medium text-slate-200">Event feed</span>
        <div className="flex gap-1">
          {(['all', 'combat', 'players'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setLimit(12);
              }}
              className={`rounded px-2 py-1 text-[11px] capitalize ${filter === f ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="px-3 pb-3 text-xs text-slate-500">Nothing in this category yet.</p>
      ) : (
        <ul className="divide-y divide-white/5 border-t border-white/5">
          {shown.slice(0, limit).map((e) => {
            const d = describe(e);
            if (!d) return null;
            return (
              <li key={e.id} className="flex items-start gap-2.5 px-3 py-2 text-sm text-slate-300">
                <span className="mt-0.5 shrink-0">{d.icon}</span>
                <span className="min-w-0 flex-1 break-words">{d.text}</span>
                <time
                  dateTime={e.t}
                  title={new Date(e.t).toLocaleString()}
                  className="shrink-0 pt-0.5 text-[11px] tabular-nums text-slate-500"
                >
                  {formatSince(e.t)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
      {shown.length > limit && (
        <button
          onClick={() => setLimit((l) => l + 24)}
          className="border-t border-white/5 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          Show more
        </button>
      )}
    </div>
  );
}
