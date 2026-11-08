import assert from 'node:assert/strict';

const legalLinks={
  'impressum.html':new Set(['https://lesespiele.heike-amthor.de/','https://lesespiele.heike-amthor.de/impressum','https://lesespiele.heike-amthor.de/datenschutz']),
  'datenschutz.html':new Set(['https://lesespiele.heike-amthor.de/datenschutz','https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement'])
};

export function checkExternalLinks(name,text){
  // Only explicitly approved, user-initiated legal links may leave the local app.
  const links=new Set();
  for(const match of text.matchAll(/<a\b[^>]*>/gi)){
    const tag=match[0],url=tag.match(/\bhref=["'](https?:\/\/[^"']+)["']/i)?.[1];
    if(!url)continue;
    assert.ok(legalLinks[name]?.has(url),'Nicht freigegebener externer Link in '+name+': '+url);
    assert.match(tag,/\btarget=["']_blank["']/i,'Externe Seite muss separat öffnen: '+name);
    const rel=tag.match(/\brel=["']([^"']+)["']/i)?.[1].split(/\s+/)||[];
    assert.ok(rel.includes('noopener')&&rel.includes('noreferrer'),'Externer Link ohne Schutzattribute: '+name);
    links.add(url);
  }
  for(const match of text.matchAll(/<(?!a\b)[a-z][^>]*\b(?:src|href)=["'](?:https?:)?\/\/[^>]*>/gi)){
    assert.fail('Externe Ressource im lokalen Paket '+name+': '+match[0]);
  }
  const runtimeText=text.replace(/<a\b[^>]*>/gi,tag=>{
    const url=tag.match(/\bhref=["'](https?:\/\/[^"']+)["']/i)?.[1];
    return links.has(url)?tag.replace(url,''):tag;
  });
  for(const match of runtimeText.matchAll(/https?:\/\/[^\s"'<>`\\)]+/g)){
    const url=match[0];
    if(name==='native-runtime.js'&&url==='https://capacitorjs.com/')continue;
    assert.ok(url==='http://www.w3.org/2000/svg','Externe Laufzeitadresse in '+name+': '+url);
  }
  return links;
}
