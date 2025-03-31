
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Integration types for better TypeScript support
export type IntegrationType = 'mailchimp' | 'twilio' | 'make' | 'vapi' | 'calendly' | 'yext';

interface Integration {
  type: IntegrationType;
  name: string;
  isConnected: boolean;
  apiKey?: string;
  lastSynced?: string;
}

export function useExternalIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const savedIntegrations = localStorage.getItem('user_integrations');
    return savedIntegrations ? JSON.parse(savedIntegrations) : [];
  });

  const saveIntegrations = (updatedIntegrations: Integration[]) => {
    localStorage.setItem('user_integrations', JSON.stringify(updatedIntegrations));
    setIntegrations(updatedIntegrations);
  };

  const addIntegration = (integrationType: IntegrationType, apiKey: string, name: string = '') => {
    // Check if integration already exists
    const exists = integrations.some(int => int.type === integrationType);
    
    if (exists) {
      // Update existing integration
      const updated = integrations.map(int => 
        int.type === integrationType 
          ? { 
              ...int, 
              apiKey, 
              isConnected: true, 
              lastSynced: new Date().toISOString(),
              name: name || int.name
            } 
          : int
      );
      
      saveIntegrations(updated);
      
      toast({
        title: "Integration Updated",
        description: `Your ${integrationType} integration has been updated`,
      });
      
      return true;
    } else {
      // Add new integration
      const newIntegration: Integration = {
        type: integrationType,
        name: name || getDefaultIntegrationName(integrationType),
        isConnected: true,
        apiKey,
        lastSynced: new Date().toISOString()
      };
      
      saveIntegrations([...integrations, newIntegration]);
      
      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${integrationType}`,
      });
      
      return true;
    }
  };

  const removeIntegration = (integrationType: IntegrationType) => {
    const updated = integrations.filter(int => int.type !== integrationType);
    saveIntegrations(updated);
    
    toast({
      title: "Integration Removed",
      description: `Your ${integrationType} integration has been removed`,
    });
    
    return true;
  };

  const getIntegration = (integrationType: IntegrationType): Integration | undefined => {
    return integrations.find(int => int.type === integrationType);
  };

  const isIntegrationConnected = (integrationType: IntegrationType): boolean => {
    const integration = getIntegration(integrationType);
    return !!integration?.isConnected;
  };

  // Helper function to get default integration display name
  const getDefaultIntegrationName = (type: IntegrationType): string => {
    const names: Record<IntegrationType, string> = {
      mailchimp: 'Mailchimp',
      twilio: 'Twilio',
      make: 'Make.com',
      vapi: 'Vapi',
      calendly: 'Calendly',
      yext: 'Yext'
    };
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Simulate syncing with external service
  const syncWithService = async (integrationType: IntegrationType): Promise<boolean> => {
    // In a real app, this would be an API call to the external service
    const integration = getIntegration(integrationType);
    
    if (!integration || !integration.isConnected) {
      toast({
        title: "Sync Failed",
        description: `${getDefaultIntegrationName(integrationType)} is not connected`,
        variant: "destructive"
      });
      return false;
    }
    
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update last synced time
    const updated = integrations.map(int => 
      int.type === integrationType 
        ? { ...int, lastSynced: new Date().toISOString() } 
        : int
    );
    
    saveIntegrations(updated);
    
    toast({
      title: "Sync Complete",
      description: `Successfully synced with ${getDefaultIntegrationName(integrationType)}`,
    });
    
    return true;
  };

  return {
    integrations,
    addIntegration,
    removeIntegration,
    getIntegration,
    isIntegrationConnected,
    syncWithService
  };
}
