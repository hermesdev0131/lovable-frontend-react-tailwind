
import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Info, Book, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeEditor } from '@/components/chatbot/KnowledgeEditor';
import { ChatbotUI } from '@/components/chatbot/ChatbotUI';
import { ChatDrawer } from '@/components/chatbot/ChatDrawer';

// Sample initial knowledge
const initialKnowledge = [
  "Our business hours are Monday to Friday, 9 AM to 6 PM Eastern Time.",
  "We offer a 30-day money-back guarantee on all our products.",
  "Our premium support package includes 24/7 phone and email support.",
  "Our company was founded in 2010 and has offices in New York, London, and Singapore.",
  "We integrate with most popular CRM systems including Salesforce, HubSpot, and Zoho."
];

const ChatbotManagement = () => {
  // State for knowledge base - in a real app, this would be stored in a database
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('chatbotKnowledge');
    return saved ? JSON.parse(saved) : initialKnowledge;
  });

  // Save knowledge base to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatbotKnowledge', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  const handleAddKnowledge = (knowledge: string) => {
    if (!knowledgeBase.includes(knowledge)) {
      setKnowledgeBase([...knowledgeBase, knowledge]);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight">Chatbot Management</h2>
        <p className="text-muted-foreground">Train and configure your business assistant</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Tabs defaultValue="knowledge" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Test Chatbot
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="knowledge">
              <KnowledgeEditor 
                knowledgeBase={knowledgeBase} 
                setKnowledgeBase={setKnowledgeBase} 
              />
            </TabsContent>
            
            <TabsContent value="test">
              <div className="bg-background border rounded-md overflow-hidden h-[600px]">
                <ChatbotUI 
                  knowledgeBase={knowledgeBase} 
                  onAddKnowledge={handleAddKnowledge} 
                  className="h-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Add Business Knowledge</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by adding company information, policies, product details, and FAQs to train your chatbot.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">2. Test Your Chatbot</h4>
                  <p className="text-sm text-muted-foreground">
                    Ask questions to see how your chatbot responds. Refine knowledge as needed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">3. Enable the Live Assistant</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you're satisfied with the responses, enable the assistant on your site for visitors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Tips for Better Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Use clear, concise language for knowledge entries</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Add variations of questions customers might ask</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Include specific product information and pricing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Add common troubleshooting steps for products/services</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>Review and update knowledge regularly</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The global chat drawer */}
      <ChatDrawer 
        knowledgeBase={knowledgeBase} 
        onAddKnowledge={handleAddKnowledge} 
      />
    </div>
  );
};

export default ChatbotManagement;
