
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  storeMailchimpCredentials, 
  getMailchimpCredentials, 
  clearMailchimpCredentials,
  testMailchimpConnection,
  validateApiKeyFormat,
  extractServerFromApiKey
} from "@/services/mailchimp";

const MailchimpConnect = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(() => !!getMailchimpCredentials());
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Mailchimp API key",
        variant: "destructive"
      });
      return;
    }

    if (!validateApiKeyFormat(apiKey)) {
      toast({
        title: "Invalid API Key Format",
        description: "The API key format is invalid. It should be in the format: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('testing');
    
    try {
      const server = extractServerFromApiKey(apiKey);
      const credentials = { apiKey, server };
      
      const isValid = await testMailchimpConnection(credentials);
      
      if (isValid) {
        storeMailchimpCredentials(credentials);
        setIsConnected(true);
        setConnectionStatus('success');
        toast({
          title: "Mailchimp Connected",
          description: "Your Mailchimp account has been successfully connected."
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: "Could not connect to Mailchimp. Please check your API key.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Mailchimp connection error:", error);
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to Mailchimp.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    clearMailchimpCredentials();
    setIsConnected(false);
    setApiKey("");
    setConnectionStatus('idle');
    toast({
      title: "Mailchimp Disconnected",
      description: "Your Mailchimp account has been disconnected."
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Mailchimp Integration</CardTitle>
            <CardDescription>Connect to your Mailchimp account to send marketing emails</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
              <Check className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium">Connected to Mailchimp</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your Mailchimp account is connected. You can now create and schedule email campaigns.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Mailchimp API key"
                    className="pr-8"
                  />
                  {connectionStatus !== 'idle' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getStatusIcon()}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You can find your API key in your Mailchimp account under Account → Extras → API keys.
              </p>
            </div>

            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || !apiKey.trim()}
              className="w-full"
            >
              {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect to Mailchimp
            </Button>
          </div>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Need to reconnect? You can disconnect and connect again.
          </p>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MailchimpConnect;
