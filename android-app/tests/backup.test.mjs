import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBackup, validateBackup, snapshot, replaceData, PROFILE_KEY, ACTIVE_KEY } from '../src/backup.mjs';
class MemoryStorage {
  map = new Map();
  get length() { return this.map.size; }
  key(i) { return [...this.map.keys()][i] ?? null; }
  getItem(key) { return this.map.get(key) ?? null; }
  setItem(key, val) { this.map.set(key, String(val)); }
  removeItem(key) { this.map.delete(key); }
}
const profile = { id: 'abc-123', name: 'Abdullah' };
const game = 'lesespiele-v1:abc-123:park';
const data = { [PROFILE_KEY]: JSON.stringify([profile]), [ACTIVE_KEY]: profile.id,
  [game]: JSON.stringify({ decks: { baum: { pos: 3 } }, completed: ['baum'], colors: { baum: '#ff0000' } }),
  'interaktive-geschichten-ansicht-v1': '0.85' };
test('Sicherung erhält Profil-ID, Lesefortschritt und Farben unverändert', () => {
  const backup = validateBackup(JSON.stringify(createBackup(data)));
  assert.deepEqual({ ...backup.data }, data);
  assert.deepEqual(backup.profiles, [profile]);
});
test('Keine fremden Website-Daten im Export', () => {
  const storage = new MemoryStorage();
  for (const [k, v] of Object.entries(data)) storage.setItem(k, v);
  storage.setItem('anderes-spiel', 'privat');
  assert.deepEqual({ ...snapshot(storage) }, data);
});
test('Defekte, fremde und nicht zugeordnete Daten werden abgewiesen', () => {
  assert.throws(() => validateBackup('{'), /gültige Sicherung/);
  assert.throws(() => validateBackup(JSON.stringify({ ...createBackup(data), version: 2 })), /passende/);
  assert.throws(() => validateBackup(JSON.stringify(createBackup({ ...data, 'anderes-spiel': 'x' }))), /unpassende/);
  assert.throws(() => validateBackup(JSON.stringify(createBackup({ ...data, 'lesespiele-v1:missing:park': '{}' }))), /gültigen Profil/);
  assert.throws(() => validateBackup(JSON.stringify(createBackup({ ...data, [game]: 'kaputt' }))), /beschädigt/);
});
test('Import ersetzt nur Lesespieldaten und entfernt alte Profile', () => {
  const storage = new MemoryStorage();
  storage.setItem(PROFILE_KEY, '[]'); storage.setItem('lesespiele-v1:old:park', '{}'); storage.setItem('fremd', 'behalten');
  replaceData(storage, data);
  assert.equal(storage.getItem('fremd'), 'behalten');
  assert.equal(storage.getItem('lesespiele-v1:old:park'), null);
  assert.deepEqual({ ...snapshot(storage) }, data);
});
test('Speicherfehler beim Import stellt vorherige Daten wieder her', () => {
  const storage = new MemoryStorage();
  const previous = { [PROFILE_KEY]: '[]', 'interaktive-geschichten-ansicht-v1': '1' };
  for (const [k, v] of Object.entries(previous)) storage.setItem(k, v);
  const original = storage.setItem.bind(storage);
  let failed = false;
  storage.setItem = (k, v) => { if (k === game && !failed) { failed = true; throw Error('QuotaExceeded'); } original(k, v); };
  assert.throws(() => replaceData(storage, data), /QuotaExceeded/);
  assert.deepEqual({ ...snapshot(storage) }, previous);
});
