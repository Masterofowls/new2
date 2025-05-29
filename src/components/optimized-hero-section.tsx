"use client";

import React, {
  useEffect,
  useRef,
} from 'react';

import { motion } from 'framer-motion';
import { gsap } from 'gsap';

import { AdvancedImage } from '@/components/ui/advanced-image';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { LazyLoadWrapper } from '@/components/ui/performance-optimizations';
import { SparklesCore } from '@/components/ui/sparkles';
import {
  faArrowRight,
  faChartLine,
  faGlobe,
  faRocket,
  faShieldAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * OptimizedHeroSection with performance improvements:
 * - Uses AdvancedImage for hero background
 * - Prioritizes LCP elements
 * - Reduces initial animation complexity
 * - Optimized for Core Web Vitals
 */
const OptimizedHeroSection = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Mark the start of hero section rendering for performance measurement
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark('hero-render-start');
    }
    
    const ctx = gsap.context(() => {
      // Simplified initial animations to improve FCP/LCP
      gsap.from(".hero-title", {
        duration: 0.8, // Reduced from 1.2
        y: 50, // Reduced from 100
        opacity: 0,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        duration: 0.7, // Reduced from 1.0
        y: 30, // Reduced from 50
        opacity: 0,
        ease: "power3.out",
        delay: 0.2, // Reduced from 0.3
      });

      gsap.from(".hero-cta", {
        duration: 0.6, // Reduced from 0.8
        y: 20, // Reduced from 30
        opacity: 0,
        ease: "power3.out",
        delay: 0.4, // Reduced from 0.6
        stagger: 0.1, // Reduced from 0.2
      });

      // Deferred animations - only run these after LCP is complete
      setTimeout(() => {
        // Stats animation
        gsap.from(".stat-item", {
          duration: 0.7,
          y: 20,
          opacity: 0,
          ease: "power3.out",
          stagger: 0.1,
        });

        // Floating animation for stats - lighter animation
        gsap.to(".stat-item", {
          duration: 3,
          y: -8, // Reduced movement
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.4,
        });
        
        // Mark when hero animations are complete
        if (typeof window !== 'undefined' && window.performance) {
          window.performance.mark('hero-animations-complete');
          window.performance.measure('hero-animation-time', 'hero-render-start', 'hero-animations-complete');
        }
      }, 1000); // Delay heavy animations
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Active Users", value: "2.5M+", icon: faGlobe },
    { label: "Assets Under Management", value: "$50B+", icon: faChartLine },
    { label: "Security Rating", value: "AAA+", icon: faShieldAlt },
    { label: "Customer Satisfaction", value: "4.9★", icon: faStar },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero Background - Optimized for LCP */}
      <div className="absolute inset-0 z-0">
        <AdvancedImage
          src="/images/hero-background.jpg"
          alt="Financial Technology Background"
          fill
          priority
          quality={85}
          isLCP={true}
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAIAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9rdB8T/8ACJ/DPTryR7dtQitkDCNgVXA6ZHT8KKKKALf/AAkH/Tx/47/9aj/hIP8Ap4/8d/8ArUUUAf/Z"
        />
      </div>
      
      {/* Background Effects - Load these with lower priority */}
      <div className="absolute inset-0 z-[1]">
        <BackgroundBeams />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/40 z-[2]" />
      
      {/* Sparkles Effect - Defer this animation */}
      <LazyLoadWrapper className="absolute inset-0 z-[3]">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={100}
          particleColor="#FFFFFF"
        />
      </LazyLoadWrapper>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="max-w-4xl mx-auto pt-8 sm:pt-12 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium">
              <FontAwesomeIcon icon={faRocket} className="mr-1.5 sm:mr-2 text-xs sm:text-sm" />
              <span className="hidden xs:inline">The Future of Finance is Here</span>
              <span className="xs:hidden">Future of Finance</span>
            </span>
          </motion.div>

          <h1 className="hero-title font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Revolutionary
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Financial Platform
            </span>
          </h1>

          <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Experience next-generation banking, trading, and wealth management 
            with cutting-edge technology, unparalleled security, and seamless user experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hero-cta w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 min-w-[200px] min-h-[48px] touch:min-h-[52px]"
            >
              <span>Start Trading</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-sm sm:text-base" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hero-cta w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-all duration-200 min-w-[200px] min-h-[48px] touch:min-h-[52px]"
            >
              Watch Demo
            </motion.button>
          </div>
        </div>

        {/* Stats Section - Deferred for better FCP/LCP */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 tablet:grid-cols-2 max-w-5xl mx-auto px-4 py-6"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-2xl px-3 py-4 sm:px-5 sm:py-6 border border-blue-500/20 shadow-lg flex flex-col items-center justify-center"
            >
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
                <FontAwesomeIcon
                  icon={stat.icon}
                  className="text-white text-xs sm:text-sm"
                />
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OptimizedHeroSection;
