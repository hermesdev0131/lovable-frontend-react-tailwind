
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RealTimeAnalytics from './RealTimeAnalytics';

interface RealTimeTabAdapterProps {
  selectedPage: string | null;
}

const RealTimeTabAdapter = ({ selectedPage }: RealTimeTabAdapterProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Analytics</CardTitle>
        <CardDescription>
          {selectedPage 
            ? 'Monitoring activity for the selected page' 
            : 'Select a page to track or view overall site metrics'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RealTimeAnalytics websiteId={selectedPage} />
      </CardContent>
    </Card>
  );
};

export default RealTimeTabAdapter;
