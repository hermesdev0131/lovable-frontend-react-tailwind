import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMasterAccount, Client } from "@/contexts/MasterAccountContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Mail, Lock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MasterAccount = () => {
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
    subscription: "Basic" as const
  });
  
  const { addClient, clients, removeClient } = useMasterAccount();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: 'Basic' | 'Professional' | 'Enterprise') => {
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
    
    if (!validateEmail(newClient.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (newClient.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    addClient({
      name: newClient.name,
      email: newClient.email,
      password: newClient.password,
      subscription: newClient.subscription,
      status: "active",
      users: 0,
      deals: 0,
      contacts: 0,
      lastActivity: new Date().toISOString(),
      logo: "/placeholder.svg"
    });
    
    setNewClient({ name: "", email: "", password: "", subscription: "Basic" });
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added successfully.`
    });
  };

  const deleteClient = (id: string) => {
    removeClient(id);
    toast({
      title: "Client Removed",
      description: "The client has been removed successfully."
    });
  };
  
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-4 flex justify-start">
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" /> Add New Client
              </CardTitle>
              <CardDescription>Create a new client account in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Label>Subscription Plan</Label>
                  <Select 
                    onValueChange={handleSelectChange as (value: string) => void} 
                    defaultValue={newClient.subscription}
                  >
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
              </div>
              <Button onClick={addNewClient} className="mt-2">Add Client</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>View and manage all client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No clients have been added yet</p>
                  <Button variant="outline" onClick={() => document.getElementById('name')?.focus()}>
                    Add Your First Client
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.subscription}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteClient(client.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Master Account Settings</CardTitle>
              <CardDescription>Configure your master account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings options will appear here in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterAccount;
