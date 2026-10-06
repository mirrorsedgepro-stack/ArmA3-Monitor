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
      className="flex-1 min-w-[4.5rem] flex flex-col items-center justify-center text-center rounded-sm bg-black/20 px-1.5 py-1.5"
    >
      <div className={`text-sm font-light tabular-nums truncate max-w-full ${TONES[tone]}`}>{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5 px-2 pb-2">{children}</div>;
}
