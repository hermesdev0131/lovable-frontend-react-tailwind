
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, ExternalLink, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export const GoogleCalendarConnect = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar account has been successfully connected."
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    
    // Simulate disconnection process
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(false);
      
      toast({
        title: "Google Calendar Disconnected",
        description: "Your Google Calendar has been disconnected."
      });
    }, 800);
  };

  const handleOpenGoogleCalendar = () => {
    window.open("https://calendar.google.com/", "_blank");
  };

  const handleSync = () => {
    setIsLoading(true);
    
    // Simulate syncing process
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Calendar Synced",
        description: "Your calendar has been synchronized."
      });
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Google Calendar</CardTitle>
              <CardDescription>Synchronize your appointments and meetings</CardDescription>
            </div>
          </div>
          
          {isConnected ? (
            <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
              <Check className="h-3 w-3" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConnected ? (
            <>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSync} 
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Sync Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleOpenGoogleCalendar}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Calendar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect} 
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
              </div>
              
              <Alert className="bg-muted mt-2">
                <AlertDescription>
                  Your Google Calendar is connected. Events will be automatically synchronized.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Connect your Google Calendar to automatically sync appointments and meetings.
              </p>
              
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Connect Google Calendar
                </Button>
              </div>
              
              <Alert className="bg-muted mt-2">
                <AlertDescription>
                  You'll be redirected to Google to authorize this application.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
