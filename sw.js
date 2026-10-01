const CACHE_NAME='lesen-entdecken-erzaehlen-v46';
const CACHE_PREFIX='lesen-entdecken-erzaehlen-';
const CORE_FILES=['./index.html','./spieler.html','./manifest.webmanifest'];
const OFFLINE_FILES=[
  ...CORE_FILES,'./datenschutz.html','./icon-192.png','./icon-512.png',
  './start-wiese.png','./kachel-wuerfeln.webp','./kachel-geschichten.webp','./kachel-verruecktes.webp',
  './freizeit-und-abenteuer.png','./sport-und-spiel.png','./maerchen-und-zauber.png',
  './im-herbstpark.png','./auf-dem-fussballplatz.png','./finde-den-fehler.png','./das-verrueckte-fussballspiel.png',
  './preview-art-sources.js','./wuerfeln-freizeit.html','./wuerfeln-sport.html',
  './wuerfeln-maerchen.html','./geschichten.html','./finde-den-fehler.html','./verruecktes-fussball.html'
];
const SCOPE=new URL('./',self.location.href);
let preparation=null;

// Queries select a story inside the same HTML file; the directory is index.html.
function cacheKey(request){
  const url=new URL(typeof request==='string'?request:request.url,SCOPE);
  url.search='';url.hash='';
  if(url.pathname===SCOPE.pathname)url.pathname+='index.html';
  return url.href;
}
async function cachedResponse(request){
  const key=cacheKey(request);
  try{
    const current=await caches.open(CACHE_NAME);
    const hit=await current.match(key,{ignoreSearch:true});
    if(hit)return hit;
    // Keep older working games available while the new package is incomplete.
    const names=(await caches.keys()).filter(n=>n.startsWith(CACHE_PREFIX)&&n!==CACHE_NAME).reverse();
    for(const name of names){
      const cache=await caches.open(name);
      const old=await cache.match(key,{ignoreSearch:true}) ||
        (key===new URL('index.html',SCOPE).href?await cache.match(SCOPE.href,{ignoreSearch:true}):null);
      if(old)return old;
    }
  }catch(_){}
  return null;
}
async function download(request,timeout=30000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const response=await fetch(request,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error('HTTP '+response.status);
    // Storage failure must never discard a successfully downloaded page.
    try{await (await caches.open(CACHE_NAME)).put(cacheKey(request),response.clone())}catch(_){}
    return response;
  }finally{clearTimeout(timer)}
}
async function status(){
  let completed=0;
  try{
    const cache=await caches.open(CACHE_NAME);
    for(const file of OFFLINE_FILES)if(await cache.match(cacheKey(file)))completed++;
  }catch(_){}
  return {type:'OFFLINE_STATUS',version:CACHE_NAME,ready:completed===OFFLINE_FILES.length,
    completed,total:OFFLINE_FILES.length};
}
async function broadcast(){
  const info=await status();
  for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage(info);
  return info;
}
function prepareOffline(){
  if(preparation)return preparation;
  preparation=(async()=>{
    const cache=await caches.open(CACHE_NAME);
    // Individual, sequential downloads retain progress and avoid a download burst.
    for(const file of OFFLINE_FILES){
      if(await cache.match(cacheKey(file)))continue;
      try{await download(cacheKey(file),60000)}catch(_){}
      await broadcast();
    }
    const info=await broadcast();
    if(info.ready){
      const names=await caches.keys();
      await Promise.all(names.filter(n=>n.startsWith(CACHE_PREFIX)&&n!==CACHE_NAME).map(n=>caches.delete(n)));
    }
  })().catch(()=>broadcast()).finally(()=>{preparation=null});
  return preparation;
}
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    // Only the small app shell is required before this worker can take over.
    for(const file of CORE_FILES)await download(cacheKey(file));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{await self.clients.claim();await prepareOffline()})());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='OFFLINE_STATUS'){
    event.waitUntil((async()=>{
      event.source?.postMessage(await status());
      await prepareOffline();
    })());
  }
  if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
});
async function serve(request,event){
  const cached=await cachedResponse(request);
  if(cached){
    // Display immediately, update for the next visit without blocking this one.
    event.waitUntil(download(request).catch(()=>null));
    return cached;
  }
  try{return await download(request)}catch(_){
    if(request.mode==='navigate')return new Response(
      '<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesespiele</title><body style="font:18px Arial;padding:24px;background:#f2f8e9;color:#173c2a"><h1>Dieses Spiel ist noch nicht offline bereit.</h1><p>Bitte mit dem Internet verbinden und erneut öffnen.</p><button onclick="location.reload()" style="font:inherit;padding:12px">Erneut versuchen</button><p><a href="'+SCOPE.href+'">Zur Hauptauswahl</a></p></body></html>',
      {status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});
    return Response.error();
  }
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  event.respondWith(serve(event.request,event));
});
