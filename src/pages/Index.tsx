
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DealsOverview from '@/components/dashboard/DealsOverview';
import TasksPanel from '@/components/dashboard/TasksPanel';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  // Sample data for dashboard stats
  const totalContacts = 24;
  const openDeals = 8;
  const totalDealValue = 12500;
  
  // Sample data for deals overview
  const dealStageData = [
    { name: 'Qualified', value: 4, color: '#4CAF50' },
    { name: 'Proposal', value: 2, color: '#2196F3' },
    { name: 'Negotiation', value: 2, color: '#FF9800' },
  ];
  
  // Sample data for activity feed
  const [activities, setActivities] = useState([
    { id: 1, action: 'Email sent to John Doe', time: '10 mins ago', name: 'Sales Team' },
    { id: 2, action: 'Call scheduled with ABC Corp', time: '1 hour ago', name: 'Marketing' },
    { id: 3, action: 'New task created', time: '3 hours ago', name: 'Support' },
  ]);
  
  // Handle card click navigation
  const handleCardClick = useCallback((title: string, path: string) => {
    navigate(path);
  }, [navigate]);
  
  // Handle clearing activity
  const handleClearActivity = (id: number) => {
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
