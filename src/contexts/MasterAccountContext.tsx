
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  name: string;
  email: string;
  password: string;
  subscription: string;
  status: string;
  users: number;
  deals: number;
  contacts: number;
  lastActivity: string;
  logo: string;
}

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
}

interface WebsitePage {
  id: number;
  title: string;
  url: string;
  status: 'published' | 'draft' | 'scheduled';
  type: 'landing' | 'blog' | 'product' | 'other';
  createdAt: string;
  updatedAt: string;
  views: number;
  conversions: number;
  bounceRate: number;
}

interface ContentItem {
  id: number;
  title: string;
  content: string;
  type: 'email' | 'social' | 'blog' | 'other';
  platform?: string;
  createdBy: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  scheduledFor?: string;
  rejectionReason?: string;
  approvedBy?: number;
  approvedAt?: string;
  media?: string | null;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'system' | 'other';
  createdAt: string;
  read: boolean;
  relatedContentId?: number;
  forClientId?: number | null;
}

interface MasterAccountContextType {
  clients: Client[];
  currentClientId: number | null;
  webhooks: Webhook[];
  websitePages: WebsitePage[];
  contentItems: ContentItem[];
  notifications: Notification[];
  addClient: (client: Omit<Client, 'id'>) => void;
  removeClient: (id: number) => void;
  switchToClient: (id: number | null) => void;
  isInMasterMode: boolean;
  toggleMasterMode: () => void;
  loginToAccount: (email: string, password: string) => boolean;
  addWebhook: (webhook: Omit<Webhook, 'id'>) => void;
  removeWebhook: (id: number) => void;
  updateWebhook: (id: number, data: Partial<Webhook>) => void;
  triggerWebhook: (webhookId: number, data: any) => Promise<void>;
  addWebsitePage: (page: Omit<WebsitePage, 'id'>) => void;
  removeWebsitePage: (id: number) => void;
  updateWebsitePage: (id: number, data: Partial<WebsitePage>) => void;
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'status'>) => void;
  updateContentStatus: (id: number, status: 'approved' | 'rejected', reason?: string) => void;
  getContentItems: (clientId?: number | null, status?: string) => ContentItem[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: number) => void;
  getNotifications: (forClientId?: number | null) => Notification[];
  getUnreadNotificationsCount: (forClientId?: number | null) => number;
}

const MasterAccountContext = createContext<MasterAccountContextType | undefined>(undefined);

export const MasterAccountProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(true);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [websitePages, setWebsitePages] = useState<WebsitePage[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1
    };
    
    setClients([...clients, newClient]);
  };

  const removeClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    
    if (currentClientId === id) {
      setCurrentClientId(null);
      setIsInMasterMode(true);
    }
  };

  const switchToClient = (id: number | null) => {
    setCurrentClientId(id);
    setIsInMasterMode(id === null);
  };

  const toggleMasterMode = () => {
    setIsInMasterMode(!isInMasterMode);
    if (!isInMasterMode) {
      setCurrentClientId(null);
    }
  };

  const addWebhook = (webhook: Omit<Webhook, 'id'>) => {
    const newWebhook = {
      ...webhook,
      id: webhooks.length > 0 ? Math.max(...webhooks.map(w => w.id)) + 1 : 1
    };
    
    setWebhooks([...webhooks, newWebhook]);
    toast({
      title: "Webhook Added",
      description: `${webhook.name} webhook has been created successfully.`
    });
  };

  const removeWebhook = (id: number) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast({
      title: "Webhook Removed",
      description: "The webhook has been removed successfully."
    });
  };

  const updateWebhook = (id: number, data: Partial<Webhook>) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id ? { ...webhook, ...data } : webhook
    ));
    toast({
      title: "Webhook Updated",
      description: "The webhook has been updated successfully."
    });
  };

  const triggerWebhook = async (webhookId: number, data: any) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    
    if (!webhook) {
      toast({
        title: "Error",
        description: "Webhook not found",
        variant: "destructive"
      });
      return;
    }
    
    if (!webhook.active) {
      toast({
        title: "Error",
        description: "This webhook is currently inactive",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: webhook.events[0],
          data: data
        })
      });
      
      updateWebhook(webhookId, { lastTriggered: new Date().toISOString() });
      
      toast({
        title: "Webhook Triggered",
        description: `${webhook.name} webhook was successfully triggered.`
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger webhook. Please check the URL and try again.",
        variant: "destructive"
      });
    }
  };

  const addWebsitePage = (page: Omit<WebsitePage, 'id'>) => {
    const newPage = {
      ...page,
      id: websitePages.length > 0 ? Math.max(...websitePages.map(p => p.id)) + 1 : 1
    };
    
    setWebsitePages([...websitePages, newPage]);
    toast({
      title: "Page Added",
      description: `${page.title} has been created successfully.`
    });
  };

  const removeWebsitePage = (id: number) => {
    setWebsitePages(websitePages.filter(page => page.id !== id));
    toast({
      title: "Page Removed",
      description: "The page has been removed successfully."
    });
  };

  const updateWebsitePage = (id: number, data: Partial<WebsitePage>) => {
    setWebsitePages(websitePages.map(page => 
      page.id === id ? { ...page, ...data, updatedAt: new Date().toISOString() } : page
    ));
    toast({
      title: "Page Updated",
      description: "The page has been updated successfully."
    });
  };

  const addContentItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'status'>) => {
    const newItem: ContentItem = {
      ...item,
      id: contentItems.length > 0 ? Math.max(...contentItems.map(item => item.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setContentItems([...contentItems, newItem]);
    
    if (item.createdBy !== null) {
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
      description: `${item.title} has been created and is pending approval.`
    });
  };
  
  const updateContentStatus = (id: number, status: 'approved' | 'rejected', reason?: string) => {
    const contentItem = contentItems.find(item => item.id === id);
    if (!contentItem) return;
    
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
      if (clientId !== undefined && item.createdBy !== clientId) return false;
      if (status && item.status !== status) return false;
      return true;
    });
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setNotifications([newNotification, ...notifications]);
  };
  
  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const getNotifications = (forClientId?: number | null) => {
    return notifications.filter(notification => {
      if (forClientId !== undefined && notification.forClientId !== forClientId) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };
  
  const getUnreadNotificationsCount = (forClientId?: number | null) => {
    return getNotifications(forClientId).filter(notification => !notification.read).length;
  };

  const loginToAccount = (email: string, password: string): boolean => {
    if (email === "dej@avai.vip" && password === "FilthyRich2025!\\") {
      setCurrentClientId(null);
      setIsInMasterMode(true);
      toast({
        title: "Logged In",
        description: "Successfully logged in to master account."
      });
      return true;
    }
    
    const client = clients.find(client => client.email === email && client.password === password);
    if (client) {
      setCurrentClientId(client.id);
      setIsInMasterMode(false);
      toast({
        title: "Logged In",
        description: `Successfully logged in to ${client.name} account.`
      });
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid email or password. Please try again.",
      variant: "destructive"
    });
    return false;
  };

  return (
    <MasterAccountContext.Provider 
      value={{ 
        clients, 
        currentClientId, 
        webhooks,
        websitePages,
        contentItems,
        notifications,
        addClient, 
        removeClient, 
        switchToClient,
        isInMasterMode,
        toggleMasterMode,
        loginToAccount,
        addWebhook,
        removeWebhook,
        updateWebhook,
        triggerWebhook,
        addWebsitePage,
        removeWebsitePage,
        updateWebsitePage,
        addContentItem,
        updateContentStatus,
        getContentItems,
        addNotification,
        markNotificationAsRead,
        getNotifications,
        getUnreadNotificationsCount
      }}
    >
      {children}
    </MasterAccountContext.Provider>
  );
};

export const useMasterAccount = () => {
  const context = useContext(MasterAccountContext);
  if (context === undefined) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};
