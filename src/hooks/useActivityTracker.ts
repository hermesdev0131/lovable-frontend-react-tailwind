
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

  return {
    trackChatbotInteraction,
    trackEmailSent,
    trackCall,
    trackTextMessage
  };
}
