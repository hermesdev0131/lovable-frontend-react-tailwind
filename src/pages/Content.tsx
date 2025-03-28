
import React from 'react';
import ContentScheduling from '@/components/content/ContentScheduling';
import { SocialMediaConnect } from '@/components/content/SocialMediaConnect';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Content = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Content Management</h1>
      
      <Tabs defaultValue="schedule" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Tools</CardTitle>
            <CardDescription>
              Schedule and manage your content across multiple platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule">Content Scheduling</TabsTrigger>
              <TabsTrigger value="accounts">Social Media Accounts</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>
        
        <TabsContent value="schedule">
          <ContentScheduling />
        </TabsContent>
        
        <TabsContent value="accounts">
          <SocialMediaConnect />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Content;
