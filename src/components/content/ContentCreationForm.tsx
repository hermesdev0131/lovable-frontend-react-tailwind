import React, { useState, Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Image } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ContentItem } from "@/types/masterAccount";

interface ContentCreationFormProps {
  onSuccess?: () => void;
  initialData?: Partial<ContentItem>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
}

const ContentCreationForm: React.FC<ContentCreationFormProps> = ({
  onSuccess,
  initialData,
  isEditing = false,
  isSubmitting: externalIsSubmitting,
  setIsSubmitting: externalSetIsSubmitting
}) => {
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.media || null);
  
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting;
  const setIsSubmitting = externalSetIsSubmitting || setInternalIsSubmitting;
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    type: initialData?.type || 'blog',
    scheduledFor: initialData?.scheduledFor ? new Date(initialData.scheduledFor) : new Date(),
    skipApproval: initialData?.skipApproval || false,
    media: initialData?.media || null,
  });
  
  const { addContentItem, updateContentStatus, currentClientId, isInMasterMode } = useMasterAccount();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as 'blog' | 'email' | 'social' | 'other'
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        scheduledFor: date
      });
      setIsDatePickerOpen(false);
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({
          ...formData,
          media: base64String
        });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && initialData?.id) {
        toast({
          title: "Content Updated",
          description: `${formData.title} has been updated.`
        });
      } else {
        addContentItem({
          title: formData.title,
          content: formData.content,
          type: formData.type,
          createdBy: currentClientId || 0,
          scheduledFor: formData.scheduledFor.toISOString(),
          media: formData.media,
          clientId: currentClientId,
          skipApproval: formData.skipApproval,
        });
        
        toast({
          title: "Content Created",
          description: `${formData.title} has been created.`
        });
      }
      
      if (!isEditing) {
        setFormData({
          title: '',
          content: '',
          type: 'blog',
          scheduledFor: new Date(),
          skipApproval: false,
          media: null,
        });
        setSelectedFile(null);
        setPreviewImage(null);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting content:", error);
      toast({
        title: "Submission Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Content' : 'Create New Content'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update your content details' : 'Create and schedule new content'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter content title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your content here"
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Schedule For</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduledFor && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduledFor ? (
                      format(formData.scheduledFor, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledFor}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="media">Media (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <Input
                  id="media"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload an image to accompany your content
                </p>
              </div>
              
              {previewImage && (
                <div className="rounded-md overflow-hidden border border-input">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="max-h-32 w-full object-cover" 
                  />
                </div>
              )}
              {!previewImage && (
                <div className="h-32 border rounded-md flex items-center justify-center bg-muted">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          
          {isInMasterMode && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="skipApproval" 
                checked={formData.skipApproval}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    skipApproval: !!checked
                  });
                }}
              />
              <Label htmlFor="skipApproval" className="cursor-pointer">
                Skip approval process (publish immediately)
              </Label>
            </div>
          )}
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : isEditing ? 'Update Content' : 'Create Content'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCreationForm;
