import { NextResponse } from 'next/server';
import { bridgeFetchBytes } from '@/lib/bridge';

export const dynamic = 'force-dynamic';

/**
 * Arma-style map tile rendered by the bridge. The URL carries the tile-set version, so a tile
 * never changes: Vercel's edge cache keeps it for a year and the game host serves it once.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ version: string; z: string; x: string; y: string }> },
) {
  const { version, z, x, y } = await params;
  const yNum = y.replace(/\.png$/, '');
  if (!/^[0-9a-f]{12}$/.test(version) || ![z, x, yNum].every((v) => /^\d{1,3}$/.test(v))) {
    return NextResponse.json({ error: 'Bad tile' }, { status: 400 });
  }
  const png = await bridgeFetchBytes(`/api/map/tiles/${version}/${z}/${x}/${yNum}.png`);
  if (!png) {
    return NextResponse.json({ error: 'Tile not available' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  return new NextResponse(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
    },
  });
}
