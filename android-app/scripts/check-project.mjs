import { readdir, readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { checkExternalLinks } from './check-external-links.mjs';
const json = async p => JSON.parse(await readFile(new URL('../' + p, import.meta.url), 'utf8'));
const config = await json('capacitor.config.json');
assert.equal(config.appId, 'de.heikeamthor.lesespiele');
assert.equal(config.webDir, 'www');
assert.ok(!config.server.url, 'Entfernte Startadresse ist nicht erlaubt.');
const source = await json('source-provenance.json');
const lite = await json('lite-source-provenance.json');
const overrides = new Map(lite.files.map(f => [f.path, f.sha256]));
for (const f of source.files) {
  const bytes = await readFile(new URL('../web-source/' + f.path, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), overrides.get(f.path) || f.sha256, 'Quelle verändert: ' + f.path);
}
for (const f of lite.files) {
  const bytes = await readFile(new URL('../web-source/' + f.path, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256, 'Dokumentierte Quelle verändert: ' + f.path);
}
for (const name of await readdir(new URL('../www/', import.meta.url))) {
  if (!/\.(html|js|css)$/.test(name)) continue;
  const text = await readFile(new URL('../www/' + name, import.meta.url), 'utf8');
  assert.ok(!text.includes('serviceWorker.register('), 'Service Worker im lokalen Paket: ' + name);
  assert.ok(!['beforeinstallprompt', 'web-install.js', 'web-install.css'].some(marker => text.includes(marker)), 'Web-Installation im nativen Paket: ' + name);
  const externalLinks=checkExternalLinks(name,text);
  for (const ref of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const value = ref[1].split(/[?#]/)[0];
    if (!value || value.includes('${') || value.startsWith('data:') || value.startsWith('javascript:') || value.startsWith('mailto:') || value.startsWith('tel:') || externalLinks.has(value)) continue;
    await access(new URL('../www/' + value.replace(/^\.\//, ''), import.meta.url));
  }
}
console.log('Dokumentierte Quellen stimmen überein; lokale Verweise vorhanden; kein Service Worker, keine Web-Installation und keine extern geladenen Ressourcen; nur geprüfte externe Verweise in den Rechtstexten.');

