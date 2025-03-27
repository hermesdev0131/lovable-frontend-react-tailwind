
import React, { createContext, useContext, useState } from 'react';
import { toast } from "@/hooks/use-toast";

// Define the structure of a client object
export type Client = {
  id: number;
  name: string;
  email: string;
  password?: string;
  subscription: string;
  status: string;
  users: number;
  deals: number;
  contacts: number;
  lastActivity: string;
  logo: string;
};

// Notification type
export type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

// Website page type
export type WebsitePage = {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

// Webhook type
export type Webhook = {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
};

// Content item type
export type ContentItem = {
  id: number;
  title: string;
  content: string;
  type: string;
  status: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
};

// Define the context type
export type MasterAccountContextType = {
  isInMasterMode: boolean;
  setIsInMasterMode: (value: boolean) => void;
  currentClientId: number | null;
  clients: Client[];
  selectedClient: Client | null;
  switchToClient: (clientId: number | null) => void;
  loginToAccount: (email: string, password: string) => boolean;
  addClient: (client: Omit<Client, 'id'>) => void;
  removeClient: (id: number) => void;
  
  // Notification related functions
  getNotifications: (clientId: number | null) => Notification[];
  getUnreadNotificationsCount: (clientId: number | null) => number;
  markNotificationAsRead: (id: number) => void;
  
  // Website management related functions
  websitePages: WebsitePage[];
  addWebsitePage: (page: Omit<WebsitePage, 'id'>) => void;
  removeWebsitePage: (id: number) => void;
  updateWebsitePage: (id: number, page: Partial<WebsitePage>) => void;
  
  // Webhook related functions
  webhooks: Webhook[];
  addWebhook: (webhook: Omit<Webhook, 'id'>) => void;
  removeWebhook: (id: number) => void;
  updateWebhook: (id: number, webhook: Partial<Webhook>) => void;
  triggerWebhook: (id: number) => void;
  
  // Content related functions
  getContentItems: (type?: string) => ContentItem[];
  addContentItem: (item: Omit<ContentItem, 'id'>) => void;
  updateContentStatus: (id: number, status: string) => void;
};

// Create the context with a default value of null 
const MasterAccountContext = createContext<MasterAccountContextType | null>(null);

// Create a provider component
export const MasterAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInMasterMode, setIsInMasterMode] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Acme Corp",
      email: "info@acmecorp.com",
      subscription: "Professional",
      status: "active",
      users: 15,
      deals: 42,
      contacts: 120,
      lastActivity: "2024-01-20T14:30:00Z",
      logo: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Beta Industries",
      email: "contact@betaindustries.net",
      subscription: "Basic",
      status: "inactive",
      users: 5,
      deals: 12,
      contacts: 65,
      lastActivity: "2023-12-15T09:00:00Z",
      logo: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Gamma Solutions",
      email: "sales@gammasolutions.org",
      subscription: "Enterprise",
      status: "active",
      users: 50,
      deals: 150,
      contacts: 500,
      lastActivity: "2024-01-28T18:45:00Z",
      logo: "/placeholder.svg"
    }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New lead assigned",
      message: "A new lead has been assigned to your account",
      type: "info",
      read: false,
      createdAt: "2024-01-28T10:30:00Z"
    },
    {
      id: 2,
      title: "Campaign approved",
      message: "Your campaign has been approved and is now live",
      type: "approval",
      read: true,
      createdAt: "2024-01-27T15:45:00Z"
    }
  ]);

  // Website pages state
  const [websitePages, setWebsitePages] = useState<WebsitePage[]>([
    {
      id: 1,
      title: "Home",
      slug: "home",
      content: "<h1>Welcome to our website</h1>",
      status: "published",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-01-15T09:00:00Z"
    }
  ]);

  // Webhooks state
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 1,
      name: "New Lead Notification",
      url: "https://example.com/webhook",
      events: ["lead.created", "lead.updated"],
      active: true
    }
  ]);

  // Content items state
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 1,
      title: "Welcome to our blog",
      content: "This is our first blog post",
      type: "blog",
      status: "published",
      createdAt: "2024-01-20T12:00:00Z",
      updatedAt: "2024-01-20T12:00:00Z"
    },
    {
      id: 2,
      title: "Monthly Newsletter",
      content: "Here's what's new this month",
      type: "email",
      status: "draft",
      scheduledFor: "2024-02-01T09:00:00Z",
      createdAt: "2024-01-25T14:30:00Z",
      updatedAt: "2024-01-25T14:30:00Z"
    }
  ]);

  // Find the selected client based on currentClientId
  const selectedClient = clients.find((client) => client.id === currentClientId) || null;

  // Function to switch to a different client
  const switchToClient = (clientId: number | null) => {
    setCurrentClientId(clientId);
    // Note: Navigation is now handled in the components that call this function
  };

  const loginToAccount = (email: string, password: string): boolean => {
    if (email === "dej@avai.vip" && password === "FilthyRich2025!") {
      setIsInMasterMode(true);
      toast({
        title: "Login Successful",
        description: "You have logged in as the master account."
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    const newClient: Client = { id: newId, ...client };
    setClients([...clients, newClient]);
  };

  const removeClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    if (currentClientId === id) {
      setCurrentClientId(null);
    }
  };

  // Notification functions
  const getNotifications = (clientId: number | null) => {
    // In a real app, you would filter notifications based on clientId
    return notifications;
  };

  const getUnreadNotificationsCount = (clientId: number | null) => {
    // In a real app, you would filter notifications based on clientId
    return notifications.filter(n => !n.read).length;
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // Website management functions
  const addWebsitePage = (page: Omit<WebsitePage, 'id'>) => {
    const newId = websitePages.length > 0 ? Math.max(...websitePages.map(p => p.id)) + 1 : 1;
    const newPage: WebsitePage = { id: newId, ...page };
    setWebsitePages([...websitePages, newPage]);
  };

  const removeWebsitePage = (id: number) => {
    setWebsitePages(websitePages.filter(page => page.id !== id));
  };

  const updateWebsitePage = (id: number, page: Partial<WebsitePage>) => {
    setWebsitePages(
      websitePages.map(p => 
        p.id === id ? { ...p, ...page, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  // Webhook functions
  const addWebhook = (webhook: Omit<Webhook, 'id'>) => {
    const newId = webhooks.length > 0 ? Math.max(...webhooks.map(w => w.id)) + 1 : 1;
    const newWebhook: Webhook = { id: newId, ...webhook };
    setWebhooks([...webhooks, newWebhook]);
  };

  const removeWebhook = (id: number) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
  };

  const updateWebhook = (id: number, webhook: Partial<Webhook>) => {
    setWebhooks(
      webhooks.map(w => 
        w.id === id ? { ...w, ...webhook } : w
      )
    );
  };

  const triggerWebhook = (id: number) => {
    // In a real app, this would actually trigger the webhook
    toast({
      title: "Webhook Triggered",
      description: `Webhook ID ${id} has been triggered`
    });
  };

  // Content functions
  const getContentItems = (type?: string) => {
    if (type) {
      return contentItems.filter(item => item.type === type);
    }
    return contentItems;
  };

  const addContentItem = (item: Omit<ContentItem, 'id'>) => {
    const newId = contentItems.length > 0 ? Math.max(...contentItems.map(c => c.id)) + 1 : 1;
    const newItem: ContentItem = { 
      id: newId, 
      ...item, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContentItems([...contentItems, newItem]);
  };

  const updateContentStatus = (id: number, status: string) => {
    setContentItems(
      contentItems.map(item => 
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  // Provide the context value
  const contextValue: MasterAccountContextType = {
    isInMasterMode,
    setIsInMasterMode,
    currentClientId,
    clients,
    selectedClient,
    switchToClient,
    loginToAccount,
    addClient,
    removeClient,
    getNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    websitePages,
    addWebsitePage,
    removeWebsitePage,
    updateWebsitePage,
    webhooks,
    addWebhook,
    removeWebhook,
    updateWebhook,
    triggerWebhook,
    getContentItems,
    addContentItem,
    updateContentStatus
  };

  return (
    <MasterAccountContext.Provider value={contextValue}>
      {children}
    </MasterAccountContext.Provider>
  );
};

// Create a hook to use the context
export const useMasterAccount = () => {
  const context = useContext(MasterAccountContext);
  if (!context) {
    throw new Error('useMasterAccount must be used within a MasterAccountProvider');
  }
  return context;
};
