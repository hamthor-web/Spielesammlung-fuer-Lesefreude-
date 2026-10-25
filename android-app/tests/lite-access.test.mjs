import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');
test('Kaufversion öffnet alle Inhalte ohne Konto, Kaufcache oder Internet',()=>{
 const window={};vm.runInNewContext(read('src/lite-policy.js'),{window});
 assert.equal(window.LeseLite.full,true);
 for(const key of ['park','football'])assert.deepEqual(Array.from(window.LeseLite.storyIds(key,['a','b','c'])),['a','b','c']);
 for(const key of ['finde','crazy'])assert.deepEqual(Array.from(window.LeseLite.taskIds(key,[1,2,3])),[1,2,3]);
});
test('Kaufversion enthält keine Kaufmenüs oder Billing-Berechtigung',()=>{
 const runtime=read('www/native-runtime.js');
 for(const marker of ['LesespieleBilling','buyFull','restoreFull','billingDiagnostics','app-license-gate'])assert.ok(!runtime.includes(marker),marker);
 assert.ok(!read('www/home.html').includes('Die Lite-Version ist kostenlos'));
 assert.ok(!read('android/app/src/main/AndroidManifest.xml').includes('com.android.vending.BILLING'));
});
test('Ausmalbilder behalten ihre gesamte Flächenreihenfolge; Fortschritt wird nicht abgeschnitten', () => {
  for (const file of ['finde-den-fehler.html','verruecktes-fussball.html']) {
    const source = read('web-source/'+file);
    assert.ok(source.includes('const normalized=areaIds.map(String), allowed=ids.map(String)'));
    assert.ok(source.includes('saved.completed=[...new Set([...saved.completed,...completed])]'));
  }
  assert.ok(read('web-source/geschichten.html').includes('id=Object.keys(game.data)[area]'));
});
test('Eine Demo-Aufgabe können mit dem vollständigen Ausmalbild initialisiert werden', () => {
  for (const [file, type, count, selected] of [['finde-den-fehler.html','finde',20,[11]], ['verruecktes-fussball.html','crazy',15,[5]]]) {
    const text = read('web-source/'+file);
    const start = text.indexOf('function mount({type,ids,areaIds=ids,container})');
    const end = text.indexOf('window.LeseReward={mount};', start);
    const fn = text.slice(start, end);
    const reached = new Error('Rendering erreicht');
    const context = { LeseArt: { sources: { [type]: { count } } },
      LeseProfile: { active: () => ({id:'test'}), gameKey: () => 'test' },
      localStorage: { getItem: () => JSON.stringify({artMaskVersion:2}) },
      document: { createElement: () => { throw reached; } } };
    vm.runInNewContext(fn+';this.mount=mount', context);
    assert.throws(() => context.mount({type, ids:selected, areaIds:Array.from({length:count},(_,i)=>i+1),container:{}}), err => err === reached);
    assert.throws(() => context.mount({type,ids:selected,areaIds:selected,container:{}}), /Anzahl der Ausmalflächen/);
  }
});
test('Alle eingebauten Spielskripte sind syntaktisch gültig', () => {
  for (const file of fs.readdirSync(new URL('www/', root)).filter(x => x.endsWith('.html'))) {
    for (const script of read('www/'+file).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/src=|application\/ld\+json/.test(script[1])) new vm.Script(script[2], { filename: file });
    }
  }
});

