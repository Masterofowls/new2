"use client";

import React from 'react';

import { useDevice } from '@/hooks/use-device';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'text-blue-500',
  className = '',
}) => {
  const { isMobile } = useDevice();
  
  const getSizeClasses = () => {
    const baseSize = {
      small: isMobile ? 'w-4 h-4' : 'w-5 h-5',
      medium: isMobile ? 'w-6 h-6' : 'w-8 h-8',
      large: isMobile ? 'w-8 h-8' : 'w-12 h-12',
    };
    return baseSize[size];
  };

  return (
    <div className={`${getSizeClasses()} ${color} ${className}`}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full',
}) => {
  const { isMobile } = useDevice();
  
  const skeletonHeight = isMobile && height === 'h-4' ? 'h-3' : height;
  
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`
            ${skeletonHeight} ${width} 
            bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 
            dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
            animate-pulse rounded
            ${className}
          `}
          style={{
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </>
  );
};

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showPercentage = true,
  color = 'bg-blue-500',
}) => {
  const { isMobile } = useDevice();
  
  const height = isMobile ? 'h-2' : 'h-3';
  const textSize = isMobile ? 'text-xs' : 'text-sm';
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className={`mt-1 ${textSize} text-gray-600 dark:text-gray-400 text-center`}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.jpg',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const { isRetina } = useDevice();
  
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    setHasError(true);
    onError?.();
  };
  
  // Use higher resolution images for retina displays
  const imageSrc = isRetina && !hasError ? src.replace(/\.(jpg|jpeg|png)$/, '@2x.$1') : src;
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
          <Skeleton height="h-full" className="rounded-none" />
        </div>
      )}
      
      <img
        src={hasError ? placeholder : imageSrc}
        alt={alt}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  className = '',
}) => {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [canPull, setCanPull] = React.useState(false);
  const { isTouchDevice } = useDevice();
  
  const startY = React.useRef(0);
  const currentY = React.useRef(0);
  
  React.useEffect(() => {
    if (!isTouchDevice) return;
    
    const container = document.documentElement;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        setCanPull(true);
        startY.current = e.touches[0].clientY;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull) return;
      
      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    };
    
    const handleTouchEnd = async () => {
      if (!canPull) return;
      
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setPullDistance(0);
      setCanPull(false);
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchDevice, canPull, pullDistance, threshold, onRefresh]);
  
  return (
    <div className={className}>
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="flex items-center justify-center py-4 transition-all duration-200"
          style={{ 
            transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
            opacity: pullDistance / threshold 
          }}
        >
          {isRefreshing ? (
            <LoadingSpinner size="small" />
          ) : (
            <div className="text-gray-500 text-sm">
              {pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          )}
        </div>
      )}
      
      <div
        style={{ 
          transform: `translateY(${pullDistance > 0 ? Math.min(pullDistance, threshold) : 0}px)`,
          transition: pullDistance === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};
