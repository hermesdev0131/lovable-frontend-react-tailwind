import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Pencil, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentEditDialog from './ContentEditDialog';
import { ContentItem } from "@/types/masterAccount";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContentCreationForm from './ContentCreationForm';

const ContentScheduling = () => {
  const { getContentItems, currentClientId, isInMasterMode, clients } = useMasterAccount();
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const items = getContentItems(currentClientId).filter(item => 
      item.status === 'approved' && item.scheduledFor
    );
    setContentItems(items);
  }, [currentClientId, getContentItems]);
  
  const handleCreateContent = () => {
    setIsCreatingContent(true);
  };
  
  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
  };
  
  const handleCloseEditor = () => {
    setSelectedContent(null);
    const items = getContentItems(currentClientId).filter(item => 
      item.status === 'approved' && item.scheduledFor
    );
    setContentItems(items);
  };
  
  const handleCloseCreation = () => {
    setIsCreatingContent(false);
    const items = getContentItems(currentClientId).filter(item => 
      item.status === 'approved' && item.scheduledFor
    );
    setContentItems(items);
  };
  
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };
  
  const getFilteredContent = () => {
    switch(filter) {
      case 'today':
        return contentItems.filter(item => {
          if (!item.scheduledFor) return false;
          const itemDate = new Date(item.scheduledFor);
          const today = new Date();
          return itemDate.toDateString() === today.toDateString();
        });
      case 'week':
        return contentItems.filter(item => {
          if (!item.scheduledFor) return false;
          const itemDate = new Date(item.scheduledFor);
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          return itemDate >= today && itemDate <= nextWeek;
        });
      case 'month':
        return contentItems.filter(item => {
          if (!item.scheduledFor) return false;
          const itemDate = new Date(item.scheduledFor);
          const today = new Date();
          const nextMonth = new Date();
          nextMonth.setMonth(today.getMonth() + 1);
          return itemDate >= today && itemDate <= nextMonth;
        });
      default:
        return contentItems;
    }
  };
  
  const filteredContent = getFilteredContent();
  
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'blog':
        return <Badge className="bg-blue-500">Blog</Badge>;
      case 'social':
        return <Badge className="bg-green-500">Social</Badge>;
      case 'email':
        return <Badge className="bg-orange-500">Email</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Schedule</CardTitle>
          <CardDescription>View and manage your scheduled content</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scheduled</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Next 7 Days</SelectItem>
                <SelectItem value="month">Next 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateContent}>
            <Plus className="h-4 w-4 mr-2" /> New Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Content Scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating and scheduling your first content piece
            </p>
            <Button onClick={handleCreateContent}>
              <Plus className="h-4 w-4 mr-2" /> Create Content
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-2 rounded">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getContentTypeBadge(item.type)}
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {format(new Date(item.scheduledFor || ''), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                    {isInMasterMode && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Created by {getClientName(item.createdBy)}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleEditContent(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Edit Content Dialog */}
      <ContentEditDialog 
        isOpen={selectedContent !== null}
        onClose={handleCloseEditor}
        contentItem={selectedContent}
      />
      
      {/* Create Content Dialog */}
      <Dialog open={isCreatingContent} onOpenChange={setIsCreatingContent}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
            <DialogDescription>
              Create and schedule new content
            </DialogDescription>
          </DialogHeader>
          <ContentCreationForm onSuccess={handleCloseCreation} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContentScheduling;
