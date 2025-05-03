
import React, { useState } from 'react';
import { PlusCircle, Save, Trash, X, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

interface KnowledgeEditorProps {
  knowledgeBase: string[];
  setKnowledgeBase: (knowledge: string[]) => void;
}

export function KnowledgeEditor({ knowledgeBase, setKnowledgeBase }: KnowledgeEditorProps) {
  const [newEntry, setNewEntry] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;
    
    setKnowledgeBase([...knowledgeBase, newEntry.trim()]);
    setNewEntry('');
    toast({
      title: "Added to Knowledge Base",
      description: "New information has been added to the chatbot.",
    });
  };

  const handleRemoveEntry = (index: number) => {
    const updatedKnowledge = [...knowledgeBase];
    updatedKnowledge.splice(index, 1);
    setKnowledgeBase(updatedKnowledge);
    toast({
      title: "Removed from Knowledge Base",
      description: "The information has been removed from the chatbot.",
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingContent(knowledgeBase[index]);
    setSheetOpen(true);
  };

  const saveEdit = () => {
    if (editingIndex === null || !editingContent.trim()) return;
    
    const updatedKnowledge = [...knowledgeBase];
    updatedKnowledge[editingIndex] = editingContent.trim();
    setKnowledgeBase(updatedKnowledge);
    
    setEditingIndex(null);
    setEditingContent('');
    setSheetOpen(false);
    
    toast({
      title: "Knowledge Base Updated",
      description: "The information has been updated in the chatbot.",
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingContent('');
    setSheetOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Knowledge</CardTitle>
          <CardDescription>
            Train your chatbot by adding business knowledge. Add facts, policies, procedures, or any information you want the bot to know.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter business knowledge (e.g., 'Our return policy allows returns within 30 days with receipt')"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddEntry} disabled={!newEntry.trim()} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Knowledge Base
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>
            All the information your chatbot has been trained on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full pr-4">
            {knowledgeBase.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileText className="h-12 w-12 mb-2 opacity-50" />
                <p>No knowledge entries yet</p>
                <p className="text-sm">Add some information to train your chatbot</p>
              </div>
            ) : (
              <div className="space-y-2">
                {knowledgeBase.map((entry, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-muted rounded-md flex justify-between items-start group"
                  >
                    <p className="text-sm flex-1 mr-4">{entry}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEditing(index)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveEntry(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Total entries: {knowledgeBase.length}
          </p>
        </CardFooter>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Knowledge</SheetTitle>
            <SheetDescription>
              Update the information in your chatbot's knowledge base.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button onClick={saveEdit} disabled={!editingContent.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
