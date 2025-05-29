"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useDevice } from '@/hooks/use-device';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
  connectionType?: string;
}

export const PerformanceMonitor: React.FC<{ enableInProduction?: boolean }> = ({ 
  enableInProduction = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const { isMobile, isTablet, isDesktop, devicePixelRatio, screenWidth } = useDevice();

  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldShow = isDevelopment || enableInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const firstContentfulPaint = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;

      // Get Web Vitals if available
      let largestContentfulPaint = 0;
      let cumulativeLayoutShift = 0;
      let firstInputDelay = 0;

      // LCP
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            largestContentfulPaint = lastEntry.startTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

          // CLS
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            cumulativeLayoutShift = clsValue;
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });

          // FID
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              firstInputDelay = entries[0].processingStart - entries[0].startTime;
            }
          });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (error) {
          console.warn('Performance Observer not fully supported:', error);
        }
      }

      // Memory usage (if available)
      let memoryUsage;
      if ('memory' in performance) {
        memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // MB
      }

      // Connection type (if available)
      let connectionType;
      if ('connection' in navigator) {
        connectionType = (navigator as any).connection.effectiveType;
      }

      setTimeout(() => {
        setMetrics({
          loadTime,
          firstContentfulPaint,
          largestContentfulPaint,
          cumulativeLayoutShift,
          firstInputDelay,
          memoryUsage,
          connectionType,
        });
      }, 2000); // Wait for metrics to stabilize
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, [shouldShow]);

  if (!shouldShow || !metrics) return null;

  const getDeviceInfo = () => {
    const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';
    return `${deviceType} (${screenWidth}px, ${devicePixelRatio}x DPR)`;
  };

  const getPerformanceGrade = (metric: number, thresholds: [number, number]) => {
    if (metric <= thresholds[0]) return { grade: 'Good', color: 'text-green-400' };
    if (metric <= thresholds[1]) return { grade: 'Fair', color: 'text-yellow-400' };
    return { grade: 'Poor', color: 'text-red-400' };
  };

  const formatTime = (time: number) => `${time.toFixed(1)}ms`;
  const formatMemory = (memory: number) => `${memory.toFixed(1)}MB`;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono hover:bg-gray-700 transition-colors"
      >
        📊 Perf
      </button>

      {showMetrics && (
        <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-sm font-mono w-80 max-h-96 overflow-y-auto">
          <div className="mb-3">
            <h3 className="font-bold text-blue-400 mb-1">Performance Metrics</h3>
            <p className="text-gray-400 text-xs">{getDeviceInfo()}</p>
            {metrics.connectionType && (
              <p className="text-gray-400 text-xs">Connection: {metrics.connectionType}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Load Time:</span>{' '}
              <span className={getPerformanceGrade(metrics.loadTime, [1000, 3000]).color}>
                {formatTime(metrics.loadTime)}
              </span>
            </div>

            <div>
              <span className="text-gray-400">FCP:</span>{' '}
              <span className={getPerformanceGrade(metrics.firstContentfulPaint, [1800, 3000]).color}>
                {formatTime(metrics.firstContentfulPaint)}
              </span>
            </div>

            {metrics.largestContentfulPaint > 0 && (
              <div>
                <span className="text-gray-400">LCP:</span>{' '}
                <span className={getPerformanceGrade(metrics.largestContentfulPaint, [2500, 4000]).color}>
                  {formatTime(metrics.largestContentfulPaint)}
                </span>
              </div>
            )}

            {metrics.cumulativeLayoutShift > 0 && (
              <div>
                <span className="text-gray-400">CLS:</span>{' '}
                <span className={getPerformanceGrade(metrics.cumulativeLayoutShift * 1000, [100, 250]).color}>
                  {metrics.cumulativeLayoutShift.toFixed(3)}
                </span>
              </div>
            )}

            {metrics.firstInputDelay > 0 && (
              <div>
                <span className="text-gray-400">FID:</span>{' '}
                <span className={getPerformanceGrade(metrics.firstInputDelay, [100, 300]).color}>
                  {formatTime(metrics.firstInputDelay)}
                </span>
              </div>
            )}

            {metrics.memoryUsage && (
              <div>
                <span className="text-gray-400">Memory:</span>{' '}
                <span className={getPerformanceGrade(metrics.memoryUsage, [50, 100]).color}>
                  {formatMemory(metrics.memoryUsage)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              <div>Good: <span className="text-green-400">●</span> Fair: <span className="text-yellow-400">●</span> Poor: <span className="text-red-400">●</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
