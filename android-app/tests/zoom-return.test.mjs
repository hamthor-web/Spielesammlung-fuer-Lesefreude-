import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=name=>readFileSync(new URL('../web-source/'+name,import.meta.url),'utf8');
test('Geschichten: Pinch verändert die gespeicherte 60%-Grundgröße nicht',()=>{
 const html=read('geschichten.html'),writes=[];
 const c=vm.createContext({viewScale:.6,baseViewScale:1,pinchDistance:100,app:{hidden:false},document:{body:{style:{}},getElementById:()=>({})},zoomReset:{},zoomStorage:'zoom',localStorage:{setItem:(key,value)=>writes.push(value)}});
 vm.runInContext(html.match(/function applyZoom\([^\n]+/)[0]+'\n'+html.match(/function restoreViewZoom\([^\n]+/)[0],c);
 vm.runInContext('applyZoom();viewScale=1.2;applyZoom(false);restoreViewZoom()',c);
 assert.deepEqual(writes,['0.6']);assert.equal(c.viewScale,.6);assert.equal(c.pinchDistance,0);assert.equal(c.document.body.style.zoom,'0.6');
});
for(const name of ['finde-den-fehler.html','verruecktes-fussball.html'])test(name+': Aufgabenende kehrt zur gewählten Grundgröße ohne Verschiebung zurück',()=>{
 const fn=read(name).match(/function restoreTaskZoom\(\){[^\n]+/)[0];let rendered=0;
 const c=vm.createContext({scale:2,preferredScale:.75,tx:-100,ty:-120,pointers:new Map([[1,{}]]),pinch:{},freeFocused:true,hideBubble(){},setTransform(){rendered++}});
 vm.runInContext(fn+';restoreTaskZoom()',c);
 assert.equal(c.scale,.75);assert.equal(c.tx,0);assert.equal(c.ty,0);assert.equal(c.pointers.size,0);assert.equal(c.pinch,null);assert.equal(rendered,1);
});
test('Würfelfeld: Rückkehr entfernt Vergrößerung und Verschiebung',()=>{
 const fn=read('dice-ui.js').match(/function restoreZoom\(\){[^\n]+/)[0];let rendered=0;
 const c=vm.createContext({scale:3,pinch:{},viewport:{scrollLeft:80,scrollTop:100},render(){rendered++}});
 vm.runInContext(fn+';restoreZoom()',c);
 assert.equal(c.scale,1);assert.equal(c.pinch,null);assert.equal(c.viewport.scrollLeft,0);assert.equal(c.viewport.scrollTop,0);assert.equal(rendered,1);
});

test('Würfelfeld lässt sich unter Normalgröße verkleinern, aber nicht unter 35 Prozent',()=>{
 const clamp=read('dice-ui.js').match(/const clamp=value=>([^;]+);/)[1];
 const c=vm.createContext({});vm.runInContext('this.clamp=value=>'+clamp,c);
 assert.equal(c.clamp(.1),.35);assert.equal(c.clamp(.6),.6);assert.equal(c.clamp(9),3);
});
