// src/hooks/useParallaxEffect.ts
import { useState, useEffect, RefObject } from 'react';

interface ParallaxOptions {
  factor?: number;
  reverse?: boolean;
}

/**
 * Hook for creating parallax scrolling effects
 */
export function useParallaxEffect(
  ref: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
): { offset: number } {
  const { factor = 0.2, reverse = false } = options;
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const distanceFromCenter = elementCenter - windowCenter;
      
      // Calculate parallax offset based on distance from center of viewport
      const parallaxOffset = distanceFromCenter * factor;
      setOffset(reverse ? -parallaxOffset : parallaxOffset);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, factor, reverse]);
  
  return { offset };
}