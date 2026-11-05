import { readdir, readFile, writeFile, mkdir, rm, copyFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'web-source'), target = path.join(root, 'www');
// Unused truncated historical previews stay in the provenance archive, never in the app.
const excludedAssets = new Set(['previews-sharp.webp', 'start-hoch-sharp.webp', 'index-legacy.html', 'lite-policy.js', 'lite-view.js']);
const stripNativeLayout = text => text.replace(/<link rel="stylesheet" href="\.\/native-layout\.css[^"]*">/g, '').replace(/<script src="\.\/native-layout\.js[^"]*" defer><\/script>/g, '');
const nativeMarkup = text => stripNativeLayout(text.replace(/\r\n/g, '\n'))
  .replace(/<(?:script|link)\b[^>]*(?:src|href)="\.\/(?:web-install\.(?:js|css)|web-update\.js|manifest\.webmanifest)"[^>]*>(?:<\/script>)?/g, '')
  .replace(/<script src="\.\/native-runtime\.js"><\/script>/g, '');
const paidMarkup = text => nativeMarkup(text).replace(/<(div|section|p)\b[^>]*class="lite-note"[^>]*>[\s\S]*?<\/\1>/g, '');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const name of await readdir(source)) {
  if (name.startsWith('.') || excludedAssets.has(name)) continue;
  // Reward PNGs are archival originals. Runtime paths resolve to identical existing WebP images.
  if (/^pokal-(?:sport|freizeit|maerchen)-[1-7]\.png$/.test(name)) continue;
  if (['assets', 'world-intros'].includes(name)) { await cp(path.join(source,name),path.join(target,name),{recursive:true}); continue; }
  if (name === 'index.html') {
    let text = paidMarkup(await readFile(path.join(source, name), 'utf8'));
    text = text.replace('<link rel="manifest" href="./manifest.webmanifest">', '');
    const sw = /<script>\s*\(\(\)=>\{\s*const status=document\.getElementById\('offlineStatus'\);[\s\S]*?<\/script>/;
    // Current home source already contains the native offline status; older sources use this block.
    text = text.replace(sw, '<script>document.getElementById("offlineStatus").textContent="Alle Spiele sind in dieser App enthalten und offline verfügbar.";</script>');
    text = text.replace('</head>', '<link rel="stylesheet" href="./native-layout.css"><script src="./native-runtime.js"></script></head>');
    await writeFile(path.join(target, 'home.html'), text);
  } else if (name.endsWith('.html')) {
    let text = paidMarkup(await readFile(path.join(source, name), 'utf8'));
    text = text.replace('</head>', '<link rel="stylesheet" href="./native-layout.css"><script src="./native-layout.js" defer></script></head>');
    await writeFile(path.join(target, name), text);
  } else await copyFile(path.join(source, name), path.join(target, name));
}
await copyFile(path.join(root, 'src/native-layout.js'), path.join(target, 'native-layout.js'));
await copyFile(path.join(root, 'src/native-layout.css'), path.join(target, 'native-layout.css'));
await copyFile(path.join(root, 'src/index.html'), path.join(target, 'index.html'));
await build({ entryPoints: [path.join(root, 'src/native-runtime.mjs')], outfile: path.join(target, 'native-runtime.js'), bundle: true, format: 'iife', target: 'chrome110', minify: true });
const migration = await build({ entryPoints: [path.join(root, 'src/browser-export.mjs')], bundle: true, format: 'iife', target: 'chrome110', minify: true, write: false });
const exporter = migration.outputFiles[0].text;
await writeFile(path.join(root, 'migration/browser-export.js'), exporter);
await writeFile(path.join(root, 'migration/browser-export-bookmarklet.txt'), 'javascript:' + encodeURIComponent(exporter) + '\n');
await writeFile(path.join(root, 'migration/Spielstaende-sichern.html'), `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesespiele sichern</title><style>body{font:18px "Trebuchet MS",Arial;max-width:600px;margin:30px auto;padding:20px;background:#f2f8e9;color:#173c2a}button{font:inherit;padding:14px;border-radius:14px;background:#e7f3e8}p{line-height:1.5}</style></head><body><h1>Spielstände mitnehmen</h1><p>Diese Seite muss auf hamthor-web.github.io im bisherigen Browser geöffnet werden. Sie sichert die vorhandenen Profile und Spielstände. Sie löscht nichts.</p><button id="browserExport">Sicherungsdatei erstellen</button><p id="migrationStatus" role="status"></p><script>${exporter}</script></body></html>`);
console.log('Lokales Spielepaket erstellt. Keine GitHub-Pages-Laufzeitadresse konfiguriert.');

await copyFile(path.join(root,'src/lite-policy.js'),path.join(target,'lite-policy.js'));

await copyFile(path.join(root,'src/lite-view.js'),path.join(target,'lite-view.js'));

// Imported web sources already reference their checked-in optimized assets.
// Preserve the exact current image files and paths without re-encoding.


