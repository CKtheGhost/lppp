// src/hooks/useAnimationFrame.ts
import { useRef, useEffect, useCallback } from 'react';

export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const isRunningRef = useRef<boolean>(true);
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Cap deltaTime to prevent large jumps when tab becomes active
      const cappedDeltaTime = Math.min(deltaTime, 32); // ~30fps minimum
      
      if (isRunningRef.current) {
        callback(cappedDeltaTime / 1000); // Convert to seconds
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    const handleVisibilityChange = () => {
      isRunningRef.current = !document.hidden;
      
      if (isRunningRef.current) {
        // Reset time when becoming visible to prevent large delta
        previousTimeRef.current = undefined;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [animate]);
  
  return {
    pause: () => { isRunningRef.current = false; },
    resume: () => { isRunningRef.current = true; },
    isRunning: () => isRunningRef.current
  };
};