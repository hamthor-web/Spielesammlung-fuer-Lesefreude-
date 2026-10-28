/* Web installation UI. Native Android builds have their own bundled home page. */
(() => {
  const displayMode = matchMedia('(display-mode: standalone)');
  const isInstalled = () => displayMode.matches || navigator.standalone === true;
  const isNative = () => window.Capacitor?.isNativePlatform?.() === true;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  let installPrompt = null;
  let installing = false;
  let installed = false;
  let panel, button, hint;

  function render() {
    if (!panel) return;
    panel.hidden = installed || isInstalled() || isNative() ||
      (!isIOS && !isAndroid && !installPrompt);
    button.hidden = isIOS;
    button.disabled = installing;
    if (isIOS) {
      hint.hidden = false;
      hint.textContent = 'Auf dem iPhone oder iPad: Öffne diese Seite in Safari. Tippe auf „Teilen“ (Quadrat mit Pfeil nach oben), dann auf „Zum Home-Bildschirm“ und „Hinzufügen“. Falls angeboten, lasse „Als Web-App öffnen“ eingeschaltet.';
    }
  }

  addEventListener('beforeinstallprompt', event => {
    if (isInstalled() || isNative()) return;
    event.preventDefault();
    installPrompt = event;
    if (hint && !isIOS) hint.hidden = true;
    render();
  });
  addEventListener('appinstalled', () => {
    installed = true;
    installPrompt = null;
    render();
  });
  displayMode.addEventListener('change', render);

  function init() {
    const home = document.getElementById('home');
    if (!home || isNative()) return;
    panel = document.createElement('aside');
    panel.className = 'web-install';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Lesespiele installieren');
    const title = document.createElement('p');
    title.className = 'web-install-title';
    title.textContent = 'Lesespiele auf deinem Startbildschirm';
    button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Lesespiele installieren';
    button.setAttribute('aria-describedby', 'webInstallHint');
    hint = document.createElement('p');
    hint.id = 'webInstallHint';
    hint.hidden = true;
    hint.setAttribute('role', 'status');
    panel.append(title, button, hint);
    // Keep the same controls available before and after choosing a profile.
    // The profile dialog is created and removed dynamically by home.html.
    function placePanel() {
      const profilePanel = document.querySelector('.profile-overlay .profile-panel');
      const target = profilePanel || home;
      const before = target.querySelector(profilePanel ? '.profile-list' : '.adult-entry');
      if (panel.parentNode !== target) target.insertBefore(panel, before);
    }
    placePanel();
    new MutationObserver(placePanel).observe(document.body, { childList: true, subtree: true });

    button.addEventListener('click', async () => {
      if (installing) return;
      if (!installPrompt) {
        hint.textContent = 'Öffne das Browser-Menü (⋮) und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“. Falls die Option fehlt, öffne die Seite in Chrome. Ist die App schon installiert, kannst du sie über ihr Symbol starten.';
        hint.hidden = false;
        return;
      }
      const prompt = installPrompt;
      installPrompt = null; // Each browser prompt can only be used once.
      installing = true;
      render();
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        hint.textContent = choice.outcome === 'accepted'
          ? 'Installation bestätigt. Folge gegebenenfalls noch den Hinweisen deines Browsers.'
          : 'Du kannst die Spiele weiter im Browser spielen und später über das Browser-Menü installieren.';
      } catch {
        hint.textContent = 'Bitte öffne das Browser-Menü (⋮) und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.';
      } finally {
        installing = false;
        hint.hidden = false;
        render();
      }
    });
    render();
  }
  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
