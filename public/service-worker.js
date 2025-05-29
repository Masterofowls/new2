// Service worker for FinTech Pro Application
// This provides offline functionality and caching strategies

const CACHE_NAME = 'fintech-pro-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately during installation
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Dynamic content that will be cached during usage
const DYNAMIC_CACHE_PATTERNS = [
  /\.(js|css)$/,
  /\.(png|jpg|jpeg|svg|gif|webp)$/,
  /\.(woff|woff2|ttf|otf)$/
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache static assets
      await cache.addAll(STATIC_ASSETS);
      // Ensure the offline page is cached
      const offlineResponse = await fetch(OFFLINE_URL);
      await cache.put(OFFLINE_URL, offlineResponse);
      // Activate immediately
      await self.skipWaiting();
    })()
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

// Helper to determine if a request should be cached dynamically
const shouldCacheDynamically = (url) => {
  const requestUrl = new URL(url);
  // Don't cache API calls or analytics
  if (requestUrl.pathname.startsWith('/api/') || 
      requestUrl.pathname.includes('analytics') || 
      requestUrl.pathname.includes('tracking')) {
    return false;
  }
  
  // Cache based on file extensions
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(requestUrl.pathname));
};

// Network-first strategy with dynamic caching for most resources
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    
    // Cache dynamic content that matches our patterns
    if (networkResponse.ok && shouldCacheDynamically(request.url)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a page navigation and we don't have it cached, show offline page
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match(OFFLINE_URL);
    }
    
    // Otherwise just propagate the error
    throw error;
  }
};

// Cache-first strategy for static assets
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    // Cache for future use
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // For image failures, you could return a placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eee"/><text x="200" y="150" text-anchor="middle" fill="#888">Image Unavailable</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
};

// Fetch event - Apply different strategies based on request type
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Don't handle non-GET requests or cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  
  // Apply different strategies based on request type
  if (request.destination === 'document') {
    // For HTML documents - network-first strategy
    event.respondWith(networkFirst(request));
  } else if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    // For static assets - cache-first strategy
    event.respondWith(cacheFirst(request));
  } else {
    // For everything else - network-first
    event.respondWith(networkFirst(request));
  }
});

// Background sync for offline data submission
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

// Function to handle syncing stored form data when back online
async function syncFormData() {
  try {
    // Open the IndexedDB database
    const db = await openDB('offline-forms', 1);
    // Get all stored form submissions
    const submissions = await db.getAll('submissions');
    
    for (const submission of submissions) {
      try {
        // Attempt to send each stored submission
        const response = await fetch(submission.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          // If successful, remove from IndexedDB
          await db.delete('submissions', submission.id);
        }
      } catch (error) {
        console.error('Failed to sync submission:', error);
        // We'll retry on next sync event
      }
    }
  } catch (error) {
    console.error('Error in sync operation:', error);
  }
}

// Open IndexedDB helper function
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Push notification event handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'FinTech Pro Notification',
        options
      )
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open, open one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
