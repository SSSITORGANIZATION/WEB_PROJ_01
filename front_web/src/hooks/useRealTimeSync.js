import { useEffect, useRef } from 'react';

/**
 * Hook for real-time data synchronization
 * Automatically refreshes data at specified intervals
 * and when page becomes visible again
 */
export const useRealTimeSync = (fetchFunction, interval = 30000) => {
  const intervalRef = useRef(null);
  const lastFetchRef = useRef(Date.now());

  useEffect(() => {
    // Initial fetch
    fetchFunction();

    // Set up interval for periodic updates
    intervalRef.current = setInterval(() => {
      fetchFunction();
      lastFetchRef.current = Date.now();
    }, interval);

    // Set up visibility change listener to refresh when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden && Date.now() - lastFetchRef.current > 5000) {
        fetchFunction();
        lastFetchRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchFunction, interval]);

  // Manual refresh function
  const manualRefresh = () => {
    fetchFunction();
    lastFetchRef.current = Date.now();
  };

  return { manualRefresh };
};

/**
 * Hook for real-time data synchronization with multiple data sources
 */
export const useMultiRealTimeSync = (fetchFunctions, interval = 30000) => {
  const intervalRef = useRef(null);
  const lastFetchRef = useRef(Date.now());

  useEffect(() => {
    // Initial fetch for all functions
    fetchFunctions.forEach(fn => fn());

    // Set up interval for periodic updates
    intervalRef.current = setInterval(() => {
      fetchFunctions.forEach(fn => fn());
      lastFetchRef.current = Date.now();
    }, interval);

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      if (!document.hidden && Date.now() - lastFetchRef.current > 5000) {
        fetchFunctions.forEach(fn => fn());
        lastFetchRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchFunctions, interval]);

  // Manual refresh function
  const manualRefresh = () => {
    fetchFunctions.forEach(fn => fn());
    lastFetchRef.current = Date.now();
  };

  return { manualRefresh };
};
