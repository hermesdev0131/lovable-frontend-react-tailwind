
// Define all types used in the Master Account context

export interface Client {
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
  clientId: number | null;
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
  clientId: number | null;
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
  forClientId?: number | null;
}

export interface MasterAccountContextType {
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
