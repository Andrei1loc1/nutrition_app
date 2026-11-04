const CACHE_NAME = 'neurosnap-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch(OFFLINE_URL).then((response) => {
      if (response.ok) {
        return caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]));
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});