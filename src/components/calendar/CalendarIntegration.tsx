
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Calendar, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CalendarIntegrationProps {
  onSync: () => void;
  onClose: () => void;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ onSync, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("google");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { toast } = useToast();

  const handleConnect = (type: string) => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      toast({
        title: `${type === 'google' ? 'Google Calendar' : 'Outlook Calendar'} Connected`,
        description: "Your calendar has been successfully connected",
      });
      
      onSync();
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Calendar Disconnected",
      description: "Your calendar integration has been removed",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Calendar Integration</CardTitle>
        <CardDescription>
          Connect with Google Calendar or Outlook to sync your events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Your {activeTab === 'google' ? 'Google Calendar' : 'Outlook Calendar'} is connected and syncing.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
              <div>
                <h4 className="font-medium text-sm">Last synced</h4>
                <p className="text-sm text-muted-foreground">Just now</p>
              </div>
              <Button variant="outline" size="sm" onClick={onSync}>
                <RefreshCw className="h-4 w-4 mr-1" /> Sync Now
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="google" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="google">Google Calendar</TabsTrigger>
              <TabsTrigger value="outlook">Outlook</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-muted-foreground">Sync events with your Google Calendar</p>
                </div>
              </div>
              
              <Alert variant="destructive" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  You'll be redirected to Google to authorize this application.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="outlook" className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Outlook Calendar</h3>
                  <p className="text-sm text-muted-foreground">Sync events with your Outlook Calendar</p>
                </div>
              </div>
              
              <Alert variant="destructive" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  You'll be redirected to Microsoft to authorize this application.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConnected ? (
          <>
            <Button variant="ghost" onClick={handleDisconnect}>Disconnect</Button>
            <Button onClick={onClose}>Close</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={() => handleConnect(activeTab)} 
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect</>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CalendarIntegration;
