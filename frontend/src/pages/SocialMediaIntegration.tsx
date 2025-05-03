
import React from 'react';
import { SocialMediaConnect } from '@/components/content/SocialMediaConnect';

const SocialMediaIntegration = () => {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Social Media Integration</h1>
      <p className="text-muted-foreground">
        Connect your social media accounts to enable posting directly from the content scheduler.
      </p>
      
      <SocialMediaConnect />
    </div>
  );
};

export default SocialMediaIntegration;
