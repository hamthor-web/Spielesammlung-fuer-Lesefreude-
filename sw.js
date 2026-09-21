const CACHE_NAME = 'lesen-entdecken-erzaehlen-offline-v9';

const APP_SHELL = [
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './responsive-home.css',
  './responsive-home.js',
  './start-hoch.webp',
  './kachel-wuerfeln.webp',
  './kachel-geschichten.webp',
  './kachel-verruecktes.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

async function withResponsiveHome(response) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  try {
    let html = await response.text();

    if (!html.includes('responsive-home.css')) {
      html = html.replace(/<\/head>/i,
        '<link rel="stylesheet" href="./responsive-home.css"></head>');
    }

    if (!html.includes('responsive-home.js')) {
      html = html.replace(/<\/body>/i,
        '<script src="./responsive-home.js"></script></body>');
    }

    const headers = new Headers(response.headers);
    headers.delete('content-length');

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (err) {
    return response;
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isHomeNavigation =
    event.request.mode === 'navigate' &&
    (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'));

  if (isHomeNavigation) {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        if (cached) return withResponsiveHome(cached.clone());

        return fetch(event.request).then(async response => {
          if (response && response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put('./index.html', response.clone());
          }
          return withResponsiveHome(response);
        }).catch(() => new Response('Startseite konnte nicht geladen werden.', {
          status:503,
          headers:{'content-type':'text/plain; charset=utf-8'}
        }));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (
          response &&
          response.ok &&
          new URL(event.request.url).origin === self.location.origin
        ) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html').then(r => r ? withResponsiveHome(r.clone()) : Response.error());
        }
        return Response.error();
      });
    })
  );
});
