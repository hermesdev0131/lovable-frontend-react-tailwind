
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Edit, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from "@/hooks/use-toast";

export interface Column {
  id: string;
  label: string;
}

interface ColumnCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onSave: (columns: Column[]) => void;
  storageKey?: string;
}

const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  isOpen,
  onClose,
  columns,
  onSave,
  storageKey
}) => {
  const [workingColumns, setWorkingColumns] = useState<Column[]>([...columns]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    // Validate that no columns are empty
    if (workingColumns.some(col => !col.label.trim())) {
      toast({
        title: "Validation Error",
        description: "Column names cannot be empty",
        variant: "destructive"
      });
      return;
    }

    onSave(workingColumns);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(workingColumns));
    }
    
    toast({
      title: "Columns Saved",
      description: "Your column configuration has been updated"
    });
    
    onClose();
  };

  const handleAddColumn = () => {
    if (!newColumnLabel.trim()) {
      toast({
        title: "Validation Error",
        description: "Column name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newId = `column-${Date.now()}`;
    setWorkingColumns([...workingColumns, { id: newId, label: newColumnLabel }]);
    setNewColumnLabel('');
  };

  const handleRemoveColumn = (index: number) => {
    if (workingColumns.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one column",
        variant: "destructive"
      });
      return;
    }

    const newColumns = [...workingColumns];
    newColumns.splice(index, 1);
    setWorkingColumns(newColumns);
  };

  const handleStartEditing = (index: number) => {
    setEditingIndex(index);
    setEditingLabel(workingColumns[index].label);
  };

  const handleSaveEditing = () => {
    if (!editingLabel.trim()) {
      toast({
        title: "Validation Error",
        description: "Column name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (editingIndex !== null) {
      const newColumns = [...workingColumns];
      newColumns[editingIndex] = { ...newColumns[editingIndex], label: editingLabel };
      setWorkingColumns(newColumns);
      setEditingIndex(null);
      setEditingLabel('');
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(workingColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWorkingColumns(items);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customize Columns</DialogTitle>
          <DialogDescription>
            Drag to reorder columns, edit or add new ones.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <div
                  className="space-y-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {workingColumns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center bg-muted/40 rounded-md p-2"
                        >
                          <div {...provided.dragHandleProps} className="px-2 cursor-grab">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {editingIndex === index ? (
                            <div className="flex-1 flex items-center gap-2 mx-2">
                              <Input
                                value={editingLabel}
                                onChange={(e) => setEditingLabel(e.target.value)}
                                className="flex-1"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEditing();
                                  if (e.key === 'Escape') {
                                    setEditingIndex(null);
                                    setEditingLabel('');
                                  }
                                }}
                              />
                              <Button size="sm" onClick={handleSaveEditing}>Save</Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => {
                                  setEditingIndex(null);
                                  setEditingLabel('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <span className="flex-1 mx-2">{column.label}</span>
                          )}
                          
                          <div className="flex gap-1">
                            {editingIndex !== index && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleStartEditing(index)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleRemoveColumn(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <div className="border-t pt-4">
            <Label htmlFor="new-column" className="mb-2 block">Add New Column</Label>
            <div className="flex gap-2">
              <Input
                id="new-column"
                value={newColumnLabel}
                onChange={(e) => setNewColumnLabel(e.target.value)}
                placeholder="Enter column name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newColumnLabel.trim()) handleAddColumn();
                }}
              />
              <Button onClick={handleAddColumn}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setWorkingColumns([...columns]);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnCustomizer;
