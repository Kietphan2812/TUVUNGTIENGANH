const CACHE_NAME = 'tuvung-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Ưu tiên mạng, tránh cản trở các API Neon SQL hay cập nhật dữ liệu
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
