
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ChatbotUI } from './ChatbotUI';
import { useActivityTracker } from '@/hooks/useActivityTracker';

interface ChatDrawerProps {
  knowledgeBase: string[];
  onAddKnowledge?: (knowledge: string) => void;
}

export function ChatDrawer({ knowledgeBase, onAddKnowledge }: ChatDrawerProps) {
  const [open, setOpen] = useState(false);
  const { trackChatbotInteraction } = useActivityTracker();

  const handleAddKnowledge = (knowledge: string) => {
    if (onAddKnowledge) {
      onAddKnowledge(knowledge);
    }
  };

  // Track when user opens the chatbot
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      trackChatbotInteraction("Opened chatbot");
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        <div className="p-4 h-full">
          <ChatbotUI 
            knowledgeBase={knowledgeBase} 
            onAddKnowledge={handleAddKnowledge}
            className="h-full max-h-[calc(85vh-32px)]" 
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
