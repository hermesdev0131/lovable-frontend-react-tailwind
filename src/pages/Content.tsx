
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentScheduling from '@/components/content/ContentScheduling';
import { SocialMediaConnect } from '@/components/content/SocialMediaConnect';
import ContentList from '@/components/content/ContentList';
import { FileEdit, Share } from 'lucide-react';

const Content = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Content Management</h1>
      
      <Tabs defaultValue="content" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Tools</CardTitle>
            <CardDescription>
              Create, manage and schedule your content across multiple platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">
                <FileEdit className="h-4 w-4 mr-2" /> Content Library
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Share className="h-4 w-4 mr-2" /> Content Scheduling
              </TabsTrigger>
              <TabsTrigger value="accounts">Social Media Accounts</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>
        
        <TabsContent value="content">
          <ContentList />
        </TabsContent>
        
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
