// Define all types used in the Master Account context

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  emails: string[];
  phoneNumbers: string[];
  company: string;
  leadType: string;
  leadSource: string;
  tags: string[];
  status: string;
  users: number;
  deals: number;
  contacts: number;
  lastActivity: string;
  logo: string;
}

export interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
}

export interface WebsitePage {
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
  clientId: string | null;
}

export interface ContentItem {
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
  clientId: string | null;
  skipApproval?: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'system' | 'other';
  createdAt: string;
  read: boolean;
  relatedContentId?: number;
  forClientId?: string | null;
}

export interface MasterAccountContextType {
  clients: Client[];
  currentClientId: string | null;
  webhooks: Webhook[];
  websitePages: WebsitePage[];
  contentItems: ContentItem[];
  notifications: Notification[];
  isLoadingClients: boolean;
  clientsLoaded: boolean;
  addClient: (client: Client) => void;
  removeClient: (id: string) => void;
  switchToClient: (id: string | null) => void;
  isInMasterMode: boolean;
  toggleMasterMode: () => void;
  loginToAccount: (email: string, password: string) => boolean;
  clearAllClients: () => void;
  fetchClientsData: () => Promise<boolean>;
  refreshClientsData: () => Promise<boolean>;
  addWebhook: (webhook: Omit<Webhook, 'id'>) => void;
  removeWebhook: (id: number) => void;
  updateWebhook: (id: number, data: Partial<Webhook>) => void;
  triggerWebhook: (webhookId: number, data: any) => Promise<void>;
  addWebsitePage: (page: Omit<WebsitePage, 'id'>) => void;
  removeWebsitePage: (id: number) => void;
  updateWebsitePage: (id: number, data: Partial<WebsitePage>) => void;
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'status'>) => void;
  updateContentItem: (id: number, data: Partial<ContentItem>) => void;
  deleteContentItem: (id: number) => void;
  updateContentStatus: (id: number, status: 'approved' | 'rejected', reason?: string) => void;
  getContentItems: (clientId?: string | null, status?: string) => ContentItem[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: number) => void;
  getNotifications: (forClientId?: string | null) => Notification[];
  getUnreadNotificationsCount: (forClientId?: string | null) => number;
}
