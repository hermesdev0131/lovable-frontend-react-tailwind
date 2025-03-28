
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Pencil } from "lucide-react";

const ContentScheduling = () => {
  const { getContentItems, currentClientId } = useMasterAccount();
  const navigate = useNavigate();
  
  // Get content items from context
  const contentItems = getContentItems(currentClientId);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Schedule</CardTitle>
          <CardDescription>Manage and schedule your content across platforms</CardDescription>
        </div>
        <Button onClick={() => navigate('/social-media')}>
          <Plus className="h-4 w-4 mr-2" /> New Content
        </Button>
      </CardHeader>
      <CardContent>
        {contentItems.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Content Scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating and scheduling your first content piece
            </p>
            <Button onClick={() => navigate('/social-media')}>
              <Plus className="h-4 w-4 mr-2" /> Create Content
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {contentItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Scheduled for {new Date(item.scheduledFor || '').toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentScheduling;
