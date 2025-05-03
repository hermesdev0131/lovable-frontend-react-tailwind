
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMasterAccount } from '@/contexts/MasterAccountContext';
import { toast } from '@/hooks/use-toast';
import { PageFormValues } from '@/types/website';

export const useWebsiteActions = () => {
  const { websitePages, addWebsitePage, removeWebsitePage, updateWebsitePage, currentClientId } = useMasterAccount();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  const addForm = useForm<PageFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      status: 'draft',
      type: 'landing'
    }
  });
  
  const editForm = useForm<PageFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      status: 'published',
      type: 'landing'
    }
  });
  
  const handleAddPage = (data: PageFormValues) => {
    // Convert form data to the context's WebsitePage type format
    const newPage = {
      title: data.title,
      url: data.slug, // map slug to url
      status: data.status as 'published' | 'draft' | 'scheduled',
      type: data.type as 'landing' | 'blog' | 'product' | 'other',
      views: 0,
      conversions: 0,
      bounceRate: 0,
      clientId: currentClientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addWebsitePage(newPage);
    addForm.reset();
    setIsAddDialogOpen(false);
  };
  
  const openEditDialog = (pageId: string) => {
    const numericId = Number(pageId);
    const page = websitePages.find(p => p.id === numericId);
    
    if (page) {
      editForm.reset({
        title: page.title,
        slug: page.url || '', // map url to slug
        status: page.status,
        type: page.type,
      });
      setEditingPageId(numericId);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleEditPage = (data: PageFormValues) => {
    if (editingPageId) {
      updateWebsitePage(editingPageId, {
        title: data.title,
        url: data.slug, // map slug to url
        status: data.status as 'published' | 'draft' | 'scheduled',
        type: data.type as 'landing' | 'blog' | 'product' | 'other',
        updatedAt: new Date().toISOString(),
      });
      setIsEditDialogOpen(false);
      setEditingPageId(null);
    }
  };
  
  const deletePage = (pageId: string) => {
    const numericId = Number(pageId);
    if (window.confirm('Are you sure you want to delete this page?')) {
      removeWebsitePage(numericId);
    }
  };
  
  const startTracking = (pageId: string) => {
    setSelectedPage(pageId);
    
    if (!isTracking) {
      setIsTracking(true);
      toast({
        title: "Real-time tracking activated",
        description: "Now monitoring website traffic and performance metrics",
      });
    }
  };

  return {
    websitePages,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedPage,
    addForm,
    editForm,
    handleAddPage,
    openEditDialog,
    handleEditPage,
    deletePage,
    startTracking
  };
};
