
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatbotUIProps {
  knowledgeBase: string[];
  onAddKnowledge?: (knowledge: string) => void;
  className?: string;
}

export function ChatbotUI({ knowledgeBase, onAddKnowledge, className }: ChatbotUIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your business assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Simulate AI processing with knowledge base
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic response generation based on knowledge base
      let response = "I'm not sure about that based on my current knowledge.";
      
      // Simple keyword matching from knowledge base
      for (const knowledge of knowledgeBase) {
        const keywords = input.toLowerCase().split(' ');
        if (keywords.some(keyword => 
          keyword.length > 3 && knowledge.toLowerCase().includes(keyword)
        )) {
          response = knowledge;
          break;
        }
      }
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddToKnowledge = () => {
    if (selectedText && onAddKnowledge) {
      onAddKnowledge(selectedText);
      toast({
        title: "Added to Knowledge Base",
        description: "The selected text has been added to the chatbot's knowledge.",
      });
      setSelectedText('');
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your business assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div 
      className={cn("flex flex-col h-full max-h-[600px] bg-background border rounded-md", className)}
      onMouseUp={handleSelection}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Business Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          {selectedText && (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 gap-1"
              onClick={handleAddToKnowledge}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-md:not-sr-only sr-only">Add to Knowledge</span>
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8"
            onClick={clearChat}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear Chat</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 group",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 border">
                  <Bot className="h-4 w-4" />
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg px-3 py-2 max-w-[80%] break-words",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className="mt-1 flex justify-between items-center opacity-60">
                  <span className="text-xs">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 border">
                  <MessageCircle className="h-4 w-4" />
                </Avatar>
              )}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
