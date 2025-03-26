
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, FileText, CreditCard, Key, User } from "lucide-react";

const Account = () => {
  const { currentClientId, clients, isInMasterMode } = useMasterAccount();
  const { toast } = useToast();
  
  const currentClient = isInMasterMode 
    ? null 
    : clients.find(client => client.id === currentClientId);

  const [accountInfo, setAccountInfo] = useState({
    name: currentClient?.name || "Master Account",
    email: currentClient?.email || "admin@crmpro.com",
    role: isInMasterMode ? "Administrator" : "Client",
    plan: currentClient?.subscription || "Master",
    phone: "",
    company: currentClient?.name || "CRM Pro Inc."
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    // In a real app, you would save these changes to your backend
    setIsEditing(false);
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully."
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Account</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/lovable-uploads/2e7bc354-d939-480c-b0dc-7aa03dbde994.png" alt="Profile" />
                <AvatarFallback className="text-2xl">{accountInfo.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{accountInfo.name}</CardTitle>
            <CardDescription>{accountInfo.email}</CardDescription>
            <div className="mt-2">
              <Badge variant="outline" className="text-sm">
                {accountInfo.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">{isInMasterMode ? "Master Account" : "Client Account"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subscription</span>
                <span className="font-medium">{accountInfo.plan}</span>
              </div>
              {currentClient && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${currentClient.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                      {currentClient.status.charAt(0).toUpperCase() + currentClient.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-medium">{currentClient.users}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Active</span>
                <span className="font-medium">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Key className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={accountInfo.name} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={accountInfo.email} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={accountInfo.phone} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        name="company" 
                        value={accountInfo.company} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Change Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your subscription and payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{accountInfo.plan} Plan</p>
                            <p className="text-sm text-muted-foreground">
                              {accountInfo.plan === "Basic" ? "Up to 3 users" : 
                               accountInfo.plan === "Professional" ? "Up to 10 users" : 
                               "Unlimited users"}
                            </p>
                          </div>
                          <Badge>{accountInfo.plan === "Basic" ? "$9.99/mo" : 
                                 accountInfo.plan === "Professional" ? "$29.99/mo" : 
                                 "$99.99/mo"}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                      <div className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="rounded-full bg-primary/10 p-2">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Billing History</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Invoice #001234</p>
                              <p className="text-sm text-muted-foreground">March 1, 2025</p>
                            </div>
                          </div>
                          <Badge variant="outline">${accountInfo.plan === "Basic" ? "9.99" : 
                                 accountInfo.plan === "Professional" ? "29.99" : 
                                 "99.99"}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Invoice #001233</p>
                              <p className="text-sm text-muted-foreground">February 1, 2025</p>
                            </div>
                          </div>
                          <Badge variant="outline">${accountInfo.plan === "Basic" ? "9.99" : 
                                 accountInfo.plan === "Professional" ? "29.99" : 
                                 "99.99"}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>View your account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Profile updated</p>
                        <p className="text-sm text-muted-foreground">You updated your profile information</p>
                        <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                        <Key className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Password changed</p>
                        <p className="text-sm text-muted-foreground">You changed your password</p>
                        <p className="text-xs text-muted-foreground">Yesterday at 2:15 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Payment processed</p>
                        <p className="text-sm text-muted-foreground">Your monthly subscription payment was processed</p>
                        <p className="text-xs text-muted-foreground">March 1, 2025 at 12:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
