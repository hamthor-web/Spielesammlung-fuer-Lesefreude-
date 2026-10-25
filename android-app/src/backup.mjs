export const BACKUP_FORMAT = 'heike-lesespiele-backup';
export const PROFILE_KEY = 'lesespiele-profile-v1';
export const ACTIVE_KEY = 'lesespiele-active-v1';
export const MAX_BACKUP_BYTES = 8 * 1024 * 1024;
export function isGameKey(key) {
  return key === PROFILE_KEY || key === ACTIVE_KEY || key.startsWith('lesespiele-v1:') ||
    key === 'interaktive-geschichten-ansicht-v1';
}
export function snapshot(storage) {
  const data = Object.create(null);
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && isGameKey(key)) data[key] = storage.getItem(key);
  }
  return data;
}
export function createBackup(data) {
  return { format: BACKUP_FORMAT, version: 1, createdAt: new Date().toISOString(), data };
}
export function validateBackup(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BACKUP_BYTES)
    throw Error('Die Sicherungsdatei ist zu groß.');
  let value;
  try { value = JSON.parse(text); } catch { throw Error('Die Datei enthält keine gültige Sicherung.'); }
  if (!value || value.format !== BACKUP_FORMAT || value.version !== 1 ||
      !value.data || typeof value.data !== 'object' || Array.isArray(value.data))
    throw Error('Diese Datei ist keine passende Lesespiele-Sicherung.');
  const data = Object.create(null);
  for (const [key, val] of Object.entries(value.data)) {
    if (!isGameKey(key) || typeof val !== 'string') throw Error('Die Sicherung enthält unpassende Daten.');
    data[key] = val;
  }
  let profiles;
  try { profiles = JSON.parse(data[PROFILE_KEY] || '[]'); } catch { throw Error('Die Profilliste ist beschädigt.'); }
  if (!Array.isArray(profiles) || profiles.length > 1000)
    throw Error('Die Profilliste ist ungültig.');
  const ids = new Set();
  for (const p of profiles) {
    if (!p || typeof p.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(p.id) ||
        typeof p.name !== 'string' || !p.name.trim() || p.name.length > 32 || ids.has(p.id))
      throw Error('Die Sicherung enthält ein ungültiges Profil.');
    ids.add(p.id);
  }
  if (data[ACTIVE_KEY] && !ids.has(data[ACTIVE_KEY])) throw Error('Das aktive Profil fehlt in der Sicherung.');
  for (const [key, val] of Object.entries(data)) {
    if (!key.startsWith('lesespiele-v1:')) continue;
    const match = key.match(/^lesespiele-v1:([a-zA-Z0-9-]+):(dice-freizeit|dice-sport|dice-maerchen|park|football|crazy|finde)(:imported)?$/);
    if (!match || !ids.has(match[1])) throw Error('Ein Spielstand gehört zu keinem gültigen Profil.');
    if (match[3]) { if (val !== '1') throw Error('Ungültiger Übernahmemarker.'); continue; }
    try {
      const state = JSON.parse(val);
      if (!state || typeof state !== 'object' || Array.isArray(state)) throw Error();
    } catch { throw Error('Ein Spielstand ist beschädigt.'); }
  }
  return { data, profiles };
}
// Synchronous transaction for the existing synchronous game storage API.
// Failed imports restore the previous data, including keys not in the backup.
export function replaceData(storage, data) {
  const previous = snapshot(storage);
  const remove = () => {
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i);
      if (key && isGameKey(key)) storage.removeItem(key);
    }
  };
  try {
    remove();
    for (const [key, val] of Object.entries(data)) storage.setItem(key, val);
  } catch (error) {
    remove();
    for (const [key, val] of Object.entries(previous)) storage.setItem(key, val);
    throw error;
  }
}
