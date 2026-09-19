/* Pastels — service worker
   Strategi:
   - Navigasi (membuka aplikasi): jaringan dulu, cache sebagai cadangan.
     Dengan begitu pembaruan index.html langsung terpakai, dan aplikasi tetap
     terbuka saat offline.
   - Aset milik sendiri (ikon, manifest): cache dulu, lalu diperbarui diam-diam.
   - Permintaan ke domain lain (font, ikon Iconify, Supabase): tidak disentuh.

   PENTING: naikkan VERSI setiap kali index.html diperbarui, supaya cache lama
   dibuang dan pengguna tidak tertinggal di versi sebelumnya.
*/
const VERSI = 'pastels-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSI)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(kunci => Promise.all(kunci.filter(k => k !== VERSI).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const salinan = res.clone();
          caches.open(VERSI).then(c => c.put('./index.html', salinan));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      const jaringan = fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const salinan = res.clone();
            caches.open(VERSI).then(c => c.put(req, salinan));
          }
          return res;
        })
        .catch(() => cached);
      return cached || jaringan;
    })
  );
});
