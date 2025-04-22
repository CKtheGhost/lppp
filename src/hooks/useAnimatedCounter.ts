// src/hooks/useAnimatedCounter.ts
import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

/**
 * Hook for animated number counting
 */
export function useAnimatedCounter(
  targetValue: number,
  options: AnimatedCounterOptions = {}
): number {
  const { 
    duration = 1500, 
    delay = 0,
    easing = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t 
  } = options;
  
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Reset animation if target value changes
  useEffect(() => {
    // Store the current value as the starting point
    startValue.current = displayValue;
    startTime.current = null;
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    // Add delay if specified
    const timeoutId = setTimeout(() => {
      // Start the animation
      const animate = (timestamp: number) => {
        if (startTime.current === null) {
          startTime.current = timestamp;
        }
        
        const elapsed = timestamp - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        
        // Calculate the current value based on progress
        const newValue = startValue.current + (targetValue - startValue.current) * easedProgress;
        setDisplayValue(Math.round(newValue));
        
        // Continue animation if not complete
        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId.current = requestAnimationFrame(animate);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [targetValue, duration, delay, easing]);
  
  return displayValue;
}
