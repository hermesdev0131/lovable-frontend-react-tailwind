
import { useState, useEffect } from 'react';
import { ContentItem, Client } from '@/types/masterAccount';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { toast } from "@/hooks/use-toast";

export function useContentItems(
  isInMasterMode: boolean, 
  currentClientId: number | null, 
  clients: Client[],
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
) {
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    const savedItems = localStorage.getItem(STORAGE_KEYS.CONTENT_ITEMS);
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENT_ITEMS, JSON.stringify(contentItems));
  }, [contentItems]);

  const addContentItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'status'>) => {
    const newItem: ContentItem = {
      ...item,
      id: contentItems.length > 0 ? Math.max(...contentItems.map(item => item.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      status: item.skipApproval ? 'approved' : 'pending',
      clientId: isInMasterMode ? null : currentClientId,
    };
    
    setContentItems([...contentItems, newItem]);
    
    if (!item.skipApproval && item.createdBy !== null) {
      const client = clients.find(c => c.id === item.createdBy);
      if (client) {
        addNotification({
          title: "Content Approval",
          message: `${client.name} has submitted ${item.type} content for approval`,
          type: "approval",
          relatedContentId: newItem.id,
          forClientId: null
        });
      }
    }
    
    toast({
      title: "Content Created",
      description: item.skipApproval 
        ? `${item.title} has been created and automatically approved.` 
        : `${item.title} has been created and is pending approval.`
    });
  };

  const updateContentStatus = (id: number, status: 'approved' | 'rejected', reason?: string) => {
    const contentItem = contentItems.find(item => item.id === id);
    if (!contentItem) return;
    
    if (!isInMasterMode && contentItem.clientId !== currentClientId && contentItem.createdBy !== currentClientId) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to update this content.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedContentItems = contentItems.map(item => 
      item.id === id ? { 
        ...item, 
        status, 
        rejectionReason: status === 'rejected' ? reason : undefined,
        approvedBy: status === 'approved' ? currentClientId : undefined,
        approvedAt: status === 'approved' ? new Date().toISOString() : undefined
      } : item
    );
    
    setContentItems(updatedContentItems);
    
    const client = clients.find(c => c.id === contentItem.createdBy);
    if (client) {
      addNotification({
        title: status === 'approved' ? "Content Approved" : "Content Rejected",
        message: status === 'approved' 
          ? `Your ${contentItem.type} "${contentItem.title}" has been approved` 
          : `Your ${contentItem.type} "${contentItem.title}" has been rejected${reason ? `: ${reason}` : ''}`,
        type: status === 'approved' ? "approval" : "rejection",
        relatedContentId: id,
        forClientId: contentItem.createdBy
      });
    }
    
    toast({
      title: status === 'approved' ? "Content Approved" : "Content Rejected",
      description: `${contentItem.title} has been ${status}.`
    });
  };

  const getContentItems = (clientId?: number | null, status?: string) => {
    return contentItems.filter(item => {
      if (clientId !== undefined) {
        if (item.clientId !== clientId && item.createdBy !== clientId) return false;
      } else if (!isInMasterMode && currentClientId !== null) {
        if (item.clientId !== currentClientId && item.createdBy !== currentClientId) return false;
      }
      
      if (status && item.status !== status) return false;
      
      return true;
    });
  };

  return {
    contentItems,
    addContentItem,
    updateContentStatus,
    getContentItems
  };
}
