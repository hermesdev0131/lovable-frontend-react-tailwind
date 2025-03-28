
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock } from "lucide-react";
import { useMasterAccount } from "@/contexts/MasterAccountContext";

const AddClientForm = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewClient(prev => ({ ...prev, subscription: value }));
  };

  const addNewClient = () => {
    if (!newClient.name || !newClient.email || !newClient.password) {
      return; // Simple validation
    }
    addClient(newClient);
    // Reset form
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
  };

  return (
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
        <p className="text-xs text-muted-foreground mt-1">
          Min. 6 characters. Will be used for client login.
        </p>
      </div>
      <div>
        <Label htmlFor="subscription">Subscription Plan</Label>
        <Select onValueChange={handleSelectChange} defaultValue={newClient.subscription}>
          <SelectTrigger>
            <SelectValue placeholder="Select subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Button onClick={addNewClient} className="mt-4">Add Client</Button>
      </div>
    </div>
  );
};

export default AddClientForm;
