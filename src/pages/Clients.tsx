
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Mail, Phone, X, Tag, Building } from 'lucide-react';
import ClientsTable from '@/components/clients/ClientsTable';
import { useToast } from '@/hooks/use-toast';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Badge } from '@/components/ui/badge';

const Clients = () => {
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const { toast } = useToast();
  const { addClient } = useMasterAccount();
  const [availableTags, setAvailableTags] = useState<string[]>([
    'VIP', 'New Lead', 'Qualified', 'Nurturing', 'Potential', 'Enterprise', 'Small Business'
  ]);
  const [newTag, setNewTag] = useState('');
  
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    emails: [''],
    phoneNumbers: [''],
    company: '',
    leadType: 'Prospect',
    leadSource: 'Website',
    tags: [] as string[],
    status: 'active',
    users: 0,
    deals: 0,
    contacts: 0,
    lastActivity: new Date().toISOString(),
    logo: ''
  });

  const handleCreateClientClick = () => {
    setShowAddClientForm(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewClient(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddEmail = () => {
    setNewClient(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }));
  };
  
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...newClient.emails];
    newEmails[index] = value;
    setNewClient(prev => ({
      ...prev,
      emails: newEmails
    }));
  };
  
  const handleRemoveEmail = (index: number) => {
    if (newClient.emails.length === 1) return;
    const newEmails = [...newClient.emails];
    newEmails.splice(index, 1);
    setNewClient(prev => ({
      ...prev,
      emails: newEmails
    }));
  };
  
  const handleAddPhone = () => {
    setNewClient(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, '']
    }));
  };
  
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...newClient.phoneNumbers];
    newPhones[index] = value;
    setNewClient(prev => ({
      ...prev,
      phoneNumbers: newPhones
    }));
  };
  
  const handleRemovePhone = (index: number) => {
    if (newClient.phoneNumbers.length === 1) return;
    const newPhones = [...newClient.phoneNumbers];
    newPhones.splice(index, 1);
    setNewClient(prev => ({
      ...prev,
      phoneNumbers: newPhones
    }));
  };
  
  const addNewTag = () => {
    if (!newTag.trim()) return;
    if (!availableTags.includes(newTag.trim())) {
      setAvailableTags(prev => [...prev, newTag.trim()]);
    }
    if (!newClient.tags.includes(newTag.trim())) {
      setNewClient(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
    }
    setNewTag('');
  };
  
  const toggleTag = (tag: string) => {
    if (newClient.tags.includes(tag)) {
      setNewClient(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    } else {
      setNewClient(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };
  
  const handleAddClient = () => {
    if (!newClient.firstName || !newClient.lastName) {
      toast({
        title: "Error",
        description: "First name and last name are required.",
        variant: "destructive"
      });
      return;
    }
    
    // Filter out any empty emails or phone numbers
    const filteredClient = {
      ...newClient,
      emails: newClient.emails.filter(email => email.trim() !== ''),
      phoneNumbers: newClient.phoneNumbers.filter(phone => phone.trim() !== '')
    };
    
    // Add the client
    addClient(filteredClient);
    
    // Reset the form
    setShowAddClientForm(false);
    setNewClient({
      firstName: '',
      lastName: '',
      emails: [''],
      phoneNumbers: [''],
      company: '',
      leadType: 'Prospect',
      leadSource: 'Website',
      tags: [],
      status: 'active',
      users: 0,
      deals: 0,
      contacts: 0,
      lastActivity: new Date().toISOString(),
      logo: ''
    });
    
    toast({
      title: "Client added",
      description: "The client has been successfully added.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={handleCreateClientClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      
      {showAddClientForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  placeholder="Enter first name"
                  value={newClient.firstName} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  placeholder="Enter last name"
                  value={newClient.lastName} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Email Address</Label>
                {newClient.emails.map((email, index) => (
                  <div key={`email-${index}`} className="relative mb-2 flex items-center">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      placeholder="Enter email address"
                      className="pl-9 flex-1"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {newClient.emails.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveEmail(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddEmail}
                  className="mt-1"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Email
                </Button>
              </div>
              
              <div className="md:col-span-2">
                <Label>Phone Number</Label>
                {newClient.phoneNumbers.map((phone, index) => (
                  <div key={`phone-${index}`} className="relative mb-2 flex items-center">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="tel"
                      placeholder="Enter phone number"
                      className="pl-9 flex-1"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                    />
                    {newClient.phoneNumbers.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemovePhone(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPhone}
                  className="mt-1"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Phone
                </Button>
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    id="company" 
                    name="company" 
                    placeholder="Enter company name"
                    className="pl-9"
                    value={newClient.company} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="leadType">Lead Type</Label>
                <Select onValueChange={(value) => handleSelectChange('leadType', value)} value={newClient.leadType}>
                  <SelectTrigger id="leadType">
                    <SelectValue placeholder="Select lead type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="leadSource">Lead Source</Label>
                <Select onValueChange={(value) => handleSelectChange('leadSource', value)} value={newClient.leadSource}>
                  <SelectTrigger id="leadSource">
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {availableTags.map(tag => (
                    <Badge 
                      key={tag}
                      variant={newClient.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Create new tag"
                      className="pl-9"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addNewTag}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddClientForm(false)}>Cancel</Button>
              <Button onClick={handleAddClient}>Add Client</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
