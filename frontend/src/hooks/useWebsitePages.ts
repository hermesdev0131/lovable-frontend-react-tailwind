
import { useState, useEffect } from 'react';
import { WebsitePage } from '@/types/masterAccount';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { toast } from "@/hooks/use-toast";

export function useWebsitePages(isInMasterMode: boolean, currentClientId: number | null) {
  const [websitePages, setWebsitePages] = useState<WebsitePage[]>(() => {
    const savedPages = localStorage.getItem(STORAGE_KEYS.WEBSITE_PAGES);
    return savedPages ? JSON.parse(savedPages) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEBSITE_PAGES, JSON.stringify(websitePages));
  }, [websitePages]);

  const addWebsitePage = (page: Omit<WebsitePage, 'id'>) => {
    const newPage = {
      ...page,
      id: websitePages.length > 0 ? Math.max(...websitePages.map(p => p.id)) + 1 : 1,
      clientId: isInMasterMode ? null : currentClientId,
    };
    
    setWebsitePages([...websitePages, newPage]);
    toast({
      title: "Page Added",
      description: `${page.title} has been created successfully.`
    });
  };

  const removeWebsitePage = (id: number) => {
    const pageToRemove = websitePages.find(page => page.id === id);
    if (!pageToRemove) return;
    
    if (!isInMasterMode && pageToRemove.clientId !== currentClientId) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to remove this page.",
        variant: "destructive"
      });
      return;
    }
    
    setWebsitePages(websitePages.filter(page => page.id !== id));
    toast({
      title: "Page Removed",
      description: "The page has been removed successfully."
    });
  };

  const updateWebsitePage = (id: number, data: Partial<WebsitePage>) => {
    const pageToUpdate = websitePages.find(page => page.id === id);
    if (!pageToUpdate) return;
    
    if (!isInMasterMode && pageToUpdate.clientId !== currentClientId) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to update this page.",
        variant: "destructive"
      });
      return;
    }
    
    setWebsitePages(websitePages.map(page => 
      page.id === id ? { ...page, ...data, updatedAt: new Date().toISOString() } : page
    ));
    toast({
      title: "Page Updated",
      description: "The page has been updated successfully."
    });
  };

  return {
    websitePages,
    addWebsitePage,
    removeWebsitePage,
    updateWebsitePage
  };
}
