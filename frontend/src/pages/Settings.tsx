
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, ExternalLink, Plus, Trash2, Zap, Calendar, Mail, Cable, RefreshCw, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { integrations } from '@/lib/data';
import { YextConnect } from "@/components/integrations/YextConnect";
import MailchimpConnect from "@/components/email/MailchimpConnect";
import { GoogleCalendarConnect } from "@/components/integrations/GoogleCalendarConnect";
import { ZapierConnect } from "@/components/integrations/ZapierConnect";
import { CustomWebhookConnect } from "@/components/integrations/CustomWebhookConnect";
import { MakeConnect } from "@/components/integrations/MakeConnect";
import TeamMembers from "@/components/settings/TeamMembers";
import { SocialMediaConnect } from '@/components/content/SocialMediaConnect';
import { Integration } from '../hooks/useExternalIntegrations';

const SettingsPage = () => {
  const location = useLocation();
  const { webhooks, addWebhook, removeWebhook, updateWebhook, triggerWebhook, isInMasterMode } = useMasterAccount();
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "",
    email: "",
    language: "English"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    dealUpdates: true,
    contactChanges: true,
    weeklyReports: true
  });

  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: ["client.created"],
    active: true
  });
  
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const getIntegrationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'email': <Mail className="h-5 w-5" />,
      'calendar': <Calendar className="h-5 w-5" />,
      'webhook': <Zap className="h-5 w-5" />,
      'api': <ExternalLink className="h-5 w-5" />,
      'other': <Cable className="h-5 w-5" />
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

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings updated",
      description: "Your general settings have been saved successfully."
    });
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Notification preference updated",
      description: `${setting} notifications ${notificationSettings[setting] ? "disabled" : "enabled"}.`
    });
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Error",
        description: "Webhook name and URL are required",
        variant: "destructive"
      });
      return;
    }

    if (!newWebhook.url.includes("make.com")) {
      toast({
        title: "Warning",
        description: "This doesn't look like a Make.com webhook URL",
        variant: "destructive"
      });
      return;
    }

    addWebhook(newWebhook);
    setNewWebhook({
      name: "",
      url: "",
      events: ["client.created"],
      active: true
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/webhook-test`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never triggered";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          
          {isInMasterMode && (
            <>
              <TabsTrigger value="team">
                <Users className="h-4 w-4 mr-2" />
                Team
              </TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="make">Make.com</TabsTrigger>
              <TabsTrigger value="social integration">Social Media Integration</TabsTrigger>
            </>
          )}
          
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your basic account settings and preferences.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleGeneralSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input 
                    id="language"
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" onClick={() => {
                  toast({
                    title: "Settings updated",
                    description: "Your general settings have been saved successfully."
                  });
                }}>
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dealUpdates">Deal Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about deal status changes
                  </p>
                </div>
                <Switch
                  id="dealUpdates"
                  checked={notificationSettings.dealUpdates}
                  onCheckedChange={() => handleNotificationToggle('dealUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="contactChanges">Contact Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when contacts are updated
                  </p>
                </div>
                <Switch
                  id="contactChanges"
                  checked={notificationSettings.contactChanges}
                  onCheckedChange={() => handleNotificationToggle('contactChanges')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly activity summaries
                  </p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>
                Update your password to secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Password Updated",
                  description: "Your password has been changed successfully."
                });
              }}>
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <TeamMembers />
        </TabsContent>

        {isInMasterMode && (
          <>
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect and manage your external service integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Integration content only for master account */}
                  <YextConnect />
                  <GoogleCalendarConnect />
                  <ZapierConnect />
                  <CustomWebhookConnect />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="make">
              <Card>
                <CardHeader>
                  <CardTitle>Make.com Integration</CardTitle>
                  <CardDescription>
                    Configure your Make.com webhooks and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Make.com content only for master account */}
                  <MakeConnect />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social integration">
              <SocialMediaConnect />
            </TabsContent>
            
          </>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
