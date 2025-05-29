"use client";

import React, { useEffect } from 'react';

import { useDevice } from '@/hooks/use-device';

/**
 * Component to optimize initial asset loading strategy
 * This component helps improve both FCP and LCP by:
 * 1. Preloading critical resources
 * 2. Prioritizing above-the-fold content
 * 3. Deferring non-critical resources
 */
export const AssetOptimizer: React.FC = () => {
  const { isMobile, isTablet, connectionType } = useDevice();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Function to preload important resources
    const preloadResource = (url: string, as: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = as;
      document.head.appendChild(link);
    };
    
    // Function to prefetch less critical resources
    const prefetchResource = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    };
    
    // Determine if we're on a slow connection
    const isSlowConnection = connectionType === 'slow' || 
      (navigator as any).connection?.effectiveType === 'slow-2g' ||
      (navigator as any).connection?.effectiveType === '2g';
      
    // Critical resources that should be preloaded
    const criticalResources = [
      { url: '/images/hero-background.jpg', as: 'image' },
      { url: '/fonts/inter-var-latin.woff2', as: 'font' }
    ];
    
    // Secondary resources that can be prefetched
    const secondaryResources = [
      '/images/feature-1.jpg',
      '/images/feature-2.jpg'
    ];
    
    // Preload critical resources
    criticalResources.forEach(resource => {
      preloadResource(resource.url, resource.as);
    });
    
    // Only prefetch secondary resources on fast connections
    if (!isSlowConnection && !isMobile) {
      secondaryResources.forEach(url => {
        prefetchResource(url);
      });
    }
    
    // Optimize LCP by finding and prioritizing the largest image
    setTimeout(() => {
      // Find all large images in the viewport
      const images = Array.from(document.querySelectorAll('img'));
      const viewportImages = images.filter(img => {
        const rect = img.getBoundingClientRect();
        return (
          rect.top < window.innerHeight && 
          rect.width * rect.height > 50000 // Large images (> ~200x250px)
        );
      });
      
      // Set the loading priority for these images
      viewportImages.forEach(img => {
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('loading', 'eager');
      });
    }, 100); // Small delay to ensure DOM is ready
    
    // Defer non-critical CSS
    const deferredStyles = document.querySelectorAll('link[data-deferred="true"]');
    if (deferredStyles.length > 0) {
      // Load deferred styles after the page renders
      window.addEventListener('load', () => {
        deferredStyles.forEach(link => {
          (link as HTMLLinkElement).media = 'all';
        });
      });
    }
    
  }, [isMobile, isTablet, connectionType]);
  
  return null; // This component doesn't render anything
};

/**
 * Component to optimize image loading specifically for hero sections
 * Hero images are typically the LCP element and should be prioritized
 */
interface HeroImageOptimizerProps {
  imageUrl: string;
  fallbackUrl?: string;
  width?: number;
  height?: number;
}

export const HeroImageOptimizer: React.FC<HeroImageOptimizerProps> = ({
  imageUrl,
  fallbackUrl,
  width,
  height
}) => {
  const { isMobile } = useDevice();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Immediately preload the hero image
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
    
    // For mobile devices, also preload a smaller version if available
    if (isMobile && fallbackUrl) {
      const mobileLink = document.createElement('link');
      mobileLink.rel = 'preload';
      mobileLink.as = 'image';
      mobileLink.href = fallbackUrl;
      mobileLink.fetchPriority = 'high';
      document.head.appendChild(mobileLink);
    }
    
    return () => {
      // Safely remove elements if they exist
      const heroLink = document.querySelector(`link[href="${imageUrl}"]`);      if (heroLink) {
        try {
          document.head.removeChild(heroLink);
        } catch {
          console.warn('Could not remove hero image preload link');
        }
      }
      
      if (fallbackUrl) {
        const mobileLink = document.querySelector(`link[href="${fallbackUrl}"]`);
        if (mobileLink) {
          try {
            document.head.removeChild(mobileLink);
          } catch {
            console.warn('Could not remove fallback image preload link');
          }
        }
      }
    };
  }, [imageUrl, fallbackUrl, isMobile]);
  
  return null; // This component just handles preloading
};
