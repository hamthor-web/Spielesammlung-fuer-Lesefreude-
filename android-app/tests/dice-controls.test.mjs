import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const world of ['sport','freizeit','maerchen']){
 const html=readFileSync(new URL(`../web-source/wuerfeln-${world}.html`,import.meta.url),'utf8');
 test(`${world}: Kartenbutton nur im bereiten eigenen Zug nach Zieleinlauf`,()=>{
  const classes=new Set();
  const c=vm.createContext({players:[{name:'Blau',finished:true},{name:'Rot',finished:false}],active:0,busy:true,waitingForCardTarget:false,waitingForMoveCard:false,waitingForFootballCard:false,waitingForJoker:false,diceBtn:{},drawAdventure:{},turnLabel:{},board:{classList:{contains:n=>classes.has(n),toggle(n,on){on?classes.add(n):classes.delete(n)}}}});
  vm.runInContext(html.match(/function updateControls\(\){[\s\S]*?\n  }/)[0],c);
  const update=()=>vm.runInContext('updateControls()',c);
  update();assert.equal(c.drawAdventure.hidden,true);
  c.busy=false;update();assert.equal(c.drawAdventure.hidden,false);assert.equal(c.diceBtn.hidden,true);
  c.active=1;update();assert.equal(c.drawAdventure.hidden,true);assert.equal(c.diceBtn.hidden,false);
  c.active=0;c.waitingForJoker=true;update();assert.equal(c.drawAdventure.hidden,true);
  c.waitingForJoker=false;c.players[1].finished=true;update();assert.equal(c.drawAdventure.hidden,true);assert.equal(c.diceBtn.hidden,true);
 });
 test(`${world}: Noch einmal fragt nach vollständigem Abschluss nicht nach`,()=>{
  let action,restarts=0,confirms=0;
  const c=vm.createContext({players:[{finished:true},{finished:true}],reset:{addEventListener(){}},again:{addEventListener(type,fn){action=fn}},restart(){restarts++},confirmRestart(){confirms++}});
  vm.runInContext(html.match(/reset\.addEventListener\('click',confirmRestart\); again\.addEventListener\('click',[^\n]+/)[0],c);
  action();assert.equal(restarts,1);assert.equal(confirms,0);
  c.players[1].finished=false;action();assert.equal(confirms,1);
 });
}
