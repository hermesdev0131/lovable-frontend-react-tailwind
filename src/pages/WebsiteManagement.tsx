
import React, { useState } from 'react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import website types
import { PageFormValues } from '@/types/website';

// Import refactored components
import WebsiteStats from '@/components/website/WebsiteStats';
import AllPagesTab from '@/components/website/AllPagesTab';
import LandingPagesTab from '@/components/website/LandingPagesTab';
import RealTimeTab from '@/components/website/RealTimeTab';
import InsightsTab from '@/components/website/InsightsTab';
import DevicesTab from '@/components/website/DevicesTab';
import AddPageDialog from '@/components/website/AddPageDialog';
import EditPageDialog from '@/components/website/EditPageDialog';

// Create a type adapter to handle context vs component type differences
type ContextWebsitePage = {
  id: number;
  title: string;
  url: string;
  status: 'published' | 'draft' | 'scheduled';
  type: 'landing' | 'blog' | 'product' | 'other';
  createdAt: string;
  updatedAt: string;
  views: number;
  conversions: number;
  bounceRate: number;
  clientId: number | null;
};

// Type adapter function to ensure consistency
const adaptWebsitePageForComponents = (page: ContextWebsitePage) => {
  return {
    id: String(page.id),
    title: page.title,
    slug: page.url || '',
    url: page.url,
    status: page.status,
    type: page.type,
    visits: page.views || 0,
    views: page.views || 0,
    conversions: page.conversions || 0,
    bounceRate: page.bounceRate || 0,
    lastUpdated: page.updatedAt,
    updatedAt: page.updatedAt,
    createdAt: page.createdAt,
    clientId: String(page.clientId)
  };
};

const WebsiteManagement = () => {
  const { websitePages, addWebsitePage, removeWebsitePage, updateWebsitePage, currentClientId } = useMasterAccount();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // Calculate page stats
  const totalPages = websitePages.length;
  const publishedPages = websitePages.filter(page => page.status === 'published').length;
  const totalViews = websitePages.reduce((sum, page) => sum + (page.views || 0), 0);
  const totalConversions = websitePages.reduce((sum, page) => sum + (page.conversions || 0), 0);
  const avgBounceRate = websitePages.length > 0 
    ? websitePages.reduce((sum, page) => sum + (page.bounceRate || 0), 0) / websitePages.length 
    : 0;
  
  // Landing pages specifically
  const landingPages = websitePages.filter(page => page.type === 'landing');
  const landingPageViews = landingPages.reduce((sum, page) => sum + (page.views || 0), 0);
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
    // Convert form data to the context's WebsitePage type format
    const newPage = {
      title: data.title,
      url: data.slug, // map slug to url
      status: data.status as 'published' | 'draft' | 'scheduled',
      type: data.type as 'landing' | 'blog' | 'product' | 'other',
      views: 0,
      conversions: 0,
      bounceRate: 0,
      clientId: currentClientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addWebsitePage(newPage);
    addForm.reset();
    setIsAddDialogOpen(false);
  };
  
  const openEditDialog = (pageId: string) => {
    const numericId = Number(pageId);
    const page = websitePages.find(p => p.id === numericId);
    
    if (page) {
      editForm.reset({
        title: page.title,
        slug: page.url || '', // map url to slug
        status: page.status,
        type: page.type,
      });
      setEditingPageId(numericId);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleEditPage = (data: PageFormValues) => {
    if (editingPageId) {
      updateWebsitePage(editingPageId, {
        title: data.title,
        url: data.slug, // map slug to url
        status: data.status as 'published' | 'draft' | 'scheduled',
        type: data.type as 'landing' | 'blog' | 'product' | 'other',
        updatedAt: new Date().toISOString(),
      });
      setIsEditDialogOpen(false);
      setEditingPageId(null);
    }
  };
  
  const deletePage = (pageId: string) => {
    const numericId = Number(pageId);
    if (window.confirm('Are you sure you want to delete this page?')) {
      removeWebsitePage(numericId);
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
  
  // Adapt website pages for component consumption
  const adaptedWebsitePages = websitePages.map(adaptWebsitePageForComponents);
  const adaptedLandingPages = landingPages.map(adaptWebsitePageForComponents);
  
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
            websitePages={adaptedWebsitePages}
            openEditDialog={openEditDialog}
            deletePage={deletePage}
            startTracking={startTracking}
            formatDate={formatDate}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="landing" className="mt-4">
          <LandingPagesTab 
            landingPages={adaptedLandingPages}
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
          <InsightsTab 
            websitePages={adaptedWebsitePages}
          />
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
