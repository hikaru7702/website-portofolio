const VERSION = "portfolio-v5";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const IMAGE_CACHE = `${VERSION}-images`;
const MAX_IMAGE_ENTRIES = 80;

const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const OFFLINE_URL = `${BASE_PATH}/offline`;
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  OFFLINE_URL,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/icons/192.png`,
  `${BASE_PATH}/icons/512.png`,
  `${BASE_PATH}/icons/maskable.png`,
  `${BASE_PATH}/icons/apple-touch-icon.png`,
  `${BASE_PATH}/og-image.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined)
        )
      )
    )
  );
});

self.addEventListener("activate", (event) => {
  const activeCaches = new Set([STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE]);

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !activeCaches.has(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith(`${BASE_PATH}/api/`)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith(`${BASE_PATH}/_next/image`) ||
    /\.(?:png|jpe?g|webp|avif|gif|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_IMAGE_ENTRIES));
    return;
  }

  if (url.pathname.startsWith(`${BASE_PATH}/_next/static/`)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(event, request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok && response.type === "basic") {
      const cache = await caches.open(PAGE_CACHE);
      await cache.put(request, response.clone());
    }

    if (response.status >= 500) {
      const cached = await caches.match(request);
      if (cached) return cached;
    }

    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) return offlineResponse;

    return new Response(
      `<!doctype html><html lang="id"><meta charset="utf-8"><title>Offline</title><body style="font-family:system-ui;padding:2rem;text-align:center"><h1>Anda sedang offline</h1><p>Halaman ini belum tersimpan. Kembali ke beranda untuk melihat konten yang tersedia.</p><a href="${BASE_PATH}/">Kembali ke beranda</a></body></html>`,
      {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  let response;

  try {
    response = await fetch(request);
  } catch {
    return new Response("", { status: 504, statusText: "Offline" });
  }

  if (response.ok) {
    await cache.put(request, response.clone());
    if (maxEntries) await trimCache(cacheName, maxEntries);
  }

  return response;
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  const networkRequest = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(
      () =>
        cached ??
        new Response("", { status: 503, statusText: "Offline" })
    );

  event.waitUntil(networkRequest);

  return cached || networkRequest;
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length <= maxEntries) return;

  await Promise.all(
    keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key))
  );
}
