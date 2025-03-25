
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMasterAccount } from "@/contexts/MasterAccountContext";

const MasterAccount = () => {
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "password123", // Default password
    subscription: "Basic"
  });
  
  const { addClient, clients, removeClient } = useMasterAccount();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setNewClient({ ...newClient, subscription: value });
  };

  const addNewClient = () => {
    if (!newClient.name || !newClient.email || !newClient.password || !newClient.subscription) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addClient({
      name: newClient.name,
      email: newClient.email,
      password: newClient.password, // Include password field
      subscription: newClient.subscription,
      status: "active",
      users: 0,
      deals: 0,
      contacts: 0,
      lastActivity: new Date().toISOString(),
      logo: "/placeholder.svg"
    });
    
    setNewClient({ name: "", email: "", password: "password123", subscription: "Basic" });
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added successfully.`
    });
  };

  const deleteClient = (id: number) => {
    removeClient(id);
    toast({
      title: "Client Removed",
      description: "The client has been removed successfully."
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>Create a new client account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={newClient.name} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={newClient.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              name="password" 
              value={newClient.password} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label>Subscription</Label>
            <Select onValueChange={handleSelectChange} defaultValue={newClient.subscription}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addNewClient}>Add Client</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Clients</CardTitle>
          <CardDescription>Manage existing client accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => deleteClient(client.id)}>
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterAccount;
