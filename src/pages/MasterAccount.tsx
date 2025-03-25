import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, UserPlus, Search, ArrowUpRight, Shield, Bell, Copy, Check, Mail } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/contexts/MasterAccountContext";

const MasterAccount = () => {
  const { clients, addClient, switchToClient } = useMasterAccount();
  
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleAddClient = () => {
    if (newClientName && newClientEmail) {
      addClient({
        name: newClientName,
        email: newClientEmail,
        subscription: "Basic",
        status: "active",
        users: 1,
        deals: 0,
        contacts: 0,
        lastActivity: new Date().toISOString(),
        logo: "/placeholder.svg"
      });
      
      setNewClientName('');
      setNewClientEmail('');
    }
  };
  
  const handleAccessClient = (clientId: number) => {
    switchToClient(clientId);
    toast({
      title: "Accessing Client",
      description: "Switching to client account view..."
    });
  };
  
  const handleGenerateInviteLink = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    const uniqueCode = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/invite/${client.id}/${uniqueCode}`;
    
    setSelectedClientId(clientId);
    setInviteLink(link);
    
    toast({
      title: "Invite Link Generated",
      description: `Invite link for ${client.name} is ready to share`
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    
    toast({
      title: "Link Copied",
      description: "Invite link copied to clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSendInviteEmail = () => {
    if (!inviteEmail || !selectedClientId) {
      toast({
        title: "Error",
        description: "Please enter an email address and select a client",
        variant: "destructive"
      });
      return;
    }
    
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    
    toast({
      title: "Invite Sent",
      description: `Invitation sent to ${inviteEmail} for ${client.name}`
    });
    
    setInviteEmail('');
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };
  
  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Master Account</h1>
        <p className="text-muted-foreground">Manage all your client CRM accounts from one dashboard</p>
      </div>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="clients">Client Accounts</TabsTrigger>
          <TabsTrigger value="invites">User Invitations</TabsTrigger>
          <TabsTrigger value="settings">Master Settings</TabsTrigger>
          <TabsTrigger value="reports">Consolidated Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Card className="w-auto">
              <CardContent className="p-3 flex items-center gap-3">
                <div>
                  <Label htmlFor="newClientName">Add Client</Label>
                  <div className="flex mt-1 gap-2">
                    <Input
                      id="newClientName"
                      placeholder="Client name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-40"
                    />
                    <Input
                      id="newClientEmail"
                      placeholder="Admin email"
                      type="email"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-40"
                    />
                    <Button onClick={handleAddClient} size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4">
            {filteredClients.map(client => (
              <Card key={client.id} className="bg-white text-black dark:bg-card dark:text-card-foreground">
                <CardContent className="p-0">
                  <div className="flex items-center p-4 border-b border-border">
                    <div className="flex items-center flex-1">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={client.logo} alt={client.name} />
                        <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={client.status === 'active' ? "default" : "secondary"}>
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{client.subscription}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 p-4 bg-muted/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Users</p>
                      <p className="text-lg font-medium">{client.users}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deals</p>
                      <p className="text-lg font-medium">{client.deals}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contacts</p>
                      <p className="text-lg font-medium">{client.contacts}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Activity</p>
                      <p className="text-sm font-medium">{formatDate(client.lastActivity)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Notification Sent",
                        description: `Notification sent to ${client.name}`
                      });
                    }}>
                      <Bell className="h-4 w-4 mr-2" />
                      Notify
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Settings Access",
                        description: `Opening settings for ${client.name}`
                      });
                    }}>
                      <Shield className="h-4 w-4 mr-2" />
                      Permissions
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => handleGenerateInviteLink(client.id)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Users
                    </Button>
                  </div>
                  
                  <Button onClick={() => handleAccessClient(client.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Access Account
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredClients.length === 0 && (
              <Card className="bg-white text-black dark:bg-card dark:text-card-foreground">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground">No clients found matching "{searchQuery}"</p>
                  <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="invites">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invite Users</CardTitle>
                <CardDescription>
                  Generate invitation links to share with users or invite them directly via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Generate Invite Link</h3>
                    <div className="space-y-2">
                      <Label htmlFor="client-select">Select Client Account</Label>
                      <select
                        id="client-select"
                        className="w-full p-2 border border-input rounded"
                        value={selectedClientId || ''}
                        onChange={(e) => setSelectedClientId(Number(e.target.value) || null)}
                      >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <Button 
                      onClick={() => selectedClientId && handleGenerateInviteLink(selectedClientId)} 
                      disabled={!selectedClientId}
                    >
                      Generate Link
                    </Button>
                    
                    {inviteLink && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Invitation Link</Label>
                          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="bg-background p-2 rounded text-sm font-mono break-all">
                          {inviteLink}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          This link will expire in 7 days
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Send Invite by Email</h3>
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="invite-client-select">Client Account</Label>
                      <select
                        id="invite-client-select"
                        className="w-full p-2 border border-input rounded"
                        value={selectedClientId || ''}
                        onChange={(e) => setSelectedClientId(Number(e.target.value) || null)}
                      >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <Button 
                      onClick={handleSendInviteEmail} 
                      disabled={!inviteEmail || !selectedClientId}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Invitations</CardTitle>
                <CardDescription>Manage all pending invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No active invitations</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate an invitation link to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Master Account Settings</CardTitle>
              <CardDescription>Configure settings that apply to all client accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Master Company Name</Label>
                <Input id="company" defaultValue="CRM Solutions Agency" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Primary Admin Email</Label>
                <Input id="adminEmail" defaultValue="admin@mastercrm.com" type="email" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Global Permissions</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowClientDataAccess">Client Data Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow master account to view all client data
                    </p>
                  </div>
                  <Switch id="allowClientDataAccess" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBulkOperations">Bulk Operations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable operations across multiple client accounts
                    </p>
                  </div>
                  <Switch id="enableBulkOperations" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="clientActivityLogs">Client Activity Logs</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all master account actions in client accounts
                    </p>
                  </div>
                  <Switch id="clientActivityLogs" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Master account settings have been updated"
                });
              }}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card className="bg-white text-black dark:bg-card dark:text-card-foreground">
            <CardHeader>
              <CardTitle>Consolidated Reports</CardTitle>
              <CardDescription>View aggregated data across all client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Select report type to generate consolidated data</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Revenue Report', 'Activity Summary', 'User Engagement', 'Pipeline Analysis', 'Conversion Metrics', 'Client Health'].map((report) => (
                  <Card key={report} className="bg-white text-black dark:bg-card dark:text-card-foreground hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">{report}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Consolidated view across all client accounts</p>
                      <Button variant="outline" className="w-full" onClick={() => {
                        toast({
                          title: "Generating Report",
                          description: `Preparing ${report.toLowerCase()} for all client accounts`
                        });
                      }}>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterAccount;
