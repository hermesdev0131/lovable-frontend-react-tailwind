
import React, { useRef, useState } from 'react';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OpportunityImageUploadProps {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  label?: string;
}

const OpportunityImageUpload = ({
  uploadedImage,
  setUploadedImage,
  label = "Add Image"
}: OpportunityImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image file should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the post",
      });
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Image removed",
      description: "The image has been removed from the post",
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleImageButtonClick}
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            Select Image
          </Button>
          
          {uploadedImage && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleRemoveImage}
              className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        
        {uploadedImage && (
          <div className="mt-2 relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded preview" 
              className="max-h-[200px] rounded-md object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityImageUpload;
