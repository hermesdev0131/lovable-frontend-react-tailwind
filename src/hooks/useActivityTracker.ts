
import { useCallback } from 'react';
import { useTasks } from '@/contexts/TasksContext';
import { useDeals } from '@/contexts/DealsContext';
import { socialMediaService, SocialMediaPlatform } from '@/services/socialMedia';

export function useActivityTracker() {
  const { addActivityAsTask } = useTasks();

  // Function to track chatbot interactions
  const trackChatbotInteraction = useCallback((message: string) => {
    addActivityAsTask({
      title: `Chatbot conversation: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
      type: 'chat',
      source: 'chatbot'
    });
  }, [addActivityAsTask]);

  // Function to track email sends
  const trackEmailSent = useCallback((subject: string, recipient: string) => {
    addActivityAsTask({
      title: `Email sent: ${subject}`,
      type: 'email',
      source: 'email',
      relatedTo: recipient
    });
  }, [addActivityAsTask]);

  // Function to track calls
  const trackCall = useCallback((contactName: string, duration: number) => {
    addActivityAsTask({
      title: `Call with ${contactName} (${Math.floor(duration / 60)}m ${duration % 60}s)`,
      type: 'call',
      source: 'phone',
      relatedTo: contactName
    });
  }, [addActivityAsTask]);

  // Function to track text messages
  const trackTextMessage = useCallback((contactName: string, message: string) => {
    addActivityAsTask({
      title: `Text to ${contactName}: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
      type: 'text',
      source: 'sms',
      relatedTo: contactName
    });
  }, [addActivityAsTask]);

  // Function to track social media activity
  const trackSocialActivity = useCallback((platform: string, action: string, content?: string) => {
    addActivityAsTask({
      title: content 
        ? `${action} on ${platform}: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`
        : `${action} on ${platform}`,
      type: 'social',
      source: platform
    });
  }, [addActivityAsTask]);

  // Function to track review activity
  const trackReviewActivity = useCallback((platform: string, action: string, customerName?: string) => {
    addActivityAsTask({
      title: customerName 
        ? `${action} on ${platform} from ${customerName}`
        : `${action} on ${platform}`,
      type: 'review',
      source: platform
    });
  }, [addActivityAsTask]);

  // Function to track integration events
  const trackIntegrationEvent = useCallback((integration: string, event: string, details?: string) => {
    addActivityAsTask({
      title: details
        ? `${integration}: ${event} - ${details.substring(0, 30)}${details.length > 30 ? '...' : ''}`
        : `${integration}: ${event}`,
      type: 'integration',
      source: integration
    });
  }, [addActivityAsTask]);

  // Function to track deal activities
  const trackDealActivity = useCallback((dealName: string, action: string, details?: string) => {
    addActivityAsTask({
      title: details
        ? `${action} for deal "${dealName}": ${details.substring(0, 30)}${details.length > 30 ? '...' : ''}`
        : `${action} for deal "${dealName}"`,
      type: 'deal',
      source: 'crm',
      relatedTo: dealName
    });
  }, [addActivityAsTask]);

  // Function to track document activities
  const trackDocumentActivity = useCallback((documentName: string, action: string, dealName?: string) => {
    addActivityAsTask({
      title: dealName
        ? `${action} document "${documentName}" for deal "${dealName}"`
        : `${action} document "${documentName}"`,
      type: 'document',
      source: 'files',
      relatedTo: dealName
    });
  }, [addActivityAsTask]);

  // Function to track appointment scheduling
  const trackAppointmentScheduled = useCallback((contactName: string, dealName: string, dateTime: string) => {
    addActivityAsTask({
      title: `Appointment scheduled with ${contactName} for deal "${dealName}" on ${dateTime}`,
      type: 'calendar',
      source: 'scheduler',
      relatedTo: dealName
    });
  }, [addActivityAsTask]);

  return {
    trackChatbotInteraction,
    trackEmailSent,
    trackCall,
    trackTextMessage,
    trackSocialActivity,
    trackReviewActivity,
    trackIntegrationEvent,
    trackDealActivity,
    trackDocumentActivity,
    trackAppointmentScheduled
  };
}
