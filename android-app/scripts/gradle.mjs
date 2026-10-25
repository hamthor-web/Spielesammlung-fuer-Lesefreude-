import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const settings = JSON.parse(readFileSync(new URL('../release-settings.json', import.meta.url)));
const config = JSON.parse(readFileSync(new URL('../capacitor.config.json', import.meta.url)));
const task = process.argv[2];
if (!['assembleDebug', 'assembleRelease', 'bundleRelease'].includes(task)) throw Error('Unbekannter Build.');
if (task !== 'assembleDebug') {
  if (settings.packageId !== config.appId)
    throw Error('Die Paket-ID in release-settings.json stimmt nicht mit capacitor.config.json überein.');
  if (!Number.isInteger(settings.versionCode) || settings.versionCode < 2) throw Error('Versionscode muss höher als der bisher veröffentlichte Code sein.');
  for (const key of ['LESESPIELE_KEYSTORE', 'LESESPIELE_STORE_PASSWORD', 'LESESPIELE_KEY_ALIAS', 'LESESPIELE_KEY_PASSWORD'])
    if (!process.env[key]) throw Error('Signierung fehlt: ' + key);
}
const windows = process.platform === 'win32';
const result = spawnSync(windows ? 'gradlew.bat' : './gradlew', [task], { cwd: new URL('../android/', import.meta.url), stdio: 'inherit', shell: windows });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
