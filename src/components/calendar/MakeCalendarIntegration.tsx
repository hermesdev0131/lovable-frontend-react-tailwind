
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Link, RefreshCw, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export interface MakeCalendarIntegrationProps {
  onIntegrationChange?: (isConnected: boolean) => void;
}

const MakeCalendarIntegration: React.FC<MakeCalendarIntegrationProps> = ({ 
  onIntegrationChange 
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleConnect = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your Make.com webhook URL for calendar integration",
        variant: "destructive"
      });
      return;
    }

    if (!webhookUrl.includes('hook.eu1.make.com') && !webhookUrl.includes('hook.make.com')) {
      toast({
        title: "Invalid URL",
        description: "This doesn't look like a Make.com webhook URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      
      toast({
        title: "Make.com Calendar Integration Connected",
        description: "Your calendar events will now sync with Make.com"
      });
      
      if (onIntegrationChange) {
        onIntegrationChange(true);
      }
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    
    // Simulate disconnection process
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(false);
      setWebhookUrl("");
      
      toast({
        title: "Make.com Calendar Integration Disconnected",
        description: "Your calendar events will no longer sync with Make.com"
      });
      
      if (onIntegrationChange) {
        onIntegrationChange(false);
      }
    }, 800);
  };

  const handleTriggerSync = () => {
    setIsLoading(true);
    
    // Simulate sync process
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Calendar Events Synced",
        description: "Your calendar events have been sent to Make.com"
      });
    }, 1200);
  };

  const handleOpenMake = () => {
    window.open("https://www.make.com/en/", "_blank");
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
              <CardTitle className="text-base">Make.com Calendar Integration</CardTitle>
              <CardDescription>Sync calendar events with your Make.com scenarios</CardDescription>
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
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Make.com Webhook URL</p>
                  <div className="flex items-center mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs flex-1 mr-2 truncate">
                      {webhookUrl}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Calendar events will be automatically sent to this webhook.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTriggerSync}
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Sync Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenMake}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Make.com
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDisconnect} 
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
              </div>
              
              <Alert className="bg-muted mt-2">
                <AlertDescription>
                  When calendar events are created, updated, or deleted, they will be sent to Make.com.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="make-webhook-url">Make.com Webhook URL</Label>
                  <Input 
                    id="make-webhook-url"
                    placeholder="https://hook.eu1.make.com/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a webhook in Make.com to receive calendar event data from this application.
                  </p>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleConnect}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Connect to Make.com
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-muted mt-4">
                <AlertDescription>
                  <Link className="h-4 w-4 mr-1 inline" />
                  <span className="align-middle">Need help? </span>
                  <a 
                    href="https://www.make.com/en/help/tools/webhooks" 
                    target="_blank" 
                    rel="noreferrer"
                    className="underline"
                  >
                    Learn how to set up Make.com webhooks
                  </a>
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MakeCalendarIntegration;
