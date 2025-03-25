
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients } = useMasterAccount();
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    const name = client.name.toLowerCase();
    const email = client.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || email.includes(query);
  });

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'outline' : 'secondary';
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
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          </div>
        </div>
        
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
                    <span>{client.email}</span>
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
          
          {filteredClients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">No clients found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button>Add New Client</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
