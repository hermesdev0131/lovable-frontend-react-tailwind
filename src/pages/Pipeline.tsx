
import React, { useState } from 'react';
import { Plus, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deals, DealStage, getContactById, getStageLabel, formatCurrency } from '@/lib/data';

const Pipeline = () => {
  // Define the stages in the order they should appear
  const stages: DealStage[] = ['lead', 'contact', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Deal Pipeline</h2>
            <p className="text-muted-foreground">Manage and track your sales pipeline</p>
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Deal
          </Button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 overflow-x-auto pb-6">
          {stages.map((stage) => (
            <div key={stage} className="min-w-[300px]">
              <div className="mb-2 flex justify-between items-center animate-fade-in">
                <div>
                  <h3 className="font-medium">{getStageLabel(stage)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {dealsByStage[stage].length} deals • {formatCurrency(stageValues[stage], 'USD')}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {dealsByStage[stage].map((deal, index) => (
                  <Card 
                    key={deal.id} 
                    className="glass-card hover:shadow-md transition-all duration-300 cursor-pointer animate-scale-in"
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
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Move to Next Stage</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3">{deal.company}</div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">{formatCurrency(deal.value, deal.currency)}</div>
                        <div className="text-sm text-blue-500">{deal.probability}%</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(deal.contactId)}
                          </AvatarFallback>
                        </Avatar>
                        
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
                    <span>No deals in this stage</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
