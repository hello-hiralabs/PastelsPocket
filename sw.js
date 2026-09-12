/* =========================================================
   SERVICE WORKER
   ---------------------------------------------------------
   Strategi sengaja dibedakan per jenis berkas:
   · Cangkang aplikasi (index.html) -> network-first.
     Kalau online, selalu ambil versi terbaru, jadi pengguna
     tidak terjebak di versi lama setelah kamu deploy.
     Kalau offline, pakai salinan cache.
   · Aset pihak ketiga (font, ikon) -> cache-first.
     Isinya tidak berubah, jadi tidak perlu dicek tiap kali.
   ========================================================= */
const VERSI = 'pastels-v1';
const INTI = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(INTI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  const samaAsal = url.origin === self.location.origin;
  const cangkang = samaAsal && (url.pathname.endsWith('/') || url.pathname.endsWith('.html'));

  if(cangkang){
    e.respondWith(
      fetch(req).then(res => {
        caches.open(VERSI).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      /* hanya simpan respons yang benar-benar berhasil */
      if(res && (res.ok || res.type === 'opaque'))
        caches.open(VERSI).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => hit))
  );
});
