import React from 'react';

type Tone = 'default' | 'good' | 'warn' | 'bad';

const TONES: Record<Tone, string> = {
  default: 'text-slate-200',
  good: 'text-emerald-400',
  warn: 'text-amber-400',
  bad: 'text-red-400',
};

interface StatBlockProps {
  label: string;
  value: React.ReactNode;
  tone?: Tone;
  title?: string;
}

/** homepage's widget "Block": a value over a tiny uppercase label. */
export function StatBlock({ label, value, tone = 'default', title }: StatBlockProps) {
  return (
    <div
      title={title}
      className="flex-1 min-w-0 sm:min-w-[4.5rem] flex flex-col items-center justify-center text-center rounded-sm bg-black/20 px-1.5 py-1.5"
    >
      <div className={`text-sm font-light tabular-nums truncate max-w-full ${TONES[tone]}`}>{value}</div>
      <div className="truncate max-w-full text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

/** Phone grid for n blocks, chosen so no row is left with a stretched orphan. */
const MOBILE_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-6', // 3 on top (span 2), 2 below (span 3)
  6: 'grid-cols-3',
};

export function StatRow({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (items.length === 0) return null;
  const cols = MOBILE_COLS[items.length] ?? 'grid-cols-3';
  return (
    <div className={`grid ${cols} gap-1.5 px-2 pb-2 sm:flex sm:flex-wrap`}>
      {items.map((child, i) => (
        <div
          key={i}
          className={`flex min-w-0 sm:flex-1 ${items.length === 5 ? (i < 3 ? 'col-span-2' : 'col-span-3') : ''}`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
