const CACHE_NAME='lesen-entdecken-erzaehlen-v16';
const APP_SHELL=[
  './','./index.html','./spieler.html','./manifest.webmanifest',
  './icon-192.png','./icon-512.png',
  './start-wiese.png',
  './finde-den-fehler.png','./freizeit-und-abenteuer.png','./sport-und-spiel.png',
  './maerchen-und-zauber.png','./im-herbstpark.png','./auf-dem-fussballplatz.png',
  './das-verrueckte-fussballspiel.png',
  './kachel-wuerfeln.webp','./kachel-geschichten.webp','./kachel-verruecktes.webp'
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 const u=new URL(event.request.url);
 if(u.origin!==self.location.origin) return;

 if(event.request.mode==='navigate'){
   event.respondWith(
     fetch(event.request).then(r=>{
       if(r&&r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy))}
       return r
     }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
   );
   return;
 }

 event.respondWith(
   caches.match(event.request).then(cached=>{
     if(cached){
       fetch(event.request).then(r=>{if(r&&r.ok)caches.open(CACHE_NAME).then(c=>c.put(event.request,r.clone()))}).catch(()=>{});
       return cached;
     }
     return fetch(event.request).then(r=>{
       if(r&&r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy))}
       return r
     });
   })
 );
});
