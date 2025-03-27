
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Clock, 
  Mail, 
  PlusCircle, 
  Send, 
  X, 
  AlertCircle, 
  Calendar, 
  Users,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { ContentItem } from '@/types/content';

const EmailMarketing = () => {
  const [selectedTab, setSelectedTab] = useState('campaigns');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [isMailchimpDialogOpen, setIsMailchimpDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mailchimpApiKey, setMailchimpApiKey] = useState('');
  const [isMailchimpConnected, setIsMailchimpConnected] = useState(false);
  const [newEmail, setNewEmail] = useState({
    title: '',
    subject: '',
    content: '',
    audience: 'all'
  });
  
  const { 
    currentClientId, 
    isInMasterMode, 
    getContentItems, 
    addContentItem, 
    updateContentStatus 
  } = useMasterAccount();
  
  const emailContentItems = getContentItems()
    .filter(item => item.type === 'email');
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleSubmitEmail = () => {
    if (!newEmail.title.trim() || !newEmail.subject.trim() || !newEmail.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addContentItem({
      title: newEmail.title,
      content: `Subject: ${newEmail.subject}\n\n${newEmail.content}`,
      type: 'email',
      status: 'pending',
      scheduledFor: new Date(Date.now() + 86400000).toISOString() // Schedule for tomorrow
    });
    
    setNewEmail({
      title: '',
      subject: '',
      content: '',
      audience: 'all'
    });
    
    setIsComposeDialogOpen(false);
  };
  
  const handleApprove = (contentId: number) => {
    updateContentStatus(contentId, 'approved');
  };
  
  const openRejectDialog = (contentId: number) => {
    setSelectedContentId(contentId);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };
  
  const handleReject = () => {
    if (selectedContentId) {
      updateContentStatus(selectedContentId, 'rejected', rejectReason);
      setIsRejectDialogOpen(false);
      setSelectedContentId(null);
    }
  };
  
  const handleConnectToMailchimp = () => {
    setIsMailchimpDialogOpen(true);
  };

  const handleMailchimpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mailchimpApiKey) {
      toast({
        title: "Missing API Key",
        description: "Please enter your Mailchimp API key",
        variant: "destructive"
      });
      return;
    }
    
    setIsConnecting(true);
    
    setTimeout(() => {
      setIsConnecting(false);
      setIsMailchimpConnected(true);
      setIsMailchimpDialogOpen(false);
      
      toast({
        title: "Connected to Mailchimp",
        description: "Your Mailchimp account has been successfully connected",
      });
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Marketing</h1>
        <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Compose Email
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Email Campaign</DialogTitle>
              <DialogDescription>
                Create a new email to be sent to your audience
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Campaign Name</Label>
                <Input 
                  id="title" 
                  value={newEmail.title}
                  onChange={(e) => setNewEmail({...newEmail, title: e.target.value})}
                  placeholder="Summer Newsletter"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input 
                  id="subject"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                  placeholder="Check out our summer deals!"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audience">Audience</Label>
                <Select 
                  value={newEmail.audience}
                  onValueChange={(value) => setNewEmail({...newEmail, audience: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers</SelectItem>
                    <SelectItem value="active">Active Customers</SelectItem>
                    <SelectItem value="inactive">Inactive Customers</SelectItem>
                    <SelectItem value="leads">New Leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea 
                  id="content"
                  value={newEmail.content}
                  onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                  placeholder="Write your email content here..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEmail}>
                Submit for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts & Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>View and manage your active email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Here you can see a list of all your active email campaigns, their status, and key metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Emails</CardTitle>
              <CardDescription>Manage your scheduled email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Here you can see a list of all your scheduled email campaigns and their scheduled send times.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Content Approval</CardTitle>
              <CardDescription>
                Manage email content that needs approval or is awaiting to be sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailContentItems.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No email content found
                </div>
              ) : (
                <div className="space-y-4">
                  {emailContentItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">{item.title}</h3>
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {item.content}
                            </p>
                            
                            {item.status === 'rejected' && item.rejectionReason && (
                              <div className="mt-2 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md text-sm">
                                <div className="font-medium flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Rejection Reason:
                                </div>
                                <p>{item.rejectionReason}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                              <Clock className="h-3 w-3" />
                              <span>Created: {format(new Date(item.createdAt), "PPP")}</span>
                              
                              {item.scheduledFor && (
                                <>
                                  <span className="mx-2">•</span>
                                  <Calendar className="h-3 w-3" />
                                  <span>Scheduled: {format(new Date(item.scheduledFor), "PPP")}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {item.status === 'pending' && isInMasterMode && (
                            <div className="flex items-start gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                onClick={() => handleApprove(item.id)}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => openRejectDialog(item.id)}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {item.status === 'approved' && isInMasterMode && (
                            <Button variant="outline" size="sm" className="text-blue-600">
                              <Send className="h-4 w-4 mr-1" />
                              Send Now
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Track the performance of your email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Here you can see detailed analytics for your email campaigns, including open rates, click-through rates, and conversions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this content.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Reject Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMailchimpDialogOpen} onOpenChange={setIsMailchimpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Mailchimp</DialogTitle>
            <DialogDescription>
              Enter your Mailchimp API key to connect your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMailchimpSubmit}>
            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="mailchimp-api-key">Mailchimp API Key</Label>
                <Input
                  id="mailchimp-api-key"
                  placeholder="Enter your Mailchimp API key..."
                  value={mailchimpApiKey}
                  onChange={(e) => setMailchimpApiKey(e.target.value)}
                  type="password"
                />
                <p className="text-xs text-muted-foreground">
                  You can find your API key in your Mailchimp account under Account &gt; Extras &gt; API keys
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMailchimpDialogOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect to Mailchimp"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Mailchimp Integration Settings</h2>
        <Card>
          <CardHeader>
            <CardTitle>Connect to Mailchimp</CardTitle>
            <CardDescription>
              Integrate your Mailchimp account to sync your email lists and automate your email marketing campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMailchimpConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <p className="font-medium">Connected to Mailchimp</p>
                </div>
                <p className="text-muted-foreground">
                  Your Mailchimp account is successfully integrated. You can now sync your email lists and send campaigns directly from this CRM.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsMailchimpConnected(false)}>
                    Disconnect
                  </Button>
                  <Button variant="outline">
                    Sync Lists
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Connect your Mailchimp account to import your email lists and automate your email marketing campaigns.
                </p>
                <Button onClick={handleConnectToMailchimp}>Connect to Mailchimp</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailMarketing;
