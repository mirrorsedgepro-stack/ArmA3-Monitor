'use client';

import React, { useState } from 'react';
import { ArrowUpCircle, Crosshair, Flag, LogIn, LogOut, Shield, ShieldAlert, Skull, Swords } from 'lucide-react';
import type { CampaignEvent, CampaignEventType } from '@/app/api/events/route';
import { formatSince } from '@/lib/format';

const CAMPAIGN: CampaignEventType[] = ['capture', 'counterattack', 'defended', 'lost'];
const PLAYERS: CampaignEventType[] = ['join', 'leave', 'promotion', 'death'];

type Filter = 'all' | 'kills' | 'campaign' | 'players';

// Antistasi sides as the rebels (GUER) see them.
const SIDES: Record<string, { label: string; className: string }> = {
  GUER: { label: 'Rebel', className: 'text-emerald-400' },
  WEST: { label: 'Occupant', className: 'text-red-400' },
  EAST: { label: 'Invader', className: 'text-orange-400' },
  CIV: { label: 'Civilian', className: 'text-slate-400' },
};

const involvesPlayer = (e: CampaignEvent) => e.type !== 'kill' || !!e.killerIsPlayer || !!e.victimIsPlayer;

/** Drop the engine's "X was killed" line when the kill feed already reported that death. */
function withoutDuplicateDeaths(events: CampaignEvent[]) {
  const killed = events
    .filter((e) => e.type === 'kill' && e.victimIsPlayer && e.victim)
    .map((e) => ({ name: e.victim!, t: Date.parse(e.t) }));
  if (killed.length === 0) return events;
  return events.filter(
    (e) => e.type !== 'death' || !killed.some((k) => k.name === e.player && Math.abs(k.t - Date.parse(e.t)) <= 5000),
  );
}

function describe(e: CampaignEvent): { icon: React.ReactNode; text: React.ReactNode } | null {
  const who = (name?: string | null) => <span className="font-medium text-slate-100">{name}</span>;
  const unit = (name?: string | null, side?: string | null, isPlayer?: boolean) => {
    const s = side ? SIDES[side] : undefined;
    return (
      <span className={`font-medium ${isPlayer ? 'text-slate-100' : s?.className ?? 'text-slate-200'}`}>
        {name}
        {!isPlayer && s && <span className="font-normal text-slate-500"> ({s.label.toLowerCase()})</span>}
      </span>
    );
  };
  switch (e.type) {
    case 'kill': {
      const detail = [e.weapon, e.distance != null ? `${e.distance} m` : null].filter(Boolean).join(' · ');
      const victim = e.kind === 'veh' ? who(e.victim) : unit(e.victim, e.victimSide, e.victimIsPlayer);
      return {
        icon: <Crosshair className={`h-4 w-4 ${e.victimIsPlayer ? 'text-red-400' : e.killerIsPlayer ? 'text-emerald-400' : 'text-slate-500'}`} />,
        text: e.killer ? (
          <>
            {unit(e.killer, e.killerSide, e.killerIsPlayer)} {e.kind === 'veh' ? 'destroyed' : 'killed'} {victim}
            {detail && <span className="text-slate-500"> · {detail}</span>}
          </>
        ) : (
          <>{victim} died</>
        ),
      };
    }
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

  const deduped = withoutDuplicateDeaths(events);
  const hasKills = deduped.some((e) => e.type === 'kill');
  const shown = deduped.filter((e) => {
    switch (filter) {
      case 'kills':
        return e.type === 'kill';
      case 'campaign':
        return CAMPAIGN.includes(e.type);
      case 'players':
        return PLAYERS.includes(e.type) || (e.type === 'kill' && involvesPlayer(e));
      default:
        // AI-vs-AI kills are only listed under "Kills" so they don't flood the feed.
        return involvesPlayer(e);
    }
  });

  return (
    <div className="hp-card flex flex-col">
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-2">
        <span className="text-sm font-medium text-slate-200">Event feed</span>
        <div className="flex gap-1">
          {(['all', ...(hasKills ? ['kills'] : []), 'campaign', 'players'] as Filter[]).map((f) => (
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
