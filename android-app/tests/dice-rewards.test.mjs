import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({});
vm.runInContext(readFileSync(new URL('../web-source/dice-rewards.js',import.meta.url),'utf8'),context);
const r=context.DiceRewards;
test('Pokalstufen werden genau bei 1, 3, 7, 12, 18, 25 und 32 Abschlüssen erreicht',()=>{
  for(let count=0;count<=35;count++)assert.equal(r.level(count),[1,3,7,12,18,25,32].filter(n=>count>=n).length-1);
});
test('Ein Abschluss zählt einmal; Neustart erlaubt den nächsten Abschluss',()=>{
  let state=r.restore(null);state=r.complete(state);assert.equal(state.count,1);
  assert.equal(r.complete(state).count,1);
  const resumed=r.restore(JSON.parse(JSON.stringify(state)),true);assert.equal(r.complete(resumed).count,1);
  state=r.complete({count:resumed.count,credited:false});assert.equal(state.count,2);
});
test('Alte abgeschlossene Spielstände erhalten keinen rückwirkenden Abschluss',()=>{
  const state=r.restore(undefined,true);assert.equal(r.complete(state).count,0);
  assert.equal(r.restore({count:-2}).count,0);assert.equal(r.restore({count:'7'}).count,0);
});
test('Spielstand und Sicherung enthalten den Pokalfortschritt',async()=>{
  const {validateBackup,createBackup}=await import('../src/backup.mjs');
  const state={v:1,rewards:r.complete(r.restore(null))};
  const data={'lesespiele-profile-v1':JSON.stringify([{id:'test',name:'Test'}]),'lesespiele-active-v1':'test','lesespiele-v1:test:dice-sport':JSON.stringify(state)};
  const result=validateBackup(JSON.stringify(createBackup(data)));
  assert.equal(JSON.parse(result.data['lesespiele-v1:test:dice-sport']).rewards.count,1);
});

test('Belohnung wird nur beim neuen Erreichen einer Stufe angezeigt',()=>{
  for(let count=1;count<=40;count++){
    assert.equal(r.unlocked(count-1,count),[1,3,7,12,18,25,32].includes(count));
    assert.equal(r.unlocked(count,count),false,'Kein erneutes Freischalten beim Wiederöffnen');
  }
});
test('Alle drei Spiele blenden beim Wiederöffnen die Belohnung aus',()=>{
  for(const world of ['sport','freizeit','maerchen']){
    const html=readFileSync(new URL(`../web-source/wuerfeln-${world}.html`,import.meta.url),'utf8');
    const fn=html.match(/function showTrophyResult\([^]*?\n  }/)[0];
    let removed=0;
    const context=vm.createContext({document:{getElementById:()=>({remove(){removed++}}),createElement(){throw Error('Ohne Freischaltung darf keine Belohnung erzeugt werden')}}});
    vm.runInContext(fn+';showTrophyResult();',context);
    assert.equal(removed,1);
  }
});
