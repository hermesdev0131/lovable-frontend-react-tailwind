
import React from 'react';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Activity } from 'lucide-react';

// Import website types
import { useWebsiteActions } from '@/hooks/useWebsiteActions';
import { adaptWebsitePageForComponents } from '@/utils/websitePageAdapter';
import { calculateWebsiteStats } from '@/utils/websiteStatsCalculator';
import { formatDate, getStatusBadgeVariant } from '@/utils/formatters';

// Import refactored components
import WebsiteStats from '@/components/website/WebsiteStats';
import AllPagesTab from '@/components/website/AllPagesTab';
import LandingPagesTab from '@/components/website/LandingPagesTab';
import RealTimeTabAdapter from '@/components/website/RealTimeTabAdapter';
import InsightsTab from '@/components/website/InsightsTab';
import DevicesTab from '@/components/website/DevicesTab';
import AddPageDialog from '@/components/website/AddPageDialog';
import EditPageDialog from '@/components/website/EditPageDialog';

const WebsiteManagement = () => {
  const { websitePages } = useMasterAccount();
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedPage,
    addForm,
    editForm,
    handleAddPage,
    openEditDialog,
    handleEditPage,
    deletePage,
    startTracking
  } = useWebsiteActions();
  
  // Calculate page stats
  const stats = calculateWebsiteStats(websitePages);
  
  // Adapt website pages for component consumption
  const adaptedWebsitePages = websitePages.map(adaptWebsitePageForComponents);
  const adaptedLandingPages = stats.landingPages.map(adaptWebsitePageForComponents);
  
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
        totalPages={stats.totalPages}
        publishedPages={stats.publishedPages}
        totalViews={stats.totalViews}
        totalConversions={stats.totalConversions}
        avgBounceRate={stats.avgBounceRate}
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
            landingPageViews={stats.landingPageViews}
            landingPageConversions={stats.landingPageConversions}
            openEditDialog={openEditDialog}
            deletePage={deletePage}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-4">
          <RealTimeTabAdapter selectedPage={selectedPage} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <InsightsTab 
            websitePages={adaptedWebsitePages}
          />
        </TabsContent>
        
        <TabsContent value="devices" className="mt-4">
          <DevicesTab totalViews={stats.totalViews} />
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
