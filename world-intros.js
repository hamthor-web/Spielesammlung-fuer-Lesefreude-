/* Original GIF frames, decoded before playback. One pass per world entry. */
(() => {
  const titles={dice:'Würfeln',stories:'Interaktive Geschichten',crazy:'Verrücktes'};
  const frameDuration={dice:140,stories:140,crazy:150};
  const lastFrameHold=2000;
  const cache=new Map();
  let current=null;
  function load(world){
    if(!cache.has(world))cache.set(world,Promise.all(Array.from({length:12},(_,i)=>{
      const image=new Image();image.src=new URL('./world-intros/'+world+'-'+String(i).padStart(2,'0')+'.webp',document.baseURI).href;
      return image.decode().then(()=>image);
    })).catch(error=>{cache.delete(world);throw error}));
    return cache.get(world);
  }
  function play(world){
    if(!titles[world])return Promise.resolve(false);
    if(current)return current.promise;
    const dialog=document.createElement('dialog');dialog.className='world-intro';
    dialog.setAttribute('aria-labelledby','world-intro-title');
    dialog.innerHTML='<h2 id="world-intro-title"></h2><img alt="" hidden><p role="status">Die Animation wird geladen …</p><button type="button">Überspringen</button>';
    dialog.querySelector('h2').textContent=titles[world];
    const image=dialog.querySelector('img'),status=dialog.querySelector('p'),button=dialog.querySelector('button');
    const previousFocus=document.activeElement;
    let resolve,raf=0,stopped=false,elapsed=0,last=null,index=-1;
    const promise=new Promise(done=>resolve=done);current={promise};
    function finish(completed){
      if(stopped)return;stopped=true;cancelAnimationFrame(raf);
      removeEventListener('popstate',onNavigation);removeEventListener('hashchange',onNavigation);
      document.removeEventListener('visibilitychange',onVisibility);
      dialog.close();dialog.remove();current=null;
      if(!completed&&previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
      resolve(completed);
    }
    function onNavigation(){if(location.hash!=='#intro-'+world)finish(false)}
    function onVisibility(){last=null}
    function tick(now){
      if(stopped)return;
      if(!document.hidden){
        if(last!==null)elapsed+=now-last;
        last=now;
        const next=Math.min(11,Math.floor(elapsed/frameDuration[world]));
        if(next!==index){index=next;image.src=currentFrames[next].src;image.dataset.frame=String(next)}
        if(elapsed>=12*frameDuration[world]+lastFrameHold){finish(true);return}
      }else last=null;
      raf=requestAnimationFrame(tick);
    }
    let currentFrames;
    button.onclick=()=>finish(true);
    dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false)});
    dialog.addEventListener('close',()=>finish(false));
    addEventListener('popstate',onNavigation);addEventListener('hashchange',onNavigation);
    document.addEventListener('visibilitychange',onVisibility);
    document.body.append(dialog);dialog.showModal();button.focus();
    load(world).then(frames=>{
      if(stopped)return;currentFrames=frames;
      image.alt={dice:'Das Würstchen wirft einen Würfel auf das Spielbrett.',stories:'Das Würstchen lässt im Herbstpark einen Drachen steigen.',crazy:'Das Würstchen mit Ameise auf der Schulter kickt eine rosa Eiskugel in die Waffel.'}[world];
      image.src=frames[0].src;image.hidden=false;status.textContent='';
      raf=requestAnimationFrame(tick);
    }).catch(()=>{
      if(stopped)return;
      status.textContent='Die Animation konnte nicht geladen werden. Du kannst die Spielwelt trotzdem öffnen.';
      button.textContent='Spielwelt öffnen';
    });
    return promise;
  }
  window.LeseWorldIntro={play};
})();
