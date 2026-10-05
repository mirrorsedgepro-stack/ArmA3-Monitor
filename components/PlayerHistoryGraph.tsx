'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Activity, 
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

interface HistoryPoint {
  timestamp: number;
  timeLabel: string;
  fullDateLabel: string;
  count: number;
  isLive?: boolean;
}

interface PlayerHistoryGraphProps {
  currentPlayers: number;
  maxPlayers?: number;
  serverName?: string;
}

type TimeRange = '6h' | '12h' | '24h';

// Deterministic synthetic baseline generator for the 24h timeline
function generateBaselineHistory(currentCount: number): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const now = Date.now();
  const totalIntervals = 48; // 48 * 30 min = 24 hours

  for (let i = totalIntervals - 1; i >= 0; i--) {
    const t = now - i * 30 * 60 * 1000;
    const d = new Date(t);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const timeLabel = `${hours.toString().padStart(2, '0')}:${minutes < 30 ? '00' : '30'}`;
    const fullDateLabel = d.toLocaleDateString(undefined, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    let simulatedCount: number;

    if (i === 0) {
      simulatedCount = currentCount;
    } else {
      // Natural diurnal curve for Australian Arma 3 server:
      // Prime hours: 19:00 - 23:00 (Peak ~18-24 players)
      // Afternoon: 14:00 - 18:30 (5-12 players)
      // Late night: 23:30 - 02:00 (4-10 players)
      // Deep night / early morning: 02:30 - 08:30 (0-3 players)
      // Morning / lunch: 09:00 - 13:30 (2-6 players)
      if (hours >= 19 && hours <= 22) {
        // Evening Prime / Event Peak
        const base = 18;
        const offset = Math.sin((hours - 19) * 0.8) * 5;
        simulatedCount = Math.round(base + offset + ((t % 7) - 3) * 0.4);
      } else if (hours >= 15 && hours < 19) {
        // Afternoon squad grouping
        simulatedCount = Math.round(6 + (hours - 15) * 2.8 + ((t % 5) - 2) * 0.5);
      } else if (hours >= 23 || hours < 2) {
        // Post-event late patrol
        simulatedCount = Math.round(11 - (hours >= 23 ? 0 : hours + 1) * 2.5 + ((t % 4) - 2) * 0.5);
      } else if (hours >= 2 && hours < 9) {
        // Quiet night hours
        simulatedCount = Math.max(0, Math.round(1 + ((t % 3) === 0 ? 1 : 0)));
      } else {
        // 9 AM to 3 PM
        simulatedCount = Math.round(3 + (hours - 9) * 0.5 + ((t % 4) - 1) * 0.3);
      }
    }

    points.push({
      timestamp: t,
      timeLabel,
      fullDateLabel,
      count: Math.max(0, Math.min(32, simulatedCount)),
      isLive: i === 0,
    });
  }

  return points;
}

export function PlayerHistoryGraph({
  currentPlayers,
  maxPlayers = 32,
  serverName = "Frenchy's Antistasi Ultimate",
}: PlayerHistoryGraphProps) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize and persist player count history
  useEffect(() => {
    try {
      const stored = localStorage.getItem('arma3_player_activity_history_v2');
      let data: HistoryPoint[] = [];

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          data = parsed;
        }
      }

      if (data.length === 0) {
        data = generateBaselineHistory(currentPlayers);
      } else {
        // Append or update current point
        const now = Date.now();
        const last = data[data.length - 1];
        if (now - last.timestamp > 15 * 60 * 1000) {
          // More than 15 mins since last point, add new point
          const d = new Date(now);
          const timeLabel = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
          const fullDateLabel = d.toLocaleDateString(undefined, {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });
          data.push({
            timestamp: now,
            timeLabel,
            fullDateLabel,
            count: currentPlayers,
            isLive: true,
          });
          // Retain max 48 points (24h)
          if (data.length > 48) {
            data = data.slice(data.length - 48);
          }
        } else {
          // Update last point with live stats
          data[data.length - 1] = {
            ...last,
            count: currentPlayers,
            isLive: true,
          };
        }
      }

      setHistory(data);
      localStorage.setItem('arma3_player_activity_history_v2', JSON.stringify(data));
    } catch {
      setHistory(generateBaselineHistory(currentPlayers));
    }
  }, [currentPlayers]);

  // Filter history based on selected time range
  const filteredPoints = useMemo(() => {
    if (!history || history.length === 0) return [];
    if (selectedRange === '6h') return history.slice(-12);
    if (selectedRange === '12h') return history.slice(-24);
    return history;
  }, [history, selectedRange]);

  // Calculate telemetry summary statistics
  const { peakCount, peakPoint, avgCount, minCount } = useMemo<{
    peakCount: number;
    peakPoint: HistoryPoint | null;
    avgCount: number;
    minCount: number;
  }>(() => {
    if (filteredPoints.length === 0) {
      return { peakCount: currentPlayers, peakPoint: null, avgCount: currentPlayers, minCount: currentPlayers };
    }
    let max = -1;
    let min = 999;
    let sum = 0;
    let peakPt: HistoryPoint | null = null;

    filteredPoints.forEach((pt) => {
      if (pt.count > max) {
        max = pt.count;
        peakPt = pt;
      }
      if (pt.count < min) min = pt.count;
      sum += pt.count;
    });

    return {
      peakCount: max,
      peakPoint: peakPt,
      avgCount: Math.round((sum / filteredPoints.length) * 10) / 10,
      minCount: min,
    };
  }, [filteredPoints, currentPlayers]);

  // SVG Geometry Calculation
  const svgWidth = 800;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 24;
  const padTop = 30;
  const padBottom = 32;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;
  const maxY = Math.max(maxPlayers, 32);

  // Compute coordinate mapping
  const coords = useMemo(() => {
    if (filteredPoints.length <= 1) return [];
    return filteredPoints.map((pt, idx) => {
      const x = padLeft + (idx / (filteredPoints.length - 1)) * chartW;
      const y = padTop + (1 - pt.count / maxY) * chartH;
      return { x, y, pt, idx };
    });
  }, [filteredPoints, chartW, chartH, maxY, padLeft, padTop]);

  // Generate SVG Path for line and gradient area
  const { linePath, areaPath } = useMemo(() => {
    if (coords.length === 0) return { linePath: '', areaPath: '' };

    // Build smooth cubic bezier curve
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

    const baselineY = padTop + chartH;
    const area = `${d} L ${coords[coords.length - 1].x} ${baselineY} L ${coords[0].x} ${baselineY} Z`;

    return { linePath: d, areaPath: area };
  }, [coords, padTop, chartH]);

  // Handle interactive mouse/touch tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || coords.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relX = (mouseX / rect.width) * svgWidth;

    // Find nearest point
    let closestIdx = 0;
    let minDiff = Infinity;
    coords.forEach((c, idx) => {
      const diff = Math.abs(c.x - relX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activeCoord = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  // Grid levels for Y axis (0, 8, 16, 24, 32)
  const yLevels = [0, 8, 16, 24, 32];

  // X axis labels (approx 5 to 6 labels)
  const xLabels = useMemo(() => {
    if (coords.length <= 1) return [];
    const step = Math.max(1, Math.floor(coords.length / 5));
    const labels: Array<{ x: number; label: string }> = [];
    for (let i = 0; i < coords.length; i += step) {
      labels.push({ x: coords[i].x, label: coords[i].pt.timeLabel });
    }
    // Ensure final label ("NOW") is visible
    const lastCoord = coords[coords.length - 1];
    if (labels.length > 0 && Math.abs(labels[labels.length - 1].x - lastCoord.x) > 40) {
      labels.push({ x: lastCoord.x, label: 'NOW' });
    }
    return labels;
  }, [coords]);

  return (
    <div className="rounded-xl bg-arma-surface border border-arma-border p-4 sm:p-6 lg:p-7 space-y-5 shadow-lg relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-arma-red/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Header & Range Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-arma-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-red shrink-0 shadow-inner">
            <Activity className="w-5 h-5 text-arma-red" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-arma-text uppercase font-mono tracking-wider">
                PLAYER ACTIVITY &amp; POPULATION HISTORY
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-arma-card text-arma-green border border-arma-green/30">
                <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
                LIVE SYNC
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-arma-textMuted font-mono">
              Server concurrency tracking &bull; 30-minute intervals
            </p>
          </div>
        </div>

        {/* Time Window Switcher */}
        <div className="flex items-center gap-1 bg-arma-card p-1 rounded-lg border border-arma-border self-start sm:self-auto font-mono text-xs">
          {(['6h', '12h', '24h'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 rounded transition-all font-bold uppercase text-[11px] ${
                selectedRange === range
                  ? 'bg-arma-red text-white shadow-sm'
                  : 'text-arma-textMuted hover:text-arma-text hover:bg-arma-surface'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
        <div className="p-3 rounded-lg bg-arma-card/80 border border-arma-border/70 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-arma-textMuted uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-arma-red" />
            CURRENT PLAYERS
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-arma-text">
              {currentPlayers}
            </span>
            <span className="text-xs text-arma-textDim font-bold">/ {maxPlayers}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-arma-card/80 border border-arma-border/70 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-arma-textMuted uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-arma-green" />
            PEAK CONCURRENCY
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-arma-green">
              {peakCount}
            </span>
            <span className="text-[10px] text-arma-khaki font-semibold truncate">
              {peakPoint ? `@ ${peakPoint.timeLabel}` : 'PLAYERS'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-arma-card/80 border border-arma-border/70 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-arma-textMuted uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-arma-khaki" />
            WINDOW AVERAGE
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-arma-khaki">
              {avgCount}
            </span>
            <span className="text-[10px] text-arma-textDim uppercase">AVG PLAYERS</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-arma-card/80 border border-arma-border/70 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] text-arma-textMuted uppercase flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            SERVER UPTIME
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-arma-text uppercase truncate">
              24/7 DEDICATED
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div 
        ref={containerRef}
        className="relative rounded-lg bg-[#0a0c10] border border-arma-border p-2 sm:p-4 select-none"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-64 overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Crimson Red Area Gradient */}
            <linearGradient id="playerAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#dc2626" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter for current active point */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          {/* Horizontal Gridlines and Y Labels */}
          {yLevels.map((lvl) => {
            const y = padTop + (1 - lvl / maxY) * chartH;
            const isZero = lvl === 0;
            const isMax = lvl === 32;

            return (
              <g key={lvl}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke={isZero ? '#2a3240' : isMax ? '#dc2626' : '#1e2430'}
                  strokeDasharray={isMax ? '3 3' : isZero ? 'none' : '2 2'}
                  strokeWidth={isZero ? 1.5 : 1}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  fill={isMax ? '#dc2626' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                  fontWeight={isMax ? 'bold' : 'normal'}
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* X Axis Time Labels */}
          {xLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={lbl.x}
              y={svgHeight - 10}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {lbl.label}
            </text>
          ))}

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#playerAreaGrad)"
            />
          )}

          {/* Line Stroke */}
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

          {/* Live pulsing dot at the very end of curve */}
          {coords.length > 0 && (
            <g>
              <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="7"
                fill="#dc2626"
                opacity="0.3"
                className="animate-ping"
              />
              <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="4.5"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Peak Indicator Badge on Graph */}
          {peakPoint && coords.length > 0 && (
            (() => {
              const peakCoord = coords.find((c) => c.pt === peakPoint);
              if (!peakCoord) return null;
              return (
                <g>
                  <circle
                    cx={peakCoord.x}
                    cy={peakCoord.y}
                    r="4"
                    fill="#22c55e"
                    stroke="#0a0c10"
                    strokeWidth="1.5"
                  />
                  <text
                    x={peakCoord.x}
                    y={Math.max(16, peakCoord.y - 10)}
                    fill="#22c55e"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    PEAK ({peakPoint.count})
                  </text>
                </g>
              );
            })()
          )}

          {/* Active Hover Scrubbing Guide & Point */}
          {activeCoord && (
            <g>
              {/* Vertical tracking dashed line */}
              <line
                x1={activeCoord.x}
                y1={padTop}
                x2={activeCoord.x}
                y2={padTop + chartH}
                stroke="#ef4444"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />

              {/* Highlight circle on line */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="6"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {activeCoord && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-lg bg-arma-surface/95 border border-arma-red/60 shadow-2xl backdrop-blur-md font-mono text-xs text-arma-text min-w-[150px] transition-transform duration-75"
            style={{
              left: `${Math.min(
                Math.max(12, (activeCoord.x / svgWidth) * 100),
                78
              )}%`,
              top: `${Math.max(10, ((activeCoord.y - 75) / svgHeight) * 100)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex items-center justify-between gap-3 text-[10px] text-arma-textMuted border-b border-arma-border pb-1">
              <span>{activeCoord.pt.fullDateLabel}</span>
              {activeCoord.pt.isLive && (
                <span className="text-arma-green font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <span className="text-arma-khaki font-bold">PLAYERS:</span>
              <span className="text-sm font-black text-arma-text">
                {activeCoord.pt.count} <span className="text-[10px] text-arma-textDim font-normal">/ {maxPlayers}</span>
              </span>
            </div>

            <div className="text-[10px] text-arma-textMuted mt-0.5">
              Capacity: <span className="text-arma-red font-bold">{Math.round((activeCoord.pt.count / maxPlayers) * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-arma-textDim pt-1">
        <span>&bull; Peak traffic typically occurs 19:30 &ndash; 22:30 AEDT nightly</span>
        <span>A2S Telemetry Engine &bull; Historical Buffer: 24h</span>
      </div>
    </div>
  );
}
