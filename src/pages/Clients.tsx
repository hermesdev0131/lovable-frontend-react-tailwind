import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Users, X, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
    subscription: "Basic" as const
  });
  
  const { clients, addClient } = useMasterAccount();
  const { toast } = useToast();
  
  const filteredClients = clients.filter(client => {
    const name = client.name.toLowerCase();
    const email = client.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || email.includes(query);
  });

  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'outline' : 'secondary';
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: 'Basic' | 'Professional' | 'Enterprise') => {
    setNewClient({ ...newClient, subscription: value });
  };
  
  const resetForm = () => {
    setNewClient({ name: "", email: "", password: "", subscription: "Basic" });
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.password) {
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
    
    resetForm();
    setShowAddDialog(false);
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added successfully.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          </div>
        </div>
        
        {filteredClients.length === 0 ? (
          <Card className="w-full p-8 text-center">
            <CardContent className="flex flex-col items-center pt-6">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Clients Yet</CardTitle>
              <CardDescription className="mb-6">
                Add your first client to start managing your accounts.
              </CardDescription>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={client.logo} alt={client.name} />
                        <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">{client.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusBadgeVariant(client.status)}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{client.subscription}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem>Manage Access</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Email: </span>
                      <span className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {client.email}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Login Status: </span>
                      <span className="flex items-center">
                        <Lock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Account Active
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="text-center p-2 bg-background rounded-lg border border-border">
                        <div className="text-lg font-semibold">{client.users}</div>
                        <div className="text-xs text-muted-foreground">Users</div>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg border border-border">
                        <div className="text-lg font-semibold">{client.deals}</div>
                        <div className="text-xs text-muted-foreground">Deals</div>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg border border-border">
                        <div className="text-lg font-semibold">{client.contacts}</div>
                        <div className="text-xs text-muted-foreground">Contacts</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Activity: </span>
                        <span>{new Date(client.lastActivity).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-name" className="text-right">
                Name
              </Label>
              <Input
                id="client-name"
                name="name"
                placeholder="Enter client name"
                value={newClient.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-email" className="text-right">
                Email
              </Label>
              <div className="relative col-span-3">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newClient.email}
                  onChange={handleInputChange}
                  className="pl-9 w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-password" className="text-right">
                Password
              </Label>
              <div className="relative col-span-3">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="client-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={newClient.password}
                  onChange={handleInputChange}
                  className="pl-9 w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Min. 6 characters. Client will use this to log in.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Subscription</Label>
              <Select 
                onValueChange={handleSelectChange as (value: string) => void} 
                defaultValue={newClient.subscription}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subscription plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                setShowAddDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddClient}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
