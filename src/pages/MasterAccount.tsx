
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Settings, BarChart3, Mail, Lock, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MasterAccount = () => {
  const { clients, addClient, removeClient } = useMasterAccount();
  
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

  const deleteClient = (id: number) => {
    removeClient(id);
  };
  
  const clientSalesData = clients.map(client => ({
    name: client.name,
    sales: Math.floor(Math.random() * 10000) + 2000,
    leads: Math.floor(Math.random() * 50) + 10,
    conversions: Math.floor(Math.random() * 30) + 5,
  }));
  
  const totalSales = clientSalesData.reduce((sum, client) => sum + client.sales, 0);
  const averageSales = clients.length > 0 ? totalSales / clients.length : 0;
  const totalLeads = clientSalesData.reduce((sum, client) => sum + client.leads, 0);
  const totalConversions = clientSalesData.reduce((sum, client) => sum + client.conversions, 0);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Master Account Dashboard</h1>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4 flex justify-start">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Client Sales Dashboard
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Client Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all clients</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Sales per Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${Math.round(averageSales).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Monthly average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads / Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeads} / {totalConversions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((totalConversions / totalLeads) * 100)}% conversion rate
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Client Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientSalesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Sales']} />
                    <Legend />
                    <Bar dataKey="sales" fill="#4f46e5" name="Sales ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Client Performance</CardTitle>
              <CardDescription>Sales and conversion metrics for all clients</CardDescription>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No clients have been added yet</p>
                  <Button variant="outline" onClick={() => document.getElementById('settings-tab')?.click()}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Add Your First Client
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Subscription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientSalesData.map((data, index) => {
                      const client = clients[index];
                      return (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>${data.sales.toLocaleString()}</TableCell>
                          <TableCell>{data.leads}</TableCell>
                          <TableCell>{data.conversions}</TableCell>
                          <TableCell>{Math.round((data.conversions / data.leads) * 100)}%</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              client.subscription === 'Enterprise' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
                                : client.subscription === 'Professional'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            }`}>
                              {client.subscription}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6" id="settings-tab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" /> Add New Client
              </CardTitle>
              <CardDescription>Create a new client account in the system</CardDescription>
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
              </div>
              <Button onClick={addNewClient} className="mt-4">Add Client</Button>
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
