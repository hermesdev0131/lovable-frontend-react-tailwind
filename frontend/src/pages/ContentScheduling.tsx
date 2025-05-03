
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentScheduling from '@/components/content/ContentScheduling';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const ContentSchedulingPage = () => {
  const { clients } = useMasterAccount();
  
  return (
    <div>
      <ContentScheduling />
    </div>
  );
};

export default ContentSchedulingPage;
