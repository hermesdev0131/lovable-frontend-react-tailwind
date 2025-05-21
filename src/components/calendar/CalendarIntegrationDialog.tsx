
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import CalendarIntegration from './CalendarIntegration';

interface CalendarIntegrationDialogProps {
  onSync?: () => void;
  triggerButtonText?: string;
  triggerButtonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

const CalendarIntegrationDialog: React.FC<CalendarIntegrationDialogProps> = ({
  onSync = () => {},
  triggerButtonText = "Connect Calendar",
  triggerButtonVariant = "default"
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSync = () => {
    onSync();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerButtonVariant} className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <CalendarIntegration 
          onSync={handleSync} 
          onClose={handleClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarIntegrationDialog;
