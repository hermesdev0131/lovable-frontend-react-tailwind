
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CustomWebhookConnect = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your webhook URL",
        variant: "destructive"
      });
      return;
    }

    if (!webhookUrl.startsWith('http')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid webhook URL",
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
        title: "Webhook Connected",
        description: "Your custom webhook has been successfully connected."
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
        title: "Webhook Disconnected",
        description: "Your custom webhook has been disconnected."
      });
    }, 800);
  };

  const handleTest = () => {
    setIsLoading(true);
    
    // Simulate test trigger
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Test Successful",
        description: "A test event has been sent to your webhook."
      });
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <ExternalLink className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Custom Webhook</CardTitle>
              <CardDescription>Send data to your own endpoints</CardDescription>
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
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Webhook URL: </span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {webhookUrl}
                  </code>
                </div>
                
                {description && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Description: </span>
                    <span>{description}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleTest} 
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Test Webhook
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
                  Your custom webhook is connected. Events will be automatically sent to this endpoint.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="custom-webhook-url">Webhook URL</Label>
                  <Input 
                    id="custom-webhook-url"
                    placeholder="https://your-service.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="webhook-desc">Description (optional)</Label>
                  <Textarea
                    id="webhook-desc"
                    placeholder="Describe what this webhook does"
                    className="min-h-[80px] resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleConnect}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Webhook
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
