
import React, { useState } from 'react';
import { Plus, ArrowRight, MoreHorizontal, Filter, List, Kanban, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deals, DealStage, getContactById, getStageLabel, formatCurrency } from '@/lib/data';

const Pipeline = () => {
  // Define the stages in the order they should appear
  const stages: DealStage[] = ['lead', 'contact', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('kanban');
  const [sortField, setSortField] = useState<'value' | 'probability'>('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter(deal => deal.stage === stage);
    return acc;
  }, {} as Record<DealStage, typeof deals>);
  
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
    return [...deals].sort((a, b) => {
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
            <Button className="flex items-center gap-1">
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
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {dealsByStage[stage].map((deal, index) => (
                      <Card 
                        key={deal.id} 
                        className="border hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing animate-scale-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium truncate">{deal.name}</h4>
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
                            
                            {stage !== 'closed-won' && stage !== 'closed-lost' && stages.indexOf(stage) < stages.length - 3 && (
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {dealsByStage[stage].length === 0 && (
                      <div className="h-24 border border-dashed rounded-md flex items-center justify-center text-sm text-muted-foreground">
                        <span>Drop a deal here</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default Pipeline;
