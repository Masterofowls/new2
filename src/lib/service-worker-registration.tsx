"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker only in production and in supported browsers
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost'
    ) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
            
            // Set up periodic sync if supported
            if ('periodicSync' in registration) {
              const status = navigator.permissions.query({
                name: 'periodic-background-sync',
              }).then((status) => {
                if (status.state === 'granted') {
                  registration.periodicSync.register('content-sync', {
                    minInterval: 24 * 60 * 60 * 1000, // 24 hours
                  });
                }
              });
            }
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    if (window.confirm('New version available! Reload to update?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
        
        // Handle service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }
  }, []);

  return null;
}

// Helper functions for PWA features

// Function to check if the PWA is installed
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: fullscreen)').matches || 
         window.matchMedia('(display-mode: minimal-ui)').matches ||
         (window.navigator as any).standalone === true; // For iOS
}

// Function to detect if the app can be installed
export function usePWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = 
    typeof window !== 'undefined' ? 
      useEffect(() => {
        const handler = (e: any) => {
          e.preventDefault();
          setInstallPrompt(e);
        };
        
        window.addEventListener('beforeinstallprompt', handler);
        
        return () => window.removeEventListener('beforeinstallprompt', handler);
      }, []) : [null, () => {}];
  
  // Function to show the install prompt
  const showInstallPrompt = async () => {
    if (!installPrompt) return false;
    
    installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    
    // Reset the install prompt
    setInstallPrompt(null);
    
    return choiceResult.outcome === 'accepted';
  };
  
  return {
    canInstall: !!installPrompt,
    showInstallPrompt,
    isInstalled: isPWAInstalled()
  };
}

// Function to detect offline status
export function useOfflineDetection() {
  const [isOffline, setIsOffline] = 
    typeof window !== 'undefined' ? 
      useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Set initial value
        setIsOffline(!navigator.onLine);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }, []) : [false, () => {}];
  
  return isOffline;
}

// Function to detect connection quality
export function useConnectionQuality() {
  const [connectionQuality, setConnectionQuality] = 
    typeof window !== 'undefined' && 'connection' in navigator ? 
      useEffect(() => {
        const connection = (navigator as any).connection;
        
        const updateConnectionQuality = () => {
          const quality = {
            type: connection.type,
            effectiveType: connection.effectiveType,
            downlinkMax: connection.downlinkMax,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
          };
          
          setConnectionQuality(quality);
        };
        
        connection.addEventListener('change', updateConnectionQuality);
        updateConnectionQuality();
        
        return () => connection.removeEventListener('change', updateConnectionQuality);
      }, []) : [null, () => {}];
  
  return connectionQuality;
}
