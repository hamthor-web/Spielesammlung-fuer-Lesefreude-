const CACHE_NAME='lesen-entdecken-erzaehlen-v44';
const OFFLINE_FILES=[
  './','./index.html','./spieler.html','./manifest.webmanifest',
  './datenschutz.html',
  './icon-192.png','./icon-512.png','./preview-art-sources.js',
  './wuerfeln-freizeit.html','./wuerfeln-sport.html','./wuerfeln-maerchen.html',
  './geschichten.html','./finde-den-fehler.html','./verruecktes-fussball.html'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(OFFLINE_FILES))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(names=>Promise.all(
        names
          .filter(name=>name.startsWith('lesen-entdecken-erzaehlen-')&&name!==CACHE_NAME)
          .map(name=>caches.delete(name))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='OFFLINE_STATUS'){
    event.source?.postMessage({type:'OFFLINE_STATUS',version:CACHE_NAME,ready:true});
  }
  if(event.data?.type==='SKIP_WAITING'){
    self.skipWaiting();
  }
});

async function networkFirst(request){
  const cache=await caches.open(CACHE_NAME);
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      await cache.put(request,response.clone());
    }
    return response;
  }catch(err){
    const cached=await cache.match(request,{ignoreSearch:true});
    if(cached)return cached;
    throw err;
  }
}

async function cacheFirstWithRefresh(request,event){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request,{ignoreSearch:true});
  const refresh=fetch(request,{cache:'no-store'}).then(response=>{
    if(response&&response.ok)return cache.put(request,response.clone()).then(()=>response);
    return response;
  }).catch(()=>null);
  if(cached){
    event.waitUntil(refresh);
    return cached;
  }
  const fresh=await refresh;
  if(fresh)return fresh;
  throw new Error('offline');
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      networkFirst(event.request).catch(async()=>{
        const cache=await caches.open(CACHE_NAME);
        return await cache.match(event.request,{ignoreSearch:true}) || await cache.match('./index.html');
      })
    );
    return;
  }

  const importantFreshFile =
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.webmanifest');

  if(importantFreshFile){
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirstWithRefresh(event.request,event));
});
