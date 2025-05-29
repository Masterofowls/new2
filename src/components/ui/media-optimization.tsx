"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import { useConnectionQuality } from '@/components/ui/connection-quality';
import { useDevice } from '@/hooks/use-device';

// Optimized image component that loads appropriate resolution based on device and connection
interface OptimizedImageProps {
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
  lowQualitySrc?: string;
  fill?: boolean;
  isLCP?: boolean; // Flag for Largest Contentful Paint element
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality: initialQuality = 75,
  sizes,
  className = '',
  onLoad,
  blurDataURL,
  placeholder,
  lowQualitySrc,
  fill = false,
  isLCP = false, // New prop to identify the Largest Contentful Paint element
}) => {
  const { isMobile, isTablet, isRetina, devicePixelRatio } = useDevice();
  const { quality: connectionQuality } = useConnectionQuality();
  const [quality, setQuality] = useState(initialQuality);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Auto-prioritize LCP elements
  const shouldPrioritize = priority || isLCP;
  
  // Determine optimal quality based on device and connection
  useEffect(() => {
    // Start with default quality
    let newQuality = initialQuality;
    
    // Lower quality for mobile devices on slow connections
    if (isMobile && connectionQuality === 'slow') {
      newQuality = Math.min(newQuality, 50); // Max 50% quality
      
      // Use low quality source if provided and on very slow connection
      if (lowQualitySrc) {
        setCurrentSrc(lowQualitySrc);
      }
    } 
    // Medium quality for tablets on slow connections or mobile on medium connection
    else if ((isTablet && connectionQuality === 'slow') || 
             (isMobile && connectionQuality === 'medium')) {
      newQuality = Math.min(newQuality, 65); // Max 65% quality
    }
    // Higher quality for high DPI displays on fast connections
    else if (isRetina && connectionQuality === 'fast') {
      newQuality = Math.min(95, initialQuality + 10); // Increase quality for retina displays
    }
    
    setQuality(newQuality);
  }, [isMobile, isTablet, isRetina, connectionQuality, initialQuality, lowQualitySrc, devicePixelRatio]);
  
  // Generate sizes prop if not provided
  const defaultSizes = !sizes ? 
    isMobile ? '100vw' : 
    isTablet ? '50vw' : 
    '33vw'
    : sizes;
    
  // Effect to add fetchpriority attribute to LCP image
  useEffect(() => {
    if (imgRef.current && shouldPrioritize) {
      // Set fetchpriority attribute for modern browsers
      imgRef.current.setAttribute('fetchpriority', 'high');
      
      // Also set loading=eager to ensure immediate loading
      imgRef.current.setAttribute('loading', 'eager');
      
      // Use the newer decoding=async attribute for better performance
      imgRef.current.setAttribute('decoding', 'async');
    }
  }, [shouldPrioritize]);
  
  return (
    <Image
      ref={imgRef as any} // Type assertion due to Next.js Image component ref handling
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={shouldPrioritize}
      sizes={defaultSizes}
      className={className}
      onLoad={onLoad}
      blurDataURL={blurDataURL}
      placeholder={placeholder}
      loading={shouldPrioritize ? 'eager' : 'lazy'}
      fill={fill}
    />
  );
};

// Optimized video component that loads appropriate quality based on device and connection
interface OptimizedVideoProps {
  src: string;
  mobileSrc?: string;
  tabletSrc?: string;
  poster?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
  onLoad?: () => void;
  preload?: 'auto' | 'metadata' | 'none';
  children?: React.ReactNode;
}

export const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  mobileSrc,
  tabletSrc,
  poster,
  width,
  height,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  playsInline = true,
  className = '',
  onLoad,
  preload = 'metadata',
  children,
}) => {
  const { isMobile, isTablet, isTouchDevice } = useDevice();
  const { quality: connectionQuality } = useConnectionQuality();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Determine which source to use based on device
  const getOptimalSource = () => {
    if (isMobile && mobileSrc) {
      return mobileSrc;
    } else if (isTablet && tabletSrc) {
      return tabletSrc;
    }
    return src;
  };
  
  // Determine preload strategy based on connection quality
  const getPreloadStrategy = () => {
    if (connectionQuality === 'slow') {
      return 'none';
    } else if (connectionQuality === 'medium') {
      return 'metadata';
    }
    return preload;
  };
  
  // Autoplay only on fast connections for non-priority videos
  const shouldAutoplay = autoPlay && (connectionQuality !== 'slow' || isTouchDevice === false);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // For touch devices, only autoplay if explicitly set
    // For non-touch devices, autoplay more liberally
    if (shouldAutoplay) {
      // Modern browsers require muted for autoplay
      videoElement.muted = true;
      
      // Try to play the video
      const playPromise = videoElement.play();
      
      // Handle play promise (might be rejected on mobile)
      if (playPromise !== undefined) {
        playPromise
          .catch(error => {
            console.log("Autoplay was prevented:", error);
          });
      }
    }
    
    // Reduce quality for slow connections by adjusting playback rate
    if (connectionQuality === 'slow' && videoElement.readyState >= 3) {
      // Lower resolution videos are smoother at normal speed
      videoElement.playbackRate = 1.0;
    } else {
      videoElement.playbackRate = 1.0;
    }
  }, [shouldAutoplay, connectionQuality]);
  
  // Handle load event
  const handleLoadedData = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  return (
    <div className={`video-container relative ${className}`} style={{ width, height }}>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        poster={poster}
        autoPlay={shouldAutoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        preload={getPreloadStrategy()}
        onLoadedData={handleLoadedData}
      >
        <source src={getOptimalSource()} type="video/mp4" />
        {children}
      </video>
      
      {!isLoaded && poster && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Background video component optimized for different devices
interface BackgroundVideoProps {
  src: string;
  mobileSrc?: string;
  fallbackImage: string;
  className?: string;
  overlayClassName?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  src,
  mobileSrc,
  fallbackImage,
  className = '',
  overlayClassName = '',
}) => {
  const { isMobile, isTablet, isTouchDevice } = useDevice();
  const { quality: connectionQuality } = useConnectionQuality();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // On mobile devices with slow connections, just show the fallback image
  const shouldShowVideo = !(isMobile && connectionQuality === 'slow');
  
  // Use mobile source on mobile devices if available
  const videoSource = isMobile && mobileSrc ? mobileSrc : src;
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fallback image - always present */}
      <div className={`absolute inset-0 z-0 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        <OptimizedImage
          src={fallbackImage}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Video background - conditionally loaded */}
      {shouldShowVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover z-10 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
          onCanPlay={() => setIsVideoPlaying(true)}
        >
          <source src={videoSource} type="video/mp4" />
        </video>
      )}
      
      {/* Optional overlay */}
      <div className={`absolute inset-0 z-20 ${overlayClassName}`}></div>
    </div>
  );
};

// Media gallery component optimized for different devices
interface MediaGalleryProps {
  images: {
    src: string;
    alt: string;
    mobileSrc?: string;
    tabletSrc?: string;
    width?: number;
    height?: number;
  }[];
  className?: string;
  imageClassName?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  images,
  className = '',
  imageClassName = '',
}) => {
  const { isMobile, isTablet } = useDevice();
  const [imagesPerRow, setImagesPerRow] = useState(3);
  
  // Adjust images per row based on device
  useEffect(() => {
    if (isMobile) {
      setImagesPerRow(1);
    } else if (isTablet) {
      setImagesPerRow(2);
    } else {
      setImagesPerRow(3);
    }
  }, [isMobile, isTablet]);
  
  return (
    <div className={`grid gap-4 ${className}`} style={{ 
      gridTemplateColumns: `repeat(${imagesPerRow}, 1fr)` 
    }}>
      {images.map((image, index) => {
        // Determine best source based on device
        const bestSrc = isMobile && image.mobileSrc ? 
          image.mobileSrc : 
          isTablet && image.tabletSrc ? 
          image.tabletSrc : 
          image.src;
          
        return (
          <div key={index} className="relative overflow-hidden rounded-lg">
            <OptimizedImage
              src={bestSrc}
              alt={image.alt}
              width={image.width || 400}
              height={image.height || 300}
              className={`w-full h-auto object-cover transition-transform hover:scale-105 duration-300 ${imageClassName}`}
              sizes={isMobile ? '100vw' : isTablet ? '50vw' : '33vw'}
            />
          </div>
        );
      })}
    </div>
  );
};
