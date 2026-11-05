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
        reset.setAttribute('aria-label', 'Textgr��e ' + percentage() + '. Auf 100 Prozent zur�cksetzen');
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
      bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Textgr��e der Aufgabenkarte');
      const less = makeButton('Text kleiner', 'A-', () => setScale(scale - .25));
      const reset = makeButton('Textgr��e zur�cksetzen', percentage(), () => setScale(1));
      reset.className = 'reading-percentage';
      const more = makeButton('Text gr��er', 'A+', () => setScale(scale + .25));
      bar.append(less, reset, more);
      if (card) {
        const expand = makeButton('Aufgabenkarte gro� lesen', 'Gro� lesen', () => openReader(card));
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
        const title = document.createElement('h2'); title.id = 'readingDialogTitle'; title.textContent = 'Gro� lesen';
        const close = makeButton('Zur�ck zur Aufgabe', 'Zur�ck zur Aufgabe', () => dialog.close());
        close.autofocus = true; close.className = 'reading-close';
        header.append(title, close);
        readerBody = document.createElement('div'); readerBody.className = 'reading-dialog-body';
        const footer = document.createElement('p'); footer.className = 'reading-dialog-note';
        footer.textContent = 'In Ruhe lesen. Zum Antworten oder Weiterspielen zur�ck zur Aufgabe.';
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

/* Search previews stay in their own row; a successful find closes the enlargement. */
(() => {
  function initSearchPreviews() {
    if (!/\/(?:geschichten|verruecktes-fussball)\.html$/.test(location.pathname)) return;
    const gallery = document.getElementById('gallery');
    if (!gallery || !document.querySelector('#storyArea, #activeHit')) return;
    const selector = '.storyPreview, .tile';
    const rail = document.createElement('div');
    rail.className = 'search-preview-rail';
    gallery.before(rail);
    const makeArrow = (label, text) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'search-preview-arrow';
      button.textContent = text; button.setAttribute('aria-label', label);
      button.setAttribute('aria-controls', gallery.id);
      return button;
    };
    const left = makeArrow('Suchbilder nach links verschieben', '?');
    const right = makeArrow('Suchbilder nach rechts verschieben', '?');
    rail.append(left, gallery, right);
    gallery.classList.add('search-preview-gallery');
    gallery.setAttribute('aria-label', 'Suchbilder - zum Vergr��ern antippen');
    let expanded = null;
    const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    function updateArrows() {
      const max = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
      left.disabled = gallery.scrollLeft <= 2;
      right.disabled = gallery.scrollLeft >= max - 2;
      gallery.style.setProperty('--search-preview-width', Math.max(100, Math.min(220, gallery.clientWidth - 20)) + 'px');
    }
    function setExpanded(button) {
      if (expanded) { expanded.classList.remove('search-preview-expanded'); expanded.setAttribute('aria-expanded', 'false'); }
      expanded = button;
      if (expanded) { expanded.classList.add('search-preview-expanded'); expanded.setAttribute('aria-expanded', 'true'); }
      requestAnimationFrame(updateArrows);
    }
    function reveal(button) {
      requestAnimationFrame(() => {
        if (!button.isConnected || button !== expanded) return;
        const frame = gallery.getBoundingClientRect(), item = button.getBoundingClientRect();
        const zoom = frame.width / (gallery.offsetWidth || frame.width || 1);
        const delta = item.left < frame.left + 6 ? item.left - frame.left - 6 : item.right > frame.right - 6 ? item.right - frame.right + 6 : 0;
        gallery.scrollBy({left: delta / zoom, behavior: 'auto'});
        // Overrides the original story-selection scroll so the enlarged preview stays visible.
        button.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth'});
        updateArrows();
      });
    }
    for (const [button, direction] of [[left, -1], [right, 1]]) {
      button.addEventListener('click', () => gallery.scrollBy({left: direction * Math.max(100, gallery.clientWidth * .8), behavior: reduceMotion() ? 'auto' : 'smooth'}));
    }
    // Re-tapping the current preview changes only its size, preserving the reading card.
    gallery.addEventListener('click', event => {
      const button = event.target.closest(selector);
      if (!button || !gallery.contains(button) || !button.classList.contains('selected')) return;
      event.preventDefault(); event.stopImmediatePropagation();
      setExpanded(expanded === button ? null : button);
      if (expanded) reveal(button);
    }, true);
    gallery.addEventListener('click', event => {
      const button = event.target.closest(selector);
      if (!button || !gallery.contains(button)) return;
      setExpanded(button); reveal(button);
    });
    function decorate() {
      if (expanded && !gallery.contains(expanded)) setExpanded(null);
      for (const button of gallery.querySelectorAll(selector)) {
        if (!button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'false');
        if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', 'Suchbild ' + button.dataset.id + ' ausw�hlen und vergr��ern');
      }
      updateArrows();
    }
    new MutationObserver(decorate).observe(gallery, {childList: true});
    const storyArea = document.getElementById('storyArea');
    const card = storyArea || document.getElementById('card');
    if (card) new MutationObserver(() => {
      const opened = storyArea ? !storyArea.hidden : card.classList.contains('show');
      if (opened) setExpanded(null);
    }).observe(card, {attributes: true, attributeFilter: storyArea ? ['hidden'] : ['class']});
    gallery.addEventListener('scroll', updateArrows, {passive: true});
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(updateArrows).observe(gallery);
    addEventListener('resize', updateArrows);
    decorate();
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', initSearchPreviews, {once: true});
  else initSearchPreviews();
})();
