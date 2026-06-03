const CACHE = 'hk-v2';
 
// Files to cache for offline use
const PRECACHE = [
  '/HK/',
  '/HK/index.html',
  '/HK/manifest.json',
  '/HK/img/icon-192.png',
  '/HK/img/icon-512.png',
];
 
// 1. Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});
 
// 2. Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
 
// 3. Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  // If it's not a GET request or not our origin, let the browser handle it normally
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return; 
  }
 
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});