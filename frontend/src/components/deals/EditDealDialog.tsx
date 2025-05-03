
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Deal, Stage } from './types';
import { TeamMember } from '@/components/settings/TeamMembers';
import DealForm, { DealFormField } from './DealForm';

interface EditDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (updatedDeal: Deal) => void;
  stages: Stage[];
  teamMembers: TeamMember[];
  customFields?: DealFormField[];
}

const EditDealDialog: React.FC<EditDealDialogProps> = ({ 
  isOpen, 
  onClose, 
  deal, 
  onSave,
  stages,
  teamMembers,
  customFields = []
}) => {
  if (!deal) return null;

  const handleSave = (updatedDealData: Partial<Deal>) => {
    const updatedDeal = {
      ...deal,
      ...updatedDealData,
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedDeal);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DealForm
          deal={deal}
          stages={stages}
          teamMembers={teamMembers}
          customFields={customFields}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDealDialog;
