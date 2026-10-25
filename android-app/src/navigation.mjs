export function backTarget(hash) {
  const id = hash.replace(/^#spiel-/, '');
  if (hash.startsWith('#spiel-')) {
    if (['freizeit', 'sport', 'maerchen'].includes(id)) return 'dice';
    if (['herbstgeschichten', 'fussballgeschichten'].includes(id)) return 'stories';
    return 'crazy';
  }
  return 'home';
}

export function mountNavigation() {
  const profiles = window.LeseProfile;
  if (!profiles || document.getElementById('appNavigation')) return;
  const style = document.createElement('style');
  style.textContent = `.app-navigation{position:sticky;top:0;z-index:100;display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:8px 12px;background:#fffdf0;color:#173c2a;border-bottom:1px solid #c8d9c6;font:16px Nunito,Arial,sans-serif}.app-navigation strong{flex:1;min-width:0;overflow-wrap:anywhere}.app-navigation button{font:inherit;font-weight:800;border:1px solid #8da982;border-radius:12px;padding:8px 12px;background:#e7f3e8;color:inherit}.preview-shell{top:var(--app-navigation-height,0px)}@media(max-width:520px){.app-navigation{gap:6px;padding:6px 10px;font-size:14px}.app-navigation strong{flex-basis:100%}.app-navigation button{flex:1;padding:7px 10px}}`;
  style.textContent += '[data-home],#previewBackHome,.adult-entry{display:none}.app-navigation button[hidden]{display:none}';
  document.head.append(style);
  const bar = document.createElement('nav');
  bar.id = 'appNavigation'; bar.className = 'app-navigation';
  bar.setAttribute('aria-label', 'Profil und Navigation');
  bar.innerHTML = '<strong id="activeProfileName" aria-live="polite"></strong><button type="button" id="appProfileSwitch">Profil wechseln</button><button type="button" id="appGoHome">← Startmenü</button>';
  document.body.prepend(bar);
  const label = bar.querySelector('strong');
  function update() {
    label.textContent = profiles.active() ? 'Profil: ' + profiles.active().name : 'Noch kein Profil gewählt';
    const adult = document.getElementById('adultOpen');
    if (adult) adult.hidden = true;
    bar.querySelector('#appGoHome').hidden = !location.hash || location.hash === '#home';
  }
  const resize = new ResizeObserver(() => document.documentElement.style.setProperty('--app-navigation-height', bar.getBoundingClientRect().height + 'px'));
  resize.observe(bar);
  function goTo(target) {
    const shell = document.getElementById('previewShell');
    if (shell && !shell.hidden) document.getElementById('previewBackCategory').click();
    history.replaceState(null, '', location.pathname + location.search + (target === 'home' ? '' : '#' + target));
    dispatchEvent(new PopStateEvent('popstate'));
    update();
  }
  let choosing = false;
  async function chooseProfile() {
    if (choosing || document.querySelector('.profile-overlay')) return;
    choosing = true;
    try {
      await window.LesespieleNative.persist();
      goTo('home');
      await profiles.choose();
      sessionStorage.setItem('lesespiele-profile-selected', '1');
      update();
    } finally { choosing = false; }
  }
  function back() {
    if (location.hash) goTo(backTarget(location.hash));
    else chooseProfile();
  }
  bar.querySelector('#appProfileSwitch').onclick = chooseProfile;
  bar.querySelector('#appGoHome').onclick = () => goTo('home');
  document.addEventListener('click', event => {
    if (!event.target.closest('[data-home],#previewBackHome')) return;
    event.preventDefault(); event.stopImmediatePropagation(); goTo('home');
  }, true);
  addEventListener('lesespiele-profile-change', update);
  addEventListener('popstate', update);
  addEventListener('hashchange', update);
  document.addEventListener('click', event => {
    if (event.target.closest('[data-section]')) update();
  });
  window.LeseNavigation = { back, goHome: () => goTo('home'), chooseProfile };
  update();
}
