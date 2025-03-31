
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GripVertical, Plus, X, Edit, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DealFormField } from './DealForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface CustomFieldsManagerProps {
  fields: DealFormField[];
  onChange: (fields: DealFormField[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({ 
  fields, 
  onChange,
  isOpen,
  onClose
}) => {
  const [localFields, setLocalFields] = useState<DealFormField[]>(fields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<DealFormField>>({
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    section: 'custom'
  });
  const { toast } = useToast();

  const handleAddField = () => {
    if (!newField.label) {
      toast({
        title: "Required field",
        description: "Please enter a label for the field",
        variant: "destructive"
      });
      return;
    }
    
    const id = newField.label.toLowerCase().replace(/\s+/g, '_');
    
    if (localFields.some(field => field.id === id)) {
      toast({
        title: "Duplicate field",
        description: "A field with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    const fieldToAdd: DealFormField = {
      id,
      type: newField.type as any,
      label: newField.label,
      placeholder: newField.placeholder || '',
      required: newField.required || false,
      options: newField.options || [],
      section: newField.section as any || 'custom'
    };
    
    setLocalFields([...localFields, fieldToAdd]);
    
    // Reset the new field form
    setNewField({
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      section: 'custom'
    });
    
    toast({
      title: "Field added",
      description: `"${fieldToAdd.label}" field has been added`
    });
  };

  const handleUpdateField = (index: number, updates: Partial<DealFormField>) => {
    const updatedFields = [...localFields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setLocalFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    const fieldToRemove = localFields[index];
    const updatedFields = [...localFields];
    updatedFields.splice(index, 1);
    setLocalFields(updatedFields);
    
    toast({
      title: "Field removed",
      description: `"${fieldToRemove.label}" field has been removed`
    });
  };

  const handleSaveFields = () => {
    onChange(localFields);
    
    toast({
      title: "Fields saved",
      description: `${localFields.length} custom fields have been saved`
    });
    
    onClose();
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(localFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLocalFields(items);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Custom Deal Fields</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add New Field</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="field-label">Field Label*</Label>
                  <Input 
                    id="field-label"
                    placeholder="e.g. Project Timeline"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="field-type">Field Type</Label>
                  <Select 
                    value={newField.type as string} 
                    onValueChange={(value) => setNewField({ ...newField, type: value as any })}
                  >
                    <SelectTrigger id="field-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="select">Select/Dropdown</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="field-section">Section</Label>
                  <Select 
                    value={newField.section as string} 
                    onValueChange={(value) => setNewField({ ...newField, section: value as any })}
                  >
                    <SelectTrigger id="field-section">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Information</SelectItem>
                      <SelectItem value="details">Details</SelectItem>
                      <SelectItem value="custom">Custom Fields</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input 
                    id="field-placeholder"
                    placeholder="Placeholder text"
                    value={newField.placeholder || ''}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input 
                    type="checkbox" 
                    id="field-required" 
                    checked={newField.required || false}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="h-4 w-4" 
                  />
                  <Label htmlFor="field-required">Required Field</Label>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddField}
                    className="flex items-center gap-1 bg-[#D35400] hover:bg-[#B74600] w-full"
                  >
                    <Plus size={16} /> Add Field
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Custom Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {localFields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No custom fields defined yet
                        </div>
                      ) : (
                        localFields.map((field, index) => (
                          <Draggable 
                            key={field.id} 
                            draggableId={field.id} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border rounded-md p-3 ${
                                  snapshot.isDragging ? 'bg-muted/70' : 'bg-card'
                                }`}
                              >
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-3">
                                    <div {...provided.dragHandleProps} className="cursor-move">
                                      <GripVertical size={18} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{field.label}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Type: {field.type}{field.required ? ' • Required' : ''}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-[#D35400]/10 hover:text-[#D35400]"
                                      onClick={() => setEditingField(field.id)}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => handleRemoveField(index)}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveFields} className="bg-[#D35400] hover:bg-[#B74600]">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomFieldsManager;
