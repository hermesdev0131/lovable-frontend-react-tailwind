
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export interface BookingType {
  id: string;
  name: string;
  duration: number;
}

interface EditBookingTypeDialogProps {
  bookingType: BookingType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bookingType: BookingType) => void;
}

const EditBookingTypeDialog: React.FC<EditBookingTypeDialogProps> = ({
  bookingType,
  open,
  onOpenChange,
  onSave,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(bookingType?.name || '');
  const [duration, setDuration] = useState(bookingType?.duration.toString() || '30');
  const [id, setId] = useState(bookingType?.id || '');

  React.useEffect(() => {
    if (bookingType) {
      setName(bookingType.name);
      setDuration(bookingType.duration.toString());
      setId(bookingType.id);
    } else {
      setName('');
      setDuration('30');
      setId('');
    }
  }, [bookingType]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the booking type",
        variant: "destructive",
      });
      return;
    }

    if (!duration || parseInt(duration) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid duration",
        variant: "destructive",
      });
      return;
    }

    let bookingId = id;
    if (!bookingId) {
      bookingId = name.toLowerCase().replace(/\s+/g, '-');
    }

    onSave({
      id: bookingId,
      name,
      duration: parseInt(duration),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{bookingType ? 'Edit Booking Type' : 'Create Booking Type'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sales Call"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input 
              id="duration"
              type="number"
              min="5"
              step="5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          
          {bookingType && (
            <div className="space-y-2">
              <Label htmlFor="id">Link ID (optional)</Label>
              <Input 
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. sales-call"
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the booking URL. Leave unchanged to keep existing links working.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingTypeDialog;
