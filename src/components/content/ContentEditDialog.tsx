
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContentCreationForm from './ContentCreationForm';
import { useIsMobile } from "@/hooks/use-mobile";
import { ContentItem } from "@/types/masterAccount";
import { toast } from "@/hooks/use-toast";
import { logError } from "@/lib/errorHandling";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ContentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: ContentItem | null;
}

const ContentEditDialog: React.FC<ContentEditDialogProps> = ({
  isOpen,
  onClose,
  contentItem
}) => {
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!contentItem) return null;
  
  const handleSuccess = () => {
    toast({
      title: "Content Updated",
      description: "Your content has been updated successfully."
    });
    onClose();
  };
  
  const handleError = (error: unknown) => {
    setIsSubmitting(false);
    logError(error, "Failed to update content");
  };
  
  // Use Sheet component for tablet-sized devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="px-0 sm:max-w-md w-full">
          <SheetHeader className="px-4">
            <SheetTitle>Edit Content</SheetTitle>
            <SheetDescription>
              Make changes to your content
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 py-2">
            <ContentCreationForm 
              initialData={contentItem}
              isEditing={true}
              onSuccess={handleSuccess}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </div>
          <div className="sticky bottom-0 bg-background p-4 border-t">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Make changes to your content item
          </DialogDescription>
        </DialogHeader>
        <ContentCreationForm 
          initialData={contentItem}
          isEditing={true}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditDialog;
