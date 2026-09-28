const CACHE_NAME='lesen-entdecken-erzaehlen-v42';
const OFFLINE_FILES=[
  './','./index.html','./spieler.html','./manifest.webmanifest',
  './datenschutz.html',
  './icon-192.png','./icon-512.png','./preview-art-sources.js',
  './wuerfeln-freizeit.html','./wuerfeln-sport.html','./wuerfeln-maerchen.html',
  './geschichten.html','./finde-den-fehler.html','./verruecktes-fussball.html'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(OFFLINE_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(names=>Promise.all(
    names.filter(name=>name.startsWith('lesen-entdecken-erzaehlen-')&&name!==CACHE_NAME).map(name=>caches.delete(name))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{
  if(event.data?.type==='OFFLINE_STATUS')
    event.source?.postMessage({type:'OFFLINE_STATUS',version:CACHE_NAME,ready:true});
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(url.origin+url.pathname,copy)).catch(()=>{}));
      }
      return response;
    }).catch(()=>caches.open(CACHE_NAME).then(async cache=>
      await cache.match(event.request,{ignoreSearch:true})||await cache.match('./index.html')
    )));
    return;
  }
  event.respondWith(caches.open(CACHE_NAME).then(async cache=>
    await cache.match(event.request)||await fetch(event.request)
  ));
});
