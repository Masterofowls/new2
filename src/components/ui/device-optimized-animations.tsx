"use client";

import React, { useEffect, useRef } from 'react';

import { useDevice } from '@/hooks/use-device';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation types for device optimization
export type AnimationType = 
  | 'fadeIn' 
  | 'fadeInUp' 
  | 'fadeInDown' 
  | 'slideInLeft' 
  | 'slideInRight' 
  | 'scaleIn'
  | 'staggered';

// Trigger positions
export type TriggerPosition = 
  | 'top' 
  | 'center' 
  | 'bottom' 
  | 'top-=100' 
  | 'center-=100' 
  | 'bottom-=100'
  | 'top+=100' 
  | 'center+=100' 
  | 'bottom+=100';

// Configuration for animations with device-specific optimizations
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  distance?: number; // For slide animations
  scale?: number; // For scale animations
  stagger?: number; // For staggered animations
  mobile?: {
    duration?: number;
    distance?: number;
    scale?: number;
    ease?: string;
  };
  tablet?: {
    duration?: number;
    distance?: number;
    scale?: number;
    ease?: string;
  };
}

// Props for scroll animation component
export interface ScrollAnimationProps {
  children: React.ReactNode;
  animation: AnimationType;
  config?: AnimationConfig;
  trigger?: TriggerPosition;
  once?: boolean;
  className?: string;
}

// Device-optimized animations component
export const DeviceOptimizedAnimations: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, isTablet } = useDevice();

  useEffect(() => {
    // Optimize ScrollTrigger for mobile devices
    if (isMobile) {
      ScrollTrigger.config({
        limitCallbacks: true, // Limit the number of callbacks for better performance
        ignoreMobileResize: true, // Improve performance by ignoring certain mobile resize events
      });
    }
    
    return () => {
      // Clean up all ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearMatchMedia();
    };
  }, [isMobile]);

  return <>{children}</>;
};

// Component for scroll-triggered animations
export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation,
  config = {},
  trigger = 'bottom',
  once = false,
  className,
}) => {
  const { isMobile, isTablet } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  
  // Helper to get device-specific config
  const getOptimizedConfig = () => {
    if (isMobile && config.mobile) {
      return { ...config, ...config.mobile };
    } else if (isTablet && config.tablet) {
      return { ...config, ...config.tablet };
    }
    return config;
  };
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const optimizedConfig = getOptimizedConfig();
    
    // Map of animations
    const fadeInUp = () => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          y: optimizedConfig.distance || 40 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: optimizedConfig.duration || 0.6,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const fadeInDown = () => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          y: -(optimizedConfig.distance || 40) 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: optimizedConfig.duration || 0.6,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const fadeIn = () => {
      gsap.fromTo(
        element,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: optimizedConfig.duration || 0.6,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const slideInLeft = () => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          x: -(optimizedConfig.distance || 100) 
        },
        { 
          opacity: 1, 
          x: 0, 
          duration: optimizedConfig.duration || 0.6,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const slideInRight = () => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          x: optimizedConfig.distance || 100 
        },
        { 
          opacity: 1, 
          x: 0, 
          duration: optimizedConfig.duration || 0.6,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const scaleIn = () => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          scale: optimizedConfig.scale || 0.8 
        },
        { 
          opacity: 1, 
          scale: 1, 
          duration: optimizedConfig.duration || 0.6,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const staggered = () => {
      if (!element.children || element.children.length === 0) {
        fadeIn();
        return;
      }
      
      gsap.fromTo(
        element.children,
        { 
          opacity: 0, 
          y: optimizedConfig.distance || 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: optimizedConfig.duration || 0.4,
          stagger: optimizedConfig.stagger || 0.1,
          delay: optimizedConfig.delay || 0,
          ease: optimizedConfig.ease || 'power2.out',
        }
      );
    };
    
    const animationMap = {
      fadeIn,
      fadeInUp,
      fadeInDown,
      slideInLeft,
      slideInRight,
      scaleIn,
      staggered
    };
    
    const triggerMap = {
      'top': 'top bottom',
      'center': 'center bottom',
      'bottom': 'bottom bottom',
      'top-=100': 'top-=100 bottom',
      'center-=100': 'center-=100 bottom',
      'bottom-=100': 'bottom-=100 bottom',
      'top+=100': 'top+=100 bottom',
      'center+=100': 'center+=100 bottom',
      'bottom+=100': 'bottom+=100 bottom',
    };
    
    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: triggerMap[trigger],
      once: once,
      onEnter: () => animationMap[animation](),
      onLeave: isMobile ? undefined : () => {
        if (!once) {
          const duration = (typeof optimizedConfig.duration === 'number') 
            ? optimizedConfig.duration / 2 
            : 0.3;
          gsap.to(element, { opacity: 0, duration });
        }
      },
      onEnterBack: isMobile ? undefined : () => {
        if (!once) {
          animationMap[animation]();
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, config, trigger, once, isMobile, isTablet]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Optimized version of the popular Reveal animation component
export const OptimizedReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noMobile?: boolean;
}> = ({ children, className, delay = 0, noMobile = false }) => {
  const { isMobile } = useDevice();
  
  // Skip animation on mobile if noMobile is true
  if (isMobile && noMobile) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <ScrollAnimation 
      animation="fadeInUp" 
      config={{ 
        delay,
        duration: 0.5,
        distance: 30,
        mobile: {
          duration: 0.4,
          distance: 15
        }
      }}
      once={true}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
};

// Wrapper for device-specific animations
export const DeviceAnimation: React.FC<{
  children: React.ReactNode;
  mobile?: AnimationType;
  tablet?: AnimationType;
  desktop?: AnimationType;
  config?: AnimationConfig;
  className?: string;
}> = ({ 
  children, 
  mobile = 'fadeIn', 
  tablet = 'fadeIn', 
  desktop = 'fadeIn',
  config = {},
  className
}) => {
  const { isMobile, isTablet, isDesktop } = useDevice();
  
  let animation: AnimationType = 'fadeIn';
  
  if (isMobile) animation = mobile;
  else if (isTablet) animation = tablet;
  else animation = desktop;
  
  return (
    <ScrollAnimation
      animation={animation}
      config={config}
      once={true}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
};
