"use client";

import React, { useState } from 'react';

/**
 * Component to benchmark and compare performance metrics before and after optimization
 */
export const PerformanceBenchmark = () => {
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const runBenchmark = () => {
    setIsRunning(true);
    
    // Clear any existing performance entries
    if (performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
    
    // Mark the start of the benchmark
    performance.mark('benchmark-start');
    
    // Load a page 5 times and measure the average performance
    const iterations = 5;
    let fcpTotal = 0;
    let lcpTotal = 0;
    let loadTotal = 0;
    let completed = 0;
    
    const measureIteration = (iteration) => {
      // Create an iframe to load the page
      const iframe = document.createElement('iframe');
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      
      // Set a unique URL to prevent caching
      iframe.src = `/?benchmark=${Date.now()}`;
      
      document.body.appendChild(iframe);
      
      // Listen for load event
      iframe.addEventListener('load', () => {
        try {
          // Get performance metrics from the iframe
          const win = iframe.contentWindow;
          const perf = win.performance;
          
          // Get FCP
          const paintEntries = perf.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          const fcp = fcpEntry ? fcpEntry.startTime : 0;
          
          // Get LCP if available
          let lcp = 0;
          if (win.LCPTime) {
            lcp = win.LCPTime;
          }
          
          // Get load time
          const loadTime = perf.timing.loadEventEnd - perf.timing.navigationStart;
          
          // Add to totals
          fcpTotal += fcp;
          lcpTotal += lcp;
          loadTotal += loadTime;
          
          // Remove the iframe
          document.body.removeChild(iframe);
          
          // Increment completed count
          completed++;
          
          // If all iterations are complete, calculate averages
          if (completed === iterations) {
            const avgFCP = fcpTotal / iterations;
            const avgLCP = lcpTotal / iterations;
            const avgLoad = loadTotal / iterations;
            
            // Mark the end of the benchmark
            performance.mark('benchmark-end');
            performance.measure('benchmark-total', 'benchmark-start', 'benchmark-end');
            
            const benchmarkTime = performance.getEntriesByName('benchmark-total')[0].duration;
            
            // Set results
            setResults({
              fcp: avgFCP,
              lcp: avgLCP,
              load: avgLoad,
              benchmarkTime
            });
            
            setIsRunning(false);
          } else {
            // Run next iteration
            setTimeout(() => measureIteration(iteration + 1), 1000);
          }
        } catch (error) {
          console.error('Error in benchmark:', error);
          setIsRunning(false);
        }
      });
    };
    
    // Start first iteration
    measureIteration(1);
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Performance Benchmark</h2>
      
      {isRunning ? (
        <div>
          <p>Running benchmark...</p>
          <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
            <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : results ? (
        <div className="text-sm">
          <p><span className="text-gray-400">Average FCP:</span> {results.fcp.toFixed(1)}ms</p>
          <p><span className="text-gray-400">Average LCP:</span> {results.lcp.toFixed(1)}ms</p>
          <p><span className="text-gray-400">Average Load:</span> {results.load.toFixed(1)}ms</p>
          <p className="mt-2 text-xs text-gray-400">Benchmark ran in {(results.benchmarkTime / 1000).toFixed(1)}s</p>
          <button
            onClick={runBenchmark}
            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Run Again
          </button>
        </div>
      ) : (
        <button
          onClick={runBenchmark}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Run Benchmark
        </button>
      )}
    </div>
  );
};
