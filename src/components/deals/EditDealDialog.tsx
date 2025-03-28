
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DealFormFields from './DealFormFields';
import { Deal, Stage } from './types';
import { TeamMember } from '@/components/settings/TeamMembers';

interface EditDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (updatedDeal: Deal) => void;
  stages: Stage[];
  teamMembers: TeamMember[];
}

const EditDealDialog: React.FC<EditDealDialogProps> = ({ 
  isOpen, 
  onClose, 
  deal, 
  onSave,
  stages,
  teamMembers 
}) => {
  const [editedDeal, setEditedDeal] = useState<Deal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (deal) {
      setEditedDeal({ ...deal });
    }
  }, [deal]);

  const handleChange = (field: string, value: any) => {
    if (editedDeal) {
      setEditedDeal({ ...editedDeal, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedDeal) {
      onSave(editedDeal);
      toast({
        title: "Deal Updated",
        description: `${editedDeal.name} has been updated successfully.`
      });
      onClose();
    }
  };

  if (!editedDeal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>
            Update the details for this deal. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DealFormFields 
          deal={editedDeal}
          stages={stages}
          teamMembers={teamMembers}
          onChange={handleChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealDialog;
