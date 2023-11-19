/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { initialize } from 'workbox-google-analytics';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import LocalDB from './api/NewLocalDB';
import config from './config';
import { get } from 'idb-keyval';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

initialize();

const db = new LocalDB();
const channel = new BroadcastChannel('sw_channel');
db.init().then((updates) => {
  channel.postMessage({ type: 'sync', updates });
});

channel.onmessage = (event) => {
  if (event.data.action === 'sync') {
    db.sync();
  }
};

// const cacheBus = async () => {
//   const cache = await caches.open('bus');
//   const response = await fetch(`${config.apiURL}/sync`, { method: 'POST' });
//   const data = await response.json();
//   cache.put(`${config.apiURL}/stops`, new Response(JSON.stringify(data.stops)));
//   const response1 = await fetch(`${config.apiURL}/u1routepath`);
//   cache.put(`${config.apiURL}/u1routepath`, response1);
//   data.times.forEach((item: any) => {
//     cache.put(
//       `${config.apiURL}/stops/${item.stopID}/times`,
//       new Response(JSON.stringify(item.times))
//     );
//   });
// };
// cacheBus();

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    const clients = await self.clients.matchAll();
    console.log(clients);
  }
});

self.addEventListener('fetch', (ev) => {
  const { url } = ev.request;
  const serviceWorkerOrigin = new URL(self.registration.scope).origin;
  const requestOrigin = new URL(url).origin;
  if (
    url.includes('dot-unibus-app.nw.r.appspot.com/') ||
    url.includes('localhost:8080') ||
    (serviceWorkerOrigin === requestOrigin && url.includes('/api/'))
  ) {
    ev.respondWith(
      (async () => {
        if (url.includes('stops')) {
          if (url.includes('times')) {
            const stopID = url.split('stops/')?.pop()?.split('/')?.[0];
            const date = new URLSearchParams(url.split('?').pop()).get('date');
            if (stopID) {
              const times = await db.getTimes(stopID, date);
              return new Response(JSON.stringify(times));
            } else {
              return fetch(ev.request);
            }
          } else {
            const stops = await db.getStops();
            return new Response(JSON.stringify(stops));
          }
        } else if (url.includes('u1routepath')) {
          const times = await get('u1RoutePath');
          return new Response(JSON.stringify(times));
        } else {
          return fetch(ev.request);
        }
      })()
    );
  }
});
