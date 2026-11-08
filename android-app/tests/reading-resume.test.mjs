import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

for (const path of ['../web-source/geschichten.html','../../geschichten.html']) {
 const html=readFileSync(new URL(path,import.meta.url),'utf8');
 const show=html.match(/function show\(id,scroll=true,index=null\)\{[^\r\n]+/)[0];
 function setup(pos) {
  const element=()=>({textContent:'',disabled:false,hidden:true,scrollIntoView(){}});
  const context={state:{decks:{a:{pos}},seen:[]},game:{data:{a:{name:'Geschichte',cards:['Eins','Zwei','Drei','Vier','Fünf']}}},title:element(),storyText:element(),image:{},step:element(),next:element(),previous:element(),storyArea:element(),cardSrc:(id,n)=>id+n,save(){},update(){}};
  vm.createContext(context);vm.runInContext(show,context);return context;
 }
 test(path+': Wiederaufnahme wiederholt die zuletzt gelesene Karte und überspringt keine',()=>{
  const c=setup(3);vm.runInContext("show('a',false)",c);
  assert.equal(c.storyText.textContent,'Drei');assert.equal(c.step.textContent,'3/5');
  assert.equal(c.state.resume.index,2);assert.equal(c.state.decks.a.pos,3);
 });
 test(path+': Zurückblättern speichert die genaue Karte, ohne den Fortschritt zu verlieren',()=>{
  const c=setup(4);vm.runInContext("show('a',false,1)",c);
  assert.equal(c.state.resume.index,1);assert.equal(c.state.decks.a.pos,4);
  assert.equal(c.storyText.textContent,'Zwei');
 });
 test(path+': Neue Geschichte beginnt auf Karte 1',()=>{
  const c=setup(0);vm.runInContext("show('a',false)",c);
  assert.equal(c.storyText.textContent,'Eins');assert.equal(c.previous.disabled,true);
 });
}
