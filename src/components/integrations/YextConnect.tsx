
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, RefreshCw, ExternalLink } from "lucide-react";
import { YextCredentials, getYextCredentials, storeYextCredentials, testYextConnection, clearYextCredentials } from '@/services/yext';
import { useToast } from "@/hooks/use-toast";

export const YextConnect = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    // Load existing credentials
    const creds = getYextCredentials();
    if (creds) {
      setIsConnected(true);
      setApiKey(creds.apiKey || "");
      setBusinessId(creds.businessId || "");
      setLastSynced(localStorage.getItem('yextLastSynced'));
    }
  }, []);

  const handleConnect = async () => {
    if (!apiKey || !businessId) {
      toast({
        title: "Missing Information",
        description: "Please enter your Yext API Key and Business ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const credentials: YextCredentials = {
      apiKey,
      businessId
    };

    try {
      const isValid = await testYextConnection(credentials);
      
      if (isValid) {
        storeYextCredentials(credentials);
        
        const now = new Date().toISOString();
        localStorage.setItem('yextLastSynced', now);
        setLastSynced(now);
        
        setIsConnected(true);
        toast({
          title: "Connected Successfully",
          description: "Your Yext account has been connected."
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Yext with the provided credentials.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error connecting to Yext:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to Yext.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    
    // Simulate disconnection process
    setTimeout(() => {
      clearYextCredentials();
      localStorage.removeItem('yextLastSynced');
      
      setIsConnected(false);
      setLastSynced(null);
      setIsLoading(false);
      
      toast({
        title: "Disconnected",
        description: "Your Yext account has been disconnected."
      });
    }, 500);
  };

  const handleSync = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    
    const creds = getYextCredentials();
    if (!creds) {
      setIsLoading(false);
      return;
    }
    
    try {
      const isValid = await testYextConnection(creds);
      
      if (isValid) {
        const now = new Date().toISOString();
        localStorage.setItem('yextLastSynced', now);
        setLastSynced(now);
        
        toast({
          title: "Sync Completed",
          description: "Your Yext data has been synchronized."
        });
      } else {
        toast({
          title: "Sync Failed",
          description: "Could not connect to Yext. Please check your credentials.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing with Yext:", error);
      toast({
        title: "Sync Error",
        description: "An error occurred while syncing with Yext.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Yext Integration</CardTitle>
              <CardDescription>Connect to Yext to manage reviews and reputation</CardDescription>
            </div>
          </div>
          
          {isConnected ? (
            <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
              <Check className="h-3 w-3" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
              <X className="h-3 w-3" /> Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConnected ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Key</p>
                  <p className="text-sm text-muted-foreground">
                    ••••••••••{apiKey.substring(apiKey.length - 4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Business ID</p>
                  <p className="text-sm text-muted-foreground">{businessId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Synced</p>
                  <p className="text-sm text-muted-foreground">{formatDate(lastSynced)}</p>
                </div>
              </div>
              
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
                  onClick={() => window.open("https://www.yext.com/", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Yext
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect} 
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Disconnect
                </Button>
              </div>
              
              <Alert className="bg-muted mt-4">
                <AlertDescription>
                  Your Yext account is connected. You can manage reviews and reputation from the Reputation page.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="yext-api-key">API Key</Label>
                  <Input 
                    id="yext-api-key"
                    placeholder="Enter Yext API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="yext-business-id">Business ID</Label>
                  <Input 
                    id="yext-business-id"
                    placeholder="Enter Yext Business ID"
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleConnect}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Connect Yext
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-muted mt-4">
                <AlertDescription>
                  Connect your Yext account to manage your online reviews and reputation.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
