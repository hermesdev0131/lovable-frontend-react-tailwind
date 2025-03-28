
import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RealTimeAnalytics from '@/components/website/RealTimeAnalytics';

interface RealTimeTabProps {
  selectedPage: number | null;
}

const RealTimeTab = ({ selectedPage }: RealTimeTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Real-Time Website Tracking
            </CardTitle>
            <CardDescription>
              Live monitoring of website visitors and performance metrics
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              Live
            </Badge>
            <Badge variant="outline">
              Refreshing every 5s
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RealTimeAnalytics websiteId={selectedPage} />
      </CardContent>
    </Card>
  );
};

export default RealTimeTab;
