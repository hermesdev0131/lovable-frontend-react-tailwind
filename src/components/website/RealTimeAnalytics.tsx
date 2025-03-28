
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Activity, Eye, Clock, Users, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface RealTimeAnalyticsProps {
  websiteId?: string | null;
}

interface VisitorData {
  id: number;
  page: string;
  location: string;
  device: string;
  browser: string;
  entryTime: Date;
  timeOnPage: number;
  active: boolean;
}

interface PagePerformance {
  page: string;
  loadTime: number;
  visitors: number;
  bounceRate: number;
}

const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ websiteId }) => {
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const [pagesPerMinute, setPagesPerMinute] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.1) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
        toast({
          title: "Connection Issue",
          description: "Reconnecting to analytics service...",
          variant: "destructive",
        });
        
        setTimeout(() => {
          setIsConnected(true);
          toast({
            title: "Connected",
            description: "Analytics connection restored",
          });
        }, 3000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [toast]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };
  
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    return `${diffMins} minutes ago`;
  };
  
  return (
    <div className="space-y-6">
      {!isConnected && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
              <p className="text-amber-600 dark:text-amber-400">Reconnecting to analytics service...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{activeVisitors}</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Right now</span>
                <span>{activeVisitors} users</span>
              </div>
              <Progress value={activeVisitors > 0 ? (activeVisitors / 20) * 100 : 0} className="h-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pages/Minute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{pagesPerMinute.toFixed(1)}</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className="text-muted-foreground">No data available</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{conversionRate.toFixed(1)}%</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className="text-muted-foreground">No data available</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Visitors</CardTitle>
          <CardDescription>
            Users currently browsing your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Time on Page</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitorData.length > 0 ? (
                visitorData.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.page}</TableCell>
                    <TableCell>{visitor.location}</TableCell>
                    <TableCell>{visitor.device}</TableCell>
                    <TableCell>{visitor.browser}</TableCell>
                    <TableCell>{getRelativeTime(visitor.entryTime)}</TableCell>
                    <TableCell>{formatTime(visitor.timeOnPage)}</TableCell>
                    <TableCell>
                      <Badge variant={visitor.active ? "default" : "secondary"} className="w-min">
                        {visitor.active ? "Active" : "Idle"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Eye className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-muted-foreground">No visitors currently on your site</p>
                      <p className="text-xs text-muted-foreground mt-1">Real-time visitor data will appear here</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Page Performance</CardTitle>
          <CardDescription>
            Load times and engagement metrics by page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Load Time</TableHead>
                <TableHead>Active Visitors</TableHead>
                <TableHead>Bounce Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagePerformance.length > 0 ? (
                pagePerformance.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{page.page}</TableCell>
                    <TableCell>{page.loadTime.toFixed(1)}s</TableCell>
                    <TableCell>{page.visitors}</TableCell>
                    <TableCell>{page.bounceRate.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge 
                        variant={page.loadTime < 1 ? "default" : page.loadTime < 2 ? "secondary" : "destructive"} 
                        className="w-min"
                      >
                        {page.loadTime < 1 ? "Fast" : page.loadTime < 2 ? "OK" : "Slow"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-muted-foreground">No page performance data yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Performance metrics will appear here as visitors browse your site</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
