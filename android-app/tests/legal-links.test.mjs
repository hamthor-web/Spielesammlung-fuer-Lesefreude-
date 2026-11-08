import test from 'node:test';
import assert from 'node:assert/strict';
import {checkExternalLinks} from '../scripts/check-external-links.mjs';

const url='https://lesespiele.heike-amthor.de/datenschutz';
const link=`<a href="${url}" target="_blank" rel="noopener noreferrer">Datenschutz der Website</a>`;
test('Rechtstexte dürfen geprüfte Webseiten bewusst als Link öffnen',()=>{
 assert.equal(checkExternalLinks('datenschutz.html',link).has(url),true);
});
test('Ein erlaubter Link erlaubt keine automatisch geladenen externen Ressourcen',()=>{
 for(const tag of [`<script src="${url}"></script>`,`<iframe src="${url}"></iframe>`,`<link rel="stylesheet" href="${url}">`,`<img src="//lesespiele.heike-amthor.de/pixel">`]){
  assert.throws(()=>checkExternalLinks('datenschutz.html',link+tag),/Externe Ressource/);
 }
});
test('Externe Links bleiben auf Rechtstexte und die genaue Zielliste begrenzt',()=>{
 assert.throws(()=>checkExternalLinks('home.html',link),/Nicht freigegebener/);
 assert.throws(()=>checkExternalLinks('datenschutz.html',link.replace(url,'https://example.com/')),/Nicht freigegebener/);
 assert.throws(()=>checkExternalLinks('datenschutz.html',link.replace('noopener noreferrer','noopener')),/Schutzattribute/);
});

test('Ein statischer Rechtslink erlaubt keinen fetch zum gleichen Ziel',()=>{
 assert.throws(()=>checkExternalLinks('datenschutz.html',link+`<script>fetch('${url}')</script>`),/Externe Laufzeitadresse/);
});
