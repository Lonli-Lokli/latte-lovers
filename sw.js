const CACHE_NAME = "coffee-lovers-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/script.mjs",
  "/manifest.json",
  "/styles.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Serve from cache if available
      if (response) {
        return response;
      }
      // Fallback: fetch from network
      return fetch(event.request).catch(() => {
        // If offline and request is for a navigation, serve index.html
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
