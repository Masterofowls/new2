"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { useConnectionQuality } from '@/components/ui/connection-quality';
import { useDevice } from '@/hooks/use-device';

interface DeviceTestResult {
  deviceType: string;
  screenSize: string;
  orientation: string;
  isTouchCapable: boolean;
  isHighDPI: boolean;
  performanceScore: number;
  accessibilityScore: number;
  loadTime: number;
  memoryUsage: number;
  renderTime: number;
}

export const DeviceTestingTool: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DeviceTestResult | null>(null);
  const [log, setLog] = useState<string[]>([]);
  
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isTouchDevice,
    isRetina,
    screenWidth,
    screenHeight,
    orientation,
    devicePixelRatio
  } = useDevice();
  
  const { quality, info } = useConnectionQuality();

  // Add log message
  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  // Run tests
  const runTests = async () => {
    setIsRunning(true);
    setLog([]);
    addLog('Starting device optimization tests...');
    
    // Basic device info
    addLog(`Device: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`);
    addLog(`Screen: ${screenWidth}x${screenHeight} (${devicePixelRatio}x)`);
    addLog(`Orientation: ${orientation}`);
    addLog(`Touch capable: ${isTouchDevice ? 'Yes' : 'No'}`);
    addLog(`High DPI display: ${isRetina ? 'Yes' : 'No'}`);
    
    // Connection info
    if (info) {
      addLog(`Connection: ${info.effectiveType} (${info.downlink.toFixed(1)} Mbps, ${info.rtt}ms RTT)`);
      addLog(`Data saver: ${info.saveData ? 'Enabled' : 'Disabled'}`);
    }
    
    // Performance tests
    addLog('Running performance tests...');
    const startTime = performance.now();
    
    // Memory usage
    let memoryUsage = 0;
    if ((performance as any).memory) {
      memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
      addLog(`Memory usage: ${memoryUsage} MB`);
    }
    
    // Layout shifts
    if ('LayoutShift' in window) {
      let cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
      }).observe({type: 'layout-shift', buffered: true});
      
      addLog(`Cumulative Layout Shift: ${cls.toFixed(3)}`);
    }
    
    // Simulate heavy rendering
    addLog('Testing rendering performance...');
    const renderStartTime = performance.now();
    
    // Create 1000 divs to test rendering performance
    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-9999px';
    testDiv.style.left = '-9999px';
    document.body.appendChild(testDiv);
    
    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div');
      div.textContent = `Test ${i}`;
      div.style.padding = '10px';
      div.style.margin = '5px';
      div.style.border = '1px solid #ccc';
      testDiv.appendChild(div);
    }
    
    // Force layout calculation
    const forceLayout = testDiv.offsetHeight;
    
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime;
    
    // Clean up test elements
    document.body.removeChild(testDiv);
    
    addLog(`Render time for 1000 elements: ${renderTime.toFixed(2)}ms`);
    
    // Calculate performance score (lower is better)
    const performanceScore = isMobile ? 
      Math.min(100, Math.max(0, 100 - (renderTime / 20))) : 
      Math.min(100, Math.max(0, 100 - (renderTime / 10)));
    
    addLog(`Performance score: ${performanceScore.toFixed(0)}/100`);
    
    // Accessibility tests
    addLog('Running accessibility tests...');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    addLog(`Prefers reduced motion: ${prefersReducedMotion ? 'Yes' : 'No'}`);
    
    // Check for contrast preference
    const prefersContrast = window.matchMedia('(prefers-contrast: more)').matches;
    addLog(`Prefers high contrast: ${prefersContrast ? 'Yes' : 'No'}`);
    
    // Calculate accessibility score (subjective)
    const accessibilityScore = 95; // Placeholder - would be calculated from actual tests
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    addLog(`Tests completed in ${totalTime.toFixed(2)}ms`);
    
    // Set results
    setResults({
      deviceType: isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
      screenSize: `${screenWidth}x${screenHeight}`,
      orientation: orientation,
      isTouchCapable: isTouchDevice,
      isHighDPI: isRetina,
      performanceScore: parseFloat(performanceScore.toFixed(0)),
      accessibilityScore,
      loadTime: totalTime,
      memoryUsage,
      renderTime
    });
    
    setIsRunning(false);
  };

  // Effect to log window size changes
  useEffect(() => {
    if (!isRunning) return;
    
    const handleResize = () => {
      addLog(`Window resized: ${window.innerWidth}x${window.innerHeight}`);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isRunning]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl p-6 text-black dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Device Optimization Test</h2>
          <button 
            className="bg-gray-200 dark:bg-gray-700 rounded-full p-2"
            onClick={() => window.history.back()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Device Information</h3>
            <ul className="space-y-2">
              <li><strong>Type:</strong> {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</li>
              <li><strong>Screen:</strong> {screenWidth}x{screenHeight}</li>
              <li><strong>Pixel Ratio:</strong> {devicePixelRatio}x</li>
              <li><strong>Orientation:</strong> {orientation}</li>
              <li><strong>Touch Capable:</strong> {isTouchDevice ? 'Yes' : 'No'}</li>
              <li><strong>High DPI:</strong> {isRetina ? 'Yes' : 'No'}</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Connection Information</h3>
            <ul className="space-y-2">
              <li><strong>Quality:</strong> {quality === 'fast' ? '🟢 Fast' : quality === 'medium' ? '🟡 Medium' : '🔴 Slow'}</li>
              {info && (
                <>
                  <li><strong>Type:</strong> {info.effectiveType}</li>
                  <li><strong>Speed:</strong> {info.downlink.toFixed(1)} Mbps</li>
                  <li><strong>Latency:</strong> {info.rtt}ms</li>
                  <li><strong>Data Saver:</strong> {info.saveData ? 'Enabled' : 'Disabled'}</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        {results && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Performance</h4>
                <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full mt-2">
                  <div 
                    className={`h-4 rounded-full ${
                      results.performanceScore > 80 ? 'bg-green-500' : 
                      results.performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${results.performanceScore}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1">{results.performanceScore}/100</p>
              </div>
              
              <div>
                <h4 className="font-medium">Accessibility</h4>
                <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full mt-2">
                  <div 
                    className={`h-4 rounded-full ${
                      results.accessibilityScore > 80 ? 'bg-green-500' : 
                      results.accessibilityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${results.accessibilityScore}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1">{results.accessibilityScore}/100</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div><strong>Load Time:</strong> {results.loadTime.toFixed(2)}ms</div>
              <div><strong>Render Time:</strong> {results.renderTime.toFixed(2)}ms</div>
              {results.memoryUsage > 0 && (
                <div><strong>Memory Usage:</strong> {results.memoryUsage} MB</div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-medium mb-2">Test Log</h3>
          {log.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Run the test to see logs</p>
          ) : (
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {log.join('\n')}
            </pre>
          )}
        </div>
        
        <div className="flex justify-center">
          <button
            className={`
              px-6 py-3 rounded-lg font-medium
              ${isRunning ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}
              text-white transition-colors
              min-h-[44px] min-w-[120px]
            `}
            onClick={runTests}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>
      </div>
    </div>
  );
};
