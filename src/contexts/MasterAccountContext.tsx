import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  name: string;
  email: string;
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

interface MasterAccountContextType {
  clients: Client[];
  currentClientId: number | null;
  webhooks: Webhook[];
  websitePages: WebsitePage[];
  addClient: (client: Omit<Client, 'id'>) => void;
  removeClient: (id: number) => void;
  switchToClient: (id: number | null) => void;
  isInMasterMode: boolean;
  toggleMasterMode: () => void;
  addWebhook: (webhook: Omit<Webhook, 'id'>) => void;
  removeWebhook: (id: number) => void;
  updateWebhook: (id: number, data: Partial<Webhook>) => void;
  triggerWebhook: (webhookId: number, data: any) => Promise<void>;
  addWebsitePage: (page: Omit<WebsitePage, 'id'>) => void;
  removeWebsitePage: (id: number) => void;
  updateWebsitePage: (id: number, data: Partial<WebsitePage>) => void;
}

const MasterAccountContext = createContext<MasterAccountContextType | undefined>(undefined);

export const MasterAccountProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([
    { 
      id: 1, 
      name: "Acme Corporation", 
      email: "admin@acme.com", 
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

  return (
    <MasterAccountContext.Provider 
      value={{ 
        clients, 
        currentClientId, 
        webhooks,
        websitePages,
        addClient, 
        removeClient, 
        switchToClient,
        isInMasterMode,
        toggleMasterMode,
        addWebhook,
        removeWebhook,
        updateWebhook,
        triggerWebhook,
        addWebsitePage,
        removeWebsitePage,
        updateWebsitePage
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
