'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { StatBlock } from '@/components/dash/StatBlock';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Activity, 
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface HistoryPoint {
  timestamp: number;
  timeLabel: string;
  fullDateLabel: string;
  count: number;
  isLive?: boolean;
}

interface PlayerHistoryGraphProps {
  /** Live player count, or null when the server is not answering. */
  currentPlayers: number | null;
  maxPlayers?: number;
  serverName?: string;
}

type TimeRange = '6h' | '12h' | '24h';

export function PlayerHistoryGraph({
  currentPlayers,
  maxPlayers = 32,
  serverName = "Frenchy's Antistasi Ultimate",
}: PlayerHistoryGraphProps) {
  const [points, setPoints] = useState<{ t: string; players: number }[]>([]);
  const [trackingSince, setTrackingSince] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hoursForRange: Record<TimeRange, number> = {
    '6h': 6,
    '12h': 12,
    '24h': 24,
  };

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const hours = hoursForRange[selectedRange];
      const bucket = selectedRange === '6h' ? 15 : (selectedRange === '12h' ? 30 : 60);
      const res = await fetch(`/api/history?hours=${hours}&bucket=${bucket}`);
      if (res.ok) {
        const data = await res.json();
        if (data.available && Array.isArray(data.points)) {
          setPoints(data.points);
          setTrackingSince(data.trackingSince);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch player history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 60000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  // Convert raw points into HistoryPoint list including live active point
  const history: HistoryPoint[] = useMemo(() => {
    const list: HistoryPoint[] = points.map((p) => {
      const d = new Date(p.t);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const timeLabel = `${hours.toString().padStart(2, '0')}:${minutes < 30 ? '00' : '30'}`;
      const fullDateLabel = d.toLocaleDateString(undefined, {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        timestamp: d.getTime(),
        timeLabel,
        fullDateLabel,
        count: Math.max(0, p.players),
        isLive: false,
      };
    });

    // Add current live point at the end
    const now = Date.now();
    const dNow = new Date(now);
    const timeLabel = `${dNow.getHours().toString().padStart(2, '0')}:${dNow.getMinutes().toString().padStart(2, '0')}`;
    const fullDateLabel = dNow.toLocaleDateString(undefined, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (currentPlayers != null) {
      list.push({
        timestamp: now,
        timeLabel,
        fullDateLabel,
        count: currentPlayers,
        isLive: true,
      });
    }

    return list;
  }, [points, currentPlayers]);

  // Calculate summary statistics
  const { peakCount, peakPoint, avgCount } = useMemo(() => {
    if (history.length === 0) {
      return { peakCount: 0, peakPoint: null, avgCount: 0 };
    }
    let max = 0;
    let sum = 0;
    let peakPt: HistoryPoint | null = null;

    history.forEach((pt) => {
      if (pt.count >= max) {
        max = pt.count;
        peakPt = pt;
      }
      sum += pt.count;
    });

    return {
      peakCount: max,
      peakPoint: peakPt,
      avgCount: Math.round((sum / history.length) * 10) / 10,
    };
  }, [history, currentPlayers]);

  // SVG Geometry Calculation
  const svgWidth = 800;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 24;
  const padTop = 30;
  const padBottom = 32;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;
  const maxY = Math.max(maxPlayers, Math.max(peakCount + 2, 4));

  // Compute coordinate mapping
  const coords = useMemo(() => {
    if (history.length <= 1) return [];
    return history.map((pt, idx) => {
      const x = padLeft + (idx / (history.length - 1)) * chartW;
      const y = padTop + (1 - pt.count / maxY) * chartH;
      return { x, y, pt, idx };
    });
  }, [history, chartW, chartH, maxY, padLeft, padTop]);

  // Generate SVG Path for line and gradient area
  const { linePath, areaPath } = useMemo(() => {
    if (coords.length === 0) return { linePath: '', areaPath: '' };
    if (coords.length === 1) {
      const y = coords[0].y;
      return {
        linePath: `M ${padLeft} ${y} L ${padLeft + chartW} ${y}`,
        areaPath: `M ${padLeft} ${y} L ${padLeft + chartW} ${y} L ${padLeft + chartW} ${padTop + chartH} L ${padLeft} ${padTop + chartH} Z`,
      };
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const current = coords[i];
      const next = coords[i + 1];
      const cpX1 = current.x + (next.x - current.x) / 2;
      const cpY1 = current.y;
      const cpX2 = current.x + (next.x - current.x) / 2;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }

    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const bottomY = padTop + chartH;
    const a = `${d} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

    return { linePath: d, areaPath: a };
  }, [coords, chartH, chartW, padLeft, padTop]);

  const activeHoverPoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  // No recorded history (bridge unreachable or nothing logged yet): show nothing.
  if (points.length === 0) return null;

  return (
    <div className="hp-card p-3 space-y-3">
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-200">Player count</div>
          {trackingSince && (
            <div className="text-xs text-slate-500">Recorded since {new Date(trackingSince).toLocaleDateString()}</div>
          )}
        </div>

        {/* Time Range Selector */}
        <div className="flex shrink-0 items-center gap-1">
          {(['6h', '12h', '24h'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                selectedRange === range ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
          <button
            onClick={fetchHistory}
            className="p-1 text-arma-textMuted hover:text-arma-text ml-1"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-1.5">
        {currentPlayers != null && <StatBlock label="Now" value={`${currentPlayers}/${maxPlayers}`} />}
        <StatBlock label={`Peak (${selectedRange})`} value={peakCount} />
        <StatBlock label={`Average (${selectedRange})`} value={avgCount} />
      </div>

      {/* Interactive SVG Graph Area */}
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-sm bg-black/20 p-1 sm:p-3">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 sm:h-56"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padTop + (1 - ratio) * chartH;
            const val = Math.round(ratio * maxY);
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + chartW}
                  y2={y}
                  stroke="#1f242e"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  fill="#5c6370"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

          {/* Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#dc2626"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Coordinate points */}
          {coords.map((c, i) => {
            const isHovered = hoverIndex === i;
            const isLast = i === coords.length - 1;

            return (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 5 : isLast ? 4 : 2.5}
                  fill={isLast ? '#22c55e' : isHovered ? '#ffffff' : '#dc2626'}
                  stroke="#07090c"
                  strokeWidth="1.5"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeHoverPoint && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-md bg-arma-surface/95 border border-arma-red/60 text-xs shadow-2xl backdrop-blur-md"
            style={{
              left: `${(activeHoverPoint.x / svgWidth) * 100}%`,
              top: `${Math.max(10, (activeHoverPoint.y / svgHeight) * 100 - 30)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="text-[10px] text-arma-textDim font-bold">
              {activeHoverPoint.pt.fullDateLabel}
            </div>
            <div className="text-sm font-medium text-arma-text mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-arma-red" />
              <span>{activeHoverPoint.pt.count} Players</span>
              {activeHoverPoint.pt.isLive && (
                <span className="text-[10px] text-arma-green font-bold uppercase">(LIVE)</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
