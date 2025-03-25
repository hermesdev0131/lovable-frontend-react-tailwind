
import { useState } from "react";
import { 
  Mail, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  BarChart3,
  ExternalLink,
  Send
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface Email {
  id: string;
  subject: string;
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
  recipient: {
    name: string;
    email: string;
  };
  openRate?: number;
  clickRate?: number;
  timestamp: string;
  campaign?: string;
}

const EmailMarketing = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('mailchimpApiKey') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      subject: 'July Newsletter - Summer Special Offers',
      status: 'sent',
      recipient: {
        name: 'Marketing List',
        email: 'marketing-list@example.com',
      },
      openRate: 68,
      clickRate: 32,
      timestamp: '2023-07-15T14:30:00Z',
      campaign: 'Summer Campaign'
    },
    {
      id: '2',
      subject: 'Your Monthly Account Summary',
      status: 'sent',
      recipient: {
        name: 'All Clients',
        email: 'clients@example.com',
      },
      openRate: 81,
      clickRate: 44,
      timestamp: '2023-07-10T09:15:00Z',
      campaign: 'Monthly Updates'
    },
    {
      id: '3',
      subject: 'New Service Announcement - AI Integrations',
      status: 'sent',
      recipient: {
        name: 'Tech Clients',
        email: 'tech-clients@example.com',
      },
      openRate: 72,
      clickRate: 51,
      timestamp: '2023-07-05T16:45:00Z',
      campaign: 'Product Announcements'
    },
    {
      id: '4',
      subject: 'Exclusive Webinar Invitation - Aug 15',
      status: 'scheduled',
      recipient: {
        name: 'Premium Clients',
        email: 'premium@example.com',
      },
      timestamp: '2023-08-05T10:00:00Z',
      campaign: 'Educational Series'
    },
    {
      id: '5',
      subject: 'End of Year Strategy Planning',
      status: 'draft',
      recipient: {
        name: 'Executive Clients',
        email: 'executives@example.com',
      },
      timestamp: '2023-11-20T08:30:00Z',
      campaign: 'Strategy Series'
    },
    {
      id: '6',
      subject: 'Platform Maintenance Notice',
      status: 'failed',
      recipient: {
        name: 'All Users',
        email: 'users@example.com',
      },
      timestamp: '2023-07-02T22:15:00Z',
      campaign: 'System Notifications'
    }
  ]);
  
  const [selectedTab, setSelectedTab] = useState("monitor");
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [newCampaign, setNewCampaign] = useState({
    subject: '',
    recipientList: '',
    content: '',
    schedule: false,
    scheduledTime: ''
  });

  const handleConnectionTest = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Mailchimp API key to connect.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('mailchimpApiKey', apiKey);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to your Mailchimp account.",
      });
    }, 1500);
  };

  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Email campaign data has been refreshed.",
      });
    }, 1000);
  };

  const handleSendCampaign = () => {
    if (!newCampaign.subject || !newCampaign.recipientList || !newCampaign.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (newCampaign.schedule && !newCampaign.scheduledTime) {
      toast({
        title: "Schedule Time Required",
        description: "Please select a scheduled time for your campaign.",
        variant: "destructive"
      });
      return;
    }

    // Add the new campaign to the emails list
    const status = newCampaign.schedule ? 'scheduled' : 'sent';
    const newEmail: Email = {
      id: (emails.length + 1).toString(),
      subject: newCampaign.subject,
      status: status,
      recipient: {
        name: newCampaign.recipientList,
        email: `${newCampaign.recipientList.toLowerCase().replace(/\s+/g, '-')}@example.com`
      },
      timestamp: newCampaign.schedule ? newCampaign.scheduledTime : new Date().toISOString(),
      campaign: 'New Campaign'
    };

    setEmails([newEmail, ...emails]);
    
    // Reset form
    setNewCampaign({
      subject: '',
      recipientList: '',
      content: '',
      schedule: false,
      scheduledTime: ''
    });

    toast({
      title: status === 'scheduled' ? "Campaign Scheduled" : "Campaign Sent",
      description: status === 'scheduled' ? 
        "Your email campaign has been scheduled successfully." :
        "Your email campaign has been sent successfully."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEmails = emails
    .filter(email => 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.campaign && email.campaign.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Marketing</h1>
          <p className="text-muted-foreground">Manage and monitor your email campaigns</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2 sm:mt-0 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Connect to Mailchimp
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect to Mailchimp</DialogTitle>
              <DialogDescription>
                Enter your Mailchimp API key to connect your account. 
                Find your API key in your Mailchimp account under Account &gt; Extras &gt; API Keys.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey" 
                placeholder="Enter your Mailchimp API key" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser and is never sent to our servers.
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleConnectionTest} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs 
        defaultValue="monitor" 
        className="w-full" 
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="monitor">Monitor Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Email Campaigns</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                View and monitor all your email campaigns
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    size="sm"
                    className="flex items-center whitespace-nowrap"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Date {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />}
                  </Button>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="hidden sm:grid grid-cols-12 gap-2 p-4 bg-muted/50">
                  <div className="col-span-4 font-medium">Subject</div>
                  <div className="col-span-2 font-medium">Status</div>
                  <div className="col-span-2 font-medium">Recipients</div>
                  <div className="col-span-2 font-medium">Date</div>
                  <div className="col-span-2 font-medium text-right">Performance</div>
                </div>
                
                <div className="divide-y">
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((email) => (
                      <div key={email.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4 hover:bg-muted/50">
                        <div className="col-span-4 sm:col-span-4 font-medium flex flex-col">
                          <span>{email.subject}</span>
                          <span className="text-xs text-muted-foreground mt-1 sm:hidden">
                            Status: <Badge variant="outline" className={getStatusColor(email.status)}>{email.status}</Badge>
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {email.campaign}
                          </span>
                        </div>
                        <div className="hidden sm:flex col-span-2 items-center">
                          <Badge variant="outline" className={getStatusColor(email.status)}>{email.status}</Badge>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm">{email.recipient.name}</div>
                          <div className="text-xs text-muted-foreground">{email.recipient.email}</div>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {formatDate(email.timestamp)}
                        </div>
                        <div className="col-span-2 flex justify-end items-center">
                          {email.status === 'sent' ? (
                            <div className="flex flex-col items-end">
                              <div className="flex gap-2 items-center">
                                <User className="h-3 w-3 text-blue-500" />
                                <span className="text-sm">{email.openRate}% open</span>
                              </div>
                              <div className="flex gap-2 items-center mt-1">
                                <BarChart3 className="h-3 w-3 text-green-500" />
                                <span className="text-sm">{email.clickRate}% click</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Mail className="mx-auto h-12 w-12 text-muted-foreground/30" />
                      <h3 className="mt-4 text-lg font-medium">No campaigns found</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Try changing your search or filter, or create a new campaign.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredEmails.length} of {emails.length} campaigns
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <span>1</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="flex items-center" onClick={() => window.open("https://mailchimp.com", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Mailchimp Dashboard
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>
                Compose and send a new email campaign to your contacts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-subject">Subject Line</Label>
                <Input 
                  id="campaign-subject" 
                  placeholder="Enter a compelling subject line" 
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-recipients">Recipient List</Label>
                <Select 
                  value={newCampaign.recipientList}
                  onValueChange={(value) => setNewCampaign({...newCampaign, recipientList: value})}
                >
                  <SelectTrigger id="campaign-recipients">
                    <SelectValue placeholder="Select a recipient list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Clients">All Clients (1,267 subscribers)</SelectItem>
                    <SelectItem value="Newsletter Subscribers">Newsletter Subscribers (856 subscribers)</SelectItem>
                    <SelectItem value="New Customers">New Customers (124 subscribers)</SelectItem>
                    <SelectItem value="Premium Clients">Premium Clients (78 subscribers)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-content">Email Content</Label>
                <div className="border rounded-md p-4 bg-muted/30 text-center h-[200px] flex items-center justify-center">
                  <div className="text-muted-foreground">
                    <Mail className="h-8 w-8 mx-auto mb-2" />
                    <p>Email content editor would be integrated here.</p>
                    <p className="text-sm mt-2">Use Mailchimp's editor for full design capabilities.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="schedule" 
                  checked={newCampaign.schedule}
                  onCheckedChange={(checked) => setNewCampaign({...newCampaign, schedule: checked})}
                />
                <Label htmlFor="schedule">Schedule for later</Label>
              </div>
              
              {newCampaign.schedule && (
                <div className="space-y-2">
                  <Label htmlFor="scheduled-time">Schedule Date and Time</Label>
                  <Input 
                    id="scheduled-time" 
                    type="datetime-local" 
                    value={newCampaign.scheduledTime}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduledTime: e.target.value})}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={handleSendCampaign} className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                {newCampaign.schedule ? 'Schedule' : 'Send Now'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailMarketing;
