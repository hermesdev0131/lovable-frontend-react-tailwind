
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, RefreshCw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ZapierConnect = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive"
      });
      return;
    }

    if (!webhookUrl.includes('hooks.zapier.com')) {
      toast({
        title: "Invalid URL",
        description: "This doesn't look like a Zapier webhook URL",
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
        title: "Zapier Connected",
        description: "Your Zapier webhook has been successfully connected."
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    
    // Simulate disconnection process
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(false);
      setWebhookUrl("");
      
      toast({
        title: "Zapier Disconnected",
        description: "Your Zapier webhook has been disconnected."
      });
    }, 800);
  };

  const handleOpenZapier = () => {
    window.open("https://zapier.com/app/dashboard", "_blank");
  };

  const handleTriggerTest = () => {
    setIsLoading(true);
    
    // Simulate webhook trigger
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Webhook Triggered",
        description: "A test event has been sent to your Zapier webhook."
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Zapier Integration</CardTitle>
              <CardDescription>Connect with 3,000+ apps via Zapier</CardDescription>
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
              <div className="text-sm mb-4">
                <span className="text-muted-foreground">Webhook URL: </span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {webhookUrl.substring(0, 30)}...
                </code>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleTriggerTest} 
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  Test Webhook
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleOpenZapier}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Zapier
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
                  Your Zapier webhook is connected. Events will be automatically sent to your Zap.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="zapier-webhook-url">Zapier Webhook URL</Label>
                  <Input 
                    id="zapier-webhook-url"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find your webhook URL in your Zapier webhook trigger setup.
                  </p>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleConnect}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Connect to Zapier
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-muted mt-2">
                <AlertDescription>
                  Connect your Zapier webhook to integrate with thousands of applications.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
