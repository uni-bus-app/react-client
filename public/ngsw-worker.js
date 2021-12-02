// tslint:disable:no-console

// this script will unregister the old angular service worker to allow
// the new react service worker to install

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  self.registration.unregister().then(() => {
    console.log('NGSW Safety Worker - unregistered old service worker');
    window.reload();
  });
});
