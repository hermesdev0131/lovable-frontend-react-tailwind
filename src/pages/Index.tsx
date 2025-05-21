import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DealsOverview from '@/components/dashboard/DealsOverview';
import TasksPanel from '@/components/dashboard/TasksPanel';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { useNavigate } from 'react-router-dom';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useDeals } from '@/contexts/DealsContext';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { clients, clientsLoaded, fetchClientsData, isLoadingClients } = useMasterAccount();
  const { deals, fetchDealsData, isLoadingDeals, dealsLoaded } = useDeals();
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const isAuthenticated = authState?.isAuthenticated ?? false;
  
  // Fetch clients and deals data if not already loaded and user is authenticated
  useEffect(() => {
    console.log("Dashboard: Initial data load check");
    const loadData = async () => {
      // Only proceed if authenticated and we need to load data and aren't already loading
      if (!isAuthenticated) {
        console.log("Dashboard: User not authenticated, skipping data load");
        return;
      }

      const needClientsData = !clientsLoaded && !isLoadingClients;
      const needDealsData = !dealsLoaded && !isLoadingDeals;
      
      if (needClientsData || needDealsData) {
        setIsLoading(true);
        try {
          // Load clients data if needed
          if (needClientsData) {
            console.log("Dashboard: Fetching client data...");
            await fetchClientsData();
          }
          
          // Load deals data if needed
          if (needDealsData) {
            console.log("Dashboard: Fetching deals data...");
            await fetchDealsData();
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    // Only re-run when the loaded state changes or authentication state changes
  }, [clientsLoaded, dealsLoaded, isAuthenticated]);
  
  // Calculate dashboard stats from actual data
  const totalContacts = clients.length;
  
  // Only count deals that are past lead stage (not in 'lead' or 'contact' stages)
  const openDeals = deals.filter(deal => 
    !['lead', 'contact'].includes(deal.stage.toLowerCase())
  ).length;
  
  // Calculate total value of all current deals
  const totalDealValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  
  // Create deal stage data for chart
  const dealStages = deals.reduce((stages: Record<string, number>, deal) => {
    const stage = deal.stage || 'Unknown';
    stages[stage] = (stages[stage] || 0) + 1;
    return stages;
  }, {});
  
  const dealStageData = Object.entries(dealStages).map(([name, value], index) => {
    // Colors for the chart (reuse existing colors or generate a set)
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
    return {
      name,
      value,
      color: colors[index % colors.length]
    };
  });
  
  // Sample data for activity feed (kept as is)
  const [activities, setActivities] = useState([
    { id: 1, action: 'Email sent to John Doe', time: '10 mins ago', name: 'Sales Team' },
    { id: 2, action: 'Call scheduled with ABC Corp', time: '1 hour ago', name: 'Marketing' },
    { id: 3, action: 'New task created', time: '3 hours ago', name: 'Support' },
  ]);
  
  // Handle card click navigation
  const handleCardClick = useCallback((title: string, path: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive"
      });
      return;
    }
    navigate(path);
  }, [navigate, isAuthenticated]);
  
  // Handle clearing activity
  const handleClearActivity = (id: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to clear activities",
        variant: "destructive"
      });
      return;
    }
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <DashboardStats 
        totalContacts={totalContacts}
        openDeals={openDeals}
        totalDealValue={totalDealValue}
        onCardClick={handleCardClick}
        isLoading={isLoading || isLoadingClients || isLoadingDeals}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals Overview */}
        <DealsOverview 
          dealStageData={dealStageData}
          hasDeals={dealStageData.length > 0}
        />
        
        {/* Tasks Panel */}
        <TasksPanel />
      </div>
			
      {/* Activity Feed - Full width at the bottom */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed 
            activities={activities}
            onClearActivity={handleClearActivity}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;


