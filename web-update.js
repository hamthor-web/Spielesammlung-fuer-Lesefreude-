(() => {
 const version='1.1.19';let reloaded=false;
 const tell=text=>{const el=document.getElementById('offlineStatus');if(el)el.textContent=text};
 addEventListener('DOMContentLoaded',()=>{
  const panel=document.getElementById('adultPanel');if(panel){const p=document.createElement('p');p.textContent='Web-Version '+version;panel.append(p)}
 });
 if(!('serviceWorker' in navigator))return;
 navigator.serviceWorker.addEventListener('message',event=>{
  if(event.data?.type==='OFFLINE_STATUS')tell(event.data.ready?'Alle Spiele sind auf diesem Gerät offline bereit.':'Offline-Paket wird vorbereitet ('+event.data.completed+' von '+event.data.total+'). Bitte die Seite geöffnet lassen.');
 });
 addEventListener('load',async()=>{
  try{
   const reg=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
   const check=()=>reg.active?.postMessage({type:'OFFLINE_STATUS'});
   navigator.serviceWorker.addEventListener('controllerchange',()=>{
    check();
    // Never interrupt a game. A safe return to the selection loads the new version.
    if(!reloaded&&navigator.serviceWorker.controller&&!location.hash.startsWith('#spiel-')&&document.getElementById('home')){reloaded=true;location.reload()}
   });
   await reg.update().catch(()=>{});check();
  }catch{tell('Offline-Paket konnte nicht vollständig geladen werden. Bitte später mit Internet erneut öffnen.')}
 },{once:true});
})();
