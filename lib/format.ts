/** Display helpers. Every formatter returns "unknown" for missing values. */

export const UNKNOWN = 'unknown';

export function formatUptime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return UNKNOWN;
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatAge(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return UNKNOWN;
  if (seconds < 60) return `${Math.round(seconds)}s ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
}

export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value == null || !Number.isFinite(value)) return UNKNOWN;
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(value) >= 10_000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toFixed(digits);
}

export function formatBool(value: boolean | null | undefined, yes = 'On', no = 'Off'): string {
  if (value == null) return UNKNOWN;
  return value ? yes : no;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) return UNKNOWN;
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/** "3h ago", "2d ago", "Mar 2025" for older dates. */
export function formatSince(isoDate: string | null | undefined): string {
  if (!isoDate) return UNKNOWN;
  const t = new Date(isoDate).getTime();
  if (!Number.isFinite(t)) return UNKNOWN;
  const s = (Date.now() - t) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 45) return `${Math.floor(s / 86400)}d ago`;
  return new Date(t).toLocaleDateString([], { month: 'short', year: 'numeric' });
}

/** True when a value is worth showing (not null/undefined/NaN/empty). */
export function has<T>(v: T | null | undefined): v is T {
  if (v == null) return false;
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'string') return v.trim().length > 0;
  return true;
}
