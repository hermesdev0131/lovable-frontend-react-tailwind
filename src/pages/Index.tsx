
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useDeals } from '@/contexts/DealsContext';
import { contacts } from '@/lib/data';
import { TasksProvider } from '@/contexts/TasksContext';

// Import the components
import DashboardStats from '@/components/dashboard/DashboardStats';
import DealsOverview from '@/components/dashboard/DealsOverview';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import TasksPanel from '@/components/dashboard/TasksPanel';

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
  
  const openDeals = userDeals.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).length;
  const wonDeals = userDeals.filter(deal => deal.stage === 'closed-won').length;
  const lostDeals = userDeals.filter(deal => deal.stage === 'closed-lost').length;
  
  const totalDealValue = userDeals.reduce((sum, deal) => sum + deal.value, 0);
  
  // Create data for the pie chart
  const dealStageData = [
    { name: 'Open', value: openDeals, color: '#D35400' },
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
    <TasksProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
          {/* Stats Cards */}
          <DashboardStats 
            totalContacts={totalContacts}
            openDeals={openDeals}
            totalDealValue={totalDealValue}
            onCardClick={handleCardClick}
          />
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deal Overview Chart */}
              <DealsOverview 
                dealStageData={dealStageData} 
                hasDeals={userDeals.length > 0} 
              />
              
              {/* Tasks Panel */}
              <TasksPanel onCreateTask={handleCreateTask} />
            </div>
            
            {/* Activity Feed - Full Width at Bottom */}
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
      </div>
    </TasksProvider>
  );
};

export default Index;
