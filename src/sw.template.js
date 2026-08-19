// Offline shell for Mr. Shake. Bumping VERSION invalidates the old cache.
const VERSION = "__BUILD__";
const CACHE = "ms-" + VERSION;

const SHELL = [
  "./",
  "index.html",
  "app.js",
  "app.css",
  "manifest.webmanifest",
  "icon.svg",
  "favicon.png",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  // Feltwork ships three VARIABLE faces in place of nine static IBM Plex
  // files — one file per family covering every weight and width. If this
  // list drifts from what build.sh emits, offline loads 404.
  "fonts/Archivo.woff2",
  "fonts/HankenGrotesk.woff2",
  "fonts/MartianMono.woff2",
  "tex/felt-1024.png",
  "filters.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Any navigation is served by the cached shell
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("index.html", { ignoreSearch: true }).then((hit) => {
        const net = fetch(req)
          .then((res) => {
            if (res && res.ok) caches.open(CACHE).then((c) => c.put("index.html", res.clone()));
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});
