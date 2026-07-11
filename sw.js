const CACHE_NAME = 'rifa-cache-v1';
const urlsToCache = [
  '/',
  'https://script.google.com/macros/s/AKfycbzApOiRbdid9v-8N7wri9mREJ7AnfvLg0l6NCZuRJ2KacmjU5OjIX-ctGVITMAH5q0A/exec',
  'https://i.ibb.co/gL5HKWDt/192-icon.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
