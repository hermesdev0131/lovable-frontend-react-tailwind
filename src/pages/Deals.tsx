
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Settings, Eye, Edit, Trash2 } from 'lucide-react';
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
import { useActivityTracker } from '@/hooks/useActivityTracker';
import DealDetailDialog from '@/components/deals/DealDetailDialog';
import DealForm, { DealFormField } from '@/components/deals/DealForm';
import CustomFieldsManager from '@/components/deals/CustomFieldsManager';
import { useCustomFields } from '@/contexts/CustomFieldsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const getInitialDealsByStage = (deals: Deal[], columns: Column[]) => {
  const result: Record<string, Deal[]> = {};
  
  columns.forEach(column => {
    result[column.id] = deals.filter(deal => deal.stage === column.id);
  });
  
  return result;
};

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, currentAccount } = useMasterAccount();
  const { deals: existingDeals, addDeal: addDealToContext, updateDeal: updateDealInContext, deleteDeal: deleteDealFromContext } = useDeals();
  const { trackDealActivity } = useActivityTracker();
  const { dealFields, updateDealFields } = useCustomFields();
  
  // Initialize deals from context 
  const [deals, setDeals] = useState<Deal[]>(() => {
    return existingDeals || [];
  });
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem(STORAGE_KEYS.DEALS_COLUMNS);
    return savedColumns ? JSON.parse(savedColumns) : DEFAULT_COLUMNS;
  });
  const [dealsByStage, setDealsByStage] = useState(getInitialDealsByStage(deals, columns));
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFieldsManagerOpen, setIsFieldsManagerOpen] = useState(false);
  const [viewingDeal, setViewingDeal] = useState<Deal | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false);
  const [teamMembers] = useState<TeamMember[]>(demoTeamMembers); // Using demo data
  const [sortField, setSortField] = useState<'value' | 'company' | 'name' | 'probability' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStage, setFilterStage] = useState<string | null>(null);
  
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
  
  // Filter deals based on search query and selected stage
  const getFilteredDeals = () => {
    let allDeals = getAllDeals();
    
    // Apply stage filter
    if (filterStage) {
      allDeals = allDeals.filter(deal => deal.stage === filterStage);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allDeals = allDeals.filter(deal => {
        const name = deal.name.toLowerCase();
        const company = deal.company.toLowerCase();
        const description = deal.description.toLowerCase();
        
        return name.includes(query) || company.includes(query) || description.includes(query);
      });
    }
    
    // Apply sorting
    return [...allDeals].sort((a, b) => {
      if (sortField === 'createdAt' || sortField === 'name' || sortField === 'company') {
        const aValue = a[sortField]?.toString().toLowerCase() || '';
        const bValue = b[sortField]?.toString().toLowerCase() || '';
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        const aValue = a[sortField] || 0;
        const bValue = b[sortField] || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  };

  // Filter deals by stage and search query
  const getFilteredDealsByStage = () => {
    const filteredDeals = getFilteredDeals();
    
    const filteredResult: Record<string, Deal[]> = {};
    
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
    
    // Update the deal's stage
    const updatedDeal: Deal = {
      ...deal, 
      stage: destination.droppableId,
      updatedAt: new Date().toISOString()
    };
    
    // Update in context
    updateDealInContext(updatedDeal);
    
    // Track the activity
    const destinationColumn = columns.find(col => col.id === destination.droppableId);
    trackDealActivity(deal.name, "moved to new stage", destinationColumn?.label || 'new stage');
    
    // Show toast notification
    toast({
      title: "Deal Moved",
      description: `${deal.name} moved to ${destinationColumn?.label || 'new stage'} stage`
    });
  };

  // Handle edit deal
  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsEditDialogOpen(true);
  };

  // Handle view deal details
  const handleViewDeal = (deal: Deal) => {
    setViewingDeal(deal);
    setIsDetailDialogOpen(true);
  };

  // Handle save edited deal
  const handleSaveEditedDeal = (updatedDeal: Deal) => {
    // Update the deal in the context
    updateDealInContext(updatedDeal);
    
    // Track the activity
    trackDealActivity(updatedDeal.name, "updated deal", "Deal details were modified");
    
    // Show toast notification
    toast({
      title: "Deal Updated",
      description: `${updatedDeal.name} has been updated successfully`
    });
    
    // Close dialog
    setIsEditDialogOpen(false);
  };

  // Handle save new deal
  const handleSaveNewDeal = (dealData: Partial<Deal>) => {
    const now = new Date().toISOString();
    
    // Add the deal to context
    addDealToContext({
      ...dealData,
      createdAt: now,
      updatedAt: now
    });
    
    // Track the activity
    trackDealActivity(dealData.name || "New Deal", "created deal", 
      `Value: ${formatCurrency(dealData.value || 0, dealData.currency || 'USD')}`);
    
    // Show toast notification
    toast({
      title: "Deal Created",
      description: `${dealData.name} has been created successfully`
    });
    
    // Close dialog
    setIsCreateDialogOpen(false);
  };

  // Handle delete deal
  const handleDeleteDeal = (deal: Deal) => {
    // Delete the deal from context
    deleteDealFromContext(deal.id);
    
    // Track the activity
    trackDealActivity(deal.name, "deleted deal", "");
    
    // Show toast notification
    toast({
      title: "Deal Deleted",
      description: `${deal.name} has been deleted`
    });
  };

  // Handle saving columns from the customizer
  const handleSaveColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
    localStorage.setItem(STORAGE_KEYS.DEALS_COLUMNS, JSON.stringify(newColumns));
    
    // Update dealsByStage to include new columns
    setDealsByStage(getInitialDealsByStage(deals, newColumns));
    
    toast({
      title: "Columns Updated",
      description: "Pipeline columns have been updated successfully"
    });
  };

  // Handle saving custom fields
  const handleSaveCustomFields = (newFields: DealFormField[]) => {
    updateDealFields(newFields);
    
    toast({
      title: "Custom Fields Updated",
      description: `${newFields.length} custom fields have been saved`
    });
  };

  // Function to get display name for assigned person
  const getAssignedPersonName = (assignedId?: string) => {
    if (!assignedId) return "Unassigned";
    if (assignedId === "account-owner") return "Account Owner";
    
    const member = teamMembers.find(m => m.id === assignedId);
    return member ? member.name : "Unassigned";
  };
  
  // Handle sort change
  const handleChangeSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle filter by stage
  const handleFilterByStage = (stageId: string | null) => {
    setFilterStage(stageId);
  };

  // Get stages in proper format for DealForm component
  const stageOptions = columns.map(column => ({
    id: column.id,
    label: column.label
  }));

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
          <div className="flex flex-wrap gap-2">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" /> 
                    {filterStage ? `Filter: ${columns.find(c => c.id === filterStage)?.label || filterStage}` : 'Filter'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleFilterByStage(null)}>
                    All Deals
                  </DropdownMenuItem>
                  {columns.map(column => (
                    <DropdownMenuItem key={column.id} onClick={() => handleFilterByStage(column.id)}>
                      {column.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Sort: {sortField}
                    {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleChangeSort('name')}>
                    Deal Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeSort('company')}>
                    Company
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeSort('value')}>
                    Value
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeSort('probability')}>
                    Probability
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeSort('createdAt')}>
                    Date Created
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
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
              <Settings className="h-4 w-4" /> Pipeline Stages
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsFieldsManagerOpen(true)}
            >
              <Settings className="h-4 w-4" /> Custom Fields
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-1 bg-[#D35400] hover:bg-[#B74600]" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
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
                
                return (
                  <div key={column.id} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 bg-muted/30 p-2 rounded-md">
                      <div>
                        <h3 className="font-medium">{column.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stageDeals.length} deals • 
                          {formatCurrency(
                            stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
                            'USD'
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-[#D35400]/10 hover:text-[#D35400]" 
                        onClick={() => {
                          setIsCreateDialogOpen(true);
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
                                  <Card className="hover:shadow-md transition-all duration-300 hover:border-[#D35400]/30">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h3 className="text-base font-medium">{deal.name}</h3>
                                          <div className="text-sm text-muted-foreground">{deal.company}</div>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#D35400]">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewDeal(deal)}>
                                              <Eye className="h-4 w-4 mr-2" />
                                              View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit Deal
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleDeleteDeal(deal)} 
                                              className="text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete Deal
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 my-2">
                                        <div className="bg-muted/20 rounded p-1.5">
                                          <div className="font-medium">{formatCurrency(deal.value || 0, deal.currency || 'USD')}</div>
                                          <div className="text-[10px] text-muted-foreground">Value</div>
                                        </div>
                                        <div className="bg-muted/20 rounded p-1.5">
                                          <div 
                                            className={`font-medium ${
                                              (deal.probability || 0) >= 70 ? 'text-[#D35400]' : 
                                              (deal.probability || 0) >= 40 ? 'text-amber-600' : 
                                              'text-red-600'
                                            }`}
                                          >
                                            {deal.probability || 0}%
                                          </div>
                                          <div className="text-[10px] text-muted-foreground">Probability</div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                                        <div className="flex items-center gap-1">
                                          <div className="text-xs text-muted-foreground">
                                            {getAssignedPersonName(deal.assignedTo)}
                                          </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(deal.closingDate || deal.createdAt).toLocaleDateString()}
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
                            <div 
                              className="h-24 border border-dashed rounded-md flex items-center justify-center text-sm text-muted-foreground hover:bg-[#D35400]/5 hover:border-[#D35400]/30 transition-colors cursor-pointer"
                              onClick={() => setIsCreateDialogOpen(true)}
                            >
                              <span className="flex items-center gap-1">
                                <Plus className="h-4 w-4" /> Add a deal
                              </span>
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
              <Card key={deal.id} className="hover:shadow-md transition-all duration-300 hover:border-[#D35400]/30">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#D35400]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDeal(deal)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDeal(deal)} 
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center my-3">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="text-xs bg-[#D35400]/10 text-[#D35400]">
                        {deal.company.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{deal.company}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Value</div>
                      <div className="font-medium">{formatCurrency(deal.value || 0, deal.currency || 'USD')}</div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Probability</div>
                      <div 
                        className={`font-medium ${
                          (deal.probability || 0) >= 70 ? 'text-[#D35400]' : 
                          (deal.probability || 0) >= 40 ? 'text-amber-600' : 
                          'text-red-600'
                        }`}
                      >
                        {deal.probability || 0}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40 text-sm text-muted-foreground">
                    <div>Assigned: {getAssignedPersonName(deal.assignedTo)}</div>
                    <div>Close: {new Date(deal.closingDate || deal.createdAt).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {getFilteredDeals().length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium mb-2">No deals found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="bg-[#D35400] hover:bg-[#B74600]"
                >
                  Create New Deal
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Deal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>
          <DealForm
            stages={stageOptions}
            teamMembers={teamMembers}
            customFields={dealFields}
            onSave={handleSaveNewDeal}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Deal Dialog */}
      <EditDealDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        deal={editingDeal}
        onSave={handleSaveEditedDeal}
        stages={stageOptions}
        teamMembers={teamMembers}
        customFields={dealFields}
      />
      
      {/* Deal Detail Dialog */}
      <DealDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        deal={viewingDeal}
        onUpdate={handleSaveEditedDeal}
        stages={stageOptions}
        teamMembers={teamMembers}
        customFields={dealFields}
      />
      
      {/* Column Customizer Dialog */}
      <ColumnCustomizer
        isOpen={isColumnCustomizerOpen}
        onClose={() => setIsColumnCustomizerOpen(false)}
        columns={columns}
        onSave={handleSaveColumns}
        storageKey={STORAGE_KEYS.DEALS_COLUMNS}
      />
      
      {/* Custom Fields Manager */}
      <CustomFieldsManager
        isOpen={isFieldsManagerOpen}
        onClose={() => setIsFieldsManagerOpen(false)}
        fields={dealFields}
        onChange={handleSaveCustomFields}
      />
    </div>
  );
};

export default Deals;
