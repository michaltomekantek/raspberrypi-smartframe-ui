// Podstawowy Service Worker wymagany przez PWA
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Pozwalamy na normalne pobieranie danych z API
  e.respondWith(fetch(e.request));
});