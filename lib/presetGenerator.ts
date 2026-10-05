import { ArmaMod } from '@/data/defaultMods';

/**
 * Generates an official Bohemia Interactive Arma 3 Launcher preset HTML string.
 * This format matches the official Arma 3 Launcher format byte-for-byte,
 * preventing dependency mismatches, missing addons, or "a3a_maps" errors.
 */
export function generateArma3PresetHtml(serverName: string, mods: ArmaMod[]): string {
  const cleanName = serverName && serverName.trim().length > 0 && !serverName.includes('Dedicated')
    ? serverName.trim()
    : 'FAS';

  const modRows = mods
    .map(
      (mod) => `        <tr data-type="ModContainer">
          <td data-type="DisplayName">${escapeHtml(mod.name)}</td>
          <td>
            <span class="from-steam">Steam</span>
          </td>
          <td>
            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}" data-type="Link">https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}</a>
          </td>
        </tr>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<html>
  <!--Created by Arma 3 Launcher: https://arma3.com-->
  <head>
    <meta name="arma:Type" content="preset" />
    <meta name="arma:PresetName" content="${escapeHtml(cleanName)}" />
    <meta name="generator" content="Arma 3 Launcher - https://arma3.com" />
    <title>Arma 3</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" />
    <style>
body {
	margin: 0;
	padding: 0;
	color: #fff;
	background: #000;	
}

body, th, td {
	font: 95%/1.3 Roboto, Segoe UI, Tahoma, Arial, Helvetica, sans-serif;
}

td {
    padding: 3px 30px 3px 0;
}

h1 {
    padding: 20px 20px 0 20px;
    color: white;
    font-weight: 200;
    font-family: segoe ui;
    font-size: 3em;
    margin: 0;
}

em {
    font-variant: italic;
    color:silver;
}

.before-list {
    padding: 5px 20px 10px 20px;
}

.mod-list {
    background: #222222;
    padding: 20px;
}

.dlc-list {
    background: #222222;
    padding: 20px;
}

.footer {
    padding: 20px;
    color:gray;
}

.whups {
    color:gray;
}

a {
    color: #D18F21;
    text-decoration: underline;
}

a:hover {
    color:#F1AF41;
    text-decoration: none;
}

.from-steam {
    color: #449EBD;
}
.from-local {
    color: gray;
}

</style>
  </head>
  <body>
    <h1>Arma 3  - Preset <strong>${escapeHtml(cleanName)}</strong></h1>
    <p class="before-list">
      <em>To import this preset, drag this file onto the Launcher window. Or click the MODS tab, then PRESET in the top right, then IMPORT at the bottom, and finally select this file.</em>
    </p>
    <div class="mod-list">
      <table>
${modRows}
      </table>
    </div>
    <div class="dlc-list">
      <table />
    </div>
    <div class="footer">
      <span>Created by Arma 3 Launcher by Bohemia Interactive.</span>
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
  if (lower.includes('cba') || lower.includes('antistasi') || lower.includes('zeus') || lower.includes('zen')) return 'core';
  if (lower.includes('rhs') || lower.includes('gref') || lower.includes('saf')) return 'equipment';
  if (lower.includes('movement') || lower.includes('running') || lower.includes('animation') || lower.includes('recoil') || lower.includes('sway') || lower.includes('stamina') || lower.includes('grass')) return 'realism';
  if (lower.includes('sound') || lower.includes('sfx') || lower.includes('jsrs') || lower.includes('audio')) return 'audio';
  if (lower.includes('blastcore') || lower.includes('craters') || lower.includes('blood') || lower.includes('dirt') || lower.includes('thermal') || lower.includes('aero')) return 'visuals';
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
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}
