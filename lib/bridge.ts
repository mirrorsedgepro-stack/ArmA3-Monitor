import { DEFAULT_SERVER_CONFIG } from '@/data/defaultServer';

/** Base URL of the telemetry bridge running on the game host (port 2310). */
export function bridgeBaseUrl(): string {
  if (process.env.TELEMETRY_BRIDGE_URL) {
    // Accept either the base URL or the legacy .../api/telemetry form.
    return process.env.TELEMETRY_BRIDGE_URL.replace(/\/api\/telemetry\/?$/, '').replace(/\/$/, '');
  }
  const port = process.env.TELEMETRY_PORT || `${DEFAULT_SERVER_CONFIG.telemetryPort || 2310}`;
  return `http://${DEFAULT_SERVER_CONFIG.ip}:${port}`;
}

/** GET a bridge endpoint; resolves to null if the bridge is unreachable or errors. */
export async function bridgeFetch<T>(path: string, timeoutMs = 3000): Promise<T | null> {
  const headers: Record<string, string> = {};
  if (process.env.TELEMETRY_API_KEY) headers['x-api-key'] = process.env.TELEMETRY_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${bridgeBaseUrl()}${path}`, { headers, signal: controller.signal, cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
