
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet, PieChart } from 'lucide-react';

interface DevicesTabProps {
  totalViews: number;
}

const DevicesTab = ({ totalViews }: DevicesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
        <CardDescription>How users access your website across different devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">58%</div>
              <div className="text-sm text-muted-foreground">
                {Math.round(totalViews * 0.58).toLocaleString()} views
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">36%</div>
              <div className="text-sm text-muted-foreground">
                {Math.round(totalViews * 0.36).toLocaleString()} views
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Tablet className="h-4 w-4 mr-2" />
                Tablet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">6%</div>
              <div className="text-sm text-muted-foreground">
                {Math.round(totalViews * 0.06).toLocaleString()} views
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <PieChart className="h-16 w-16 mx-auto mb-4 text-primary/40" />
            <p>Device distribution visualization will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicesTab;
