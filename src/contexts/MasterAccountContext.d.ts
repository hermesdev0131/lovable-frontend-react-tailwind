
import { ContentItem, WebsitePage, Webhook } from '../types/content';

export interface MasterAccountContextType {
  currentClientId: number | null;
  isInMasterMode: boolean;
  switchClient: (clientId: number | null) => void;
  toggleMasterMode: () => void;
  clients: ClientItem[];
  
  // Content management
  getContentItems: (clientId?: number | null, type?: string) => ContentItem[];
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContentStatus: (contentId: number, status: ContentItem['status'], rejectionReason?: string) => void;
  
  // Website management
  websitePages: WebsitePage[];
  addWebsitePage: (page: Omit<WebsitePage, 'id'>) => void;
  updateWebsitePage: (pageId: number, data: Partial<WebsitePage>) => void;
  removeWebsitePage: (pageId: number) => void;
  
  // Webhook management
  webhooks: Webhook[];
  updateWebhookStatus: (webhookId: number, active: boolean, lastTriggered?: string) => void;
}

export interface ClientItem {
  id: number;
  name: string;
  email: string;
  logo?: string;
}
