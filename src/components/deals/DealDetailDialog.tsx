
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Deal } from './types';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, FileText, Users, Paperclip, CalendarIcon, Mail, Phone, MessageSquare } from "lucide-react";
import DealForm from './DealForm';
import { TeamMember } from '@/components/settings/TeamMembers';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { DealFormField } from './DealForm';

interface DealDetailDialogProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (dealData: Deal) => void;
  stages: { id: string; label: string }[];
  teamMembers: TeamMember[];
  customFields?: DealFormField[];
}

const DealDetailDialog: React.FC<DealDetailDialogProps> = ({
  deal,
  isOpen,
  onClose,
  onUpdate,
  stages,
  teamMembers,
  customFields = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { trackDealActivity } = useActivityTracker();
  
  const formatCurrency = (value?: number, currency = 'USD') => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleUpdateDeal = (updatedDealData: Partial<Deal>) => {
    if (!deal) return;
    
    const updatedDeal = {
      ...deal,
      ...updatedDealData
    };
    
    onUpdate(updatedDeal);
    trackDealActivity(deal.name, "updated deal", "Deal details were modified");
    setIsEditing(false);
    
    toast({
      title: "Deal updated",
      description: `${deal.name} has been updated successfully`
    });
  };
  
  const getStageBadgeVariant = (stage?: string): "default" | "outline" | "secondary" | "destructive" => {
    if (!stage) return "default";
    
    if (stage.includes("won")) return "default";
    if (stage.includes("lost")) return "destructive";
    if (stage.includes("negotiation")) return "secondary";
    
    return "outline";
  };
  
  const getStageLabel = (stageId?: string) => {
    if (!stageId) return "Unknown";
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.label : stageId;
  };
  
  const getAssignedToName = (assignedId?: string) => {
    if (!assignedId) return "Unassigned";
    if (assignedId === "account-owner") return "Account Owner";
    
    const member = teamMembers.find(m => m.id === assignedId);
    return member ? member.name : assignedId;
  };
  
  if (!deal) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>{isEditing ? "Edit Deal: " : ""}{deal.name}</span>
              <Badge variant={getStageBadgeVariant(deal.stage)}>
                {getStageLabel(deal.stage)}
              </Badge>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                className="hover:bg-[#D35400]/10 hover:text-[#D35400] hover:border-[#D35400]"
                onClick={() => setIsEditing(true)}
              >
                Edit Deal
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {isEditing ? (
          <DealForm
            deal={deal}
            stages={stages}
            teamMembers={teamMembers}
            customFields={customFields}
            onSave={handleUpdateDeal}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Tabs defaultValue="overview" className="pt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attachments">Files & Appointments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Deal Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <DollarSign size={18} className="text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Deal Value</div>
                              <div className="font-medium">{formatCurrency(deal.value, deal.currency)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText size={18} className="text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Probability</div>
                              <div className="font-medium">{deal.probability}%</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Expected Close Date</div>
                              <div className="font-medium">{new Date(deal.closingDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={18} className="text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Created</div>
                              <div className="font-medium">{new Date(deal.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">Assigned To</div>
                              <div className="font-medium">{getAssignedToName(deal.assignedTo)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Company & Contact</h3>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-md">
                            <div className="text-sm text-muted-foreground">Company</div>
                            <div className="font-medium text-lg">{deal.company}</div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" className="flex items-center gap-1 flex-1">
                              <Mail size={16} />
                              Email
                            </Button>
                            <Button variant="outline" className="flex items-center gap-1 flex-1">
                              <Phone size={16} />
                              Call
                            </Button>
                            <Button variant="outline" className="flex items-center gap-1 flex-1">
                              <MessageSquare size={16} />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <div className="bg-muted/30 p-4 rounded-md">
                        {deal.description || "No description provided"}
                      </div>
                    </div>
                    
                    {/* Custom fields display */}
                    {deal.customFields && Object.keys(deal.customFields).length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Custom Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(deal.customFields).map(([key, value]) => (
                            <div key={key} className="bg-muted/30 p-3 rounded-md">
                              <div className="text-sm text-muted-foreground">{key.replace(/_/g, ' ')}</div>
                              <div className="font-medium">{value?.toString() || "—"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="attachments" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Files section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Paperclip size={18} />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {deal.attachments && deal.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {deal.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <Paperclip size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <Paperclip className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No files attached</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Appointments section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarIcon size={18} />
                      Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {deal.appointments && deal.appointments.length > 0 ? (
                      <div className="space-y-3">
                        {deal.appointments.map((appointment, index) => (
                          <div key={index} className="bg-muted/50 p-3 rounded-md">
                            <h4 className="font-medium">{appointment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(appointment.datetime).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample activity items, would be real in production */}
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#D35400]/10 flex items-center justify-center text-[#D35400]">
                        <FileText size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Deal created</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deal.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-foreground">
                        <Users size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Assigned to {getAssignedToName(deal.assignedTo)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deal.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 border border-dashed rounded-md">
                    <p className="text-muted-foreground">No notes added yet</p>
                    <Button 
                      className="mt-4 bg-[#D35400] hover:bg-[#B74600]"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Notes functionality will be available in a future update."
                        });
                      }}
                    >
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DealDetailDialog;
