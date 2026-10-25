/* Custom two-finger zoom needs pointer events even below 100 percent.
   A single finger at normal/reduced size still scrolls the page. */
addEventListener('DOMContentLoaded',()=>{
 const stage=document.querySelector('.stage'),world=stage?.querySelector('.world');
 if(!stage||!world||!document.getElementById('normal'))return;
 stage.style.touchAction='none';
 const pointers=new Map();
 const scale=()=>Number(world.style.transform.match(/scale\(([^)]+)\)/)?.[1]||1);
 stage.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY})});
 stage.addEventListener('pointermove',e=>{
  const previous=pointers.get(e.pointerId);if(!previous)return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===1&&scale()<=1.01&&e.pointerType==='touch')window.scrollBy(0,previous.y-e.clientY);
 });
 const end=e=>pointers.delete(e.pointerId);
 stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
});
