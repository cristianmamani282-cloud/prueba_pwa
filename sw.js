/**
 * Service Worker Oficial para la PWA de Cristian Neil (UPDS)
 * Version: 3.2.0
 */

const CACHE_NAME = 'cristian-neil-pwa-v3.2.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './css/style.css',
  './script.js',
  './manifest.webmanifest',
  './manifest.json',
  './offline.html',
  './img/perfil.jpeg',
  './img/cup.jpeg',
  './img/girl.jpeg',
  './img/travel.jpeg',
  './img/tatto.jpeg',
  './img/carpediem.jpg',
  './img/descarga.jpg',
  './img/images.jpg',
  './juegos/minecraft.webp',
  './juegos/gta.jpg',
  './juegos/fc.jpg',
  './juegos/tekken7.jpg',
  './juegos/the-binding-of-isaac-rebirth.jpg',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA SW] Pre-cacheando recursos estáticos...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html') || caches.match('./offline.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {
        if (req.destination === 'image') return caches.match('./icons/icon-192.png');
      });
    })
  );
});

