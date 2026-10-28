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

/* Text zoom is separate from the picture/board zoom in every game. */
(() => {
  function initReadingTools() {
    const cards = [...document.querySelectorAll('#cardDock > div, #storyArea > .card, .side > #card')]
      .filter(card => card.querySelector('.question, .storyText, .storytext, .sentence'));
    if (!cards.length) return;
    const key = 'lesespiele-reading-scale-v1';
    const clamp = value => Math.max(1, Math.min(3, value));
    let scale = 1;
    try { const saved = Number(localStorage.getItem(key)); if (Number.isFinite(saved) && saved >= 1) scale = clamp(saved); } catch {}
    const toolbars = [];
    let dialog, readerBody, sourceCard, sourceObserver;
    const percentage = () => Math.round(scale * 100) + ' %';
    function setScale(value) {
      scale = clamp(value);
      document.documentElement.style.setProperty('--reading-scale', scale);
      toolbars.forEach(({less, reset, more}) => {
        reset.textContent = percentage();
        reset.setAttribute('aria-label', 'Textgröße ' + percentage() + '. Auf 100 Prozent zurücksetzen');
        less.disabled = scale <= 1;
        more.disabled = scale >= 3;
      });
      try { localStorage.setItem(key, String(scale)); } catch {}
    }
    function makeButton(label, text, action) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = text;
      button.setAttribute('aria-label', label); button.title = label;
      button.addEventListener('click', event => { event.stopPropagation(); action(); });
      return button;
    }
    function makeToolbar(card) {
      const bar = document.createElement('div');
      bar.className = 'reading-controls';
      bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Textgröße der Aufgabenkarte');
      const less = makeButton('Text kleiner', 'A−', () => setScale(scale - .25));
      const reset = makeButton('Textgröße zurücksetzen', percentage(), () => setScale(1));
      reset.className = 'reading-percentage';
      const more = makeButton('Text größer', 'A+', () => setScale(scale + .25));
      bar.append(less, reset, more);
      if (card) {
        const expand = makeButton('Aufgabenkarte groß lesen', 'Groß lesen', () => openReader(card));
        expand.className = 'reading-expand'; bar.append(expand);
      }
      bar.addEventListener('click', event => event.stopPropagation());
      bar.addEventListener('pointerdown', event => event.stopPropagation());
      toolbars.push({less, reset, more});
      return bar;
    }
    function fillReader() {
      if (!sourceCard) return;
      readerBody.replaceChildren();
      const title = sourceCard.querySelector('h2, .badge');
      if (title?.textContent.trim()) {
        const heading = document.createElement('h3');
        heading.textContent = title.textContent; readerBody.append(heading);
      }
      const art = sourceCard.querySelector('.art img');
      if (art?.getAttribute('src')) {
        const image = document.createElement('img');
        image.src = art.src; image.alt = art.alt; readerBody.append(image);
      }
      const text = sourceCard.querySelector('.question, .storyText, .storytext, .sentence');
      const paragraph = document.createElement('p');
      paragraph.className = 'reading-main-text';
      paragraph.textContent = text?.textContent || '';
      readerBody.append(paragraph);
      const choices = [...sourceCard.querySelectorAll('#jokerChoices.show .jokerChoice')];
      if (choices.length) {
        const list = document.createElement('ul');
        for (const choice of choices) { const li = document.createElement('li'); li.textContent = choice.textContent; list.append(li); }
        readerBody.append(list);
      }
      const hint = sourceCard.querySelector('.hint, .error-question');
      if (hint?.textContent.trim()) {
        const note = document.createElement('p'); note.className = 'reading-task-hint';
        note.textContent = hint.textContent; readerBody.append(note);
      }
    }
    function openReader(card) {
      if (!dialog) {
        dialog = document.createElement('dialog'); dialog.className = 'reading-dialog';
        dialog.setAttribute('aria-labelledby', 'readingDialogTitle');
        const header = document.createElement('header'); header.className = 'reading-dialog-header';
        const title = document.createElement('h2'); title.id = 'readingDialogTitle'; title.textContent = 'Groß lesen';
        const close = makeButton('Zurück zur Aufgabe', 'Zurück zur Aufgabe', () => dialog.close());
        close.autofocus = true; close.className = 'reading-close';
        header.append(title, close);
        readerBody = document.createElement('div'); readerBody.className = 'reading-dialog-body';
        const footer = document.createElement('p'); footer.className = 'reading-dialog-note';
        footer.textContent = 'In Ruhe lesen. Zum Antworten oder Weiterspielen zurück zur Aufgabe.';
        dialog.append(header, makeToolbar(null), readerBody, footer);
        document.body.append(dialog);
        dialog.addEventListener('close', () => { sourceObserver?.disconnect(); sourceCard = null; });
        enablePinch(dialog);
      }
      sourceCard = card; fillReader(); setScale(scale);
      sourceObserver?.disconnect();
      sourceObserver = new MutationObserver(records => {
        if (!sourceCard || !dialog.open) return;
        if (!sourceCard.getClientRects().length || sourceCard.getAttribute('aria-hidden') === 'true') { dialog.close(); return; }
        if (records.some(record => !record.target.closest?.('.reading-controls'))) fillReader();
      });
      sourceObserver.observe(card, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'aria-hidden'] });
      if (!dialog.open) dialog.showModal();
    }
    function enablePinch(surface) {
      let pinch = null, suppressUntil = 0;
      const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      surface.addEventListener('touchstart', event => {
        if (event.touches.length !== 2) return;
        event.preventDefault(); event.stopPropagation();
        pinch = { distance: distance(event.touches), scale };
        suppressUntil = Date.now() + 700;
      }, {passive: false});
      surface.addEventListener('touchmove', event => {
        if (!pinch || event.touches.length !== 2) return;
        event.preventDefault(); event.stopPropagation();
        setScale(pinch.scale * distance(event.touches) / Math.max(1, pinch.distance));
        suppressUntil = Date.now() + 700;
      }, {passive: false});
      const end = event => { if (pinch) { suppressUntil = Date.now() + 700; if (event.touches.length < 2) pinch = null; } };
      surface.addEventListener('touchend', end); surface.addEventListener('touchcancel', end);
      surface.addEventListener('click', event => {
        if (Date.now() < suppressUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
      }, true);
    }
    for (const card of cards) {
      card.classList.add('reading-card');
      (card.querySelector('.cardInner') || card).prepend(makeToolbar(card));
      enablePinch(card);
    }
    setScale(scale);
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', initReadingTools, {once: true});
  else initReadingTools();
})();

