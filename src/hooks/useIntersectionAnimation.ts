// src/hooks/useIntersectionAnimation.ts
import { useState, useEffect, RefObject } from 'react';

interface IntersectionOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

/**
 * Hook for triggering animations when elements enter the viewport
 */
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection changes
        setIsIntersecting(entry.isIntersecting);
        
        // Unobserve if triggerOnce is true and element is intersecting
        if (entry.isIntersecting && triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold, triggerOnce, rootMargin]);

  return isIntersecting;
}