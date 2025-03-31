
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentScheduling from '@/components/content/ContentScheduling';
import ContentList from '@/components/content/ContentList';
import { FileEdit, Calendar, CheckCircle } from 'lucide-react';

const Socials = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Socials Management</h1>
      
      <Tabs defaultValue="schedule" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Tools</CardTitle>
            <CardDescription>
              Create, manage and schedule your content across multiple platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">
                <Calendar className="h-4 w-4 mr-2" /> Content Scheduling
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileEdit className="h-4 w-4 mr-2" /> Content Library
              </TabsTrigger>
              <TabsTrigger value="approvals">
                <CheckCircle className="h-4 w-4 mr-2" /> Approvals
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>
        
        <TabsContent value="schedule">
          <ContentScheduling />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentList />
        </TabsContent>
        
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Content Approvals</CardTitle>
              <CardDescription>
                Review and approve content before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Socials;
