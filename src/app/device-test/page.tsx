"use client";

import React from 'react';

import Link from 'next/link';

import { DeviceTestingTool } from '@/components/ui/device-testing-tool';
import { ViewportDebugger } from '@/components/ui/viewport-debugger';
import { useDevice } from '@/hooks/use-device';

export default function DeviceTestPage() {
  const { isMobile, isTablet, isDesktop, screenWidth, screenHeight, orientation, devicePixelRatio } = useDevice();
    return (
    <div className="container mx-auto px-4 py-12">
      <DeviceTestingTool />
      <ViewportDebugger />
      
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Device Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Your Device</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Device Type</h3>
              <div className="flex space-x-4">
                <div className={`px-4 py-2 rounded-full ${isMobile ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  Mobile
                </div>
                <div className={`px-4 py-2 rounded-full ${isTablet ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  Tablet
                </div>
                <div className={`px-4 py-2 rounded-full ${isDesktop ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  Desktop
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Screen</h3>
              <p className="text-xl">{screenWidth} × {screenHeight}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pixel Ratio: {devicePixelRatio}x</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Orientation: {orientation}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Browser</h3>
              <p className="text-xl">{typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Optimizations</h2>
          
          <ul className="space-y-3">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Responsive Design
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Device Detection
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Touch Optimizations
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Performance Optimizations
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Accessibility Features
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PWA Features
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Service Worker & Offline Support
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Testing Features</h2>
        
        <p className="mb-6">
          This page allows you to test all the device optimizations implemented in the project.
          The testing tool automatically detects your device capabilities and runs various tests to ensure
          everything is working correctly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold mb-2">Device Detection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tests proper detection of your device type, screen size, and capabilities.</p>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold mb-2">Performance Testing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Evaluates rendering speed, animation performance, and memory usage.</p>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold mb-2">Accessibility Checks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verifies that accessibility features are working correctly for your device.</p>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold mb-2">Touch Interaction</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tests touch gestures, swipe detection, and tap areas on touch devices.</p>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold mb-2">Offline Capabilities</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tests offline mode and service worker functionality for PWA features.</p>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold mb-2">Connection Quality</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Evaluates your current connection speed and tests network optimizations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
