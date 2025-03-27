
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Check, X, MoreHorizontal, LightbulbIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { opportunities, formatCurrency, formatDate, getContactById } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import OpportunityImageUpload from '@/components/opportunities/OpportunityImageUpload';
import ColumnCustomizer, { Column } from '@/components/ui/column-customizer';
import { STORAGE_KEYS } from '@/components/deals/types';

// Default columns for opportunities
const DEFAULT_OPPORTUNITY_COLUMNS: Column[] = [
  { id: 'new', label: 'New' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' }
];

const Opportunities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    description: '',
    potentialValue: 0,
    status: 'new',
    source: 'website',
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES_COLUMNS);
    return savedColumns ? JSON.parse(savedColumns) : DEFAULT_OPPORTUNITY_COLUMNS;
  });
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'new': 'default',
      'qualified': 'default',
      'discovery': 'secondary',
      'proposal': 'secondary',
      'unqualified': 'secondary',
      'won': 'outline',
      'lost': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    const statusColumn = columns.find(column => column.id === status);
    return statusColumn ? statusColumn.label : status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Extract initials for avatar
  const getInitials = (contactId: string | null) => {
    if (!contactId) return 'NA';
    const contact = getContactById(contactId);
    if (!contact) return '??';
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  };

  // Get contact name
  const getContactName = (contactId: string | null) => {
    if (!contactId) return 'No contact assigned';
    const contact = getContactById(contactId);
    if (!contact) return 'Unknown contact';
    return `${contact.firstName} ${contact.lastName}`;
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOpportunity({ ...newOpportunity, [name]: value });
  };

  // Handle add opportunity
  const handleAddOpportunity = () => {
    // Add form validation and submission logic here
    setShowCreateCard(false);
    setUploadedImage(null);
    
    toast({
      title: "Opportunity created",
      description: "New opportunity has been added successfully",
    });
  };

  // Handle saving columns from the customizer
  const handleSaveColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES_COLUMNS, JSON.stringify(newColumns));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search opportunities..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsColumnCustomizerOpen(true)}
            >
              <Settings className="h-4 w-4" /> Columns
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowCreateCard(true)}
            >
              <Plus className="h-4 w-4" /> Add Opportunity
            </Button>
          </div>
        </div>
        
        {showCreateCard && (
          <Card className="mb-6 animate-scale-in">
            <CardHeader>
              <CardTitle>Create New Opportunity</CardTitle>
              <CardDescription>Add the details of your new opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                  <Input
                    id="name"
                    name="name"
                    value={newOpportunity.name}
                    onChange={handleInputChange}
                    placeholder="Opportunity name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newOpportunity.description}
                    onChange={handleInputChange}
                    placeholder="Describe the opportunity"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  />
                </div>
                
                <OpportunityImageUpload 
                  uploadedImage={uploadedImage}
                  setUploadedImage={setUploadedImage}
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateCard(false);
                      setUploadedImage(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddOpportunity}>Create Opportunity</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {opportunities.length === 0 ? (
            <div className="col-span-full">
              <Card className="w-full p-8 text-center">
                <CardContent className="flex flex-col items-center pt-6">
                  <LightbulbIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No Opportunities Yet</CardTitle>
                  <CardDescription className="mb-6">
                    Create your first opportunity to start tracking potential deals.
                  </CardDescription>
                  <Button onClick={() => setShowCreateCard(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Opportunity
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            opportunities.map((opportunity, index) => (
              <Card 
                key={opportunity.id} 
                className="glass-card hover:shadow-md transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{opportunity.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                          {getStatusLabel(opportunity.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">from {opportunity.source}</span>
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
                        <DropdownMenuItem>Mark as Won</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Lost</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{opportunity.description}</p>
                  
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Value</div>
                        <div className="font-medium">{formatCurrency(opportunity.potentialValue, opportunity.currency)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Probability</div>
                        <div className="font-medium">{opportunity.probability}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Expected Close</div>
                      <div className="font-medium">{formatDate(opportunity.expectedCloseDate)}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(opportunity.contactId)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{getContactName(opportunity.contactId)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="w-[48%]">
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="w-[48%]">
                      <Check className="h-4 w-4 mr-1" /> Convert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Column Customizer Dialog */}
      <ColumnCustomizer
        isOpen={isColumnCustomizerOpen}
        onClose={() => setIsColumnCustomizerOpen(false)}
        columns={columns}
        onSave={handleSaveColumns}
        storageKey={STORAGE_KEYS.OPPORTUNITIES_COLUMNS}
      />
    </div>
  );
};

export default Opportunities;
