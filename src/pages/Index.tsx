
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useDeals } from '@/contexts/DealsContext';
import { contacts, opportunities } from '@/lib/data';

// Import the new components
import DashboardStats from '@/components/dashboard/DashboardStats';
import DealsOverview from '@/components/dashboard/DealsOverview';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import TasksPanel from '@/components/dashboard/TasksPanel';
import OpportunitiesPanel from '@/components/dashboard/OpportunitiesPanel';

const Index = () => {
  const navigate = useNavigate();
  const { deals: userDeals } = useDeals();
  const [recentActivity, setRecentActivity] = useState<{
    id: number;
    action: string;
    time: string;
    name: string;
  }[]>([]);
  
  // Compute statistics for the dashboard
  const totalContacts = contacts.length;
  const totalDeals = userDeals.length;
  const totalOpportunities = opportunities.length;
  
  const openDeals = userDeals.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).length;
  const wonDeals = userDeals.filter(deal => deal.stage === 'closed-won').length;
  const lostDeals = userDeals.filter(deal => deal.stage === 'closed-lost').length;
  
  const totalDealValue = userDeals.reduce((sum, deal) => sum + deal.value, 0);
  const potentialValue = opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0);
  
  // Create data for the pie chart
  const dealStageData = [
    { name: 'Open', value: openDeals, color: '#4f46e5' },
    { name: 'Won', value: wonDeals, color: '#10b981' },
    { name: 'Lost', value: lostDeals, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const handleCardClick = (title: string, path: string) => {
    toast({
      title: `Viewing ${title}`,
      description: "Navigating to detailed view",
      duration: 2000,
    });
    navigate(path);
  };

  const handleCreateTask = (data: { title: string; date: string }) => {
    toast({
      title: "Task Created",
      description: `New task "${data.title}" scheduled for ${data.date}`,
      duration: 3000,
    });
    
    setRecentActivity(prev => [
      { id: Date.now(), action: "Task created", time: "Just now", name: data.title },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Stats Cards */}
        <DashboardStats 
          totalContacts={totalContacts}
          openDeals={openDeals}
          totalDealValue={totalDealValue}
          onCardClick={handleCardClick}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Deal Overview Chart */}
          <DealsOverview 
            dealStageData={dealStageData} 
            hasDeals={userDeals.length > 0} 
          />
          
          {/* Activity Feed */}
          <ActivityFeed activities={recentActivity} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Panel */}
          <div className="lg:col-span-2">
            <TasksPanel onCreateTask={handleCreateTask} />
          </div>
          
          {/* Opportunities Panel */}
          <OpportunitiesPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
