/**
 * Service Worker for BookShelf PWA
 * Enables offline functionality by caching all app assets
 */

const CACHE_NAME = 'bookshelf-v1';

// Files to cache for offline use
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/src/css/styles.css',
    '/src/js/script.js',
    '/src/js/pdf-reader.js',
    '/src/assets/icon.jpg',
    '/src/books/iseeyoureyes/frontiseeyoureyes.png',
    '/src/books/iseeyoureyes/backiseeyoureyes.png',
    '/src/books/iseeyoureyes/iseeonyoureyes.pdf',
    '/manifest.json',
    // External resources
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching files...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('✅ Service Worker: All files cached!');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Cache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activated!');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cache new resources dynamically
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // If offline and resource not cached, return offline fallback
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
