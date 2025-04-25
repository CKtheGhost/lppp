// src/utils/performanceUtils.ts
export const PROSPERA_PERFORMANCE = {
  marks: {} as Record<string, number>,
  measures: {} as Record<string, number>,
  
  mark: function(name: string): number {
    const timestamp = performance.now();
    this.marks[name] = timestamp;
    
    if (window.performance && typeof performance.mark === 'function') {
      try {
        performance.mark(name);
      } catch (e) {
        console.warn(`Failed to mark performance: ${name}`, e);
      }
    }
    
    return timestamp;
  },
  
  measure: function(name: string, startMark: string, endMark: string): number | null {
    if (!this.marks[startMark] || !this.marks[endMark]) {
      return null;
    }
    
    const duration = this.marks[endMark] - this.marks[startMark];
    this.measures[name] = duration;
    
    if (window.performance && typeof performance.measure === 'function') {
      try {
        performance.measure(name, startMark, endMark);
      } catch (e) {
        console.warn(`Failed to measure performance: ${name}`, e);
      }
    }
    
    return duration;
  },
  
  isDevelopment: function(): boolean {
    return process.env.NODE_ENV === 'development';
  },
  
  hideLoadingOverlay: function(delay = 500): void {
    if (typeof window === 'undefined') return;
    
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        
        setTimeout(() => {
          overlay.style.display = 'none';
          document.body.classList.remove('loading');
          this.mark('loadingOverlayRemoved');
          
          window.dispatchEvent(new CustomEvent('prosperaLoaded'));
        }, 500);
      }
    }, delay);
  },
  
  // Performance monitoring wrapper
  withPerformanceTracking: function<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          this.trackMetric(name, duration);
        });
      }
      
      const duration = performance.now() - start;
      this.trackMetric(name, duration);
      return result;
    }) as T;
  },
  
  trackMetric: function(name: string, value: number): void {
    if (this.isDevelopment()) {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).PROSPERA_ANALYTICS) {
      (window as any).PROSPERA_ANALYTICS.trackMetric(name, value);
    }
  }
};

// Utility functions
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastRan), 0));
    }
  };
};