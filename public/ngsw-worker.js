/// <reference lib="webworker" />

console.log('installing new service worker');

const deleteCaches = async () => {
  try {
    const cache = await self.caches.open('ngsw:/:db:control');
    const res = await cache.match('/latest');
    const { latest } = await res.json();
    await self.caches.delete(`ngsw:/:${latest}:assets:app:cache`);
    await self.caches.delete(`ngsw:/:db:ngsw:/:${latest}:assets:app:meta`);
    await self.caches.delete(`ngsw:/:${latest}:assets:assets:cache`);
    await self.caches.delete(`ngsw:/:db:ngsw:/:${latest}:assets:assets:meta`);
    await self.caches.delete(`ngsw:/:db:control`);
  } catch {}
};

const notifyClients = async () => {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'UPDATE_AVAILABLE',
    });
  });
};

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteCaches().then(() => notifyClients()));
});

try {
  importScripts('service-worker.js');
} catch (error) {}
