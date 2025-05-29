"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import { useConnectionQuality } from '@/components/ui/connection-quality';
import { useDevice } from '@/hooks/use-device';

interface AdvancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
  fill?: boolean;
  isLCP?: boolean; // Flag for Largest Contentful Paint element
}

/**
 * Advanced Image component with optimizations for Core Web Vitals
 * This component is specifically designed to improve LCP and CLS metrics
 */
export const AdvancedImage: React.FC<AdvancedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  sizes,
  className = '',
  onLoad,
  blurDataURL,
  placeholder,
  fill = false,
  isLCP = false,
}) => {
  const { isMobile, isTablet, devicePixelRatio } = useDevice();
  const { quality: connectionQuality } = useConnectionQuality();
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Auto-prioritize LCP elements
  const shouldPrioritize = priority || isLCP;
  
  // Generate sizes prop if not provided
  const defaultSizes = !sizes ? 
    isMobile ? '100vw' : 
    isTablet ? '50vw' : 
    '33vw'
    : sizes;
  
  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
    
    // Mark loading performance
    if (shouldPrioritize && window.performance && window.performance.mark) {
      window.performance.mark('lcp-image-loaded');
    }
  };
  
  // Effect to set fetchpriority attribute
  useEffect(() => {
    if (!imageRef.current || !shouldPrioritize) return;
    
    // Use high fetchpriority for important images
    const img = imageRef.current;
    if ('fetchPriority' in HTMLImageElement.prototype) {
      img.fetchPriority = 'high';
    } else {
      // Fallback for browsers that don't support fetchPriority
      img.setAttribute('fetchpriority', 'high');
    }
    
    // Mark the start of LCP image loading
    if (window.performance && window.performance.mark) {
      window.performance.mark('lcp-image-start');
    }
  }, [shouldPrioritize]);
  
  // Calculate optimal quality based on device and connection
  const getOptimalQuality = () => {
    if (isMobile && connectionQuality === 'slow') {
      return Math.min(quality, 50); // Max 50% quality on slow mobile
    } else if ((isTablet && connectionQuality === 'slow') || 
               (isMobile && connectionQuality === 'medium')) {
      return Math.min(quality, 65); // Max 65% quality
    } else if (devicePixelRatio > 1 && connectionQuality === 'fast') {
      return Math.min(95, quality + 10); // Increase quality for retina displays with fast connection
    }
    return quality;
  };
  
  return (
    <div className={`relative ${className}`} style={{ 
      width: fill ? '100%' : width, 
      height: fill ? '100%' : height,
      // Reserve space to prevent layout shifts
      aspectRatio: !fill && width && height ? `${width}/${height}` : undefined
    }}>
      {/* Placeholder for loading state */}
      {!isLoaded && !blurDataURL && (
        <div 
          className="absolute inset-0 bg-gray-900 animate-pulse" 
          style={{ 
            width: fill ? '100%' : width,
            height: fill ? '100%' : height
          }}
        />
      )}
      
      <Image
        ref={imageRef as any} // Cast needed for Next.js Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={getOptimalQuality()}
        priority={shouldPrioritize}
        sizes={defaultSizes}
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        loading={shouldPrioritize ? 'eager' : 'lazy'}
        fill={fill}
      />
    </div>
  );
};
