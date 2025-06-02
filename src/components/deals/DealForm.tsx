import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FilePlus, UserPlus, Clock, Calendar, X, Upload, Paperclip, Loader2, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Deal, Stage } from './types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTeam, TeamMember } from '@/contexts/TeamContext';
import * as SelectPrimitive from "@radix-ui/react-select";

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
  stages: { id: string; label: string }[];
  teamMembers: TeamMember[];
  customFields: DealFormField[];
  onSave: (dealData: Partial<Deal>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Add interface for form values
interface DealFormValues {
  name: string;
  company: string;
  value: number;
  currency: string;
  probability: number;
  stage: string;
  closingDate: string;
  description: string;
  assignedTo: string;
  contactId: string;
  [key: string]: string | number; // For custom fields - only string or number values
}

// Add interface for appointment
interface Appointment {
  title: string;
  datetime: string;
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [appointmentTitle, setAppointmentTitle] = useState<string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isBasicDatePickerOpen, setIsBasicDatePickerOpen] = useState(false);
  const { toast } = useToast();
  const { trackDealActivity, trackAppointmentScheduled } = useActivityTracker();

  
  // Helper function to safely parse dates
  const safeParseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr || typeof dateStr !== 'string') return undefined;
    try {
      const parsed = parse(dateStr, 'MM/dd/yyyy', new Date());
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  };

  // Helper function to safely format dates
  const safeFormatDate = (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) return '';
    try {
      return format(date, 'MM/dd/yyyy');
    } catch {
      return '';
    }
  };

  // Helper function to ensure string value for date fields
  const ensureStringValue = (value: string | number): string => {
    return typeof value === 'string' ? value : String(value);
  };
  
  // Set up react-hook-form with proper types
  const form = useForm<DealFormValues>({
    defaultValues: {
      name: deal?.name || "",
      company: deal?.company || "",
      value: deal?.value || 0,
      currency: deal?.currency || "USD",
      probability: deal?.probability || 50,
      stage: deal?.stage || (stages.length > 0 ? stages[0].id : ""),
      closingDate: deal?.closingDate ? format(new Date(deal.closingDate), 'MM/dd/yyyy') : format(new Date(), 'MM/dd/yyyy'),
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
        ...(teamMembers?.map(member => ({
          value: member.id,
          label: member.name
        })) || [])
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
  const basicFields = allFields.filter(field => field.section === 'basic' || field.section === 'custom');
  const detailFields = allFields.filter(field => field.section === 'details');
  
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

    try {
      // Parse the date and time
      const parsedDate = parse(appointmentDate, 'MM/dd/yyyy', new Date());
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      
      // Create a new date object with the correct time
      const appointmentDateTime = new Date(parsedDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      const newAppointment = {
        title: appointmentTitle,
        datetime: format(appointmentDateTime, 'MM/dd/yyyy HH:mm')
      };
      
      setAppointments([...appointments, newAppointment]);
      
      // Track the scheduled appointment
      trackAppointmentScheduled(
        "Contact", // This would be the actual contact name in a real implementation
        form.getValues("name") || "New Deal",
        format(appointmentDateTime, 'MMM d, yyyy h:mm a')
      );
      
      // Reset form fields
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentTitle("");
      
      toast({
        title: "Appointment added",
        description: `Appointment scheduled for ${format(appointmentDateTime, 'MMM d, yyyy h:mm a')}`
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast({
        title: "Error",
        description: "Failed to add appointment. Please try again.",
        variant: "destructive"
      });
    }
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
  
  const onSubmit = (data: DealFormValues) => {
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
  
  // Add helper function for time formatting
  const formatTime = (hours: number, minutes: number): string => {
    return format(new Date().setHours(hours, minutes, 0, 0), 'HH:mm');
  };

  // Add helper function for time display
  const displayTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return format(new Date().setHours(hours, minutes, 0, 0), 'h:mm a');
    } catch {
      return '';
    }
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
                value={ensureStringValue(formField.value)}
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "number" && (
              <Input 
                type="number" 
                placeholder={field.placeholder} 
                {...formField} 
                value={typeof formField.value === 'number' ? formField.value : ''}
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
                value={typeof formField.value === 'number' ? formField.value : ''}
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
                value={ensureStringValue(formField.value)}
              />
            )}
          </FormControl>
          <FormControl>
            {field.type === "select" && field.options && (
              <Select 
                value={ensureStringValue(formField.value)} 
                onValueChange={(value) => {
                  // Convert to number if the field type is number
                  if (field.type === 'number') {
                    formField.onChange(Number(value));
                  } else {
                    formField.onChange(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue>
                    {field.options.find(opt => opt.value === formField.value)?.label || "Select..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        {option.value === formField.value && (
                          <Check className="h-4 w-4" />
                        )}
                      </span>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormControl>
            {field.type === "date" && (
              <Popover open={isBasicDatePickerOpen} onOpenChange={setIsBasicDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !formField.value && "text-muted-foreground"
                    )}
                  >
                    {formField.value ? (
                      safeFormatDate(safeParseDate(ensureStringValue(formField.value)))
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={safeParseDate(ensureStringValue(formField.value))}
                    onSelect={(date) => {
                      if (date) {
                        formField.onChange(safeFormatDate(date));
                        setIsBasicDatePickerOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                  value={typeof formField.value === 'number' ? formField.value : ''}
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
                        <Label>Title</Label>
                        <Input
                          placeholder="Meeting title"
                          value={appointmentTitle}
                          onChange={(e) => setAppointmentTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !appointmentDate && "text-muted-foreground"
                              )}
                            >
                              {appointmentDate ? (
                                format(parse(appointmentDate, 'MM/dd/yyyy', new Date()), 'MM/dd/yyyy')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={appointmentDate ? parse(appointmentDate, 'MM/dd/yyyy', new Date()) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setAppointmentDate(format(date, 'MM/dd/yyyy'));
                                  setIsDatePickerOpen(false);
                                }
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !appointmentTime && "text-muted-foreground"
                              )}
                            >
                              {appointmentTime ? (
                                displayTime(appointmentTime)
                              ) : (
                                <span>Pick a time</span>
                              )}
                              <Clock className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-2">
                              <div className="grid grid-cols-2 gap-2">
                                {/* AM Times */}
                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-muted-foreground px-2">AM</div>
                                  <div className="grid grid-cols-3 gap-1">
                                    {Array.from({ length: 12 }).map((_, hour) => (
                                      <div key={`am-${hour}`} className="space-y-1">
                                        <div className="text-xs text-muted-foreground px-1">
                                          {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                                        </div>
                                        {[0, 30].map((minute) => (
                                          <Button
                                            key={`am-${hour}-${minute}`}
                                            variant="ghost"
                                            className="h-7 w-full text-xs"
                                            onClick={() => {
                                              setAppointmentTime(formatTime(hour, minute));
                                              setIsTimePickerOpen(false);
                                            }}
                                          >
                                            {format(new Date().setHours(hour, minute, 0, 0), 'h:mm')}
                                          </Button>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* PM Times */}
                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-muted-foreground px-2">PM</div>
                                  <div className="grid grid-cols-3 gap-1">
                                    {Array.from({ length: 12 }).map((_, hour) => (
                                      <div key={`pm-${hour}`} className="space-y-1">
                                        <div className="text-xs text-muted-foreground px-1">
                                          {format(new Date().setHours(hour + 12, 0, 0, 0), 'h a')}
                                        </div>
                                        {[0, 30].map((minute) => (
                                          <Button
                                            key={`pm-${hour}-${minute}`}
                                            variant="ghost"
                                            className="h-7 w-full text-xs"
                                            onClick={() => {
                                              setAppointmentTime(formatTime(hour + 12, minute));
                                              setIsTimePickerOpen(false);
                                            }}
                                          >
                                            {format(new Date().setHours(hour + 12, minute, 0, 0), 'h:mm')}
                                          </Button>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
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
                        {appointments.map((appointment, index) => {
                          try {
                            const appointmentDate = parse(appointment.datetime, 'MM/dd/yyyy HH:mm', new Date());
                            return (
                              <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} className="text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{appointment.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(appointmentDate, 'MMM d, yyyy h:mm a')}
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
                            );
                          } catch (error) {
                            console.error('Error displaying appointment:', error);
                            return null;
                          }
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
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
