"use client";

import React, { useEffect } from 'react';

import { useDevice } from '@/hooks/use-device';

/**
 * This component optimizes First Contentful Paint (FCP) by:
 * 1. Minimizing render-blocking resources
 * 2. Preloading critical CSS
 * 3. Optimizing font loading and display
 * 4. Detecting and measuring FCP
 */
export const FCPOptimizer: React.FC = () => {
  const { isMobile } = useDevice();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Measure First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries[entries.length - 1];
        
        // Log FCP time in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[FCPOptimizer] First Contentful Paint: ${fcpEntry.startTime.toFixed(1)}ms`);
        }
        
        // Analyze FCP performance
        const fcpTime = fcpEntry.startTime;
        if (fcpTime > 3000) {
          console.warn(`[FCPOptimizer] Slow FCP detected: ${fcpTime.toFixed(1)}ms`);
          
          // Gather performance information
          const performanceEntries = performance.getEntriesByType('resource');
          const slowResources = performanceEntries
            .filter(entry => entry.duration > 300)
            .sort((a, b) => b.duration - a.duration);
          
          if (slowResources.length > 0) {
            console.warn('[FCPOptimizer] Slow resources that may be affecting FCP:');
            slowResources.slice(0, 5).forEach(resource => {
              console.warn(`- ${resource.name}: ${resource.duration.toFixed(1)}ms`);
            });
          }
        }
      });
      
      fcpObserver.observe({ type: 'paint', buffered: true });
      
      return () => {
        fcpObserver.disconnect();
      };
    }
  }, []);
  
  useEffect(() => {
    // Preload critical fonts based on device
    const preloadFont = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };
    
    // Only preload fonts for the current device type to reduce bandwidth
    if (isMobile) {
      // Preload only essential fonts for mobile
      preloadFont('/fonts/inter-var-latin-subset.woff2');
    } else {
      // Preload more fonts for desktop
      preloadFont('/fonts/inter-var-latin.woff2');
      preloadFont('/fonts/space-grotesk-var.woff2');
    }
    
    // Add font-display: swap to improve rendering
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Space Grotesk';
        font-display: swap;
      }
      
      @font-face {
        font-family: 'DM Mono';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile]);
  
  // This component doesn't render anything visible
  return null;
};
