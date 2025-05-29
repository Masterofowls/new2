"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useDevice } from '@/hooks/use-device';

import { TouchInteraction } from './touch-interaction';

interface ResponsiveCarouselProps {
  children: React.ReactNode[];
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  children,
  className = '',
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { isMobile, isTablet, isDesktop } = useDevice();

  const getItemsPerView = () => {
    if (isMobile) return itemsPerView.mobile || 1;
    if (isTablet) return itemsPerView.tablet || 2;
    if (isDesktop) return itemsPerView.desktop || 3;
    return 1;
  };

  const itemsCount = children.length;
  const visibleItems = getItemsPerView();
  const maxIndex = Math.max(0, itemsCount - visibleItems);

  useEffect(() => {
    if (isAutoPlaying && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, autoPlay, autoPlayInterval, maxIndex]);

  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  const handleSwipeLeft = () => goToNext();
  const handleSwipeRight = () => goToPrevious();

  return (
    <div className={`relative w-full ${className}`}>
      <TouchInteraction
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="overflow-hidden"
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleItems}%)`,
            width: `${(itemsCount * 100) / visibleItems}%`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsCount}%` }}
            >
              <div className="px-2">
                {child}
              </div>
            </div>
          ))}
        </div>
      </TouchInteraction>

      {/* Navigation Arrows */}
      {showArrows && itemsCount > visibleItems && (
        <>
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`
              absolute left-2 top-1/2 -translate-y-1/2 z-10
              bg-black/50 hover:bg-black/70 text-white
              rounded-full p-2 transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-label="Previous slide"
          >
            <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2 z-10
              bg-black/50 hover:bg-black/70 text-white
              rounded-full p-2 transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-label="Next slide"
          >
            <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && maxIndex > 0 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                rounded-full transition-all duration-200
                ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}
                ${currentIndex === index 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-400 hover:bg-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
