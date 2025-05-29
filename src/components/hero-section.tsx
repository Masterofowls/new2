"use client";

import React, {
  useEffect,
  useRef,
} from 'react';

import { motion } from 'framer-motion';
import { gsap } from 'gsap';

import { BackgroundBeams } from '@/components/ui/background-beams';
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

const HeroSection = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation with device optimization
      gsap.from(".hero-title", {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: "power3.out",
      });

      // Hero subtitle animation
      gsap.from(".hero-subtitle", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3,
      });

      // CTA buttons animation
      gsap.from(".hero-cta", {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.6,
        stagger: 0.2,
      });

      // Stats animation
      gsap.from(".stat-item", {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.8,
        stagger: 0.15,
      });

      // Floating animation for stats
      gsap.to(".stat-item", {
        duration: 3,
        y: -10,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });
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
      {/* Background Effects */}
      <BackgroundBeams />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/40" />
        {/* Sparkles Effect */}
      <SparklesCore
        id="hero-sparkles"
        background="transparent"
        minSize={0.4}
        maxSize={1.4}
        particleDensity={100}
        className="absolute inset-0"
        particleColor="#FFFFFF"
      />      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        </div>        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto px-4"
        >          {stats.map((statistic) => (
            <motion.div
              key={statistic.label}
              whileHover={{ scale: 1.05 }}
              className="stat-item glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center min-h-[120px] sm:min-h-[140px] flex flex-col justify-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FontAwesomeIcon icon={statistic.icon} className="text-white text-lg sm:text-xl" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 font-display">
                {statistic.value}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm font-medium">
                {statistic.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile for cleaner look */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
