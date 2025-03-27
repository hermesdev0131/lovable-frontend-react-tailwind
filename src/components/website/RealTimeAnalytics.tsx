import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Activity, Eye, Clock, Users, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface RealTimeAnalyticsProps {
  websiteId?: number | null;
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
  
  // Simulate real-time data
  useEffect(() => {
    // Initial data
    generateInitialData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.1) {
        updateRealTimeData();
      } else {
        // Occasionally simulate connection issues
        setIsConnected(false);
        toast({
          title: "Connection Issue",
          description: "Reconnecting to analytics service...",
          variant: "destructive",
        });
        
        // Simulate reconnection
        setTimeout(() => {
          setIsConnected(true);
          toast({
            title: "Connected",
            description: "Analytics connection restored",
          });
          updateRealTimeData();
        }, 3000);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateInitialData = () => {
    // Generate realistic visitor data
    const visitors: VisitorData[] = [];
    const pages = ['/home', '/about', '/products', '/contact', '/blog', '/pricing'];
    const locations = ['United States', 'Germany', 'United Kingdom', 'Canada', 'Australia', 'France'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    
    for (let i = 0; i < 15; i++) {
      const entryTime = new Date();
      entryTime.setMinutes(entryTime.getMinutes() - Math.floor(Math.random() * 60));
      
      visitors.push({
        id: i + 1,
        page: pages[Math.floor(Math.random() * pages.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        entryTime,
        timeOnPage: Math.floor(Math.random() * 600),
        active: Math.random() > 0.3,
      });
    }
    
    setVisitorData(visitors);
    setActiveVisitors(visitors.filter(v => v.active).length);
    setPagesPerMinute(Math.floor(Math.random() * 12) + 3);
    setConversionRate(Math.random() * 5 + 1);
    
    // Generate page performance data
    const performance: PagePerformance[] = pages.map(page => ({
      page,
      loadTime: Math.random() * 2 + 0.5,
      visitors: Math.floor(Math.random() * 30),
      bounceRate: Math.random() * 70 + 10,
    }));
    
    setPagePerformance(performance);
  };
  
  const updateRealTimeData = () => {
    // Update existing visitor data
    const updatedVisitors = visitorData.map(visitor => {
      // Update time on page
      const timeIncrement = Math.floor(Math.random() * 30);
      const active = Math.random() > 0.2;
      
      return {
        ...visitor,
        timeOnPage: visitor.timeOnPage + (active ? timeIncrement : 0),
        active,
      };
    });
    
    // Occasionally add new visitors
    if (Math.random() > 0.5) {
      const pages = ['/home', '/about', '/products', '/contact', '/blog', '/pricing'];
      const locations = ['United States', 'Germany', 'United Kingdom', 'Canada', 'Australia', 'France'];
      const devices = ['Desktop', 'Mobile', 'Tablet'];
      const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
      
      updatedVisitors.push({
        id: Date.now(),
        page: pages[Math.floor(Math.random() * pages.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        entryTime: new Date(),
        timeOnPage: 0,
        active: true,
      });
      
      // Keep the list at a reasonable size
      if (updatedVisitors.length > 20) {
        updatedVisitors.shift();
      }
    }
    
    setVisitorData(updatedVisitors);
    setActiveVisitors(updatedVisitors.filter(v => v.active).length);
    
    // Update pages per minute with some fluctuation
    setPagesPerMinute(prev => {
      const change = Math.random() * 4 - 2;
      const newValue = prev + change;
      return Math.max(1, Math.min(20, newValue));
    });
    
    // Update conversion rate with some fluctuation
    setConversionRate(prev => {
      const change = Math.random() * 0.8 - 0.4;
      const newValue = prev + change;
      return Math.max(0.5, Math.min(8, newValue));
    });
    
    // Update page performance
    setPagePerformance(prev => prev.map(page => ({
      ...page,
      loadTime: Math.max(0.5, Math.min(3, page.loadTime + (Math.random() * 0.4 - 0.2))),
      visitors: Math.max(0, page.visitors + Math.floor(Math.random() * 3 - 1)),
      bounceRate: Math.max(5, Math.min(95, page.bounceRate + (Math.random() * 5 - 2.5))),
    })));
  };
  
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
              <div className={`flex items-center ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.random() > 0.5 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {(Math.random() * 20).toFixed(1)}%
              </div>
              <span className="text-muted-foreground ml-2">vs. last hour</span>
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
              <div className={`flex items-center ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.random() > 0.5 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {(Math.random() * 10).toFixed(1)}%
              </div>
              <span className="text-muted-foreground ml-2">vs. last hour</span>
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
              {visitorData.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.page}</TableCell>
                  <TableCell>{visitor.location}</TableCell>
                  <TableCell>{visitor.device}</TableCell>
                  <TableCell>{visitor.browser}</TableCell>
                  <TableCell>{getRelativeTime(visitor.entryTime)}</TableCell>
                  <TableCell>{formatTime(visitor.timeOnPage)}</TableCell>
                  <TableCell>
                    <Badge variant={visitor.active ? "success" : "secondary"} className="w-min">
                      {visitor.active ? "Active" : "Idle"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
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
              {pagePerformance.map((page, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{page.page}</TableCell>
                  <TableCell>{page.loadTime.toFixed(1)}s</TableCell>
                  <TableCell>{page.visitors}</TableCell>
                  <TableCell>{page.bounceRate.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge 
                      variant={page.loadTime < 1 ? "success" : page.loadTime < 2 ? "default" : "destructive"} 
                      className="w-min"
                    >
                      {page.loadTime < 1 ? "Fast" : page.loadTime < 2 ? "OK" : "Slow"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
