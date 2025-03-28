
import React, { useState } from 'react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import website types
import { PageFormValues, WebsitePage } from '@/types/website';

// Import refactored components
import WebsiteStats from '@/components/website/WebsiteStats';
import AllPagesTab from '@/components/website/AllPagesTab';
import LandingPagesTab from '@/components/website/LandingPagesTab';
import RealTimeTab from '@/components/website/RealTimeTab';
import InsightsTab from '@/components/website/InsightsTab';
import DevicesTab from '@/components/website/DevicesTab';
import AddPageDialog from '@/components/website/AddPageDialog';
import EditPageDialog from '@/components/website/EditPageDialog';

const WebsiteManagement = () => {
  const { websitePages, addWebsitePage, removeWebsitePage, updateWebsitePage, currentClientId } = useMasterAccount();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // Calculate page stats
  const totalPages = websitePages.length;
  const publishedPages = websitePages.filter(page => page.status === 'published').length;
  const totalViews = websitePages.reduce((sum, page) => sum + (page.views || page.visits), 0);
  const totalConversions = websitePages.reduce((sum, page) => sum + (page.conversions || 0), 0);
  const avgBounceRate = websitePages.length > 0 
    ? websitePages.reduce((sum, page) => sum + (page.bounceRate || 0), 0) / websitePages.length 
    : 0;
  
  // Landing pages specifically
  const landingPages = websitePages.filter(page => page.type === 'landing');
  const landingPageViews = landingPages.reduce((sum, page) => sum + (page.views || page.visits), 0);
  const landingPageConversions = landingPages.reduce((sum, page) => sum + (page.conversions || 0), 0);
  
  const addForm = useForm<PageFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      status: 'draft',
      type: 'landing'
    }
  });
  
  const editForm = useForm<PageFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      status: 'published',
      type: 'landing'
    }
  });
  
  const handleAddPage = (data: PageFormValues) => {
    const newPage: Omit<WebsitePage, 'id'> = {
      ...data,
      visits: 0,
      views: 0,
      conversions: 0,
      bounceRate: 0,
      clientId: currentClientId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addWebsitePage(newPage);
    addForm.reset();
    setIsAddDialogOpen(false);
  };
  
  const openEditDialog = (pageId: string) => {
    const page = websitePages.find(p => p.id === pageId);
    if (page) {
      editForm.reset({
        title: page.title,
        slug: page.slug,
        url: page.url,
        status: page.status as 'published' | 'draft' | 'scheduled',
        type: page.type,
        content: page.content,
        template: page.template
      });
      setEditingPageId(pageId);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleEditPage = (data: PageFormValues) => {
    if (editingPageId) {
      updateWebsitePage(editingPageId, {
        ...data,
        lastUpdated: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsEditDialogOpen(false);
      setEditingPageId(null);
    }
  };
  
  const deletePage = (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      removeWebsitePage(pageId);
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const startTracking = (pageId: string) => {
    setSelectedPage(pageId);
    
    if (!isTracking) {
      setIsTracking(true);
      toast({
        title: "Real-time tracking activated",
        description: "Now monitoring website traffic and performance metrics",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Website & Landing Pages</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <AddPageDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            form={addForm}
            onSubmit={handleAddPage}
          />
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add New Page
          </Button>
        </Dialog>
      </div>
      
      <WebsiteStats 
        totalPages={totalPages}
        publishedPages={publishedPages}
        totalViews={totalViews}
        totalConversions={totalConversions}
        avgBounceRate={avgBounceRate}
      />
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Pages</TabsTrigger>
          <TabsTrigger value="landing">Landing Pages</TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-1">
            <Activity className="h-4 w-4" /> Real-Time Tracking
          </TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="devices">Device Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <AllPagesTab 
            websitePages={websitePages}
            openEditDialog={openEditDialog}
            deletePage={deletePage}
            startTracking={startTracking}
            formatDate={formatDate}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="landing" className="mt-4">
          <LandingPagesTab 
            landingPages={landingPages}
            landingPageViews={landingPageViews}
            landingPageConversions={landingPageConversions}
            openEditDialog={openEditDialog}
            deletePage={deletePage}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-4">
          <RealTimeTab selectedPage={selectedPage} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <InsightsTab websitePages={websitePages} />
        </TabsContent>
        
        <TabsContent value="devices" className="mt-4">
          <DevicesTab totalViews={totalViews} />
        </TabsContent>
      </Tabs>
      
      <EditPageDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        form={editForm}
        onSubmit={handleEditPage}
      />
    </div>
  );
};

export default WebsiteManagement;
