
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const Account = () => {
  const { currentClientId, clients } = useMasterAccount();
  
  const client = clients.find(c => c.id === currentClientId);
  
  if (!client) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p>No client account selected.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={`${client.firstName} ${client.lastName}`} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={client.emails[0] || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue={client.company} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" defaultValue={client.status} disabled />
            </div>
            
            <div className="pt-4">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>View your current plan details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Plan</Label>
              <div className="border rounded p-4 bg-muted/30">
                <p className="text-lg font-medium">{client.leadType} Plan</p>
                <p className="text-sm text-muted-foreground">Next billing date: June 1, 2023</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Usage</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded p-3 text-center">
                  <p className="text-xl font-bold">{client.users}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
                <div className="border rounded p-3 text-center">
                  <p className="text-xl font-bold">{client.deals}</p>
                  <p className="text-xs text-muted-foreground">Deals</p>
                </div>
                <div className="border rounded p-3 text-center">
                  <p className="text-xl font-bold">{client.contacts}</p>
                  <p className="text-xs text-muted-foreground">Contacts</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="outline">Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
