import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentScheduling from '@/components/content/ContentScheduling';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const ContentSchedulingPage = () => {
  const { clients, getContentItems } = useMasterAccount();
  
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };
  
  return (
    <div>
      <ContentScheduling />
    </div>
  );
};

export default ContentSchedulingPage;
