import { ArmaMod } from '@/data/defaultMods';

/**
 * Generates an official Bohemia Interactive Arma 3 Launcher preset HTML string.
 * When saved as a .html file, players can simply drag and drop it into their Arma 3 Launcher
 * or click "Import" to automatically subscribe, download, and configure all mods.
 */
export function generateArma3PresetHtml(serverName: string, mods: ArmaMod[]): string {
  const modRows = mods
    .map(
      (mod) => `        <tr data-type="ModContainer">
          <td data-type="DisplayName">${escapeHtml(mod.name)}</td>
          <td>
            <span class="from-steam">Steam</span>
          </td>
          <td>
            <a href="http://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}" data-type="Link">${mod.id}</a>
          </td>
        </tr>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<html>
  <!--Saved by Arma 3 Web Portal Generator-->
  <head>
    <meta name="arma:Type" content="preset" />
    <meta name="arma:PresetName" content="${escapeHtml(serverName)}" />
    <meta name="generator" content="Arma 3 Server Portal (Vercel)" />
    <title>Arma 3 - Preset ${escapeHtml(serverName)}</title>
    <style>
      body {
        margin: 0;
        padding: 0 4em 4em 4em;
        font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background-color: #121820;
        color: #d1d5db;
      }
      h1 {
        margin: 0 0 10px 0;
        padding: 30px 0 10px 0;
        color: #10b981;
        font-size: 26px;
        letter-spacing: 1px;
        border-bottom: 2px solid #10b981;
      }
      .meta {
        font-size: 13px;
        color: #9ca3af;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        background-color: #1a222d;
      }
      th, td {
        padding: 10px 14px;
        text-align: left;
        border-bottom: 1px solid #2b3747;
      }
      th {
        background-color: #0b1017;
        color: #9ca3af;
        text-transform: uppercase;
        font-size: 12px;
      }
      a {
        color: #38bdf8;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .from-steam {
        display: inline-block;
        background-color: #10b981;
        color: #070a0e;
        font-weight: bold;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 3px;
        text-transform: uppercase;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <h1>Arma 3 - Preset: ${escapeHtml(serverName)}</h1>
    <p class="meta">Exported from Server Web Portal &bull; Loaded Mods: ${mods.length} &bull; Drag & drop this file into your official Arma 3 Launcher to load all mods automatically.</p>
    <div class="mod-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Source</th>
            <th>Workshop ID</th>
          </tr>
        </thead>
        <tbody>
${modRows}
        </tbody>
      </table>
    </div>
    <div class="footer">
      Generated for ${escapeHtml(serverName)}. Ready for deployment and Steam Workshop sync.
    </div>
  </body>
</html>`;
}

/**
 * Parses an Arma 3 Launcher HTML preset string and extracts the mod list.
 */
export function parseArma3PresetHtml(htmlContent: string): Partial<ArmaMod>[] {
  const mods: Partial<ArmaMod>[] = [];
  
  // Extract preset name if available
  // Matches: <meta name="arma:PresetName" content="..." />
  const presetMatch = htmlContent.match(/<meta\s+name=["']arma:PresetName["']\s+content=["'](.*?)["']/i);
  
  // Regex to extract table rows with data-type="ModContainer"
  // or links with steam file details
  const regex = /<tr[^>]*data-type=["']ModContainer["'][^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = regex.exec(htmlContent)) !== null) {
    const rowHtml = match[1];

    // Extract display name: <td data-type="DisplayName">...</td>
    const nameMatch = rowHtml.match(/<td[^>]*data-type=["']DisplayName["'][^>]*>([\s\S]*?)<\/td>/i);
    const rawName = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unnamed Mod';

    // Extract workshop ID: id=(\d+)
    const idMatch = rowHtml.match(/id=(\d+)/i) || rowHtml.match(/data-type=["']Link["'][^>]*>(\d+)</i);
    const id = idMatch ? idMatch[1] : '';

    if (id) {
      mods.push({
        id,
        name: unescapeHtml(rawName),
        category: categorizeMod(rawName),
        required: true,
        steamUrl: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`
      });
    }
  }

  // Fallback: If no ModContainer rows, match all steam workshop links
  if (mods.length === 0) {
    const fallbackRegex = /steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+)/gi;
    const seenIds = new Set<string>();
    let fallbackMatch;
    while ((fallbackMatch = fallbackRegex.exec(htmlContent)) !== null) {
      const id = fallbackMatch[1];
      if (!seenIds.has(id)) {
        seenIds.add(id);
        mods.push({
          id,
          name: `Workshop Mod #${id}`,
          category: 'core',
          required: true,
          steamUrl: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`
        });
      }
    }
  }

  return mods;
}

function categorizeMod(name: string): ArmaMod['category'] {
  const lower = name.toLowerCase();
  if (lower.includes('cba') || lower.includes('framework') || lower.includes('core')) return 'core';
  if (lower.includes('ace') || lower.includes('medical') || lower.includes('kat') || lower.includes('realism')) return 'realism';
  if (lower.includes('rhs') || lower.includes('weapon') || lower.includes('vehicle') || lower.includes('cup units') || lower.includes('cup weapons')) return 'equipment';
  if (lower.includes('terrain') || lower.includes('map') || lower.includes('island') || lower.includes('cup terrains')) return 'terrain';
  if (lower.includes('tfar') || lower.includes('radio') || lower.includes('sound') || lower.includes('jsrs') || lower.includes('acre')) return 'audio';
  if (lower.includes('zeus') || lower.includes('zen') || lower.includes('admin') || lower.includes('server')) return 'server';
  return 'qol';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}
