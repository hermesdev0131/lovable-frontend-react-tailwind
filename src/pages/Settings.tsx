
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "CRM Pro",
    email: "admin@crmpro.com",
    language: "English"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    dealUpdates: true,
    contactChanges: true,
    weeklyReports: true
  });

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

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">API & Integrations</TabsTrigger>
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
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
                <Button type="submit">Save Changes</Button>
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
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access settings.
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
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>
                Manage your API keys and third-party integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="apiKey" 
                    value="sk_live_51HG6HhLmN0D4hsNkQvCzIxZfXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" 
                    disabled 
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText("sk_live_51HG6HhLmN0D4hsNkQvCzIxZfXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    toast({
                      title: "API key copied",
                      description: "The API key has been copied to clipboard."
                    });
                  }}>
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This is your secret API key. Keep it secure and never share it publicly.
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Connected Services</h3>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">Connected on Apr 12, 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Connected on Mar 8, 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                  
                  <Button className="mt-2" variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    Connect New Service
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
