"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface OrientationHandlerProps {
  landscapeContent?: React.ReactNode;
  portraitContent?: React.ReactNode;
  showWarning?: boolean;
  preferredOrientation?: 'portrait' | 'landscape';
  children?: React.ReactNode;
}

export const OrientationHandler: React.FC<OrientationHandlerProps> = ({
  landscapeContent,
  portraitContent,
  showWarning = true,
  preferredOrientation,
  children,
}) => {
  const { orientation, isMobile, isTablet } = useDevice();
  const [showOrientationWarning, setShowOrientationWarning] = useState(false);
  
  // Only show orientation warning for mobile and tablet devices
  const shouldHandleOrientation = (isMobile || isTablet) && preferredOrientation && orientation !== preferredOrientation;
  
  useEffect(() => {
    // Set warning visibility
    if (shouldHandleOrientation && showWarning) {
      setShowOrientationWarning(true);
      
      // Hide warning after 5 seconds
      const timer = setTimeout(() => {
        setShowOrientationWarning(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setShowOrientationWarning(false);
    }
  }, [orientation, shouldHandleOrientation, showWarning]);
  
  // Render orientation-specific content if provided
  if (orientation === 'landscape' && landscapeContent) {
    return <>{landscapeContent}</>;
  }
  
  if (orientation === 'portrait' && portraitContent) {
    return <>{portraitContent}</>;
  }
  
  return (
    <>
      {/* Orientation warning */}
      {showOrientationWarning && (
        <div className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          bg-yellow-600 text-white px-4 py-3 rounded-lg shadow-lg
          max-w-xs text-center
          animate-fade-in
        `}>
          <div className="flex items-center justify-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Orientation Notice</span>
          </div>
          <p className="text-sm">
            {preferredOrientation === 'landscape' 
              ? 'This content is best viewed in landscape mode. Please rotate your device.' 
              : 'This content is best viewed in portrait mode. Please rotate your device.'}
          </p>
        </div>
      )}
      
      {children}
    </>
  );
};

// Hook for handling orientation changes
export const useOrientation = () => {
  const { orientation } = useDevice();
  const [previousOrientation, setPreviousOrientation] = useState<'portrait' | 'landscape'>(orientation);
  const [orientationChanged, setOrientationChanged] = useState(false);
  
  useEffect(() => {
    if (orientation !== previousOrientation) {
      setPreviousOrientation(orientation);
      setOrientationChanged(true);
      
      // Reset the orientation changed flag after a short delay
      const timer = setTimeout(() => {
        setOrientationChanged(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [orientation, previousOrientation]);
  
  return {
    orientation,
    previousOrientation,
    orientationChanged,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  };
};
