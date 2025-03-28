import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, DollarSign, Calendar, Users, Edit, Trash2, Settings } from 'lucide-react';
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from "@/hooks/use-toast";
import EditDealDialog from '@/components/deals/EditDealDialog';
import ColumnCustomizer, { Column } from '@/components/ui/column-customizer';
import { DEFAULT_COLUMNS, STORAGE_KEYS, Deal } from '@/components/deals/types';
import { TeamMember } from '@/components/settings/TeamMembers';
import { useDeals } from "@/contexts/DealsContext";

// Sample team members data for demo purposes
const demoTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    lastActive: "Today at 2:34 PM"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "editor",
    status: "active",
    lastActive: "Yesterday at 5:12 PM"
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "viewer",
    status: "pending",
  }
];

// Empty deals data structure
const initialDeals: any[] = [];

// Create stage labels map
const getInitialDealsByStage = (deals: any[], columns: Column[]) => {
  const result: Record<string, typeof deals> = {};
  
  columns.forEach(column => {
    result[column.id] = deals.filter(deal => deal.stage === column.id);
  });
  
  return result;
};

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients } = useMasterAccount();
  const { deals: existingDeals, addDeal: addDealToContext, updateDeal: updateDealInContext, deleteDeal: deleteDealFromContext } = useDeals();
  
  // Initialize deals from context 
  const [deals, setDeals] = useState<Deal[]>(() => {
    return existingDeals || [];
  });
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem(STORAGE_KEYS.DEALS_COLUMNS);
    return savedColumns ? JSON.parse(savedColumns) : DEFAULT_COLUMNS;
  });
  const [dealsByStage, setDealsByStage] = useState(getInitialDealsByStage(initialDeals, columns));
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const { toast } = useToast();
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false);
  const [teamMembers] = useState<TeamMember[]>(demoTeamMembers); // Using demo data
  
  // Update local deals when context deals change
  useEffect(() => {
    setDeals(existingDeals);
    setDealsByStage(getInitialDealsByStage(existingDeals, columns));
  }, [existingDeals, columns]);
  
  // Update dealsByStage when columns change
  useEffect(() => {
    setDealsByStage(getInitialDealsByStage(deals, columns));
  }, [columns, deals]);
  
  // All deals flattened for search filtering
  const getAllDeals = () => {
    return Object.values(dealsByStage).flat();
  };
  
  // Filter deals based on search query
  const getFilteredDeals = () => {
    const allDeals = getAllDeals();
    if (!searchQuery.trim()) return allDeals;
    
    return allDeals.filter(deal => {
      const name = deal.name.toLowerCase();
      const description = deal.description.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return name.includes(query) || description.includes(query);
    });
  };

  // Filter deals by stage and search query
  const getFilteredDealsByStage = () => {
    if (!searchQuery.trim()) return dealsByStage;
    
    const filteredResult: Record<string, typeof deals> = {};
    const filteredDeals = getFilteredDeals();
    
    columns.forEach(column => {
      filteredResult[column.id] = filteredDeals.filter(deal => deal.stage === column.id);
    });
    
    return filteredResult;
  };

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
    const stageColumn = columns.find(column => column.id === stage);
    const label = stageColumn ? stageColumn.label : "Unknown";
    
    const variants: Record<string, "default" | "outline" | "secondary" | "destructive"> = {
      "discovery": "secondary",
      "proposal": "secondary",
      "negotiation": "default",
      "closed_won": "outline",
      "closed_lost": "destructive"
    };
    
    return { 
      variant: variants[stage] || "secondary", 
      label 
    };
  };
  
  // Handle drag end
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or if the item was dropped in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Find the deal that was dragged
    const deal = getAllDeals().find(d => d.id.toString() === draggableId);
    if (!deal) return;
    
    // Create new dealsByStage object
    const newDealsByStage = {...dealsByStage};
    
    // Remove from the source stage
    newDealsByStage[source.droppableId] = newDealsByStage[source.droppableId].filter(
      d => d.id.toString() !== draggableId
    );
    
    // Update the deal's stage
    const updatedDeal = {...deal, stage: destination.droppableId};
    
    // Add to the destination stage at the correct index
    newDealsByStage[destination.droppableId] = [
      ...newDealsByStage[destination.droppableId].slice(0, destination.index),
      updatedDeal,
      ...newDealsByStage[destination.droppableId].slice(destination.index)
    ];
    
    // Update state
    setDealsByStage(newDealsByStage);
    
    // Update the main deals array
    setDeals(getAllDeals());
    
    // Show toast notification
    const destinationColumn = columns.find(col => col.id === destination.droppableId);
    toast({
      title: "Deal Moved",
      description: `${deal.name} moved to ${destinationColumn?.label || 'new stage'} stage`
    });
  };

  // Handle edit deal
  const handleEditDeal = (deal: any) => {
    setEditingDeal(deal);
    setIsEditDialogOpen(true);
  };

  // Handle save edited deal
  const handleSaveEditedDeal = (updatedDeal: any) => {
    // Update the deal in the context
    updateDealInContext(updatedDeal);
    
    // Show toast notification
    toast({
      title: "Deal Updated",
      description: `${updatedDeal.name} has been updated successfully`
    });
  };

  // Handle delete deal
  const handleDeleteDeal = (deal: any) => {
    // Delete the deal from context
    deleteDealFromContext(deal.id);
    
    // Show toast notification
    toast({
      title: "Deal Deleted",
      description: `${deal.name} has been deleted`
    });
  };

  // Add a new deal
  const handleAddDeal = () => {
    const defaultStage = columns.length > 0 ? columns[0].id : "discovery";
    
    const newDeal = {
      name: "New Deal",
      company: "Example Company",
      stage: defaultStage,
      value: 5000,
      currency: "USD",
      closingDate: new Date().toISOString().split('T')[0],
      probability: 50,
      description: "New deal description",
      assignedTo: "account-owner",
      contactId: "contact1"
    };
    
    // Add to context
    addDealToContext(newDeal);
    
    // Show toast notification
    const stageColumn = columns.find(col => col.id === defaultStage);
    toast({
      title: "Deal Added",
      description: `${newDeal.name} has been added to the ${stageColumn?.label || 'first'} stage`
    });
    
    // Edit the newly created deal
    // Need to find the deal with the correct ID after it was added
    const addedDeal = existingDeals.find(d => 
      d.name === newDeal.name && 
      d.company === newDeal.company && 
      d.stage === newDeal.stage
    );
    
    if (addedDeal) {
      handleEditDeal(addedDeal);
    }
  };

  // Handle saving columns from the customizer
  const handleSaveColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
    localStorage.setItem(STORAGE_KEYS.DEALS_COLUMNS, JSON.stringify(newColumns));
    
    // Update dealsByStage to include new columns
    setDealsByStage(getInitialDealsByStage(deals, newColumns));
  };

  // Function to get display name for assigned person
  const getAssignedPersonName = (assignedId: string) => {
    if (assignedId === "account-owner") return "Account Owner";
    const member = teamMembers.find(m => m.id === assignedId);
    return member ? member.name : "Unassigned";
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
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'outline'} 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setViewMode('kanban')}
            >
              Kanban
            </Button>
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
            <Button size="sm" className="flex items-center gap-1" onClick={handleAddDeal}>
              <Plus className="h-4 w-4" /> New Deal
            </Button>
          </div>
        </div>
        
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 overflow-x-auto pb-6">
              {columns.map(column => {
                const filteredDealsByStage = getFilteredDealsByStage();
                const stageDeals = filteredDealsByStage[column.id] || [];
                const stageInfo = getStageBadge(column.id);
                
                return (
                  <div key={column.id} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 bg-muted/30 p-2 rounded-md">
                      <div>
                        <h3 className="font-medium">{column.label}</h3>
                        <p className="text-sm text-muted-foreground">{stageDeals.length} deals</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                          const newDeal = {
                            name: "New Deal",
                            clientId: clients.length > 0 ? clients[0].id : 1,
                            stage: column.id,
                            value: 5000,
                            currency: "USD",
                            closingDate: new Date().toISOString().split('T')[0],
                            probability: 50,
                            createdAt: new Date().toISOString(),
                            assignedTo: "account-owner",
                            description: "New deal description"
                          };
                          
                          // Add to dealsByStage
                          const newDealsByStage = {...dealsByStage};
                          newDealsByStage[column.id] = [...(newDealsByStage[column.id] || []), newDeal];
                          
                          // Update state
                          setDealsByStage(newDealsByStage);
                          
                          // Update the main deals array
                          setDeals([...deals, newDeal]);
                          
                          // Edit the newly created deal
                          handleEditDeal(newDeal);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "flex-1 space-y-4 p-2 rounded-md min-h-[200px]",
                            snapshot.isDraggingOver ? "bg-muted/50" : ""
                          )}
                        >
                          {stageDeals.map((deal, index) => (
                            <Draggable 
                              key={deal.id.toString()} 
                              draggableId={deal.id.toString()} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "transition-all duration-300",
                                    snapshot.isDragging ? "opacity-75" : ""
                                  )}
                                >
                                  <Card className="hover:shadow-md transition-all duration-300">
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
                                            <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit Deal
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteDeal(deal)}>
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete Deal
                                            </DropdownMenuItem>
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
                                            <div className="font-medium">{getAssignedPersonName(deal.assignedTo)}</div>
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
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          
                          {stageDeals.length === 0 && (
                            <div className="flex items-center justify-center h-24 border border-dashed rounded-md">
                              <span className="text-sm text-muted-foreground">No deals in this stage</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getFilteredDeals().map((deal) => (
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
                        <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDeal(deal)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Deal
                        </DropdownMenuItem>
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
                        <div className="font-medium">{getAssignedPersonName(deal.assignedTo)}</div>
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
            
            {getFilteredDeals().length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium mb-2">No deals found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button onClick={handleAddDeal}>Create New Deal</Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Deal Dialog */}
      <EditDealDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        deal={editingDeal}
        onSave={handleSaveEditedDeal}
        stages={columns.map(column => ({ id: column.id, label: column.label }))}
        teamMembers={teamMembers}
      />
      
      {/* Column Customizer Dialog */}
      <ColumnCustomizer
        isOpen={isColumnCustomizerOpen}
        onClose={() => setIsColumnCustomizerOpen(false)}
        columns={columns}
        onSave={handleSaveColumns}
        storageKey={STORAGE_KEYS.DEALS_COLUMNS}
      />
    </div>
  );
};

export default Deals;
