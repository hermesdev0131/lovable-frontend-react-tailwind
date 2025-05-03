
import { useState, useEffect } from 'react';

export type IntegrationType = 'email' | 'sms' | 'chatbot' | 'calendar' | 'mailchimp' | 'twilio' | 'vapi' | 'make' | 'yext';

export interface Integration {
  type: IntegrationType;
  name: string;
  connected: boolean;
  lastSync?: string;
  status: 'active' | 'disconnected' | 'error' | 'pending';
  details?: Record<string, any>;
}

export interface YextIntegration extends Integration {
  type: 'yext';
  details: {
    reviewsUrl?: string;
    apiKey?: string;
    locationId?: string;
  };
}

export interface MailchimpIntegration extends Integration {
  type: 'mailchimp';
  details: {
    audienceId?: string;
    apiKey?: string;
    serverPrefix?: string;
  };
}

export interface TwilioIntegration extends Integration {
  type: 'twilio';
  details: {
    accountSid?: string;
    fromNumber?: string;
  };
}

export interface VapiIntegration extends Integration {
  type: 'vapi';
  details: {
    apiKey?: string;
    assistantId?: string;
  };
}

export interface MakeIntegration extends Integration {
  type: 'make';
  details: {
    webhookUrls?: Record<string, string>;
  };
}

const LOCAL_STORAGE_KEY = 'crm_integrations';

export function useExternalIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const savedIntegrations = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedIntegrations) {
      return JSON.parse(savedIntegrations);
    }
    
    // Default empty integrations
    return [
      { type: 'email', name: 'Email Provider', connected: false, status: 'disconnected' },
      { type: 'sms', name: 'SMS Provider', connected: false, status: 'disconnected' },
      { type: 'chatbot', name: 'Chatbot', connected: false, status: 'disconnected' },
      { type: 'calendar', name: 'Calendar', connected: false, status: 'disconnected' },
      { type: 'mailchimp', name: 'Mailchimp', connected: false, status: 'disconnected' },
      { type: 'twilio', name: 'Twilio', connected: false, status: 'disconnected' },
      { type: 'vapi', name: 'Vapi', connected: false, status: 'disconnected' },
      { type: 'make', name: 'Make.com', connected: false, status: 'disconnected' },
      { type: 'yext', name: 'Yext', connected: false, status: 'disconnected' },
    ];
  });

  // Persist integrations to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(integrations));
  }, [integrations]);

  // Get a specific integration
  const getIntegration = (type: IntegrationType): Integration | undefined => {
    return integrations.find(integration => integration.type === type);
  };

  // Update an integration
  const updateIntegration = (
    type: IntegrationType,
    updates: Partial<Omit<Integration, 'type'>>
  ) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.type === type 
          ? { ...integration, ...updates, lastSync: new Date().toISOString() }
          : integration
      )
    );
  };

  // Connect an integration
  const connectIntegration = (
    type: IntegrationType,
    details?: Record<string, any>
  ) => {
    updateIntegration(type, {
      connected: true,
      status: 'active',
      details: details
    });
  };

  // Disconnect an integration
  const disconnectIntegration = (type: IntegrationType) => {
    updateIntegration(type, {
      connected: false,
      status: 'disconnected'
    });
  };

  return {
    integrations,
    getIntegration,
    updateIntegration,
    connectIntegration,
    disconnectIntegration
  };
}
