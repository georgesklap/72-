// Scoped to /72-/; never caches other GitHub Pages projects.
const CACHE = '72-ores-offline-v1';
const ROOT = new URL('./', self.location.href);
const APP = new URL('index.html', ROOT).href;
const FILES = [APP, new URL('manifest.webmanifest',ROOT).href, new URL('icon-192.png',ROOT).href, new URL('icon-512.png',ROOT).href];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('72-ores-offline-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(response => { if(response.ok) {const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(APP,copy));}return response;}).catch(()=>caches.match(APP)));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
