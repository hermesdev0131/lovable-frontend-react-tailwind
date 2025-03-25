
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
  // Add missing properties to the type
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
  const [clients, setClients] = useState<Client[]>([
    { 
      id: 1, 
      name: "Acme Corporation", 
      email: "admin@acme.com", 
      password: "acme123",
      subscription: "Enterprise", 
      status: "active", 
      users: 12, 
      deals: 45, 
      contacts: 230, 
      lastActivity: "2023-09-15T10:30:00Z",
      logo: "/placeholder.svg"
    },
    { 
      id: 2, 
      name: "TechStart Inc", 
      email: "admin@techstart.com", 
      password: "tech123",
      subscription: "Professional", 
      status: "active", 
      users: 5, 
      deals: 18, 
      contacts: 87, 
      lastActivity: "2023-09-14T16:45:00Z",
      logo: "/placeholder.svg"
    },
    { 
      id: 3, 
      name: "Global Services Ltd", 
      email: "admin@globalserv.com", 
      password: "global123",
      subscription: "Basic", 
      status: "inactive", 
      users: 3, 
      deals: 7, 
      contacts: 42, 
      lastActivity: "2023-09-10T09:15:00Z",
      logo: "/placeholder.svg"
    }
  ]);
  
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(true);
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 1,
      name: "Client Added",
      url: "https://hook.eu1.make.com/sample123456789",
      events: ["client.created"],
      active: true,
      lastTriggered: "2023-09-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Client Status Change",
      url: "https://hook.eu1.make.com/sample987654321",
      events: ["client.status.updated"],
      active: false
    }
  ]);
  
  const [websitePages, setWebsitePages] = useState<WebsitePage[]>([
    {
      id: 1,
      title: "Home Page",
      url: "/",
      status: "published",
      type: "landing",
      createdAt: "2023-08-10T14:30:00Z",
      updatedAt: "2023-09-15T11:45:00Z",
      views: 2547,
      conversions: 98,
      bounceRate: 32.4
    },
    {
      id: 2,
      title: "Product Features",
      url: "/features",
      status: "published",
      type: "product",
      createdAt: "2023-08-15T09:20:00Z",
      updatedAt: "2023-09-10T16:30:00Z",
      views: 1243,
      conversions: 56,
      bounceRate: 28.7
    },
    {
      id: 3,
      title: "Summer Sale Campaign",
      url: "/summer-sale",
      status: "scheduled",
      type: "landing",
      createdAt: "2023-09-01T10:15:00Z",
      updatedAt: "2023-09-20T13:25:00Z",
      views: 0,
      conversions: 0,
      bounceRate: 0
    },
    {
      id: 4,
      title: "About Us",
      url: "/about",
      status: "published",
      type: "other",
      createdAt: "2023-07-05T08:45:00Z",
      updatedAt: "2023-08-28T14:10:00Z",
      views: 876,
      conversions: 12,
      bounceRate: 45.2
    },
    {
      id: 5,
      title: "New Product Launch",
      url: "/new-product",
      status: "draft",
      type: "landing",
      createdAt: "2023-09-18T11:30:00Z",
      updatedAt: "2023-09-18T11:30:00Z",
      views: 0,
      conversions: 0,
      bounceRate: 0
    }
  ]);

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 1,
      title: "Summer Newsletter",
      content: "Check out our latest summer deals and promotions!",
      type: "email",
      createdBy: 2,
      createdAt: "2023-09-15T10:30:00Z",
      status: "pending",
      scheduledFor: "2023-09-20T09:00:00Z"
    },
    {
      id: 2,
      title: "Product Launch Announcement",
      content: "We're excited to announce our new product line!",
      type: "social",
      platform: "facebook",
      createdBy: 3,
      createdAt: "2023-09-14T15:45:00Z",
      status: "approved",
      scheduledFor: "2023-09-18T12:00:00Z",
      approvedBy: 1,
      approvedAt: "2023-09-15T09:30:00Z"
    },
    {
      id: 3,
      title: "Holiday Promotions",
      content: "Special offers for the upcoming holiday season!",
      type: "email",
      createdBy: 2,
      createdAt: "2023-09-13T14:20:00Z",
      status: "rejected",
      rejectionReason: "Needs more specific details about the offers"
    }
  ]);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Content Approval",
      message: "TechStart Inc has submitted content for approval",
      type: "approval",
      createdAt: "2023-09-15T10:35:00Z",
      read: false,
      relatedContentId: 1,
      forClientId: null
    },
    {
      id: 2,
      title: "Content Approved",
      message: "Your social media post has been approved",
      type: "approval",
      createdAt: "2023-09-15T09:35:00Z",
      read: true,
      relatedContentId: 2,
      forClientId: 3
    }
  ]);

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
    if (email === "admin@mastercrm.com" && password === "master123") {
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
