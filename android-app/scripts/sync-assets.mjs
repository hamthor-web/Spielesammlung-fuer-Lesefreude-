import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = path.join(root, 'android/app/src/main/assets/public');
// The destination is fixed inside this project and contains generated web assets only.
if (!target.startsWith(path.join(root, 'android') + path.sep)) throw Error('Ungültiges Asset-Ziel');
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(path.join(root, 'www'), target, { recursive: true });
fs.copyFileSync(path.join(root, 'capacitor.config.json'), path.join(root, 'android/app/src/main/assets/capacitor.config.json'));
console.log('Lokale Spiele und aktuelle App-Konfiguration in das Android-Projekt übernommen.');
