"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface DeviceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isRetina: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  devicePixelRatio: number;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouchDevice: false,
  isRetina: false,
  screenWidth: 1024,
  screenHeight: 768,
  orientation: 'landscape',
  devicePixelRatio: 1,
});

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

interface DeviceProviderProps {
  children: React.ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceContextType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isRetina: false,
    screenWidth: 1024,
    screenHeight: 768,
    orientation: 'landscape',
    devicePixelRatio: 1,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isRetina = ratio > 1;
      const orientation = height > width ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        isRetina,
        screenWidth: width,
        screenHeight: height,
        orientation,
        devicePixelRatio: ratio,
      });
    };

    // Initial call
    updateDeviceInfo();

    // Add event listeners
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

// Hook for responsive values based on device
export const useResponsiveValue = <T,>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  const { isMobile, isTablet, isDesktop } = useDevice();
  
  if (isMobile && values.mobile !== undefined) return values.mobile;
  if (isTablet && values.tablet !== undefined) return values.tablet;
  if (isDesktop && values.desktop !== undefined) return values.desktop;
  
  return values.default;
};

// Hook for conditional rendering based on device
export const useDeviceRender = () => {
  const device = useDevice();
  
  return {
    showOnMobile: (component: React.ReactNode) => device.isMobile ? component : null,
    showOnTablet: (component: React.ReactNode) => device.isTablet ? component : null,
    showOnDesktop: (component: React.ReactNode) => device.isDesktop ? component : null,
    showOnTouch: (component: React.ReactNode) => device.isTouchDevice ? component : null,
    hideOnMobile: (component: React.ReactNode) => !device.isMobile ? component : null,
    hideOnTablet: (component: React.ReactNode) => !device.isTablet ? component : null,
    hideOnDesktop: (component: React.ReactNode) => !device.isDesktop ? component : null,
  };
};
