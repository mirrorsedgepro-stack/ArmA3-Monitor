'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BrainCircuit, Network, Database } from 'lucide-react';
import { ServiceGroup } from '@/components/dash/ServiceGroup';
import { ServiceCard } from '@/components/dash/ServiceCard';
import { StatBlock, StatRow } from '@/components/dash/StatBlock';
import type { TrainingResponse } from '@/app/api/training/route';
import { formatNumber } from '@/lib/format';

const iconClass = 'h-6 w-6';

const MODE_TEXT: Record<string, { label: string; detail: string; tone: string }> = {
  gameplay: { label: 'GAMEPLAY FIRST', detail: 'Players online: spark1 trains alone, the game Spark serves the game', tone: 'text-amber-400' },
  cluster: { label: 'CLUSTER', detail: 'Server empty: both Sparks train together over the CX7 link', tone: 'text-emerald-400' },
  'idle-empty': { label: 'SERVER EMPTY', detail: 'Server empty: spark1 trains, the game Spark generates practice calls', tone: 'text-sky-400' },
};

const STATE_TEXT: Record<string, string> = {
  waiting: 'Waiting for new data',
  loading: 'Loading model',
  training: 'Training',
  regrouping: 'Regrouping nodes',
  evaluating: 'Evaluating',
  exporting: 'Exporting model',
  done: 'Cycle finished',
  error: 'Error',
};

function ago(epochSeconds?: number): string {
  if (!epochSeconds) return '—';
  const s = Math.max(0, Date.now() / 1000 - epochSeconds);
  if (s < 90) return `${Math.round(s)}s ago`;
  if (s < 5400) return `${Math.round(s / 60)} min ago`;
  if (s < 172800) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

function duration(seconds?: number): string {
  if (seconds == null) return '—';
  const m = Math.round(seconds / 60);
  return m < 90 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

function Pill({ text, tone }: { text: string; tone: string }) {
  return (
    <span className={`flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {text}
    </span>
  );
}

/** Loss over the recent training history; segments trained by two nodes are drawn brighter. */
function LossChart({ history }: { history: NonNullable<TrainingResponse['history']> }) {
  const pts = history.filter((h) => typeof h.loss === 'number');
  if (pts.length < 2) return <div className="px-3 pb-3 text-xs text-slate-500">Loss chart appears after a few minutes of training.</div>;
  const W = 600, H = 90, P = 4;
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1;
  const losses = pts.map((p) => p.loss as number);
  const lo = Math.min(...losses), hi = Math.max(...losses);
  const x = (t: number) => P + ((t - t0) / Math.max(1, t1 - t0)) * (W - 2 * P);
  const y = (l: number) => P + (1 - (l - lo) / Math.max(1e-6, hi - lo)) * (H - 2 * P);
  return (
    <div className="px-2 pb-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full rounded-sm bg-black/20" preserveAspectRatio="none" role="img"
        aria-label={`Training loss from ${formatNumber(losses[0], 3)} to ${formatNumber(losses[losses.length - 1], 3)}`}>
        {pts.slice(1).map((p, i) => (
          <line key={i} x1={x(pts[i].t)} y1={y(pts[i].loss as number)} x2={x(p.t)} y2={y(p.loss as number)}
            stroke={(p.nodes ?? 1) >= 2 ? '#34d399' : '#94a3b8'} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>loss {formatNumber(hi, 3)} → {formatNumber(losses[losses.length - 1], 3)}</span>
        <span><span className="text-emerald-400">■</span> 2 nodes <span className="ml-2 text-slate-400">■</span> 1 node</span>
      </div>
    </div>
  );
}

export function TrainingPanel({ autoRefresh = true }: { autoRefresh?: boolean }) {
  const [data, setData] = useState<TrainingResponse | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/training', { cache: 'no-store' });
      if (res.ok) setData(await res.json());
    } catch {
      /* keep the last state */
    }
  }, []);

  useEffect(() => {
    load();
    if (!autoRefresh) return;
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load, autoRefresh]);

  if (!data) return null;
  if (!data.available) {
    return (
      <ServiceGroup id="training" title="OVERLORD training" icon={<BrainCircuit className="h-5 w-5 text-slate-400" />} columns="grid-cols-1">
        <ServiceCard icon={<BrainCircuit className={iconClass} />} name="Trainer" description="Training status unavailable right now" />
      </ServiceGroup>
    );
  }

  const t = data.trainer || {};
  const mode = MODE_TEXT[data.mode || ''] || { label: (data.mode || '?').toUpperCase(), detail: '', tone: 'text-slate-400' };
  const nodes = t.nodes ?? 1;
  const progress = t.step != null && t.total_steps ? Math.min(100, (100 * t.step) / t.total_steps) : null;
  const d = data.data || {};
  const peer = data.peer || {};
  const peerText = peer.state === 'joined' ? 'training' : peer.state === 'starting' ? 'joining' : peer.state === 'leaving' ? 'leaving' : 'game only';

  return (
    <ServiceGroup id="training" title="OVERLORD training" icon={<BrainCircuit className="h-5 w-5 text-slate-400" />} columns="grid-cols-1 lg:grid-cols-2">
      <ServiceCard
        icon={<BrainCircuit className={iconClass} />}
        name={`${STATE_TEXT[t.state || ''] || 'Trainer'}${t.cycle ? ` · cycle ${t.cycle}` : ''}`}
        description={data.error ? `Error: ${data.error}` : mode.detail}
        status={<Pill text={mode.label} tone={mode.tone} />}
      >
        {progress != null && (
          <div className="px-2 pb-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/30" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div className={`h-full ${nodes >= 2 ? 'bg-emerald-400' : 'bg-slate-300'}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        <StatRow>
          <StatBlock label="Progress" value={progress != null ? `${formatNumber(progress, 1)}%` : '—'} title={t.step != null ? `step ${t.step} of ${t.total_steps}` : undefined} />
          <StatBlock label="Loss" value={t.loss != null ? formatNumber(t.loss, 3) : '—'} />
          <StatBlock label="ETA" value={t.state === 'training' ? duration(t.eta_s) : '—'} />
          <StatBlock label="Nodes" value={nodes} tone={nodes >= 2 ? 'good' : 'default'} title={nodes >= 2 ? 'spark1 + game Spark over CX7' : 'spark1'} />
          <StatBlock label="Speed" value={t.samples_per_s != null ? `${formatNumber(t.samples_per_s, 1)}/s` : '—'} title="Training samples per second" />
        </StatRow>
        <LossChart history={data.history || []} />
      </ServiceCard>

      <ServiceCard
        icon={<Network className={iconClass} />}
        name="Sparks"
        description={`spark1: ${t.state === 'training' ? 'training' : t.state || '—'} · game Spark: ${peerText}${data.generating ? ', generating practice calls' : ''}`}
        status={<Pill text={`${data.playersOnline ?? 0} ONLINE`} tone={(data.playersOnline ?? 0) > 0 ? 'text-amber-400' : 'text-slate-400'} />}
      >
        <StatRow>
          <StatBlock label="Live model" value={data.deployed?.model?.split(':').pop() || '—'} title={data.deployed?.model ? `${data.deployed.model}, live ${ago(data.deployed.since)}` : undefined} />
          <StatBlock label="Live score" value={data.deployed?.score != null ? `${formatNumber(100 * data.deployed.score, 0)}%` : '—'} title="Share of held-out calls answered within radio procedure" tone={(data.deployed?.score ?? 0) >= 0.9 ? 'good' : 'default'} />
          <StatBlock label="Last export" value={ago(data.lastExport?.created)} title={data.lastExport?.gguf} />
          <StatBlock label="Updated" value={ago(t.updated)} />
        </StatRow>
        {data.events && data.events.length > 0 && (
          <ul className="space-y-0.5 px-3 pb-2 text-[11px] text-slate-400">
            {data.events.slice(-4).reverse().map((e) => (
              <li key={`${e.t}-${e.text}`} className="truncate"><span className="text-slate-500">{ago(e.t)}</span> · {e.text}</li>
            ))}
          </ul>
        )}
      </ServiceCard>

      <ServiceCard icon={<Database className={iconClass} />} name="Training data" description="Recorded radio calls, practice dialogues, battle-net reports">
        <StatRow>
          <StatBlock label="Real calls" value={formatNumber(d.conversations ?? 0)} title="Live conversations with OVERLORD (weighted ×4 in training)" />
          <StatBlock label="Practice" value={formatNumber(d.generated ?? 0)} title="Generated while the server was empty" />
          <StatBlock label="Contacts" value={formatNumber(d.contacts ?? 0)} title="Contact reports on the battle net" />
          <StatBlock label="Voice clips" value={formatNumber(d.voice_clips ?? 0)} title="Recorded radio calls (opt-in)" />
          <StatBlock label="In cycle" value={t.samples != null ? formatNumber(t.samples) : '—'} title={t.real_samples != null ? `${t.real_samples} of them real` : undefined} />
        </StatRow>
      </ServiceCard>
    </ServiceGroup>
  );
}
