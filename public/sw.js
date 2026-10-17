const CACHE = 'aiescape-shell-v3';
const SHELL = ['/', '/style.css?v=0.2.1', '/fonts.css', '/app.js?v=0.2.1', '/i18n.js', '/voxel-room.js?v=0.2.1', '/lab.svg?v=0.2.1', '/icon.svg?v=0.2.1', '/manifest.webmanifest'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('aiescape-shell-') && k !== CACHE).map(k => caches.delete(k))))); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET' || !SHELL.some(path => new URL(path, self.location.origin).pathname === url.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy))); }
    return response;
  }).catch(() => caches.match(event.request)));
});
