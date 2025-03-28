
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ContentCreationForm from './ContentCreationForm';
import { useIsMobile } from "@/hooks/use-mobile";
import { ContentItem } from "@/types/masterAccount";

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
  
  if (!contentItem) return null;
  
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader>
            <DrawerTitle>Edit Content</DrawerTitle>
            <DrawerDescription>
              Make changes to your content
            </DrawerDescription>
          </DrawerHeader>
          <ContentCreationForm 
            initialData={contentItem}
            isEditing={true}
            onSuccess={onClose}
          />
          <div className="pt-4 px-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
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
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditDialog;
