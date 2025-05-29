"use client";

import React, { useEffect } from 'react';

import Link from 'next/link';

import FeaturesSection from '@/components/features-section';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import OptimizedHeroSection from '@/components/optimized-hero-section';
import TestimonialsSection from '@/components/testimonials-section';
import TradingSection from '@/components/trading-section';
import {
  AssetOptimizer,
  HeroImageOptimizer,
} from '@/components/ui/asset-optimizer';
import { FCPOptimizer } from '@/components/ui/fcp-optimizer';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';

export default function Home() {
  // Mark the time when the component starts rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && performance) {
      // Mark when React starts rendering the page
      performance.mark('react-render-start');
      
      // Measure when everything is loaded
      window.addEventListener('load', () => {
        performance.mark('page-fully-loaded');
        performance.measure('full-page-load', 'react-render-start', 'page-fully-loaded');
        
        const loadMetrics = performance.getEntriesByName('full-page-load')[0];
        console.log(`Full page load time: ${loadMetrics.duration.toFixed(2)}ms`);
      });
    }
  }, []);
  
  return (
    <main className="min-h-screen bg-black">
      {/* Performance optimization components */}
      <FCPOptimizer />
      <AssetOptimizer />
      <HeroImageOptimizer 
        imageUrl="/images/hero-background.jpg" 
        fallbackUrl="/images/hero-background-mobile.jpg" 
      />
      
      <Navigation />
      <OptimizedHeroSection />
      <FeaturesSection />
      <TradingSection />
      <TestimonialsSection />
      <Footer />
      <PerformanceMonitor enableInProduction={true} />
      
      {/* Device Testing Tool Access */}
      <Link
        href="/device-test"
        className="fixed bottom-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
        aria-label="Device Testing Tool"
        title="Open Device Testing Tool"
        style={{
          width: '44px',
          height: '44px',
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
          paddingRight: 'calc(0.75rem + env(safe-area-inset-right, 0px))',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </Link>
    </main>
  );
}
