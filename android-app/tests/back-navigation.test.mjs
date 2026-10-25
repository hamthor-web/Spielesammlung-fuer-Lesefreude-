import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const runtime = fs.readFileSync(new URL('../src/native-runtime.mjs', import.meta.url), 'utf8');
const handler = runtime.slice(runtime.indexOf('function handleBack()'), runtime.indexOf('function mount()'));

test('Android-Zurueck nutzt Navigation und beendet die App nicht', () => {
  let backs = 0, exits = 0;
  const context = { document: { querySelectorAll: () => [], querySelector: () => null },
    window: { LeseNavigation: { back: () => backs++ } },
    native: true, App: { exitApp: () => exits++ }, persist: () => Promise.resolve() };
  vm.runInNewContext(handler + ';handleBack();', context);
  assert.equal(backs, 1); assert.equal(exits, 0);
});

test('Android-Zurueck in Profilauswahl schliesst die App nicht', () => {
  let canceled = 0, exits = 0;
  const context = { document: { querySelectorAll: () => [], querySelector: () => ({ dispatchEvent: () => canceled++ }) },
    Event: class {}, native: true, App: { exitApp: () => exits++ } };
  vm.runInNewContext(handler + ';handleBack();', context);
  assert.equal(canceled, 1); assert.equal(exits, 0);
});
