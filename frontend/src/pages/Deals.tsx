import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Settings, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
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
import { useMasterAccount } from "@/hooks/useMasterAccount";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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
import { config } from '@/config';
// import ClientsTable from '@/components/clients/ClientsTable';

const demoTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    updatedAt: "Today at 2:34 PM"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "editor",
    status: "active",
    updatedAt: "Yesterday at 5:12 PM"
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
  const { clients } = useMasterAccount();
  const { deals: existingDeals, addDeal: addDealToContext, updateDeal: updateDealInContext, deleteDeal: deleteDealFromContext } = useDeals();
  const { trackChatbotInteraction, trackEmailSent, trackCall, trackTextMessage, trackIntegrationEvent, trackReviewActivity, trackDealActivity } = useActivityTracker();
  const { dealFields, updateDealFields } = useCustomFields();
  
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
  const [teamMembers] = useState<TeamMember[]>(demoTeamMembers);
  const [sortField, setSortField] = useState<'value' | 'company' | 'name' | 'probability' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStage, setFilterStage] = useState<string | null>(null);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [isUpdatingDeal, setIsUpdatingDeal] = useState(false);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);
  const [draggingDealId, setDraggingDealId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<{droppableId: string, index: number} | null>(null);
  
  useEffect(() => {
    setDeals(existingDeals);
    setDealsByStage(getInitialDealsByStage(existingDeals, columns));
  }, [existingDeals, columns]);
  
  useEffect(() => {
    setDealsByStage(getInitialDealsByStage(deals, columns));
  }, [columns, deals]);
  
  const getAllDeals = () => {
    return Object.values(dealsByStage).flat();
  };
  
  const getFilteredDeals = () => {
    let allDeals = getAllDeals();
    
    if (filterStage) {
      allDeals = allDeals.filter(deal => deal.stage === filterStage);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allDeals = allDeals.filter(deal => {
        const name = deal.name.toLowerCase();
        const company = deal.company.toLowerCase();
        const description = deal.description.toLowerCase();
        
        return name.includes(query) || company.includes(query) || description.includes(query);
      });
    }
    
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

  const getFilteredDealsByStage = () => {
    const filteredDeals = getFilteredDeals();
    
    const filteredResult: Record<string, Deal[]> = {};
    
    columns.forEach(column => {
      filteredResult[column.id] = filteredDeals.filter(deal => deal.stage === column.id);
    });
    
    return filteredResult;
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown";
  };

  const getClientInitials = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase() : '??';
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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
  
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    const deal = getAllDeals().find(d => d.id.toString() === draggableId);
    if (!deal) return;
    
    // Store the source information for potential rollback
    setDragSource({ droppableId: source.droppableId, index: source.index });
    
    // Set the dragging state to show loading cursor
    setDraggingDealId(deal.id);
    
    // Add a class to the body to change cursor to wait
    document.body.classList.add('cursor-wait');
    
    const updatedDeal: Deal = {
      ...deal, 
      stage: destination.droppableId,
      updatedAt: new Date().toISOString()
    };
    
    const destinationColumn = columns.find(col => col.id === destination.droppableId);
    
    try {
      // Update in context immediately to show in destination
      updateDealInContext(updatedDeal);
      
      // Send stage update to backend API
      const response = await fetch(`${config.apiUrl}/deals?id=${updatedDeal.id}&&stage=${updatedDeal.stage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          stage: destination.droppableId,
          stageName: destinationColumn?.label || 'Unknown'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update deal stage');
      }
      
      trackDealActivity(deal.name, "moved to new stage", destinationColumn?.label || 'new stage');
      
      toast({
        title: "Deal Moved",
        description: `${deal.name} moved to ${destinationColumn?.label || 'new stage'} stage and synced with HubSpot`
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
      
      // If drag fails, revert the deal to its original position
      if (dragSource) {
        const revertedDeal: Deal = {
          ...deal,
          stage: dragSource.droppableId,
          updatedAt: new Date().toISOString()
        };
        updateDealInContext(revertedDeal);
      }
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update deal stage in HubSpot. Deal returned to original position.",
        variant: "destructive"
      });
    } finally {
      // Reset the dragging state
      setDraggingDealId(null);
      setDragSource(null);
      
      // Remove the wait cursor class
      document.body.classList.remove('cursor-wait');
    }
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsEditDialogOpen(true);
  };

  const handleViewDeal = (deal: Deal) => {
    setViewingDeal(deal);
    setIsDetailDialogOpen(true);
  };

  const handleSaveEditedDeal = async (updatedDeal: Deal) => {
    setIsUpdatingDeal(true);
    try {
      // Send updated deal data to backend API
      console.log(updatedDeal);
      const response = await fetch(`${config.apiUrl}/deals?id=${updatedDeal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDeal),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update deal');
      }
      
      // Update in context
      updateDealInContext(updatedDeal);
      
      trackDealActivity(updatedDeal.name, "updated deal", "Deal details were modified");
      
      toast({
        title: "Deal Updated",
        description: `${updatedDeal.name} has been updated successfully and synced with HubSpot`
      });
    } catch (error) {
      console.error('Error updating deal:', error);
      
      // Still update local context even if API call fails
      updateDealInContext(updatedDeal);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update deal in HubSpot. It was updated locally.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingDeal(false);
      setIsEditDialogOpen(false);
    }
  };

  const handleSaveNewDeal = async (dealData: Partial<Deal>) => {
    // Validate required fields
    if (!dealData.name) {
      toast({
        title: "Error",
        description: "Deal name is required.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingDeal(true);
    
    const now = new Date().toISOString();
    
    const newDeal = {
      ...dealData,
      name: dealData.name || "Unnamed Deal",
      company: dealData.company || "",
      value: dealData.value || 0,
      currency: dealData.currency || "USD",
      probability: dealData.probability || 0,
      stage: dealData.stage || "",
      closingDate: dealData.closingDate || now,
      description: dealData.description || "",
      createdAt: now,
      updatedAt: now
    };
    
    try {

      console.log(newDeal);
      // Send deal data to backend API
      const response = await fetch(`${config.apiUrl}/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeal),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add deal');
      }
      
      const data = await response.json();
      
      // Add the deal to local state with the returned data from HubSpot
      addDealToContext({...newDeal, ...data});
      
      trackDealActivity(dealData.name || "New Deal", "created deal", 
        `Value: ${formatCurrency(dealData.value || 0, dealData.currency || 'USD')}`);
      
      toast({
        title: "Deal Created",
        description: `${dealData.name} has been successfully added to HubSpot.`
      });
      
      // Reset the form
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error adding deal:', error);
      
      // Still add to local context even if API call fails
      addDealToContext(newDeal as Omit<Deal, 'id'>);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add deal to HubSpot. It was saved locally.",
        variant: "destructive"
      });
    } finally {
      // Reset loading state
      setIsAddingDeal(false);
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteDeal = async (deal: Deal) => {
    // Set the deleting state to show loading cursor
    setDeletingDealId(deal.id);
    
    // Add a class to the body to change cursor to wait
    document.body.classList.add('cursor-wait');
    
    try {
      // Send delete request to backend API
      const response = await fetch(`${config.apiUrl}/deals?id=${deal.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete deal');
      }
      
      // Delete from context
      deleteDealFromContext(deal.id);
      
      trackDealActivity(deal.name, "deleted deal", "");
      
      toast({
        title: "Deal Deleted",
        description: `${deal.name} has been deleted and removed from HubSpot`
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      
      // Still delete from local context even if API call fails
      deleteDealFromContext(deal.id);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete deal from HubSpot. It was deleted locally.",
        variant: "destructive"
      });
    } finally {
      // Reset the deleting state
      setDeletingDealId(null);
      
      // Remove the wait cursor class
      document.body.classList.remove('cursor-wait');
    }
  };

  const handleSaveColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
    localStorage.setItem(STORAGE_KEYS.DEALS_COLUMNS, JSON.stringify(newColumns));
    
    setDealsByStage(getInitialDealsByStage(deals, newColumns));
    
    toast({
      title: "Columns Updated",
      description: "Pipeline columns have been updated successfully"
    });
  };

  const handleSaveCustomFields = (newFields: DealFormField[]) => {
    updateDealFields(newFields);
    
    toast({
      title: "Custom Fields Updated",
      description: `${newFields.length} custom fields have been saved`
    });
  };

  const getAssignedPersonName = (assignedId?: string) => {
    if (!assignedId) return "Unassigned";
    if (assignedId === "account-owner") return "Account Owner";
    
    const member = teamMembers.find(m => m.id === assignedId);
    return member ? member.name : "Unassigned";
  };
  
  const handleChangeSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFilterByStage = (stageId: string | null) => {
    setFilterStage(stageId);
  };

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
              disabled={isAddingDeal}
            >
              {isAddingDeal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              New Deal
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
                            snapshot.isDraggingOver ? "bg-muted/50" : "",
                            draggingDealId && dealsByStage[column.id].some(d => d.id === draggingDealId) ? "bg-[#D35400]/5" : ""
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
                                    snapshot.isDragging ? "opacity-75" : "",
                                    draggingDealId === deal.id ? "cursor-wait" : ""
                                  )}
                                >
                                  <Card className={cn(
                                    "hover:shadow-md transition-all duration-300 hover:border-[#D35400]/30",
                                    draggingDealId === deal.id ? "border-[#D35400]/50" : ""
                                  )}>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h3 className="text-base font-medium">{deal.name}</h3>
                                          <div className="text-sm text-muted-foreground">{deal.company}</div>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#D35400]">
                                              {draggingDealId === deal.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                              ) : (
                                                <MoreHorizontal className="h-4 w-4" />
                                              )}
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
                                              disabled={deletingDealId === deal.id}
                                            >
                                              {deletingDealId === deal.id ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                              ) : (
                                                <Trash2 className="h-4 w-4 mr-2" />
                                              )}
                                              {deletingDealId === deal.id ? "Deleting..." : "Delete Deal"}
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
                          disabled={deletingDealId === deal.id}
                        >
                          {deletingDealId === deal.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          {deletingDealId === deal.id ? "Deleting..." : "Delete Deal"}
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
                  disabled={isAddingDeal}
                >
                  {isAddingDeal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                  Create New Deal
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <div>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <DealForm
              stages={stageOptions}
              teamMembers={teamMembers}
              customFields={dealFields}
              onSave={(dealData) => {
                // Ensure custom fields are included in the deal data
                const dealWithCustomFields = {
                  ...dealData,
                  customFields: Object.fromEntries(
                    dealFields
                      .filter(field => field.section === 'custom')
                      .map(field => [field.id, dealData[field.id]])
                  )
                };
                handleSaveNewDeal(dealWithCustomFields);
              }}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={isAddingDeal}
            /> 
          </div>
        </DialogContent>
      </Dialog>
      
      <EditDealDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        deal={editingDeal}
        onSave={handleSaveEditedDeal}
        stages={stageOptions}
        teamMembers={teamMembers}
        customFields={dealFields}
        isLoading={isUpdatingDeal}
      />
      
      <DealDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        deal={viewingDeal}
        onUpdate={handleSaveEditedDeal}
        stages={stageOptions}
        teamMembers={teamMembers}
        customFields={dealFields}
      />
			
      <ColumnCustomizer
        isOpen={isColumnCustomizerOpen}
        onClose={() => setIsColumnCustomizerOpen(false)}
        columns={columns}
        onSave={handleSaveColumns}
        storageKey={STORAGE_KEYS.DEALS_COLUMNS}
      />
      
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
