import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, X, Facebook, Twitter, Instagram, Linkedin, RefreshCw } from "lucide-react";
import { SocialMediaPlatform, socialMediaService } from '@/services/socialMedia';
import { useToast } from "@/hooks/use-toast";
import { useActivityTracker } from '@/hooks/useActivityTracker';

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-sky-500 hover:bg-sky-600" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600 hover:bg-pink-700" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700 hover:bg-blue-800" },
];

interface PlatformCredentialsProps {
  platformId: SocialMediaPlatform;
  name: string;
  icon: any;
  color: string;
}

const PlatformCredentials = ({ platformId, name, icon: Icon, color }: PlatformCredentialsProps) => {
  const { toast } = useToast();
  const { trackChatbotInteraction } = useActivityTracker();
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const creds = socialMediaService.getCredentials(platformId);
    if (creds) {
      setIsConnected(creds.isConnected);
      setApiKey(creds.apiKey || "");
      setApiSecret(creds.apiSecret || "");
      setAccessToken(creds.accessToken || "");
      setAccountId(creds.accountId || "");
    }
  }, [platformId]);

  const handleConnect = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      socialMediaService.setCredentials(platformId, {
        apiKey,
        apiSecret,
        accessToken,
        accountId,
        isConnected: Boolean(accessToken)
      });
      
      setIsConnected(Boolean(accessToken));
      setIsLoading(false);
      
      if (accessToken) {
        toast({
          title: "Connected Successfully",
          description: `Your ${name} account has been connected.`
        });
        
        trackChatbotInteraction(`Connected ${name} account`);
      } else {
        toast({
          title: "Connection Required",
          description: `Please enter an access token to connect your ${name} account.`,
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      socialMediaService.setCredentials(platformId, {
        accessToken: "",
        isConnected: false
      });
      
      setIsConnected(false);
      setIsLoading(false);
      
      toast({
        title: "Disconnected",
        description: `Your ${name} account has been disconnected.`
      });
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h3 className="text-lg font-medium">{name}</h3>
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
      
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor={`${platformId}-api-key`}>API Key</Label>
          <Input 
            id={`${platformId}-api-key`}
            placeholder={`Enter ${name} API Key`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading || isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${platformId}-api-secret`}>API Secret</Label>
          <Input 
            id={`${platformId}-api-secret`}
            type="password"
            placeholder={`Enter ${name} API Secret`}
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            disabled={isLoading || isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${platformId}-access-token`}>Access Token</Label>
          <Input 
            id={`${platformId}-access-token`}
            placeholder={`Enter ${name} Access Token`}
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            disabled={isLoading || isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${platformId}-account-id`}>Account/Page ID</Label>
          <Input 
            id={`${platformId}-account-id`}
            placeholder={`Enter ${name} Account/Page ID`}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={isLoading || isConnected}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          {isConnected ? (
            <Button 
              variant="destructive" 
              onClick={handleDisconnect} 
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Disconnect
            </Button>
          ) : (
            <Button 
              className={color} 
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Connect {name}
            </Button>
          )}
        </div>
      </div>
      
      {isConnected && (
        <Alert className="bg-muted mt-4">
          <AlertDescription>
            Your {name} account is connected and ready to post content.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const SocialMediaConnect = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Connections</CardTitle>
        <CardDescription>
          Connect your social media accounts to enable posting directly from the content scheduler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="facebook">
          <TabsList className="grid grid-cols-4 mb-6">
            {PLATFORMS.map((platform) => (
              <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                <platform.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{platform.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {PLATFORMS.map((platform) => (
            <TabsContent key={platform.id} value={platform.id}>
              <PlatformCredentials 
                platformId={platform.id as SocialMediaPlatform}
                name={platform.name}
                icon={platform.icon}
                color={platform.color}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
