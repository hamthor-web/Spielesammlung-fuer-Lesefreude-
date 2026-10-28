/* Board-only pinch zoom works inside the Android iframe without scaling navigation. */
addEventListener('DOMContentLoaded',()=>{
  const viewport=document.getElementById('boardWrap'),board=document.getElementById('board');
  if(!viewport||!board)return;
  let scale=1,base=0,pinch=null,suppressClickUntil=0;
  const reset=document.createElement('button');reset.type='button';reset.className='dice-zoom-reset';reset.textContent='Spielfeld 100 %';reset.setAttribute('aria-label','Spielfeld auf normale Größe zurücksetzen');reset.hidden=false;
  const row=document.createElement('div');row.className='dice-board-tools';row.setAttribute('aria-label','Spielfeldgröße');
  const less=document.createElement('button');less.type='button';less.textContent='Spielfeld −';less.setAttribute('aria-label','Spielfeld verkleinern');
  const more=document.createElement('button');more.type='button';more.textContent='Spielfeld +';more.setAttribute('aria-label','Spielfeld vergrößern');
  row.append(less,reset,more);document.getElementById('taskDock')?.append(row);
  less.addEventListener('click',()=>{scale=clamp(scale-.25);render()});
  more.addEventListener('click',()=>{scale=clamp(scale+.25);render()});
  const clamp=value=>Math.max(.35,Math.min(3,value));
  function render(){
    viewport.classList.add('dice-zoom-viewport');
    viewport.style.height=(base*.75*Math.min(1,scale))+'px';viewport.style.overscrollBehavior=scale>1.01?'contain':'auto';
    board.style.setProperty('width',(base*scale)+'px','important');
    reset.textContent='Spielfeld '+Math.round(scale*100)+' %';less.disabled=scale<=.35;more.disabled=scale>=3;
  }
  function measure(){
    const height=window.visualViewport?.height||window.innerHeight;
    const available=Math.max(120,height-64);
    const next=Math.min(1000,viewport.clientWidth,window.innerWidth>height?available/.75:Infinity);
    if(Math.abs(next-base)>.5){base=next;render()}
  }
  const distance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
  const center=touches=>({x:(touches[0].clientX+touches[1].clientX)/2,y:(touches[0].clientY+touches[1].clientY)/2});
  viewport.addEventListener('touchstart',event=>{
    if(event.touches.length!==2)return;
    event.preventDefault();const c=center(event.touches),r=viewport.getBoundingClientRect();
    pinch={distance:distance(event.touches),scale,x:(viewport.scrollLeft+c.x-r.left)/scale,y:(viewport.scrollTop+c.y-r.top)/scale};
    suppressClickUntil=Date.now()+600;
  },{passive:false});
  viewport.addEventListener('touchmove',event=>{
    if(!pinch||event.touches.length!==2)return;
    event.preventDefault();const c=center(event.touches),r=viewport.getBoundingClientRect();
    scale=clamp(pinch.scale*distance(event.touches)/Math.max(1,pinch.distance));render();
    viewport.scrollLeft=pinch.x*scale-(c.x-r.left);viewport.scrollTop=pinch.y*scale-(c.y-r.top);
    suppressClickUntil=Date.now()+600;
  },{passive:false});
  const finish=event=>{if(pinch){suppressClickUntil=Date.now()+600;if(event.touches.length<2)pinch=null}};
  viewport.addEventListener('touchend',finish);viewport.addEventListener('touchcancel',finish);
  viewport.addEventListener('click',event=>{if(Date.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation()}},true);
  function restoreZoom(){scale=1;pinch=null;render();viewport.scrollLeft=0;viewport.scrollTop=0}
  window.LeseDiceZoom=Object.freeze({restore:restoreZoom});
  reset.addEventListener('click',restoreZoom);
  new ResizeObserver(measure).observe(viewport);
  addEventListener('resize',measure);
  window.visualViewport?.addEventListener('resize',measure);
  measure();
});



