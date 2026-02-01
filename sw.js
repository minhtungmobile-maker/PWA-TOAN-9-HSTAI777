const CACHE_NAME = 'pwa-toan9-v1';

const OFFLINE_URL = '/offline.html';

const PRECACHE_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',

  // folders
  '/lessons/',
  '/exercises/',
  '/hs-yeu/',
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_FILES);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL)
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    )
  );
});