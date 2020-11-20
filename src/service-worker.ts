declare const self: ServiceWorkerGlobalScope;
export {};

const CACHE_NAME = 'static-v1';
const FILES_TO_CACHE = [
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE)),
  );
});

self.addEventListener('activate', async (event) => {
  event.waitUntil(
    caches.keys()
      .then((keyList) => Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return false;
      }))),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => cache.match(event.request)
        .then((response) => response || fetch(event.request))),
  );
});
