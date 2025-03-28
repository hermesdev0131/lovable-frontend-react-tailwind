
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Deal, Stage, DEFAULT_COLUMNS } from "@/components/deals/types";
import { useToast } from "@/hooks/use-toast";
import EditDealDialog from "@/components/deals/EditDealDialog";
import { useDeals } from '@/contexts/DealsContext';
import { TeamMember } from '@/components/settings/TeamMembers';

const SAMPLE_TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm1', name: 'John Doe', role: 'admin', email: 'john@example.com' },
  { id: 'tm2', name: 'Jane Smith', role: 'editor', email: 'jane@example.com' },
  { id: 'tm3', name: 'Alex Johnson', role: 'admin', email: 'alex@example.com' },
];

const Deals = () => {
  const { deals, addDeal, updateDeal, deleteDeal } = useDeals();
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { toast } = useToast();

  const handleAddDeal = (dealData: Omit<Deal, "id">) => {
    addDeal(dealData);
    toast({
      title: "Deal Added",
      description: `${dealData.name} has been added successfully.`
    });
    setIsAddingDeal(false);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    updateDeal(updatedDeal);
  };

  const handleOpenEditDialog = (deal: Deal) => {
    setEditingDeal(deal);
  };

  const stages: Stage[] = DEFAULT_COLUMNS.map(column => ({
    id: column.id,
    label: column.label
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-muted-foreground">Manage and track your deals</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setIsAddingDeal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">No deals added yet</p>
              <Button onClick={() => setIsAddingDeal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Deal
              </Button>
            </CardContent>
          </Card>
        ) : (
          deals.map((deal) => (
            <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOpenEditDialog(deal)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{deal.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{deal.company}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="font-medium">{deal.value} {deal.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Probability</p>
                    <p className="font-medium">{deal.probability}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stage</p>
                    <p className="font-medium">
                      {stages.find(s => s.id === deal.stage)?.label || deal.stage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Closing Date</p>
                    <p className="font-medium">{new Date(deal.closingDate).toLocaleDateString()}</p>
                  </div>
                  {deal.assignedTo && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium">
                        {deal.assignedTo === 'account-owner' 
                          ? 'Account Owner' 
                          : SAMPLE_TEAM_MEMBERS.find(m => m.id === deal.assignedTo)?.name || deal.assignedTo}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Deal Dialog */}
      <EditDealDialog
        isOpen={isAddingDeal}
        onClose={() => setIsAddingDeal(false)}
        deal={null}
        onSave={handleAddDeal}
        stages={stages}
        teamMembers={SAMPLE_TEAM_MEMBERS}
      />

      {/* Edit Deal Dialog */}
      {editingDeal && (
        <EditDealDialog
          isOpen={!!editingDeal}
          onClose={() => setEditingDeal(null)}
          deal={editingDeal}
          onSave={handleUpdateDeal}
          stages={stages}
          teamMembers={SAMPLE_TEAM_MEMBERS}
        />
      )}
    </div>
  );
};

export default Deals;
