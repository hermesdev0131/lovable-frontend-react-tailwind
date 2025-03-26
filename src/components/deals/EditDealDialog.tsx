
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EditDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
  onSave: (updatedDeal: any) => void;
  stages: { id: string, label: string }[];
}

const EditDealDialog: React.FC<EditDealDialogProps> = ({ 
  isOpen, 
  onClose, 
  deal, 
  onSave,
  stages 
}) => {
  const [editedDeal, setEditedDeal] = useState<any>(null);
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Deal Name</Label>
              <Input
                id="name"
                value={editedDeal.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={editedDeal.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="value">Deal Value</Label>
              <Input
                id="value"
                type="number"
                value={editedDeal.value}
                onChange={(e) => handleChange('value', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={editedDeal.currency} 
                onValueChange={(value) => handleChange('currency', value)}
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
                value={editedDeal.probability}
                onChange={(e) => handleChange('probability', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="stage">Stage</Label>
              <Select 
                value={editedDeal.stage} 
                onValueChange={(value) => handleChange('stage', value)}
              >
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="date">Expected Close Date</Label>
              <Input
                id="date"
                type="date"
                value={editedDeal.closingDate}
                onChange={(e) => handleChange('closingDate', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editedDeal.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealDialog;
