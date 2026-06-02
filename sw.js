const CACHE = 'hk-v1';
 
// Files to cache for offline use
const PRECACHE = [
  '/HK/',
  '/HK/index.html',
  '/HK/manifest.json',
  '/HK/img/icon-192.png',
  '/HK/img/icon-512.png',
];
 
// Install — cache core files
self.addEventListener('fetch', e => {
  // If it's not a GET request or not our origin, let the browser handle it normally!
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return; // This is okay if you don't call e.respondWith(), BUT read below:
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