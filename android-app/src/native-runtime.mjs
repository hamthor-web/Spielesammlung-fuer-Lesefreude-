import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { mountNavigation } from './navigation.mjs';
import { snapshot, createBackup, validateBackup, replaceData, isGameKey, MAX_BACKUP_BYTES } from './backup.mjs';

const native = Capacitor.isNativePlatform();
const BackupFiles = registerPlugin('BackupFiles');
const MIRROR = 'lesespiele-backup-v1';
const MARKER = 'lesespiele-native-initialized';
let writeQueue = Promise.resolve();
let importing = false;
let storageError = '';
let startupError = null;
const tell = text => {
  const status = document.getElementById('backupStatus');
  if (status) status.textContent = text;
};
function report(error) {
  storageError = 'Die zusätzliche Sicherung konnte nicht gespeichert werden. Bitte eine Sicherungsdatei erstellen.';
  console.error('Lesespiele-Sicherung:', error);
  tell(storageError);
}
function persist() {
  if (!native || importing) return writeQueue;
  const value = JSON.stringify(createBackup(snapshot(localStorage)));
  const next = writeQueue.then(() => Preferences.set({ key: MIRROR, value }));
  writeQueue = next.catch(report);
  return next;
}
const ready = (async () => {
  if (!native) return;
  const { value } = await Preferences.get({ key: MIRROR });
  if (!Object.keys(snapshot(localStorage)).length && !localStorage.getItem(MARKER) && value) {
    const backup = validateBackup(value);
    importing = true;
    try { replaceData(localStorage, backup.data); } finally { importing = false; }
  }
  localStorage.setItem(MARKER, '1');
  await persist();
})();
// Attach a rejection observer without turning failed restoration into a fresh start.
ready.catch(error => { startupError = error; report(error); });

const proto = Storage.prototype;
for (const method of ['setItem', 'removeItem', 'clear']) {
  const original = proto[method];
  proto[method] = function (...args) {
    const result = original.apply(this, args);
    if (this === localStorage && (method === 'clear' || isGameKey(String(args[0])))) persist().catch(report);
    return result;
  };
}
// Game iframes share the local origin. Their writes dispatch storage events here.
addEventListener('storage', e => {
  if (e.storageArea === localStorage && (!e.key || isGameKey(e.key))) persist().catch(report);
});

async function exportBackup() {
  const data = JSON.stringify(createBackup(snapshot(localStorage)), null, 2);
  validateBackup(data);
  const fileName = 'Lesespiele-Spielstaende-' + new Date().toISOString().slice(0, 10) + '.json';
  if (native) {
    const result = await BackupFiles.save({ name: fileName, data });
    tell(result.canceled ? 'Speichern abgebrochen.' : 'Die Sicherungsdatei wurde am gewählten Ort gespeichert.');
  } else {
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    tell('Die Sicherungsdatei wurde zum Herunterladen bereitgestellt.');
  }
}
async function importBackup(file) {
  if (!file || file.size > MAX_BACKUP_BYTES) throw Error('Die Sicherungsdatei ist zu groß oder fehlt.');
  const { data, profiles } = validateBackup(await file.text());
  if (!confirm(`Die Sicherung enthält ${profiles.length} Profil(e). Die bisherigen Profile und Spielstände in dieser App werden ersetzt. Vorher am besten eine Sicherung erstellen. Fortfahren?`)) return;
  await writeQueue;
  const previous = snapshot(localStorage);
  importing = true;
  try {
    replaceData(localStorage, data);
    if (native) await Preferences.set({ key: MIRROR, value: JSON.stringify(createBackup(data)) });
  } catch (error) {
    replaceData(localStorage, previous);
    throw error;
  } finally { importing = false; }
  sessionStorage.removeItem('lesespiele-profile-selected');
  location.replace('./index.html');
}

async function chooseBackup() {
  await ready;
  if (!native) { document.getElementById('backupFile').click(); return; }
  const result = await BackupFiles.open();
  if (result.canceled) { tell('Wiederherstellen abgebrochen.'); return; }
  await importBackup(new File([result.data], 'Lesespiele-Spielstaende.json', { type: 'application/json' }));
}

function handleBack() {
  const gameDocument = document.getElementById?.('previewFrame')?.contentDocument;
  const gameDialogs = [...(gameDocument?.querySelectorAll('dialog[open]') || [])];
  if (gameDialogs.length) { gameDialogs.at(-1).close(); return; }
  const dialogs = [...document.querySelectorAll('dialog[open]')];
  if (dialogs.length) { dialogs.at(-1).close(); return; }
  const overlay = document.querySelector('.profile-overlay');
  if (overlay) {
    overlay.dispatchEvent(new Event('profile-cancel'));
    return;
  }
  if (window.LeseNavigation) { window.LeseNavigation.back(); return; }
  const shell = document.getElementById('previewShell');
  if (shell && !shell.hidden) { document.getElementById('previewBackCategory').click(); return; }
  if (location.hash) {
    history.replaceState(null, '', location.pathname);
    dispatchEvent(new PopStateEvent('popstate'));
    return;
  }
  if (native) persist().finally(() => App.exitApp());
}

function mountLegal() {
  const panel=document.getElementById('adultPanel');
  if(!panel||document.getElementById('legalDialog'))return;
  const titles={'impressum.html':'Impressum','datenschutz.html':'Datenschutz'};
  const style=document.createElement('style');
  style.textContent='.legal-entries{border-top:1px solid #abc49b;margin-top:20px;padding-top:8px}.legal-entries a{display:inline-block;padding:8px 0;overflow-wrap:anywhere}.legal-email{font-size:.95em;overflow-wrap:anywhere}dialog.legal-dialog{box-sizing:border-box;width:min(780px,96vw);height:92dvh;max-height:92dvh;max-width:96vw;padding:0;border:2px solid #8ca184;border-radius:18px;background:#f3f8ed;color:#173c2a;overflow:hidden}dialog.legal-dialog[open]{display:grid;grid-template-rows:auto minmax(0,1fr)}.legal-dialog::backdrop{background:#142b36ba}.legal-dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:#fffdf0;border-bottom:1px solid #abc49b}.legal-dialog h2{margin:0;font:800 20px Arial,sans-serif}.legal-dialog button{min-height:44px;padding:8px 14px;border:2px solid #8ca184;border-radius:12px;background:#e7f3e8;color:#173c2a;font:800 17px Arial,sans-serif}.legal-dialog iframe{display:block;width:100%;height:100%;min-height:0;border:0}';
  document.head.append(style);
  const dialog=document.createElement('dialog');dialog.id='legalDialog';dialog.className='legal-dialog';dialog.setAttribute('aria-labelledby','legalTitle');
  dialog.innerHTML='<header><h2 id="legalTitle"></h2><button type="button" autofocus>← Zurück</button></header><iframe title="Rechtliche Hinweise" referrerpolicy="no-referrer"></iframe>';
  document.body.append(dialog);
  const frame=dialog.querySelector('iframe'),heading=dialog.querySelector('h2'),close=dialog.querySelector('button');let opener;
  panel.querySelectorAll('[data-legal]').forEach(button=>button.addEventListener('click',()=>{
    const file=button.dataset.legal;if(!Object.hasOwn(titles,file))return;
    opener=button;heading.textContent=titles[file];frame.title=titles[file];frame.src='./'+file;dialog.showModal();close.focus();
  }));
  frame.addEventListener('load',()=>{
    const title=frame.contentDocument?.querySelector('h1')?.textContent;
    if(title){heading.textContent=title;frame.title=title;}
  });
  close.onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{frame.removeAttribute('src');opener?.focus();});
}

function mount() {
  mountLegal();
  mountNavigation();
  const panel = document.getElementById('adultPanel');
  if (!panel) return;
  const actions = document.createElement('div');
  actions.innerHTML = '<hr><h3>Spielstände sichern</h3><button type="button" id="exportBackup">Sicherungsdatei erstellen</button><button type="button" id="importBackup">Sicherungsdatei laden</button><input id="backupFile" type="file" accept=".json,application/json" hidden><p id="backupStatus" role="status" aria-live="polite"></p>';
  panel.insertBefore(actions, document.getElementById('adultClose'));
  const input = document.getElementById('backupFile');
  document.getElementById('exportBackup').onclick = () => exportBackup().catch(e => tell(e.message));
  document.getElementById('importBackup').onclick = () => chooseBackup().catch(e => tell(e.message));
  input.onchange = async () => {
    try { await importBackup(input.files[0]); } catch (e) { tell(e.message); }
    input.value = '';
  };
  tell(storageError || 'Die Sicherung enthält alle Profile und Spielstände auf diesem Gerät.');
  if (native) {
    App.addListener('backButton', handleBack).catch(report);
    App.addListener('appStateChange', state => { if (!state.isActive) persist().catch(report); }).catch(report);
  }
}
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mount, { once: true });
else mount();
window.LesespieleNative = { ready, exportBackup, importBackup, chooseBackup, persist, handleBack,
  get startupError() { return startupError; } };
