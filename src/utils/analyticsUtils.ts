// src/utils/analyticsUtils.ts

// Track an event
export function trackEvent(eventName: string, eventData: Record<string, any>) {
  // Push to data layer for Google Analytics
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      eventData: eventData
    });
  }
  
  // Custom analytics system (if available)
  if (typeof window !== 'undefined' && (window as any).PROSPERA_ANALYTICS && 
      typeof (window as any).PROSPERA_ANALYTICS.track === 'function') {
    (window as any).PROSPERA_ANALYTICS.track(eventName, eventData);
  }
  
  // Log in development mode
  if (typeof window !== 'undefined' && 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    console.log('EVENT:', eventName, eventData);
  }
}
