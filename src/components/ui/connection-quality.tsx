"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface ConnectionInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface ConnectionQualityProps {
  showIndicator?: boolean;
  onQualityChange?: (quality: 'slow' | 'medium' | 'fast', info: ConnectionInfo) => void;
  children?: React.ReactNode;
}

export const ConnectionQuality: React.FC<ConnectionQualityProps> = ({
  showIndicator = true,
  onQualityChange,
  children,
}) => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [quality, setQuality] = useState<'slow' | 'medium' | 'fast'>('medium');
  const { isMobile } = useDevice();

  useEffect(() => {
    // Check if navigator.connection is available (Chrome, Edge, Opera)
    const connection = (navigator as any).connection;
    
    if (!connection) {
      return;
    }
    
    const updateConnectionInfo = () => {
      const info = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
      
      setConnectionInfo(info);
      
      // Determine connection quality
      let newQuality: 'slow' | 'medium' | 'fast' = 'medium';
      
      if (info.effectiveType === '4g' && info.downlink > 5) {
        newQuality = 'fast';
      } else if (info.effectiveType === '2g' || info.effectiveType === 'slow-2g' || info.downlink < 1) {
        newQuality = 'slow';
      }
      
      // Save Data mode overrides to slow
      if (info.saveData) {
        newQuality = 'slow';
      }
      
      setQuality(newQuality);
      
      if (onQualityChange) {
        onQualityChange(newQuality, info);
      }
    };
    
    // Initial check
    updateConnectionInfo();
    
    // Listen for changes
    connection.addEventListener('change', updateConnectionInfo);
    
    return () => {
      connection.removeEventListener('change', updateConnectionInfo);
    };
  }, [onQualityChange]);

  // Calculate RTT in human-readable format
  const formatRTT = (rtt: number) => {
    if (rtt < 100) {
      return 'Low Latency';
    } else if (rtt < 500) {
      return 'Medium Latency';
    } else {
      return 'High Latency';
    }
  };

  // Calculate speed in human-readable format
  const formatSpeed = (mbps: number) => {
    if (mbps < 1) {
      return `${(mbps * 1000).toFixed(0)} Kbps`;
    } else {
      return `${mbps.toFixed(1)} Mbps`;
    }
  };

  if (!connectionInfo || !showIndicator) {
    return <>{children}</>;
  }

  return (
    <>
      {showIndicator && (
        <div className={`
          fixed top-2 right-2 z-50 
          p-2 rounded-full
          ${quality === 'fast' ? 'bg-green-500' : 
            quality === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}
          shadow-md
          hover:scale-110 transition-transform
          cursor-pointer
        `}
        title={`Connection: ${connectionInfo.effectiveType} | Speed: ${formatSpeed(connectionInfo.downlink)} | ${formatRTT(connectionInfo.rtt)}${connectionInfo.saveData ? ' | Data Saver Mode' : ''}`}
        onClick={() => {
          alert(
            `Connection Quality: ${quality}\n` +
            `Network Type: ${connectionInfo.effectiveType}\n` +
            `Speed: ${formatSpeed(connectionInfo.downlink)}\n` +
            `Latency: ${formatRTT(connectionInfo.rtt)} (${connectionInfo.rtt}ms)\n` +
            `Data Saver: ${connectionInfo.saveData ? 'On' : 'Off'}`
          );
        }}
        >
          <div className="relative h-3 w-3">
            <div className={`
              ${quality === 'slow' ? 'animate-ping-slow' : 
                quality === 'medium' ? 'animate-ping-medium' : 'animate-ping'}
              absolute inline-flex h-full w-full rounded-full opacity-75
              ${quality === 'fast' ? 'bg-green-400' : 
                quality === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}
            `}></div>
            <div className={`
              relative inline-flex rounded-full h-3 w-3 
              ${quality === 'fast' ? 'bg-green-600' : 
                quality === 'medium' ? 'bg-yellow-600' : 'bg-red-600'}
            `}></div>
          </div>
        </div>
      )}
      
      {children}
    </>
  );
};

// Hook for using connection quality in other components
export const useConnectionQuality = () => {
  const [quality, setQuality] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [info, setInfo] = useState<ConnectionInfo | null>(null);
  
  const handleQualityChange = (newQuality: 'slow' | 'medium' | 'fast', newInfo: ConnectionInfo) => {
    setQuality(newQuality);
    setInfo(newInfo);
  };
  
  return {
    quality,
    info,
    ConnectionQualityProvider: ({ children }: { children: React.ReactNode }) => (
      <ConnectionQuality 
        showIndicator={false} 
        onQualityChange={handleQualityChange}
      >
        {children}
      </ConnectionQuality>
    )
  };
};
