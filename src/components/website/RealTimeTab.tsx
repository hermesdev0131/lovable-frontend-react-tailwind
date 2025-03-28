
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RealTimeAnalytics from './RealTimeAnalytics';

interface RealTimeTabProps {
  selectedPage: string | null;
}

const RealTimeTab: React.FC<RealTimeTabProps> = ({ selectedPage }) => {
  if (!selectedPage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Analytics</CardTitle>
          <CardDescription>
            Select a page from the All Pages tab to view real-time analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-60">
          <p className="text-muted-foreground text-center">
            No page selected. Please select a page from the All Pages tab to start tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <RealTimeAnalytics websiteId={selectedPage} />;
};

export default RealTimeTab;
