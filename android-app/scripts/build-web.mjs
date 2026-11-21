import { readdir, readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'web-source'), target = path.join(root, 'www');
// Unused truncated historical previews stay in the provenance archive, never in the app.
const shared = path.resolve(root, '..');
const sharedDicePages = new Set(['wuerfeln-freizeit.html', 'wuerfeln-maerchen.html', 'wuerfeln-sport.html']);
const sharedDiceScripts = ['dice-bird-flight.js', 'dice-owl-animation.js', 'dice-rewards.js'];
const sharedAssetPaths = new Set();
const excludedAssets = new Set(['previews-sharp.webp', 'start-hoch-sharp.webp']);
const paidMarkup = text => text.replace(/<(div|section|p)\b[^>]*class="lite-note"[^>]*>[\s\S]*?<\/\1>/g, '');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const name of await readdir(source)) {
  if (name.startsWith('.') || name.endsWith('.png') || excludedAssets.has(name)) continue;
  if (name === 'index.html') {
    let text = paidMarkup(await readFile(path.join(source, name), 'utf8'));
    text = text.replace('<link rel="manifest" href="./manifest.webmanifest">', '');
    const sw = /<script>\s*\(\(\)=>\{\s*const status=document\.getElementById\('offlineStatus'\);[\s\S]*?<\/script>/;
    if (!sw.test(text)) throw Error('Offline-Abschnitt der Quelle wurde geändert; Anpassung prüfen.');
    text = text.replace(sw, '<script>document.getElementById("offlineStatus").textContent="Alle Spiele sind in dieser App enthalten und offline verfügbar.";</script>');
    text = text.replace('</head>', '<link rel="stylesheet" href="./native-layout.css"><script src="./native-runtime.js"></script></head>');
    await writeFile(path.join(target, 'home.html'), text);
  } else if (name.endsWith('.html')) {
    const from = sharedDicePages.has(name) ? shared : source;
    let text = paidMarkup(await readFile(path.join(from, name), 'utf8'));
    if (from === shared) {
      // The native build supplies its layout and image map below.
      text = text.replace(/<link rel="stylesheet" href="\.\/native-layout\.css">/g, '')
        .replace(/<script src="\.\/(?:native-layout\.js|image-paths\.js)"[^>]*><\/script>/g, '')
        .replace(/window\.LeseImagePath\((`\.\/pokal-[^`]+`)\)/g, '$1');
      for (const asset of text.match(/assets\/[a-z0-9-]+\.(?:webp|png|gif)/g) ?? []) sharedAssetPaths.add(asset);
    }
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

const { optimizeImages } = await import('./optimize-images.mjs');
await optimizeImages(root, target);

// Bundle the original frames and playback code for offline use.
for (const name of ['world-intros.js', 'world-intros.css', ...sharedDiceScripts]) {
  await copyFile(path.join(shared, name), path.join(target, name));
}
await mkdir(path.join(target, 'world-intros'));
for (const world of ['dice', 'stories', 'crazy']) {
  for (let frame = 0; frame < 12; frame++) {
    const name = `world-intros/${world}-${String(frame).padStart(2, '0')}.webp`;
    await copyFile(path.join(shared, name), path.join(target, name));
  }
}
for (const name of sharedDiceScripts) {
  const text = await readFile(path.join(shared, name), 'utf8');
  for (const asset of text.match(/assets\/[a-z0-9-]+\.(?:webp|png|gif)/g) ?? []) sharedAssetPaths.add(asset);
}
for (const asset of sharedAssetPaths) {
  await copyFile(path.join(shared, asset), path.join(target, asset));
}
