
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, DollarSign, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { cn } from "@/lib/utils";

// Sample deals data
const deals = [
  {
    id: 1,
    name: "Enterprise SaaS Implementation",
    clientId: 1,
    stage: "proposal",
    value: 75000,
    currency: "USD",
    closingDate: "2023-11-30",
    probability: 70,
    createdAt: "2023-09-01",
    assignedTo: "John Smith",
    description: "Implementation of our Enterprise SaaS solution for Acme Corporation"
  },
  {
    id: 2,
    name: "Website Redesign Project",
    clientId: 2,
    stage: "negotiation",
    value: 25000,
    currency: "USD",
    closingDate: "2023-10-15",
    probability: 85,
    createdAt: "2023-08-15",
    assignedTo: "Sarah Johnson",
    description: "Complete website redesign for TechStart Inc with focus on conversion optimization"
  },
  {
    id: 3,
    name: "Marketing Campaign Bundle",
    clientId: 3,
    stage: "discovery",
    value: 12500,
    currency: "USD",
    closingDate: "2023-12-01",
    probability: 40,
    createdAt: "2023-09-10",
    assignedTo: "Michael Brown",
    description: "Series of digital marketing campaigns for Global Services Ltd"
  },
  {
    id: 4,
    name: "Annual Maintenance Contract",
    clientId: 1,
    stage: "closed_won",
    value: 48000,
    currency: "USD",
    closingDate: "2023-09-05",
    probability: 100,
    createdAt: "2023-07-20",
    assignedTo: "John Smith",
    description: "Yearly maintenance and support contract for Acme Corporation's systems"
  },
  {
    id: 5,
    name: "Training Services Package",
    clientId: 2,
    stage: "closed_lost",
    value: 15000,
    currency: "USD",
    closingDate: "2023-08-30",
    probability: 0,
    createdAt: "2023-08-01",
    assignedTo: "Sarah Johnson",
    description: "Comprehensive training services for TechStart Inc's new employees"
  }
];

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients } = useMasterAccount();
  
  // Filter deals based on search query
  const filteredDeals = deals.filter(deal => {
    const name = deal.name.toLowerCase();
    const description = deal.description.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || description.includes(query);
  });

  // Get client name
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Get client initials
  const getClientInitials = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name.substring(0, 2).toUpperCase() : '??';
  };

  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get stage badge variant and label
  const getStageBadge = (stage: string) => {
    const stages: Record<string, { variant: "default" | "outline" | "secondary" | "destructive", label: string }> = {
      "discovery": { variant: "secondary", label: "Discovery" },
      "proposal": { variant: "secondary", label: "Proposal" },
      "negotiation": { variant: "default", label: "Negotiation" },
      "closed_won": { variant: "outline", label: "Closed Won" },
      "closed_lost": { variant: "destructive", label: "Closed Lost" }
    };
    return stages[stage] || { variant: "secondary", label: "Unknown" };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search deals..."
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
              <Plus className="h-4 w-4" /> New Deal
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{deal.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStageBadge(deal.stage).variant}>
                        {getStageBadge(deal.stage).label}
                      </Badge>
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
                      <DropdownMenuItem>Change Stage</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center my-3">
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getClientInitials(deal.clientId)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{getClientName(deal.clientId)}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Value</div>
                        <div className="font-medium">{formatCurrency(deal.value, deal.currency)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Closing Date</div>
                        <div className="font-medium">{new Date(deal.closingDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Assigned To</div>
                      <div className="font-medium">{deal.assignedTo}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Probability: {deal.probability}%</div>
                    <div className="w-full bg-secondary/30 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full",
                          deal.probability >= 70 ? "bg-primary" : 
                          deal.probability >= 40 ? "bg-amber-500" : "bg-destructive"
                        )}
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredDeals.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">No deals found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button>Create New Deal</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deals;
