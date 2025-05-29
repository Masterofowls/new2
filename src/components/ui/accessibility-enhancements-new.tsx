"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface AccessibilityProps {
  children: React.ReactNode;
  enableHighContrast?: boolean;
  enableLargeText?: boolean;
  enableReducedMotion?: boolean;
  enableFocusIndicators?: boolean;
}

export const AccessibilityProvider: React.FC<AccessibilityProps> = ({
  children,
  enableHighContrast = true,
  enableLargeText = true,
  enableReducedMotion = true,
  enableFocusIndicators = true,
}) => {
  const { isMobile, isTouchDevice } = useDevice();

  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersLargeText = window.matchMedia('(prefers-reduced-data: reduce)').matches;
    
    const root = document.documentElement;
    
    // Apply accessibility classes
    if (enableHighContrast && prefersHighContrast) {
      root.classList.add('high-contrast');
    }
    
    if (enableLargeText && prefersLargeText) {
      root.classList.add('large-text');
    }
    
    if (enableReducedMotion && prefersReducedMotion) {
      root.classList.add('reduced-motion');
    }
    
    if (enableFocusIndicators) {
      root.classList.add('focus-indicators');
    }

    // Mobile-specific accessibility
    if (isMobile) {
      root.classList.add('mobile-accessibility');
    }

    if (isTouchDevice) {
      root.classList.add('touch-accessibility');
    }

    return () => {
      root.classList.remove('high-contrast', 'large-text', 'reduced-motion', 'focus-indicators', 'mobile-accessibility', 'touch-accessibility');
    };
  }, [enableHighContrast, enableLargeText, enableReducedMotion, enableFocusIndicators, isMobile, isTouchDevice]);

  return <>{children}</>;
};

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  className = '',
}) => (
  <span className={`sr-only ${className}`}>
    {children}
  </span>
);

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  const { isMobile } = useDevice();
  
  return (
    <a
      href={href}
      className={`
        absolute top-0 left-0 z-50 px-4 py-2 
        bg-blue-600 text-white font-medium
        transform -translate-y-full focus:translate-y-0
        transition-transform duration-200
        ${isMobile ? 'text-base' : 'text-sm'}
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
    >
      {children}
    </a>
  );
};

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions',
  className = '',
}) => (
  <div
    aria-live={politeness}
    aria-atomic={atomic}
    aria-relevant={relevant}
    className={`sr-only ${className}`}
  >
    {children}
  </div>
);

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  restoreFocus?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  restoreFocus = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the previously focused element
    if (restoreFocus) {
      previousFocus.current = document.activeElement as HTMLElement;
    }

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element
    firstElement?.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      
      // Restore focus
      if (restoreFocus && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [isActive, restoreFocus]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (options: {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          options.onArrowRight?.();
          break;
        case 'Enter':
          options.onEnter?.();
          break;
        case 'Escape':
          options.onEscape?.();
          break;
        case 'Home':
          event.preventDefault();
          options.onHome?.();
          break;
        case 'End':
          event.preventDefault();
          options.onEnd?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [options]);
};

// Hook for announcing content to screen readers
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string) => {
    setAnnouncement(message);
    
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return {
    announce,
    AnnouncementRegion: () => (
      <LiveRegion politeness="polite">
        {announcement}
      </LiveRegion>
    ),
  };
};
