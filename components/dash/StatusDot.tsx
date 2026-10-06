import React from 'react';
import { ArmaServerStats } from '@/data/defaultServer';

interface StatusDotProps {
  status: ArmaServerStats['status'];
  ping?: number | null;
}

/** homepage's siteMonitor pill: ping in ms when up, a red DOWN otherwise. */
export function StatusDot({ status, ping }: StatusDotProps) {
  if (status === 'loading') {
    return (
      <span className="flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" />
        …
      </span>
    );
  }
  if (status !== 'online') {
    return (
      <span className="flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        DOWN
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {ping != null ? `${ping}ms` : 'UP'}
    </span>
  );
}
