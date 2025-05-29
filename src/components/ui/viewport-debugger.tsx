"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface ViewportDebuggerProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showBreakpoints?: boolean;
  showDimensions?: boolean;
  showPixelRatio?: boolean;
}

export const ViewportDebugger: React.FC<ViewportDebuggerProps> = ({
  enabled = true,
  position = 'bottom-right',
  showBreakpoints = true,
  showDimensions = true,
  showPixelRatio = true,
}) => {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    screenWidth, 
    screenHeight, 
    orientation, 
    devicePixelRatio, 
    isTouchDevice,
    isRetina 
  } = useDevice();
  
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    const updateDimensions = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    
    // Initial update
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [enabled]);

  if (!enabled) return null;

  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  // Get current breakpoint name
  const getBreakpointName = () => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isDesktop) {
      if (viewportWidth >= 1536) return 'desktop-2xl';
      if (viewportWidth >= 1280) return 'desktop-xl';
      return 'desktop-lg';
    }
    return 'unknown';
  };

  return (
    <div 
      className={`
        fixed ${positionClasses[position]} z-50
        bg-black bg-opacity-80 text-white
        rounded-lg shadow-lg
        text-xs font-mono
        transition-all duration-200
        ${isExpanded ? 'p-3' : 'p-2'}
      `}
      style={{
        maxWidth: isExpanded ? '300px' : '150px',
      }}
    >
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className={`
            w-2 h-2 rounded-full mr-1
            ${isMobile ? 'bg-blue-500' : 
              isTablet ? 'bg-green-500' : 
              'bg-purple-500'}
          `}></div>
          <span>{getBreakpointName()}</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {showDimensions && (
            <div>
              <div className="text-gray-400 mb-1">Viewport</div>
              <div>{viewportWidth} × {viewportHeight}</div>
              <div className="text-gray-400">{orientation}</div>
            </div>
          )}
          
          {showBreakpoints && (
            <div>
              <div className="text-gray-400 mb-1">Breakpoints</div>
              <div className="grid grid-cols-3 gap-1">
                <div className={`px-1 py-0.5 rounded ${isMobile ? 'bg-blue-900 text-blue-100' : 'bg-gray-800'}`}>Mobile</div>
                <div className={`px-1 py-0.5 rounded ${isTablet ? 'bg-green-900 text-green-100' : 'bg-gray-800'}`}>Tablet</div>
                <div className={`px-1 py-0.5 rounded ${isDesktop ? 'bg-purple-900 text-purple-100' : 'bg-gray-800'}`}>Desktop</div>
              </div>
            </div>
          )}
          
          {showPixelRatio && (
            <div>
              <div className="text-gray-400 mb-1">Device</div>
              <div>Pixel Ratio: {devicePixelRatio}x</div>
              <div>Touch: {isTouchDevice ? 'Yes' : 'No'}</div>
              <div>Retina: {isRetina ? 'Yes' : 'No'}</div>
            </div>
          )}
          
          <div className="text-gray-400 text-[10px] pt-1 border-t border-gray-700">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};
