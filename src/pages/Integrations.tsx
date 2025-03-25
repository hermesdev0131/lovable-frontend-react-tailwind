import React, { useState } from 'react';
import { Plus, Check, X, RefreshCw, ExternalLink, Zap, Calendar, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { integrations, formatDate } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useNavigate } from 'react-router-dom';

const Integrations = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const { addWebhook } = useMasterAccount();
  const navigate = useNavigate();
  
  const getIntegrationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'email': <Mail className="h-5 w-5" />,
      'calendar': <Calendar className="h-5 w-5" />,
      'webhook': <Zap className="h-5 w-5" />,
      'api': <ExternalLink className="h-5 w-5" />,
      'other': <Settings className="h-5 w-5" />
    };
    return icons[type] || icons.other;
  };
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, {variant: 'default' | 'secondary' | 'destructive' | 'outline', text: string}> = {
      'active': { variant: 'outline', text: 'Active' },
      'inactive': { variant: 'secondary', text: 'Inactive' },
      'error': { variant: 'destructive', text: 'Error' }
    };
    const config = variants[status] || variants.inactive;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };
  
  const handleRefresh = (id: string) => {
    toast({
      title: 'Syncing...',
      description: 'Attempting to sync integration',
    });
  };
  
  const handleZapierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a Zapier webhook URL',
        variant: 'destructive',
      });
      return;
    }
    
    if (!webhookUrl.includes('hooks.zapier.com')) {
      toast({
        title: 'Warning',
        description: 'This doesn\'t look like a Zapier webhook URL',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Webhook Saved',
      description: 'Your Zapier webhook has been connected',
    });
  };

  const handleMakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a Make.com webhook URL',
        variant: 'destructive',
      });
      return;
    }
    
    if (!webhookUrl.includes('hook.eu1.make.com') && !webhookUrl.includes('hook.make.com')) {
      toast({
        title: 'Warning',
        description: 'This doesn\'t look like a Make.com webhook URL',
        variant: 'destructive',
      });
      return;
    }
    
    addWebhook({
      name: "New Integration Webhook",
      url: webhookUrl,
      events: ["client.created"],
      active: true
    });
    
    setWebhookUrl('');
    
    toast({
      title: 'Make.com Webhook Added',
      description: 'Your Make.com webhook has been connected',
    });
  };

  const handleAdvancedSettings = () => {
    navigate('/settings', { state: { tab: 'make' } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
            <p className="text-muted-foreground">Connect your CRM with other tools</p>
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> New Integration
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {integrations.map((integration, index) => (
            <Card 
              key={integration.id} 
              className="glass-card hover:shadow-md transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getIntegrationIcon(integration.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  {integration.lastSync && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Last sync: </span>
                      <span>{formatDate(integration.lastSync)}</span>
                    </div>
                  )}
                  
                  {integration.type === 'api' && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">API Key: </span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {integration.apiKey.substring(0, 10)}...
                      </code>
                    </div>
                  )}
                  
                  {integration.webhookUrl && (
                    <div className="text-sm break-all">
                      <span className="text-muted-foreground">Webhook: </span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {integration.webhookUrl.substring(0, 30)}...
                      </code>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => handleRefresh(integration.id)}>
                  <RefreshCw className="h-4 w-4 mr-1" /> Sync Now
                </Button>
                <Button variant="ghost" size="sm">Configure</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Add New Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Zapier Integration</CardTitle>
                </div>
                <CardDescription>Connect with 3,000+ apps via Zapier</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleZapierSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://hooks.zapier.com/..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">Connect to Zapier</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Google Calendar</CardTitle>
                </div>
                <CardDescription>Sync meetings and appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your Google Calendar to automatically track meetings and set reminders.
                  </p>
                  <Button className="w-full">Connect Google Calendar</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Custom Webhook</CardTitle>
                </div>
                <CardDescription>Send data to your own endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-webhook">Webhook URL</Label>
                    <Input
                      id="custom-webhook"
                      placeholder="https://your-service.com/webhook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-desc">Description (optional)</Label>
                    <Textarea
                      id="webhook-desc"
                      placeholder="Describe what this webhook does"
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  <Button className="w-full">Create Webhook</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="glass-card hover:shadow-md transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.15s' }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Make.com</CardTitle>
                      <CardDescription>Automation platform for your CRM</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Integration: </span>
                    <span>Master Account System</span>
                  </div>
                  
                  <div className="text-sm break-all">
                    <span className="text-muted-foreground">Webhook endpoint: </span>
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      {window.location.origin}/api/webhook-test
                    </code>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={handleAdvancedSettings}>
                  <Settings className="h-4 w-4 mr-1" /> Advanced Settings
                </Button>
                <Button variant="ghost" size="sm" onClick={() => window.open("https://www.make.com/en/", "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-1" /> Open Make.com
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-card hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Make.com Integration</CardTitle>
                </div>
                <CardDescription>Automate workflows with Make.com</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMakeSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="make-webhook-url">Make.com Webhook URL</Label>
                      <Input
                        id="make-webhook-url"
                        placeholder="https://hook.eu1.make.com/..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">Connect to Make.com</Button>
                    <p className="text-xs text-muted-foreground">
                      For advanced options including event selection, go to Settings → Make.com
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
