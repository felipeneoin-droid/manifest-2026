// ============================================
// SERVICE WORKER - RIFA PWA
// ============================================

const CACHE_NAME = 'rifa-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png'
];

// INSTALAÇÃO
self.addEventListener('install', function(event) {
  console.log('🔄 Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('✅ Service Worker instalado!');
        return self.skipWaiting();
      })
  );
});

// ATIVAÇÃO
self.addEventListener('activate', function(event) {
  console.log('⚡ Service Worker ativado');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// INTERCEPTAÇÃO
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          if (!response || response.status !== 200) {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(function() {
        return new Response('😅 Você está offline! Conecte-se à internet.', {
          status: 503,
          statusText: 'Offline'
        });
      })
  );
});
