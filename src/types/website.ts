
export interface YextIntegration {
  apiKey: string;
  businessId: string;
  lastSynced: string | null;
  isConnected: boolean;
}

export interface ReviewFilter {
  rating?: number;
  platform?: string;
  dateRange: string;
  keyword?: string;
}

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  type: 'landing' | 'content' | 'blog' | 'other';
  visits: number;
  lastUpdated: string;
  createdAt: string;
  content?: string;
  template?: string;
}

export interface PageFormValues {
  title: string;
  slug: string;
  type: 'landing' | 'content' | 'blog' | 'other';
  template?: string;
  content?: string;
  status: 'published' | 'draft';
}

// Adding integration interfaces
export interface Integration {
  id: string;
  name: string;
  type: 'email' | 'calendar' | 'webhook' | 'api' | 'other';
  url?: string;
  status: 'active' | 'inactive' | 'error';
}

export interface WebhookIntegration extends Integration {
  webhookUrl: string;
  events: string[];
  lastTriggered?: string;
}
