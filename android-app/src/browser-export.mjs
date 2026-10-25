import { snapshot, createBackup, validateBackup } from './backup.mjs';
function save() {
  try {
    if (location.origin !== 'https://hamthor-web.github.io') throw Error('Bitte die Sicherung auf hamthor-web.github.io im bisherigen Browser ausführen. Eine lokal geöffnete Datei kann die Browser-Spielstände nicht lesen.');
    const backup = JSON.stringify(createBackup(snapshot(localStorage)), null, 2);
    const { profiles } = validateBackup(backup);
    if (!profiles.length) throw Error('In diesem Browser wurden keine Lesespiele-Profile gefunden. Bitte den Browser und das Gerät verwenden, auf dem die Spielstände liegen.');
    const url = URL.createObjectURL(new Blob([backup], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'Lesespiele-Browser-Spielstaende-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    const status = document.getElementById('migrationStatus');
    if (status) status.textContent = `${profiles.length} Profil(e) wurden zum Sichern bereitgestellt. Bitte die Datei aufbewahren und in der neuen App laden.`;
  } catch (error) {
    const status = document.getElementById('migrationStatus');
    if (status) status.textContent = error.message; else alert(error.message);
  }
}
window.LesespieleBrowserExport = save;
const button = document.getElementById('browserExport');
if (button) button.onclick = save;
else save();
