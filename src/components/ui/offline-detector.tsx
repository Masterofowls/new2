"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

export const OfflineDetector: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const { isMobile } = useDevice();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial value
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 
      bg-red-600 dark:bg-red-800 text-white 
      ${isMobile ? 'px-4 py-3' : 'px-6 py-3'} 
      flex justify-between items-center
      transform transition-transform duration-300
      ${isOffline ? 'translate-y-0' : 'translate-y-full'}
    `} 
    style={{
      paddingBottom: `calc(${isMobile ? '0.75rem' : '0.75rem'} + env(safe-area-inset-bottom, 0px))`,
    }}>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>You're offline. Some features may be unavailable.</span>
      </div>
      <button
        className="ml-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
};
