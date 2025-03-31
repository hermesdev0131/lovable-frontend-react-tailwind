
import { useEffect } from 'react';
import { useTasks } from '@/contexts/TasksContext';
import { useDeals } from '@/contexts/DealsContext';
import { socialMediaService, SocialMediaPlatform } from '@/services/socialMedia';

export function useActivityTracker() {
  const { addActivityAsTask } = useTasks();
  const { deals } = useDeals();

  // Track social media posts
  useEffect(() => {
    const originalPostMethod = socialMediaService.postToSocialMedia;
    
    // Override the post method to track activities
    socialMediaService.postToSocialMedia = async (platform, payload) => {
      const result = await originalPostMethod.call(socialMediaService, platform, payload);
      
      if (result.success) {
        addActivityAsTask({
          title: `Posted to ${platform}: ${payload.content.substring(0, 30)}${payload.content.length > 30 ? '...' : ''}`,
          type: 'social',
          source: platform,
          relatedTo: payload.title || undefined
        });
      }
      
      return result;
    };
    
    // Cleanup function to restore original method
    return () => {
      socialMediaService.postToSocialMedia = originalPostMethod;
    };
  }, [addActivityAsTask]);

  // Track integration events (new)
  const trackIntegrationEvent = (integration: string, event: string, details?: string) => {
    addActivityAsTask({
      title: details 
        ? `${integration}: ${event} - ${details.substring(0, 30)}${details.length > 30 ? '...' : ''}`
        : `${integration}: ${event}`,
      type: 'integration',
      source: integration
    });
  };

  // Function to track chatbot interactions
  const trackChatbotInteraction = (message: string) => {
    addActivityAsTask({
      title: `Chatbot conversation: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
      type: 'chat',
      source: 'chatbot'
    });
  };

  // Function to track email sends
  const trackEmailSent = (subject: string, recipient: string) => {
    addActivityAsTask({
      title: `Email sent: ${subject}`,
      type: 'email',
      source: 'email',
      relatedTo: recipient
    });
  };

  // Function to track calls
  const trackCall = (contactName: string, duration: number) => {
    addActivityAsTask({
      title: `Call with ${contactName} (${Math.floor(duration / 60)}m ${duration % 60}s)`,
      type: 'call',
      source: 'phone',
      relatedTo: contactName
    });
  };

  // Function to track text messages
  const trackTextMessage = (contactName: string, message: string) => {
    addActivityAsTask({
      title: `Text to ${contactName}: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
      type: 'text',
      source: 'sms',
      relatedTo: contactName
    });
  };

  // Function to track review activity (new)
  const trackReviewActivity = (platform: string, action: string, customerName?: string) => {
    addActivityAsTask({
      title: customerName 
        ? `${action} on ${platform} from ${customerName}`
        : `${action} on ${platform}`,
      type: 'review',
      source: platform
    });
  };

  return {
    trackChatbotInteraction,
    trackEmailSent,
    trackCall,
    trackTextMessage,
    trackIntegrationEvent,
    trackReviewActivity
  };
}
