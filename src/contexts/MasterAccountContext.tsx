import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// Client Type Definition
export interface Client {
  id: string;
  name: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'pending';
  subscription: 'Basic' | 'Professional' | 'Enterprise';
  users: number;
  deals: number;
  contacts: number;
  lastActivity: string;
  password?: string; // Only used for client creation, not stored
}

// Webhook Type Definition
interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt?: string;
  lastTriggered?: string; // Added this property to fix the error in Settings.tsx
}

// Content Item Type Definition
export interface ContentItem {
  id: number;
  title: string;
  content: string;
  type: 'post' | 'email' | 'blog' | 'social';
  status: 'draft' | 'scheduled' | 'published'; // Ensure it's a union type
  createdBy: number | string;
  scheduledFor?: string;
  clientId: string | null;
}

// Website Page Type Definition
export interface WebsitePage {
  id: number;
  title: string;
  url: string; // Make this required to fix the error in WebsiteManagement.tsx
  status: 'published' | 'draft' | 'scheduled';
  type: 'landing' | 'blog' | 'product' | 'other';
  views: number;
  conversions: number;
  bounceRate: number;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Notification Type Definition
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'approval' | 'rejection' | 'update';
  read: boolean;
  clientId: string | null;
  createdAt: string;
}

interface MasterAccountContextType {
  // Client management
  clients: Client[];
  currentClientId: string | null;
  isInMasterMode: boolean;
  setCurrentClient: (clientId: string | null) => void;
  switchToClient: (clientId: string | null) => void; // Changed parameter type to string | null
  toggleMasterMode: () => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  removeClient: (clientId: string) => void; // Alias for deleteClient, used in MasterAccount
  loginToAccount: (email: string, password: string) => boolean; // Added for LoginForm
  
  // Webhooks management
  webhooks: Webhook[];
  addWebhook: (webhook: Omit<Webhook, "id">) => void;
  removeWebhook: (webhookId: number) => void;
  updateWebhook: (webhookId: number, data: Partial<Webhook>) => void;
  triggerWebhook: (webhookId: number, data: any) => void;
  
  // Content management
  addContentItem: (item: Omit<ContentItem, "id">) => void;
  getContentItems: (clientId: string | null, type?: string) => ContentItem[];
  updateContentStatus: (itemId: number, status: 'draft' | 'scheduled' | 'published') => void; // Fix type here
  
  // Website pages management
  websitePages: WebsitePage[];
  addWebsitePage: (page: Omit<WebsitePage, "id">) => void;
  removeWebsitePage: (pageId: number) => void;
  updateWebsitePage: (pageId: number, data: Partial<WebsitePage>) => void;
  
  // Notifications management
  getNotifications: (clientId: string | null) => Notification[];
  getUnreadNotificationsCount: (clientId: string | null) => number;
  markNotificationAsRead: (notificationId: number) => void;
}

const MasterAccountContext = createContext<MasterAccountContextType | undefined>(undefined);

export const MasterAccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Clients state
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('crm_master_clients');
    return savedClients ? JSON.parse(savedClients) : [
      { 
        id: '1', 
        name: 'Acme Corporation', 
        industry: 'Technology', 
        website: 'acme.com', 
        status: 'active',
        subscription: 'Professional',
        users: 8,
        deals: 24,
        contacts: 156,
        lastActivity: new Date().toISOString(),
        email: 'admin@acme.com' 
      },
      { 
        id: '2', 
        name: 'Globex Inc.', 
        industry: 'Manufacturing', 
        website: 'globex.com',
        status: 'active',
        subscription: 'Enterprise',
        users: 15,
        deals: 45,
        contacts: 278,
        lastActivity: new Date().toISOString(),
        email: 'admin@globex.com'
      },
      { 
        id: '3', 
        name: 'Soylent Corp', 
        industry: 'Food & Beverage', 
        website: 'soylent.com',
        status: 'active',
        subscription: 'Basic',
        users: 3,
        deals: 12,
        contacts: 67,
        lastActivity: new Date().toISOString(),
        email: 'admin@soylent.com'
      },
    ];
  });

  const [currentClientId, setCurrentClientId] = useState<string | null>(() => {
    const savedClientId = localStorage.getItem('crm_current_client_id');
    return savedClientId || '1'; // Default to first client
  });

  const [isInMasterMode, setIsInMasterMode] = useState<boolean>(() => {
    const savedMasterMode = localStorage.getItem('crm_is_master_mode');
    return savedMasterMode ? JSON.parse(savedMasterMode) : false;
  });

  // Webhooks state
  const [webhooks, setWebhooks] = useState<Webhook[]>(() => {
    const savedWebhooks = localStorage.getItem('crm_webhooks');
    return savedWebhooks ? JSON.parse(savedWebhooks) : [];
  });

  // Content items state
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    const savedContent = localStorage.getItem('crm_content_items');
    return savedContent ? JSON.parse(savedContent) : [];
  });

  // Website pages state
  const [websitePages, setWebsitePages] = useState<WebsitePage[]>(() => {
    const savedPages = localStorage.getItem('crm_website_pages');
    return savedPages ? JSON.parse(savedPages) : [];
  });

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('crm_notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [
      {
        id: 1,
        title: 'Welcome to CRM',
        message: 'Welcome to your new CRM system. Get started by exploring the dashboard.',
        type: 'info',
        read: false,
        clientId: null,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('crm_master_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    if (currentClientId) {
      localStorage.setItem('crm_current_client_id', currentClientId);
    } else {
      localStorage.removeItem('crm_current_client_id');
    }
  }, [currentClientId]);

  useEffect(() => {
    localStorage.setItem('crm_is_master_mode', JSON.stringify(isInMasterMode));
  }, [isInMasterMode]);

  useEffect(() => {
    localStorage.setItem('crm_webhooks', JSON.stringify(webhooks));
  }, [webhooks]);

  useEffect(() => {
    localStorage.setItem('crm_content_items', JSON.stringify(contentItems));
  }, [contentItems]);

  useEffect(() => {
    localStorage.setItem('crm_website_pages', JSON.stringify(websitePages));
  }, [websitePages]);

  useEffect(() => {
    localStorage.setItem('crm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Client management functions
  const setCurrentClient = (clientId: string | null) => {
    setCurrentClientId(clientId);
    
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        toast({
          title: "Client Changed",
          description: `Now working with ${client.name}`
        });
      }
    }
  };

  // Function for ClientSwitcher component
  const switchToClient = (clientId: string | null) => {
    setCurrentClientId(clientId);
    
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        toast({
          title: "Client Changed",
          description: `Now working with ${client.name}`
        });
      }
    }
  };

  const toggleMasterMode = () => {
    setIsInMasterMode(prev => !prev);
    toast({
      title: isInMasterMode ? "Master Mode Disabled" : "Master Mode Enabled",
      description: isInMasterMode 
        ? "You are now operating on a client account" 
        : "You can now manage all client accounts"
    });
  };

  const addClient = (clientData: Omit<Client, "id">) => {
    const newClient = {
      ...clientData,
      id: Date.now().toString()
    };
    
    setClients(prev => [...prev, newClient]);
    toast({
      title: "Client Added",
      description: `${clientData.name} has been added successfully`
    });
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => 
      prev.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    
    toast({
      title: "Client Updated",
      description: `${updatedClient.name} has been updated successfully`
    });
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    
    // If the deleted client is the current client, switch to the first available client
    if (currentClientId === clientId) {
      const remainingClients = clients.filter(client => client.id !== clientId);
      if (remainingClients.length > 0) {
        setCurrentClient(remainingClients[0].id);
      } else {
        setCurrentClient(null);
      }
    }
    
    toast({
      title: "Client Deleted",
      description: "The client has been removed successfully"
    });
  };
  
  // Alias for deleteClient used in MasterAccount
  const removeClient = deleteClient;

  // Authentication
  const loginToAccount = (email: string, password: string): boolean => {
    // Simple mock login - in a real app, this would verify credentials with a backend
    const clientExists = clients.some(client => client.email === email);
    
    if (clientExists) {
      toast({
        title: "Login Successful",
        description: "Welcome back to your account"
      });
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid email or password",
      variant: "destructive"
    });
    return false;
  };

  // Webhook functions
  const addWebhook = (webhookData: Omit<Webhook, "id">) => {
    const newWebhook = {
      ...webhookData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setWebhooks(prev => [...prev, newWebhook]);
    toast({
      title: "Webhook Added",
      description: `${webhookData.name} has been added successfully`
    });
  };

  const removeWebhook = (webhookId: number) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
    toast({
      title: "Webhook Removed",
      description: "The webhook has been removed successfully"
    });
  };

  const updateWebhook = (webhookId: number, data: Partial<Webhook>) => {
    setWebhooks(prev => 
      prev.map(webhook => 
        webhook.id === webhookId ? { ...webhook, ...data } : webhook
      )
    );
    toast({
      title: "Webhook Updated",
      description: "The webhook has been updated successfully"
    });
  };

  const triggerWebhook = (webhookId: number, data: any) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (webhook && webhook.active) {
      toast({
        title: "Webhook Triggered",
        description: `${webhook.name} has been triggered successfully`
      });
      // In a real app, this would make an HTTP request to the webhook URL
      console.log(`Triggering webhook ${webhook.url} with data:`, data);
    }
  };

  // Content management functions
  const addContentItem = (itemData: Omit<ContentItem, "id">) => {
    const newItem: ContentItem = {
      ...itemData,
      id: Date.now(),
      status: itemData.status || 'draft'
    };
    
    setContentItems(prev => [...prev, newItem]);
    toast({
      title: "Content Added",
      description: `${itemData.title} has been added successfully`
    });
  };

  const getContentItems = (clientId: string | null, type?: string): ContentItem[] => {
    if (!clientId && !isInMasterMode) return [];
    
    return contentItems.filter(item => {
      const clientMatch = isInMasterMode 
        ? true 
        : item.clientId === clientId || item.clientId === null;
      
      const typeMatch = type ? item.type === type : true;
      
      return clientMatch && typeMatch;
    });
  };

  const updateContentStatus = (itemId: number, status: 'draft' | 'scheduled' | 'published') => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
    toast({
      title: "Content Updated",
      description: "The content status has been updated"
    });
  };

  // Website pages management
  const addWebsitePage = (pageData: Omit<WebsitePage, "id">) => {
    const newPage = {
      ...pageData,
      id: Date.now(),
      createdAt: pageData.createdAt || new Date().toISOString(),
      updatedAt: pageData.updatedAt || new Date().toISOString()
    };
    
    setWebsitePages(prev => [...prev, newPage]);
    toast({
      title: "Page Added",
      description: `${pageData.title} has been added successfully`
    });
  };

  const removeWebsitePage = (pageId: number) => {
    setWebsitePages(prev => prev.filter(page => page.id !== pageId));
    toast({
      title: "Page Removed",
      description: "The page has been removed successfully"
    });
  };

  const updateWebsitePage = (pageId: number, data: Partial<WebsitePage>) => {
    setWebsitePages(prev => 
      prev.map(page => 
        page.id === pageId 
          ? { ...page, ...data, updatedAt: new Date().toISOString() } 
          : page
      )
    );
    toast({
      title: "Page Updated",
      description: "The page has been updated successfully"
    });
  };

  // Notifications management
  const getNotifications = (clientId: string | null): Notification[] => {
    if (!clientId && !isInMasterMode) return [];
    
    return notifications.filter(notification => {
      return isInMasterMode 
        ? true 
        : notification.clientId === clientId || notification.clientId === null;
    });
  };

  const getUnreadNotificationsCount = (clientId: string | null): number => {
    const clientNotifications = getNotifications(clientId);
    return clientNotifications.filter(notification => !notification.read).length;
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  return (
    <MasterAccountContext.Provider 
      value={{ 
        clients, 
        currentClientId, 
        isInMasterMode,
        setCurrentClient,
        switchToClient,
        toggleMasterMode,
        addClient,
        updateClient,
        deleteClient,
        removeClient,
        loginToAccount,
        
        webhooks,
        addWebhook,
        removeWebhook,
        updateWebhook,
        triggerWebhook,
        
        addContentItem,
        getContentItems,
        updateContentStatus,
        
        websitePages,
        addWebsitePage,
        removeWebsitePage,
        updateWebsitePage,
        
        getNotifications,
        getUnreadNotificationsCount,
        markNotificationAsRead
      }}
    >
      {children}
    </MasterAccountContext.Provider>
  );
};

export const useMasterAccount = (): MasterAccountContextType => {
  const context = useContext(MasterAccountContext);
  if (context === undefined) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};
