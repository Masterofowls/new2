"use client";

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import Script from 'next/script';

export const CriticalPreload = () => {
  return (
    <>
      {/* Preconnect to essential third-party domains */}
      <link
        rel="preconnect"
        href="https://analytics.example.com"
        crossOrigin="anonymous"
      />
      
      {/* Add font optimization hints */}
      <link
        rel="preload"
        as="font"
        href={`https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2`}
        type="font/woff2"
        crossOrigin="anonymous"
      />
      
      <style>
        {`
          :root {
            --font-fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-synthesis: none;
          }
        `}
      </style>
    </>
  );
};

// Add interfaces for all components
interface ScriptOptimizerProps {
  analyticsUrl?: string;
  onLoad?: () => void;
}

// Component to defer non-critical JS
export const ScriptOptimizer: React.FC<ScriptOptimizerProps> = ({ 
  analyticsUrl = "https://example.com/analytics.js",
  onLoad
}) => {
  return (
    <>
      <Script
        src={analyticsUrl}
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Analytics script loaded');
          onLoad?.();
        }}
      />
    </>
  );
};

interface PerformanceMetricsProps {
  onLCPUpdate?: (value: number) => void;
  onFCPUpdate?: (value: number) => void;
  optimizeLCP?: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  onLCPUpdate,
  onFCPUpdate,
  optimizeLCP = true
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lcpObserver: PerformanceObserver;
    let fcpObserver: PerformanceObserver;

    try {
      // Create intersection observer for LCP optimization
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        
        // Log LCP in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`LCP: ${lcpEntry.startTime}ms`);
        }
        
        onLCPUpdate?.(lcpEntry.startTime);
        
        // Optimize LCP element if enabled
        if (optimizeLCP) {
          requestAnimationFrame(() => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
              if (isElementInViewport(img)) {
                img.setAttribute('loading', 'eager');
                img.setAttribute('fetchpriority', 'high');
              }
            });
          });
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Report FCP with error handling
      fcpObserver = new PerformanceObserver((list) => {
        try {
          for (const entry of list.getEntries()) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`FCP: ${entry.startTime}ms`);
            }
            onFCPUpdate?.(entry.startTime);
          }
        } catch (error) {
          console.warn('Error processing FCP entry:', error);
        }
      });
      
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.warn('Performance observer setup failed:', error);
    }
    
    // Cleanup
    return () => {
      try {
        lcpObserver?.disconnect();
        fcpObserver?.disconnect();
      } catch (error) {
        console.warn('Error during observer cleanup:', error);
      }
    };
  }, [onLCPUpdate, onFCPUpdate, optimizeLCP]);
  
  return null;
};

// Utility function to check if element is in viewport
const isElementInViewport = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

interface LazyLoadWrapperProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  priority?: boolean;
}

// Improved lazy loading component with eager loading for visible components
export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '200px 0px', 
  className = '',
  priority = false 
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const ref = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!ref.current || priority) return;
    
    const currentRef = ref.current; // Capture current value for cleanup
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    observer.observe(currentRef);
    
    return () => {
      observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin, priority]);
  
  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div className="w-full h-40 bg-gray-900 animate-pulse rounded-lg" />}
    </div>
  );
};

interface ContentPlaceholderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

// New component to reduce layout shifts with content placeholders
export const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({
  width = '100%',
  height = '40px',
  className = '',
  isLoading = true,
  children
}) => {
  const [dimensions, setDimensions] = useState({ width, height });

  useEffect(() => {
    setDimensions({ width, height });
  }, [width, height]);

  return isLoading ? (
    <div 
      className={`bg-gray-900 animate-pulse rounded-lg ${className}`}
      style={dimensions}
      role="presentation"
      aria-hidden="true"
    />
  ) : (
    <>{children}</>
  );
};

interface FontOptimizerProps {
  children: ReactNode;
  onLoad?: () => void;
  fallbackTimeout?: number;
}

export const FontOptimizer: React.FC<FontOptimizerProps> = ({ 
  children, 
  onLoad,
  fallbackTimeout = 3000
}) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  useEffect(() => {
    let mounted = true;

    const checkFontsLoaded = async () => {
      try {
        if ('fonts' in document) {
          // Set a fallback timeout
          timeoutRef.current = setTimeout(() => {
            if (mounted && !fontsLoaded) {
              console.warn('Font loading timed out, using system fonts');
              setFontsLoaded(true);
              onLoad?.();
            }
          }, fallbackTimeout);

          // Check if fonts are already loaded
          const fontFaceSet = document.fonts;
          await fontFaceSet.ready;

          // Clear timeout as fonts loaded successfully
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          if (mounted) {
            setFontsLoaded(true);
            document.documentElement.classList.add('fonts-loaded');
            onLoad?.();
          }
        } else {
          // Fallback for browsers without Font Loading API
          setFontsLoaded(true);
          onLoad?.();
        }
      } catch (error) {
        console.warn('Font loading error:', error);
        if (mounted) {
          setFontsLoaded(true);
          onLoad?.();
        }
      }
    };

    checkFontsLoaded();

    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onLoad, fallbackTimeout, fontsLoaded]);
  
  return (
    <div className={`${fontsLoaded ? 'fonts-loaded' : ''} font-sans transition-opacity duration-200 ease-in-out`}>
      {children}
    </div>
  );
};
