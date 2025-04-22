// src/utils/performanceUtils.ts
export const PROSPERA_PERFORMANCE = {
  marks: {} as Record<string, number>,
  
  // Mark timing point
  mark: function(name: string): number {
    this.marks[name] = performance.now();
    if (window.performance && typeof performance.mark === 'function') {
      performance.mark(name);
    }
    return this.marks[name];
  },
  
  // Measure time between marks
  measure: function(name: string, startMark: string, endMark: string): number | null {
    if (!this.marks[startMark] || !this.marks[endMark]) {
      return null;
    }
    
    const duration = this.marks[endMark] - this.marks[startMark];
    
    if (window.performance && typeof performance.measure === 'function') {
      try {
        performance.measure(name, startMark, endMark);
      } catch (e) {
        // Some browsers might throw if marks don't exist
      }
    }
    
    return duration;
  },
  
  // Check if in development mode
  isDevelopment: function(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' || 
      window.location.search.includes('debug=true')
    );
  },

  // Hide loading overlay with proper cleanup
  hideLoadingOverlay: function(delay = 500): void {
    if (typeof window === 'undefined') return;
    
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        
        // Complete removal after animation
        setTimeout(() => {
          overlay.style.display = 'none';
          document.body.classList.remove('loading');
          this.mark('loadingOverlayRemoved');
          
          // Dispatch event for other scripts to respond to
          window.dispatchEvent(new CustomEvent('prosperaLoaded'));
        }, 500); // Match transition duration
      }
    }, delay);
  }
};
