const CACHE_VERSION = "1";
const CACHE_NAME = `habit-tracker-v${CACHE_VERSION}`;
const APP_SHELL_CACHE = `habit-tracker-shell-v${CACHE_VERSION}`;
const ASSET_CACHE = `habit-tracker-assets-v${CACHE_VERSION}`;

// App shell - minimal precached pages for offline support
const APP_SHELL_ROUTES = ["/", "/login", "/signup", "/dashboard", "/offline"];

// Static assets to precache (icons, manifest, etc)
const STATIC_ASSETS = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icon.svg",
];

// Install event - populate caches with app shell and static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Precache app shell pages
      caches.open(APP_SHELL_CACHE).then((cache) => {
        // Attempt to cache all app shell routes
        // Note: This initiates requests, but some may fail during install
        // The fetch event handler will ensure they get cached when accessed
        return Promise.allSettled(
          APP_SHELL_ROUTES.map((route) =>
            fetch(route).then((response) => {
              if (response.status === 200) {
                cache.put(route, response);
              }
            }),
          ),
        );
      }),
      // Precache static assets
      caches.open(ASSET_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
    ]),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              !name.includes(`habit-tracker-v${CACHE_VERSION}`) &&
              !name.includes(`habit-tracker-shell-v${CACHE_VERSION}`) &&
              !name.includes(`habit-tracker-assets-v${CACHE_VERSION}`)
            );
          })
          .map((name) => caches.delete(name)),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - intelligent caching strategy
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const { request } = event;
  const url = new URL(request.url);

  // Navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed - try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            // If page not in cache, serve offline page
            return caches.match("/offline").then((offlineResponse) => {
              return (
                offlineResponse || new Response("Offline", { status: 503 })
              );
            });
          });
        }),
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts) - cache first
  if (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".ttf") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(ASSET_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      }),
    );
    return;
  }

  // Default - network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed - try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // Fallback - return 404 response
          return new Response("Not Found", { status: 404 });
        });
      }),
  );
});
