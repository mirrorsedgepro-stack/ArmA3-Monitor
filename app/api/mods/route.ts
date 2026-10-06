import { NextResponse } from 'next/server';
import { DEFAULT_MODS } from '@/data/defaultMods';

export const revalidate = 21600; // Steam Workshop metadata changes rarely

export interface WorkshopDetails {
  title: string;
  fileSize: number;
  updatedAt: string;
  subscriptions: number | null;
}

export interface ModsResponse {
  available: boolean;
  details: Record<string, WorkshopDetails>;
}

/**
 * Real Workshop metadata (size, last update, subscribers) for the server's mods,
 * straight from Steam's public GetPublishedFileDetails API. Mods Steam does not
 * return are simply absent from `details`.
 */
export async function GET() {
  const body = new URLSearchParams({ itemcount: String(DEFAULT_MODS.length) });
  DEFAULT_MODS.forEach((m, i) => body.append(`publishedfileids[${i}]`, m.id));

  let result: ModsResponse = { available: false, details: {} };
  try {
    const res = await fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', {
      method: 'POST',
      body,
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const details: Record<string, WorkshopDetails> = {};
      for (const f of data?.response?.publishedfiledetails ?? []) {
        if (f.result !== 1) continue;
        const size = Number(f.file_size);
        details[f.publishedfileid] = {
          title: f.title,
          fileSize: Number.isFinite(size) ? size : 0,
          updatedAt: new Date(f.time_updated * 1000).toISOString(),
          subscriptions: typeof f.subscriptions === 'number' ? f.subscriptions : null,
        };
      }
      result = { available: Object.keys(details).length > 0, details };
    }
  } catch (err) {
    console.warn('Steam Workshop query failed:', err);
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` },
  });
}
