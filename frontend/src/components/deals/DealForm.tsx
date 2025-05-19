
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FilePlus, UserPlus, Clock, Calendar, X, Upload, Paperclip, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Deal, Stage } from './types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { TeamMember } from '@/components/settings/TeamMembers';

// Define the form field type for customization
export type DealFormField = {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'currency' | 'probability' | 'contact';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  section?: 'basic' | 'details' | 'custom';
};

// Props for the component
interface DealFormProps {
  deal?: Partial<Deal>;
  stages: Stage[];
  teamMembers: TeamMember[];
  customFields?: DealFormField[];
  onSave: (dealData: Partial<Deal>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DealForm: React.FC<DealFormProps> = ({ 
  deal, 
  stages, 
  teamMembers, 
  customFields = [],
  onSave, 
  onCancel,
  isLoading = false
}) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [appointmentTitle, setAppointmentTitle] = useState<string>("");
  const { toast } = useToast();
  const { trackDealActivity, trackAppointmentScheduled } = useActivityTracker();
  
  // Set up react-hook-form
  // interface DealFormValues {
  //   name: string;
  //   company: string;
  //   value: number;
  //   currency: string;
  //   probability: number;
  //   stage: string;
  //   closingDate: string;
  //   description: string;
  //   assignedTo: string;
  //   contactId: string;
  //   [customField: string]: any; // For dynamic/custom fields
  // }
  const form = useForm<any>({
    defaultValues: {
      name: deal?.name || "",
      company: deal?.company || "",
      value: deal?.value || 0,
      currency: deal?.currency || "USD",
      probability: deal?.probability || 50,
      stage: deal?.stage || (stages.length > 0 ? stages[0].id : ""),
      closingDate: deal?.closingDate || new Date().toISOString().split('T')[0],
      description: deal?.description || "",
      assignedTo: deal?.assignedTo || "account-owner",
      contactId: deal?.contactId || "",
      // Add any custom fields from the deal object
      ...(deal?.customFields || {})
    }
  });
  
  // Default fields always shown
  const defaultFields: DealFormField[] = [
    {
      id: "name",
      type: "text",
      label: "Deal Name",
      placeholder: "Enter deal name",
      required: true,
      section: "basic"
    },
    {
      id: "company",
      type: "text",
      label: "Company",
      placeholder: "Company name",
      required: true,
      section: "basic"
    },
    {
      id: "value",
      type: "number",
      label: "Deal Value",
      placeholder: "0",
      required: true,
      section: "basic"
    },
    {
      id: "currency",
      type: "select",
      label: "Currency",
      required: true,
      section: "basic",
      options: [
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" }
      ]
    },
    {
      id: "probability",
      type: "probability",
      label: "Probability (%)",
      placeholder: "50",
      required: true,
      section: "basic"
    },
    {
      id: "stage",
      type: "select",
      label: "Stage",
      required: true,
      section: "basic",
      options: stages.map(stage => ({
        value: stage.id,
        label: stage.label
      }))
    },
    {
      id: "closingDate",
      type: "date",
      label: "Expected Close Date",
      required: true,
      section: "basic"
    },
    {
      id: "assignedTo",
      type: "select",
      label: "Assigned To",
      section: "details",
      options: [
        { value: "account-owner", label: "Account Owner" },
        ...teamMembers.map(member => ({
          value: member.id,
          label: member.name
        }))
      ]
    },
    {
      id: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Deal description",
      section: "details"
    }
  ];
  
  // Combine default fields with custom fields
  const allFields = [...defaultFields, ...customFields.filter(field => 
    !defaultFields.some(df => df.id === field.id)
  )];
  
  // Filter fields by section
  const basicFields = allFields.filter(field => field.section === 'basic');
  const detailFields = allFields.filter(field => field.section === 'details');
  const customFieldsList = allFields.filter(field => field.section === 'custom');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Track activity for each file
      newFiles.forEach(file => {
        trackDealActivity(form.getValues("name") || "New Deal", "attached file", file.name);
      });
      
      toast({
        title: "Files attached",
        description: `${newFiles.length} file(s) attached to the deal`
      });
    }
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    const removedFile = newAttachments[index];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    
    toast({
      title: "File removed",
      description: `${removedFile.name} has been removed`
    });
  };
  
  const addAppointment = () => {
    if (!appointmentDate || !appointmentTime || !appointmentTitle) {
      toast({
        title: "Missing information",
        description: "Please fill out all appointment fields",
        variant: "destructive"
      });
      return;
    }
    
    const newAppointment = {
      title: appointmentTitle,
      datetime: `${appointmentDate}T${appointmentTime}`
    };
    
    setAppointments([...appointments, newAppointment]);
    
    // Track the scheduled appointment
    trackAppointmentScheduled(
      "Contact", // This would be the actual contact name in a real implementation
      form.getValues("name") || "New Deal",
      `${appointmentDate} at ${appointmentTime}`
    );
    
    // Reset form fields
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentTitle("");
    
    toast({
      title: "Appointment added",
      description: `Appointment scheduled for ${appointmentDate} at ${appointmentTime}`
    });
  };
  
  const removeAppointment = (index: number) => {
    const newAppointments = [...appointments];
    const removedAppointment = newAppointments[index];
    newAppointments.splice(index, 1);
    setAppointments(newAppointments);
    
    toast({
      title: "Appointment removed",
      description: `${removedAppointment.title} has been removed`
    });
  };
  
  const onSubmit = (data: any) => {
    // Combine form data with attachments and appointments
    const dealData = {
      ...data,
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })),
      appointments,
      updatedAt: new Date().toISOString()
    };
    
    // Track activity
    trackDealActivity(
      dealData.name, 
      deal?.id ? "updated deal" : "created deal", 
      `Value: ${dealData.value} ${dealData.currency}`
    );
    
    onSave(dealData);
  };
  
  // Render form field based on type
  const renderField = (field: DealFormField) => (
    <FormField
      key={field.id}
      control={form.control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem className={field.type === "textarea" ? "col-span-2" : ""}>
          <FormLabel>{field.label}{field.required ? " *" : ""}</FormLabel>
          <FormControl>
            {field.type === "text" && (
              <Input 
                placeholder={field.placeholder} 
                {...formField} 
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "number" && (
              <Input 
                type="number" 
                placeholder={field.placeholder} 
                {...formField} 
                onChange={e => formField.onChange(Number(e.target.value))}
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "probability" && (
              <Input 
                type="number" 
                placeholder={field.placeholder}
                min="0"
                max="100" 
                {...formField} 
                onChange={e => formField.onChange(Number(e.target.value))}
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "textarea" && (
              <Textarea 
                placeholder={field.placeholder} 
                className="min-h-[100px]"
                {...formField} 
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "select" && field.options && (
              <Select 
                value={formField.value?.toString()} 
                onValueChange={formField.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormControl>
            {field.type === "date" && (
              <Input
                type="date"
                {...formField}
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "currency" && (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="0"
                  className="flex-grow"
                  {...formField}
                  onChange={e => formField.onChange(Number(e.target.value))}
                />
                <Select defaultValue="USD">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Files & Calendar</TabsTrigger>
            {customFieldsList.length > 0 && (
              <TabsTrigger value="custom">Custom Fields</TabsTrigger>
            )}
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {basicFields.map(renderField)}
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailFields.map(renderField)}
            </div>
          </TabsContent>
          
          {/* Attachments & Calendar Tab */}
          <TabsContent value="attachments" className="pt-4">
            <div className="space-y-6">
              {/* File Attachments Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Attachments</h3>
                      <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex items-center gap-1 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-md">
                            <Upload size={14} />
                            <span>Upload Files</span>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    
                    {attachments.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <Paperclip className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No files attached</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <Paperclip size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAttachment(index)}
                              className="h-7 w-7"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Calendar/Appointments Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Schedule Appointments</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="appt-title">Title</Label>
                        <Input
                          id="appt-title"
                          placeholder="Meeting title"
                          value={appointmentTitle}
                          onChange={(e) => setAppointmentTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="appt-date">Date</Label>
                        <Input
                          id="appt-date"
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="appt-time">Time</Label>
                        <Input
                          id="appt-time"
                          type="time"
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={addAppointment}
                        className="flex items-center gap-1"
                      >
                        <CalendarIcon size={16} />
                        Add Appointment
                      </Button>
                    </div>
                    
                    {appointments.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium">Scheduled Appointments</h4>
                        {appointments.map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{appointment.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(appointment.datetime).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAppointment(index)}
                              className="h-7 w-7"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Custom Fields Tab */}
          {customFieldsList.length > 0 && (
            <TabsContent value="custom" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customFieldsList.map(renderField)}
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#D35400] hover:bg-[#B74600] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {deal?.id ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{deal?.id ? "Update" : "Create"} Deal</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DealForm;
