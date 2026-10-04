import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_MODS, ArmaMod } from '@/data/defaultMods';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...DEFAULT_MODS];

  if (category && category !== 'all') {
    filtered = filtered.filter((m) => m.category === category);
  }

  if (query) {
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.id.includes(query) ||
        m.author?.toLowerCase().includes(query) ||
        m.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    total: filtered.length,
    mods: filtered,
  });
}
