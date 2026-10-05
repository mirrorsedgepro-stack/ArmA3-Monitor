import { NextRequest, NextResponse } from 'next/server';
import { generateArma3PresetHtml, parseArma3PresetHtml } from '@/lib/presetGenerator';
import { DEFAULT_MODS, ArmaMod } from '@/data/defaultMods';
import { DEFAULT_SERVER_CONFIG } from '@/data/defaultServer';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serverName = searchParams.get('serverName') || 'FAS';
  
  const html = generateArma3PresetHtml(serverName, DEFAULT_MODS);
  
  const filename = 'FAS_Preset.html';

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (!body || body.trim().length === 0) {
      return NextResponse.json({ error: 'Preset content is empty' }, { status: 400 });
    }

    const parsedMods = parseArma3PresetHtml(body);

    return NextResponse.json({
      success: true,
      count: parsedMods.length,
      mods: parsedMods,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to parse preset' }, { status: 500 });
  }
}
