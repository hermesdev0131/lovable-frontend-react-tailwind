
import React, { useState, useEffect } from 'react';
import { X, Plus, GripVertical, Edit, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_STAGES, DealStage } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";

interface StageManagerProps {
  stages: DealStage[];
  stageLabels: Record<DealStage, string>;
  onStagesChange: (stages: DealStage[], labels: Record<DealStage, string>) => void;
}

const StageManager: React.FC<StageManagerProps> = ({ stages, stageLabels, onStagesChange }) => {
  const [localStages, setLocalStages] = useState<DealStage[]>([...stages]);
  const [localLabels, setLocalLabels] = useState<Record<DealStage, string>>({...stageLabels});
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState('');
  const [newStageValue, setNewStageValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setLocalStages([...stages]);
    setLocalLabels({...stageLabels});
  }, [stages, stageLabels]);

  const handleSave = () => {
    onStagesChange(localStages, localLabels);
    toast({
      title: "Pipeline updated",
      description: "Your deal stages have been updated successfully."
    });
  };

  const handleAddStage = () => {
    if (!newStageName.trim() || !newStageValue.trim()) return;
    
    const stageId = newStageValue.toLowerCase().replace(/\s+/g, '-');
    
    if (localStages.includes(stageId)) {
      toast({
        title: "Stage already exists",
        description: "Please use a unique identifier for the stage.",
        variant: "destructive"
      });
      return;
    }
    
    setLocalStages([...localStages, stageId]);
    setLocalLabels({...localLabels, [stageId]: newStageName});
    setNewStageName('');
    setNewStageValue('');
  };

  const handleRemoveStage = (stageId: string) => {
    setLocalStages(localStages.filter(s => s !== stageId));
    const newLabels = {...localLabels};
    delete newLabels[stageId];
    setLocalLabels(newLabels);
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === localStages.length - 1)
    ) return;
    
    const newStages = [...localStages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index], newStages[swapIndex]] = [newStages[swapIndex], newStages[index]];
    setLocalStages(newStages);
  };

  const handleEditLabel = (stageId: string, newLabel: string) => {
    setLocalLabels({...localLabels, [stageId]: newLabel});
    setEditingStage(null);
  };

  const handleReset = () => {
    setLocalStages([...DEFAULT_STAGES]);
    const defaultLabels: Record<DealStage, string> = {};
    DEFAULT_STAGES.forEach(stage => {
      defaultLabels[stage] = stageLabels[stage] || stage;
    });
    setLocalLabels(defaultLabels);
    toast({
      title: "Stages reset",
      description: "Pipeline stages have been reset to default values."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Current Stages</h3>
        <div className="border rounded-md divide-y">
          {localStages.map((stageId, index) => (
            <div key={stageId} className="flex items-center p-2 group hover:bg-muted/50">
              <div className="text-muted-foreground cursor-move">
                <GripVertical size={16} />
              </div>
              
              <div className="flex-1 px-2">
                {editingStage === stageId ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={localLabels[stageId]}
                      onChange={(e) => setLocalLabels({...localLabels, [stageId]: e.target.value})}
                      className="h-8"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7" 
                      onClick={() => handleEditLabel(stageId, localLabels[stageId])}
                    >
                      <Save size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{localLabels[stageId]}</span>
                    <span className="text-xs text-muted-foreground">(id: {stageId})</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7" 
                  onClick={() => setEditingStage(stageId === editingStage ? null : stageId)}
                >
                  <Edit size={14} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7" 
                  onClick={() => handleMoveStage(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp size={14} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7" 
                  onClick={() => handleMoveStage(index, 'down')}
                  disabled={index === localStages.length - 1}
                >
                  <ArrowDown size={14} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-destructive hover:text-destructive" 
                  onClick={() => handleRemoveStage(stageId)}
                  disabled={['closed-won', 'closed-lost'].includes(stageId)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Add New Stage</h3>
        <div className="flex gap-2 items-end">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-medium" htmlFor="stageName">Display Name</label>
            <Input
              id="stageName"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              placeholder="e.g. Initial Contact"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-sm font-medium" htmlFor="stageValue">Stage ID</label>
            <Input
              id="stageValue"
              value={newStageValue}
              onChange={(e) => setNewStageValue(e.target.value)}
              placeholder="e.g. initial-contact"
            />
          </div>
          <Button onClick={handleAddStage} className="flex items-center">
            <Plus size={16} className="mr-1" /> Add Stage
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default StageManager;
