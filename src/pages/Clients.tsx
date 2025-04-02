
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Mail, Lock } from 'lucide-react';
import ClientsTable from '@/components/clients/ClientsTable';
import { useToast } from '@/hooks/use-toast';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const Clients = () => {
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const { toast } = useToast();
  const { addClient } = useMasterAccount();
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    password: '',
    subscription: 'Basic',
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

  const handleSelectChange = (value: string) => {
    setNewClient(prev => ({ ...prev, subscription: value }));
  };
  
  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Call the addClient function from the MasterAccountContext
    addClient(newClient);
    
    // Reset the form
    setShowAddClientForm(false);
    setNewClient({
      name: '',
      email: '',
      password: '',
      subscription: 'Basic',
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
                <Label htmlFor="name">Client Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter client name"
                  value={newClient.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Enter client email"
                    className="pl-9"
                    value={newClient.email} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Create a password"
                    className="pl-9"
                    value={newClient.password} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subscription">Subscription Plan</Label>
                <Select onValueChange={handleSelectChange} value={newClient.subscription}>
                  <SelectTrigger id="subscription">
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
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
