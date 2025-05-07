
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/hooks/useMasterAccount";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MailchimpConnect from "@/components/email/MailchimpConnect";
import { 
  isMailchimpConnected,
  createCampaign,
  scheduleCampaign,
  getCampaigns,
  MailchimpCampaign
} from '@/services/mailchimp';

const EmailMarketing = () => {
  // State for email creation
  const [newEmail, setNewEmail] = useState({
    title: "",
    content: "",
    scheduledFor: undefined as Date | undefined,
  });
  
  // State for Mailchimp
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [mailchimpCampaigns, setMailchimpCampaigns] = useState<MailchimpCampaign[]>([]);
  const [activeTab, setActiveTab] = useState('create');
  
  // Master account context and toast
  const { addContentItem, getContentItems, currentClientId } = useMasterAccount();
  const { toast } = useToast();
  const [emails, setEmails] = useState(getContentItems(currentClientId, 'email'));

  useEffect(() => {
    setEmails(getContentItems(currentClientId, 'email'));
  }, [currentClientId, getContentItems]);

  useEffect(() => {
    if (isMailchimpConnected() && activeTab === 'mailchimp') {
      fetchMailchimpCampaigns();
    }
  }, [activeTab]);

  const fetchMailchimpCampaigns = async () => {
    if (!isMailchimpConnected()) return;
    
    setIsLoadingCampaigns(true);
    try {
      const campaigns = await getCampaigns();
      setMailchimpCampaigns(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
  };
  const handleDateChange = (date: Date | undefined) => {
    setNewEmail({ ...newEmail, scheduledFor: date });
  };

  const handleCreateEmail = async () => {
    if (!newEmail.title || !newEmail.content || !newEmail.scheduledFor) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and select a date",
        variant: "destructive"
      });
      return;
    }
    
    // If Mailchimp is connected, create a campaign there
    if (isMailchimpConnected()) {
      setIsLoading(true);
      try {
        const campaignId = await createCampaign(newEmail.title, newEmail.content);
        
        if (campaignId) {
          const scheduled = await scheduleCampaign(campaignId, newEmail.scheduledFor);
          
          if (scheduled) {
            toast({
              title: "Campaign Scheduled in Mailchimp",
              description: `${newEmail.title} has been scheduled in Mailchimp.`
            });
            
            // Refresh campaigns list
            fetchMailchimpCampaigns();
          }
        }
      } catch (error) {
        console.error('Error creating Mailchimp campaign:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Also add to local storage
    addContentItem({
      title: newEmail.title,
      content: newEmail.content,
      type: "email",
      createdBy: currentClientId || 0,
      scheduledFor: newEmail.scheduledFor.toISOString(),
      clientId: currentClientId,
    });
    
    setNewEmail({ title: "", content: "", scheduledFor: undefined });
    toast({
      title: "Email Scheduled",
      description: `${newEmail.title} has been scheduled successfully.`
    });
  };

  const getCampaignStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'outline', text: string }> = {
      'sent': { variant: 'default', text: 'Sent' },
      'scheduled': { variant: 'outline', text: 'Scheduled' },
      'sending': { variant: 'secondary', text: 'Sending' },
      'save': { variant: 'secondary', text: 'Draft' },
      'paused': { variant: 'secondary', text: 'Paused' },
    };
    
    return statusMap[status] || { variant: 'secondary', text: status };
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Email Marketing</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create Email</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Emails</TabsTrigger>
          <TabsTrigger value="mailchimp">Mailchimp</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Email</CardTitle>
              <CardDescription>Create and schedule a new email campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Email Title</Label>
                  <Input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="Enter email title"
                    value={newEmail.title} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledFor">Schedule Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEmail.scheduledFor && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEmail.scheduledFor ? (
                          format(newEmail.scheduledFor, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newEmail.scheduledFor}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter email content"
                  value={newEmail.content}
                  onChange={handleInputChange}
                  className="min-h-32 resize-none"
                />
              </div>
              <Button 
                onClick={handleCreateEmail} 
                disabled={isLoading}
                className="mt-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Schedule Email
              </Button>
              
              {isMailchimpConnected() && (
                <p className="text-xs text-muted-foreground">
                  Your email will be scheduled both locally and in Mailchimp.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Scheduled Emails</CardTitle>
                <CardDescription>View all scheduled email campaigns</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {emails.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No emails have been scheduled yet</p>
                  <Button variant="outline" onClick={() => setActiveTab('create')}>
                    Schedule Your First Email
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableCaption>A list of your scheduled email campaigns.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Scheduled For</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell className="font-medium">{email.title}</TableCell>
                        <TableCell>{email.scheduledFor ? format(new Date(email.scheduledFor), "PPP") : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Scheduled</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mailchimp" className="space-y-6">
          <MailchimpConnect />
          
          {isMailchimpConnected() && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mailchimp Campaigns</CardTitle>
                  <CardDescription>View your Mailchimp campaigns</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchMailchimpCampaigns} disabled={isLoadingCampaigns}>
                  {isLoadingCampaigns ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingCampaigns ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : mailchimpCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No campaigns found in your Mailchimp account</p>
                    <Button variant="outline" onClick={() => setActiveTab('create')}>
                      Create Your First Campaign
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Your Mailchimp campaigns</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mailchimpCampaigns.map((campaign) => {
                        const { variant, text } = getCampaignStatusBadge(campaign.status);
                        return (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.settings.title || campaign.settings.subject_line}</TableCell>
                            <TableCell>{format(new Date(campaign.create_time), "PPP")}</TableCell>
                            <TableCell>
                              <Badge variant={variant}>{text}</Badge>
                            </TableCell>
                            <TableCell>
                              {campaign.archive_url && (
                                <Button variant="ghost" size="sm" onClick={() => window.open(campaign.archive_url, '_blank')}>
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View Campaign</span>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                These campaigns are synced from your Mailchimp account.
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailMarketing;
