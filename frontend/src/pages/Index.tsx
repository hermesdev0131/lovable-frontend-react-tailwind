
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DealsOverview from '@/components/dashboard/DealsOverview';
import TasksPanel from '@/components/dashboard/TasksPanel';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { useNavigate } from 'react-router-dom';
import { useMasterAccount } from '@/hooks/useMasterAccount';
import { useDeals } from '@/contexts/DealsContext';

const Index = () => {
  const navigate = useNavigate();
  const { clients } = useMasterAccount();
  const { deals } = useDeals();
  
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


// import { useEffect, useState } from "react";
// import axios from "axios";

// const DashboardMetrics = () => {
//   const [metrics, setMetrics] = useState(null);

//   useEffect(() => {
//     axios.get("http://localhost:8000/dashboard/metrics")
//       .then(res => setMetrics(res.data))
//       .catch(err => console.error("Error fetching metrics", err));
//   }, []);

//   if (!metrics) return <p>Loading...</p>;

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       Total Clients: {metrics.total_clients}
//       <div className="p-4 bg-white shadow rounded-xl">Total Clients: {metrics.total_clients}</div>
//       <div className="p-4 bg-white shadow rounded-xl">Active Deals: {metrics.active_deals}</div>
//       <div className="p-4 bg-white shadow rounded-xl">Pipeline Value: ${metrics.pipeline_value}</div>
//     </div>
//   );
// };

// export default DashboardMetrics;