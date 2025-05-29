"use client";

import React, {
  useEffect,
  useRef,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface TouchInteractionProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  swipeThreshold?: number;
  longPressThreshold?: number;
}

export const TouchInteraction: React.FC<TouchInteractionProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  className = '',
  swipeThreshold = 50,
  longPressThreshold = 500,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isTouchDevice } = useDevice();
  
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTap = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isTouchDevice || !elementRef.current) return;

    const element = elementRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Long press detection
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          onLongPress();
          touchStart.current = null; // Prevent swipe after long press
        }, longPressThreshold);
      }
    };

    const handleTouchMove = () => {
      // Clear long press timer on move
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      // Double tap detection
      if (onDoubleTap) {
        const timeBetweenTaps = Date.now() - lastTap.current;
        if (timeBetweenTaps < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          onDoubleTap();
          lastTap.current = 0; // Reset to prevent triple tap
          touchStart.current = null;
          return;
        }
        lastTap.current = Date.now();
      }

      // Swipe detection
      if (deltaTime < 1000) { // Quick gesture
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
          if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0 && onSwipeRight) {
              onSwipeRight();
            } else if (deltaX < 0 && onSwipeLeft) {
              onSwipeLeft();
            }
          } else {
            // Vertical swipe
            if (deltaY > 0 && onSwipeDown) {
              onSwipeDown();
            } else if (deltaY < 0 && onSwipeUp) {
              onSwipeUp();
            }
          }
        }
      }

      touchStart.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [isTouchDevice, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, onLongPress, swipeThreshold, longPressThreshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// Hook for touch gestures
export const useTouchGestures = () => {
  const { isTouchDevice } = useDevice();
  
  return {
    isTouchDevice,
    createSwipeHandler: (callbacks: {
      onSwipeLeft?: () => void;
      onSwipeRight?: () => void;
      onSwipeUp?: () => void;
      onSwipeDown?: () => void;
    }) => {
      if (!isTouchDevice) return {};
      
      return {
        onTouchStart: (e: React.TouchEvent) => {
          // Store initial touch position
          const touch = e.touches[0];
          (e.currentTarget as any)._touchStart = {
            x: touch.clientX,
            y: touch.clientY,
          };
        },
        onTouchEnd: (e: React.TouchEvent) => {
          const touchStart = (e.currentTarget as any)._touchStart;
          if (!touchStart) return;
          
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - touchStart.x;
          const deltaY = touch.clientY - touchStart.y;
          
          const absDeltaX = Math.abs(deltaX);
          const absDeltaY = Math.abs(deltaY);
          
          if (absDeltaX > 50 || absDeltaY > 50) {
            if (absDeltaX > absDeltaY) {
              if (deltaX > 0 && callbacks.onSwipeRight) {
                callbacks.onSwipeRight();
              } else if (deltaX < 0 && callbacks.onSwipeLeft) {
                callbacks.onSwipeLeft();
              }
            } else {
              if (deltaY > 0 && callbacks.onSwipeDown) {
                callbacks.onSwipeDown();
              } else if (deltaY < 0 && callbacks.onSwipeUp) {
                callbacks.onSwipeUp();
              }
            }
          }
        },
      };
    },
  };
};
