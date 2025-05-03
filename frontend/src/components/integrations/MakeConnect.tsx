
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, ExternalLink, RefreshCw, Settings, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { useNavigate } from "react-router-dom";

export const MakeConnect = () => {
  const { toast } = useToast();
  const { addWebhook } = useMasterAccount();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter your Make.com webhook URL",
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
    
    // Add the webhook to the context
    addWebhook({
      name: "Make.com Integration Webhook",
      url: webhookUrl,
      events: ["client.created"],
      active: true
    });
    
    // Simulate connection process
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      
      toast({
        title: "Make.com Connected",
        description: "Your Make.com webhook has been successfully connected."
      });
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
        title: "Make.com Disconnected",
        description: "Your Make.com webhook has been disconnected."
      });
    }, 800);
  };

  const handleOpenMake = () => {
    window.open("https://www.make.com/en/", "_blank");
  };

  const handleAdvancedSettings = () => {
    navigate('/settings', { state: { tab: 'make' } });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/webhook-test`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "URL Copied",
      description: "Webhook URL has been copied to clipboard."
    });
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
              <CardTitle className="text-base">Make.com Integration</CardTitle>
              <CardDescription>Automate workflows with Make.com</CardDescription>
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
                  <p className="text-sm font-medium">Your Webhook URL</p>
                  <div className="flex items-center mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs flex-1 mr-2">
                      {window.location.origin}/api/webhook-test
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyUrl}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use this URL in your Make.com scenarios that need to receive data.
                  </p>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Integration: </span>
                  <span>Master Account System</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAdvancedSettings}
                >
                  <Settings className="h-4 w-4 mr-1" /> Advanced Settings
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleOpenMake}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Open Make.com
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
              </div>
              
              <Alert className="bg-muted mt-2">
                <AlertDescription>
                  Your Make.com integration is connected. For advanced options, go to Settings → Make.com.
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
                    You can find your webhook URL in your Make.com scenario webhook module.
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
                  For advanced options including event selection, go to Settings → Make.com after connecting.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
