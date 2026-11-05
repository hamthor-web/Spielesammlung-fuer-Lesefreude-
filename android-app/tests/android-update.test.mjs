import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const root = new URL('../www/', import.meta.url);
test('Android-Paket enthält alle 36 Originalframes und nur eine Layout-Initialisierung pro Spiel',()=>{
 for(const world of ['dice','stories','crazy']) for(let i=0;i<12;i++) assert.ok(existsSync(new URL(`world-intros/${world}-${String(i).padStart(2,'0')}.webp`,root)));
 for(const name of ['geschichten','finde-den-fehler','verruecktes-fussball','wuerfeln-sport','wuerfeln-freizeit','wuerfeln-maerchen']){
  const html=readFileSync(new URL(name+'.html',root),'utf8');
  assert.equal((html.match(/<script src="\.\/native-layout\.js/g)||[]).length,1,name);
 }
});
for(const world of ['dice','stories','crazy']) test(`${world}: Einleitung überspringen und Android-Zurück beenden die laufende Sequenz`,async()=>{
 let dialog;
 const node=()=>({hidden:true,textContent:'',focus(){},setAttribute(){}});
 const c={window:{},location:{hash:'#intro-'+world},Image:class{decode(){return Promise.resolve()}},URL,Promise,Map,Array,requestAnimationFrame:()=>1,cancelAnimationFrame(){},addEventListener(){},removeEventListener(){},document:{baseURI:'https://localhost/home.html',activeElement:null,hidden:false,addEventListener(){},removeEventListener(){},body:{append(){}},createElement(){const parts={h2:node(),img:node(),p:node(),button:node()},events={};dialog={setAttribute(){},querySelector:s=>parts[s],addEventListener:(n,f)=>events[n]=f,showModal(){},close(){events.close?.()},remove(){},parts};return dialog;}}};
 vm.runInNewContext(readFileSync(new URL('world-intros.js',root),'utf8'),vm.createContext(c));
 const skipped=c.window.LeseWorldIntro.play(world);dialog.parts.button.onclick();assert.equal(await skipped,true);
 const canceled=c.window.LeseWorldIntro.play(world);dialog.close();assert.equal(await canceled,false);
});
