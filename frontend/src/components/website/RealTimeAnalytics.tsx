
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Clock, MousePointerClick, Smartphone, Globe, ArrowUpDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RealTimeAnalyticsProps {
  websiteId: string | null;
}

// Define a clear interface for different event types
interface BaseEvent {
  type: string;
  time: string;
  device: string;
}

interface PageViewEvent extends BaseEvent {
  type: 'pageview';
  page: string;
}

interface ClickEvent extends BaseEvent {
  type: 'click';
  element: string;
}

interface ConversionEvent extends BaseEvent {
  type: 'conversion';
  value: string;
}

// Union type for all possible events
type AnalyticsEvent = PageViewEvent | ClickEvent | ConversionEvent;

const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ websiteId }) => {
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 20) + 1);
  const [pageViews, setPageViews] = useState(Math.floor(Math.random() * 50) + 10);
  const [timeOnSite, setTimeOnSite] = useState(Math.floor(Math.random() * 300) + 60);
  const [clickRate, setClickRate] = useState(Math.random() * 10 + 1);
  const [deviceBreakdown, setDeviceBreakdown] = useState({
    mobile: Math.floor(Math.random() * 60) + 20,
    desktop: Math.floor(Math.random() * 30) + 10,
    tablet: Math.floor(Math.random() * 10) + 5,
  });
  const [bounceRate, setBounceRate] = useState(Math.floor(Math.random() * 50) + 10);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([
    { type: 'pageview', page: '/home', time: '2 seconds ago', device: 'mobile' },
    { type: 'click', element: 'Sign Up Button', time: '15 seconds ago', device: 'desktop' },
    { type: 'conversion', value: '$24.99', time: '47 seconds ago', device: 'desktop' },
  ]);
  
  // Live update simulation
  useEffect(() => {
    // Only start analytics if a page is selected
    if (!websiteId) return;
    
    toast({
      title: "Real-time tracking active",
      description: `Monitoring page ID: ${websiteId}`,
    });
    
    const interval = setInterval(() => {
      // Simulate active users fluctuation
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(1, prev + change);
      });
      
      // Simulate page view increment
      setPageViews(prev => prev + Math.floor(Math.random() * 3));
      
      // Simulate time on site changes
      setTimeOnSite(prev => {
        const change = Math.floor(Math.random() * 10) - 3; // -3 to 6
        return Math.max(30, prev + change);
      });
      
      // Generate a new event
      const eventTypes = ['pageview', 'click', 'conversion'] as const;
      const pages = ['/home', '/products', '/about', '/contact', '/blog'];
      const elements = ['Sign Up Button', 'Learn More Link', 'Add to Cart', 'Submit Form', 'Download PDF'];
      const devices = ['mobile', 'desktop', 'tablet'];
      
      const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      let newEvent: AnalyticsEvent;
      
      if (randomEventType === 'pageview') {
        newEvent = {
          type: 'pageview',
          page: pages[Math.floor(Math.random() * pages.length)],
          time: 'just now',
          device: devices[Math.floor(Math.random() * devices.length)]
        };
      } else if (randomEventType === 'click') {
        newEvent = {
          type: 'click',
          element: elements[Math.floor(Math.random() * elements.length)],
          time: 'just now',
          device: devices[Math.floor(Math.random() * devices.length)]
        };
      } else {
        newEvent = {
          type: 'conversion',
          value: `$${(Math.random() * 100).toFixed(2)}`,
          time: 'just now',
          device: devices[Math.floor(Math.random() * devices.length)]
        };
      }
      
      setRecentEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [websiteId]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  if (!websiteId) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">No Page Selected</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Select a page from the All Pages tab to start real-time tracking
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Users className="h-4 w-4" /> Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <div className="text-xs text-muted-foreground">
              Last updated just now
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Globe className="h-4 w-4" /> Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews}</div>
            <div className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 5) + 1} in last minute
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Clock className="h-4 w-4" /> Avg. Time on Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(timeOnSite)}</div>
            <div className="text-xs text-muted-foreground">
              {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 10) + 1}s from avg
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <MousePointerClick className="h-4 w-4" /> Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(1)}% from avg
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Live Events</CardTitle>
            <CardDescription>Real-time user interactions on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {recentEvents.map((event, i) => (
                  <div key={i} className="flex items-start p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="mr-2">
                      {event.type === 'pageview' && <Globe className="h-4 w-4" />}
                      {event.type === 'click' && <MousePointerClick className="h-4 w-4" />}
                      {event.type === 'conversion' && <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">$</Badge>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">
                            {event.type === 'pageview' && `Page view: ${event.page}`}
                            {event.type === 'click' && `Click: ${event.element}`}
                            {event.type === 'conversion' && `Conversion: ${event.value}`}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2 text-xs">
                              {event.device}
                            </Badge>
                            <span className="text-xs text-gray-500">{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metrics</CardTitle>
            <CardDescription>Current performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium flex items-center">
                  <Smartphone className="h-3 w-3 mr-1" /> Mobile Traffic
                </span>
                <span className="text-sm">{deviceBreakdown.mobile}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${deviceBreakdown.mobile}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Desktop Traffic</span>
                <span className="text-sm">{deviceBreakdown.desktop}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${deviceBreakdown.desktop}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Tablet Traffic</span>
                <span className="text-sm">{deviceBreakdown.tablet}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${deviceBreakdown.tablet}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium flex items-center">
                  <ArrowUpDown className="h-3 w-3 mr-1" /> Bounce Rate
                </span>
                <span className="text-sm">{bounceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${bounceRate > 50 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${bounceRate}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
