
import { ANALYTICS_ENABLED } from '@/config/deploymentConfig';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

/**
 * Track user events for analytics
 * This is a simple implementation that can be expanded with actual analytics services
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!ANALYTICS_ENABLED) {
    // Only log in console during development
    console.log('Analytics event (disabled):', event);
    return;
  }
  
  try {
    // This is where you would integrate with an actual analytics service
    // like Google Analytics, Mixpanel, etc.
    
    // For now, we'll just log to console in production too
    console.log('Analytics event tracked:', event);
    
    // Example of how you might integrate with GA4
    /*
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
    */
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
};

/**
 * Track page views
 */
export const trackPageView = (pagePath: string, pageTitle: string): void => {
  trackEvent({
    category: 'Page View',
    action: 'view',
    label: `${pageTitle} (${pagePath})`
  });
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (featureName: string): void => {
  trackEvent({
    category: 'Feature',
    action: 'use',
    label: featureName
  });
};

/**
 * Track errors for monitoring
 */
export const trackError = (errorMessage: string, errorSource: string): void => {
  trackEvent({
    category: 'Error',
    action: 'encounter',
    label: `${errorSource}: ${errorMessage}`
  });
};
