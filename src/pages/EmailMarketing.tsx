import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { toast } from '@/hooks/use-toast';
import { Check, Send, Trash, Edit, Eye } from 'lucide-react';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  category: string;
}

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate: number;
  clickRate: number;
  sentAt?: string;
  scheduledFor?: string;
}

const EmailMarketing = () => {
  const { currentClientId, getContentItems, addContentItem, updateContentStatus } = useMasterAccount();
  
  // Templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    { id: 1, name: 'Welcome Email', subject: 'Welcome to our service!', content: 'Thank you for signing up...', category: 'Onboarding' },
    { id: 2, name: 'Monthly Newsletter', subject: 'Your Monthly Update', content: 'Here are the latest updates...', category: 'Newsletter' },
    { id: 3, name: 'Abandoned Cart', subject: 'You left something behind', content: 'We noticed you left items in your cart...', category: 'Sales' },
  ]);
  
  // Campaigns state
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    { 
      id: 1, 
      name: 'January Newsletter', 
      subject: 'January Updates', 
      content: 'Here are our January updates...', 
      status: 'sent', 
      recipients: 1250, 
      openRate: 32, 
      clickRate: 8, 
      sentAt: '2023-01-15T10:00:00Z' 
    },
    { 
      id: 2, 
      name: 'February Newsletter', 
      subject: 'February Updates', 
      content: 'Here are our February updates...', 
      status: 'scheduled', 
      recipients: 1300, 
      openRate: 0, 
      clickRate: 0, 
      scheduledFor: '2023-02-15T10:00:00Z' 
    },
    { 
      id: 3, 
      name: 'Product Launch', 
      subject: 'Introducing our new product!', 
      content: 'We are excited to announce...', 
      status: 'draft', 
      recipients: 0, 
      openRate: 0, 
      clickRate: 0 
    },
  ]);
  
  // New email state
  const [newEmail, setNewEmail] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: '',
    scheduledFor: ''
  });
  
  // Selected template for new email
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Email preview state
  const [previewEmail, setPreviewEmail] = useState<EmailCampaign | null>(null);
  
  // Load email content from templates when selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === parseInt(selectedTemplate));
      if (template) {
        setNewEmail(prev => ({
          ...prev,
          subject: template.subject,
          content: template.content
        }));
      }
    }
  }, [selectedTemplate, templates]);
  
  // Handle input changes for new email
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEmail(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Check if email can be sent
  const canSendEmail = () => {
    return (
      newEmail.name.trim() !== '' &&
      newEmail.subject.trim() !== '' &&
      newEmail.content.trim() !== '' &&
      newEmail.recipients.trim() !== ''
    );
  };
  
  // Handle sending email
  const handleSendEmail = () => {
    if (!canSendEmail()) return;
    
    const newCampaign: EmailCampaign = {
      id: Date.now(),
      name: newEmail.name,
      subject: newEmail.subject,
      content: newEmail.content,
      status: newEmail.scheduledFor ? 'scheduled' : 'sent',
      recipients: parseInt(newEmail.recipients) || 0,
      openRate: 0,
      clickRate: 0,
      sentAt: newEmail.scheduledFor ? undefined : new Date().toISOString(),
      scheduledFor: newEmail.scheduledFor || undefined
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    
    // Add to content items
    addContentItem({
      title: newEmail.subject,
      content: newEmail.content,
      type: 'email',
      status: newEmail.scheduledFor ? 'scheduled' : 'published',
      createdBy: 'user',
      clientId: currentClientId,
      scheduledFor: newEmail.scheduledFor || undefined
    });
    
    // Reset form
    setNewEmail({
      name: '',
      subject: '',
      content: '',
      recipients: '',
      scheduledFor: ''
    });
    setSelectedTemplate('');
    
    toast({
      title: newEmail.scheduledFor ? "Email Scheduled" : "Email Sent",
      description: newEmail.scheduledFor 
        ? `Your email has been scheduled for ${new Date(newEmail.scheduledFor).toLocaleString()}`
        : "Your email has been sent successfully"
    });
  };
  
  // Handle deleting a campaign
  const handleDeleteCampaign = (id: number) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    toast({
      title: "Campaign Deleted",
      description: "The email campaign has been deleted"
    });
  };
  
  // Handle sending a draft campaign
  const handleSendCampaign = (email: EmailCampaign) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === email.id 
          ? { ...campaign, status: 'sent', sentAt: new Date().toISOString() } 
          : campaign
      )
    );
    
    updateContentStatus(email.id, 'published');
    
    toast({
      title: "Campaign Sent",
      description: "The email campaign has been sent successfully"
    });
  };
  
  // Handle viewing email preview
  const handlePreviewEmail = (email: EmailCampaign) => {
    setPreviewEmail(email);
  };
  
  // Close preview
  const closePreview = () => {
    setPreviewEmail(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Email Marketing</h1>
        
        <Tabs defaultValue="campaigns">
          <TabsList className="mb-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="create">Create Email</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaigns</CardTitle>
                <CardDescription>Manage your email marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead>Click Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map(campaign => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.subject}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            campaign.status === 'sent' 
                              ? 'bg-green-100 text-green-800' 
                              : campaign.status === 'scheduled' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{campaign.recipients}</TableCell>
                        <TableCell>{campaign.openRate}%</TableCell>
                        <TableCell>{campaign.clickRate}%</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handlePreviewEmail(campaign)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {campaign.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSendCampaign(campaign)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCampaign(campaign.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Create Email Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Email</CardTitle>
                <CardDescription>Compose a new email campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newEmail.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter campaign name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Use Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={newEmail.subject} 
                    onChange={handleInputChange} 
                    placeholder="Enter email subject" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={newEmail.content} 
                    onChange={handleInputChange} 
                    placeholder="Compose your email content" 
                    rows={10} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Number of Recipients</Label>
                    <Input 
                      id="recipients" 
                      name="recipients" 
                      type="number" 
                      value={newEmail.recipients} 
                      onChange={handleInputChange} 
                      placeholder="Enter number of recipients" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                    <Input 
                      id="scheduledFor" 
                      name="scheduledFor" 
                      type="datetime-local" 
                      value={newEmail.scheduledFor} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <Button 
                  variant="default"
                  className="ml-4"
                  onClick={handleSendEmail}
                  disabled={!canSendEmail()}
                >
                  Send Email
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Manage your reusable email templates</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map(template => (
                      <TableRow key={template.id}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.subject}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Add New Template</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Email Analytics</CardTitle>
                <CardDescription>Track the performance of your email campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">32%</div>
                        <p className="text-sm text-muted-foreground">Average Open Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">8%</div>
                        <p className="text-sm text-muted-foreground">Average Click Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">2.5%</div>
                        <p className="text-sm text-muted-foreground">Average Conversion Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="h-[300px] border rounded-md p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Email performance chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Email Preview Modal */}
        {previewEmail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Email Preview</h2>
                  <Button variant="ghost" onClick={closePreview}>×</Button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">From: Your Company &lt;noreply@yourcompany.com&gt;</p>
                  <p className="text-sm text-muted-foreground">To: Recipients</p>
                  <p className="text-sm text-muted-foreground">Subject: {previewEmail.subject}</p>
                </div>
                <div className="border rounded-md p-4 min-h-[200px]">
                  {previewEmail.content}
                </div>
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button variant="outline" onClick={closePreview}>Close</Button>
                {previewEmail.status === 'draft' && (
                  <Button className="ml-2" onClick={() => {
                    handleSendCampaign(previewEmail);
                    closePreview();
                  }}>
                    Send Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmailMarketing;
