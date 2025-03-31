
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DealsOverview from '@/components/dashboard/DealsOverview';
import TasksPanel from '@/components/dashboard/TasksPanel';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

const Index = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals Overview */}
        <DealsOverview />
        
        {/* Tasks Panel */}
        <TasksPanel />
      </div>
      
      {/* Activity Feed - Full width at the bottom */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
