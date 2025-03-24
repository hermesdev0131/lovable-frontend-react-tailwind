
import React, { useState } from 'react';
import { Plus, ArrowRight, MoreHorizontal, Filter, List, Kanban, ArrowDown, ArrowUp, X, Move } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deals as initialDeals, Deal, DealStage, getContactById, getStageLabel, formatCurrency } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Pipeline = () => {
  // Define the stages in the order they should appear
  const stages: DealStage[] = ['lead', 'contact', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('kanban');
  const [sortField, setSortField] = useState<'value' | 'probability'>('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [allDeals, setAllDeals] = useState<Deal[]>([...initialDeals]);
  const [addDealOpen, setAddDealOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    company: '',
    value: 0,
    currency: 'USD',
    probability: 50,
    stage: 'lead' as DealStage,
    contactId: 'contact1',
    expectedCloseDate: new Date().toISOString().split('T')[0],
    notes: '',
    createdAt: '',
    updatedAt: ''
  });
  const { toast } = useToast();

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = allDeals.filter(deal => deal.stage === stage);
    return acc;
  }, {} as Record<DealStage, Deal[]>);
  
  // Get the total value of deals in each stage
  const stageValues = stages.reduce((acc, stage) => {
    const total = dealsByStage[stage].reduce((sum, deal) => sum + deal.value, 0);
    acc[stage] = total;
    return acc;
  }, {} as Record<DealStage, number>);

  // Extract initials for avatar
  const getInitials = (contactId: string) => {
    const contact = getContactById(contactId);
    if (!contact) return '??';
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  };
  
  // Sort deals based on current sort settings
  const getSortedDeals = () => {
    return [...allDeals].sort((a, b) => {
      const aValue = sortField === 'value' ? a.value : a.probability;
      const bValue = sortField === 'value' ? b.value : b.probability;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  // Handle toggling sort direction
  const handleSort = (field: 'value' | 'probability') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle adding a new deal
  const handleAddDeal = () => {
    const dealId = `deal${allDeals.length + 1}`;
    const currentDate = new Date().toISOString();
    
    const deal: Deal = { 
      id: dealId,
      ...newDeal,
      notes: '',
      createdAt: currentDate,
      updatedAt: currentDate
    };
    
    setAllDeals([...allDeals, deal]);
    setAddDealOpen(false);
    toast({
      title: "Deal Added",
      description: `${newDeal.name} has been added to ${getStageLabel(newDeal.stage)}`,
    });
    
    // Reset the form
    setNewDeal({
      name: '',
      company: '',
      value: 0,
      currency: 'USD',
      probability: 50,
      stage: 'lead',
      contactId: 'contact1',
      expectedCloseDate: new Date().toISOString().split('T')[0],
      notes: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const deal = allDeals.find(d => d.id === draggableId);
    if (!deal) return;

    // Create a new deal with the updated stage
    const updatedDeal: Deal = {
      ...deal,
      stage: destination.droppableId as DealStage,
      updatedAt: new Date().toISOString()
    };

    // Update the deals array with the modified deal
    const newDeals = allDeals.map(d => d.id === draggableId ? updatedDeal : d);
    setAllDeals(newDeals);

    // Show toast notification
    toast({
      title: "Deal Moved",
      description: `${deal.name} moved to ${getStageLabel(destination.droppableId as DealStage)}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Deal Pipeline</h2>
            <p className="text-muted-foreground">Manage and track your sales pipeline</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button 
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 shadow-md" 
              onClick={() => setAddDealOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Deal
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'kanban' | 'list')} className="mb-6">
          <TabsList className="grid w-[200px] grid-cols-2 mb-8">
            <TabsTrigger value="kanban" className="flex items-center gap-1">
              <Kanban className="h-4 w-4" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <List className="h-4 w-4" /> List
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="mt-0">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 overflow-x-auto pb-6">
                {stages.map((stage) => (
                  <div key={stage} className="min-w-[300px]">
                    <div className="mb-2 flex justify-between items-center bg-muted/30 rounded-md p-2">
                      <div>
                        <h3 className="font-medium">{getStageLabel(stage)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dealsByStage[stage].length} deals • {formatCurrency(stageValues[stage], 'USD')}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full"
                        onClick={() => {
                          setNewDeal({...newDeal, stage: stage});
                          setAddDealOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Droppable droppableId={stage}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3 min-h-[200px] p-1 rounded-md transition-colors"
                          style={{ background: provided.isDraggingOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}
                        >
                          {dealsByStage[stage].map((deal, index) => (
                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? '0.8' : '1'
                                  }}
                                >
                                  <Card 
                                    className={`border hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-move ${
                                      snapshot.isDragging ? 'shadow-lg border-primary/30' : ''
                                    }`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium truncate">{deal.name}</h4>
                                        <div className="flex">
                                          <div {...provided.dragHandleProps} className="mr-1 cursor-grab">
                                            <Move className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                          </div>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[180px]">
                                              <DropdownMenuItem>View Details</DropdownMenuItem>
                                              <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                                              <DropdownMenuItem>Move to Next Stage</DropdownMenuItem>
                                              <DropdownMenuItem className="text-destructive">Delete Deal</DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>
                                      
                                      <div className="text-sm text-muted-foreground mb-3">{deal.company}</div>
                                      
                                      <div className="flex justify-between items-center mb-3">
                                        <div className="font-medium">{formatCurrency(deal.value, deal.currency)}</div>
                                        <div 
                                          className={`text-xs px-2 py-1 rounded-full ${
                                            deal.probability >= 70 ? 'bg-green-100 text-green-800' : 
                                            deal.probability >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {deal.probability}%
                                        </div>
                                      </div>
                                      
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                              {getInitials(deal.contactId)}
                                            </AvatarFallback>
                                          </Avatar>
                                          {stage !== 'closed-won' && stage !== 'closed-lost' && (
                                            <div className="text-xs text-muted-foreground">
                                              {new Date(deal.expectedCloseDate).toLocaleDateString()}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          
                          {dealsByStage[stage].length === 0 && (
                            <div 
                              className="h-24 border border-dashed rounded-md flex items-center justify-center text-sm text-muted-foreground hover:bg-accent/10 hover:border-accent transition-colors" 
                              onClick={() => {
                                setNewDeal({...newDeal, stage: stage});
                                setAddDealOpen(true);
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <Plus className="h-4 w-4" /> Add a deal here
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Deal</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="w-[150px]" onClick={() => handleSort('value')} style={{ cursor: 'pointer' }}>
                        <div className="flex items-center gap-1">
                          Value
                          {sortField === 'value' && (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]" onClick={() => handleSort('probability')} style={{ cursor: 'pointer' }}>
                        <div className="flex items-center gap-1">
                          Prob.
                          {sortField === 'probability' && (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedDeals().map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div className="font-medium">{deal.name}</div>
                          <div className="flex items-center mt-1">
                            <Avatar className="h-5 w-5 mr-2">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(deal.contactId)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {new Date(deal.expectedCloseDate).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{deal.company}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted">
                            {getStageLabel(deal.stage)}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(deal.value, deal.currency)}</TableCell>
                        <TableCell>
                          <div 
                            className={`text-xs px-2 py-1 rounded-full inline-block ${
                              deal.probability >= 70 ? 'bg-green-100 text-green-800' : 
                              deal.probability >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {deal.probability}%
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                              <DropdownMenuItem>Move to Next Stage</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete Deal</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Deal Dialog */}
      <Dialog open={addDealOpen} onOpenChange={setAddDealOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
            <DialogDescription>
              Enter the details for your new deal. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Deal Name</Label>
                <Input
                  id="name"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                  placeholder="e.g. Annual Software License"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
                  placeholder="e.g. Acme Corp"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="value">Deal Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newDeal.value.toString()}
                  onChange={(e) => setNewDeal({...newDeal, value: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={newDeal.currency} 
                  onValueChange={(value) => setNewDeal({...newDeal, currency: value})}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={newDeal.probability.toString()}
                  onChange={(e) => setNewDeal({...newDeal, probability: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select 
                  value={newDeal.stage} 
                  onValueChange={(value) => setNewDeal({...newDeal, stage: value as DealStage})}
                >
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>{getStageLabel(stage)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="date">Expected Close Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDeal.expectedCloseDate}
                  onChange={(e) => setNewDeal({...newDeal, expectedCloseDate: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDealOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddDeal} disabled={!newDeal.name || !newDeal.company}>
              Add Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pipeline;
