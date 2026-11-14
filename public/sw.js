const CACHE = 'aiescape-shell-v6';
const SHELL = ['/', '/style.css?v=0.3.0', '/fonts.css', '/app.js?v=0.3.0', '/i18n.js?v=0.3.0', '/event-config.js?v=0.3.0', '/voxel-room.js?v=0.3.0', '/lab.svg?v=0.3.0', '/icon.svg?v=0.3.0', '/manifest.webmanifest'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('aiescape-shell-') && k !== CACHE).map(k => caches.delete(k))))); });
self.addEventListener('fetch', event => {
  // Den Start nur beim Öffnen abrufen, niemals vorab cachen; offline zur App weiter.
  const pwaStart = new URL(event.request.url);
  if (event.request.method === 'GET' && event.request.mode === 'navigate' && pwaStart.origin === self.location.origin && ['/pwa-start.html', '/pwa-start', '/pwa-start-en.html', '/pwa-start-en', '/pwa-start/', '/pwa-start-en/'].includes(pwaStart.pathname)) {
    const target = pwaStart.pathname.includes('-en') ? "/?lang=en" : "/";
    event.stopImmediatePropagation();
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => Response.redirect(new URL(target, self.location.origin).href, 302)));
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET' || !SHELL.some(path => new URL(path, self.location.origin).pathname === url.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy))); }
    return response;
  }).catch(() => caches.match(event.request)));
});
