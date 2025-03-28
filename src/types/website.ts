
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
  url?: string;
  status: 'published' | 'draft' | 'scheduled';
  type: 'landing' | 'content' | 'blog' | 'product' | 'other';
  visits: number;
  views?: number;
  conversions?: number;
  bounceRate?: number;
  lastUpdated: string;
  updatedAt?: string;
  createdAt: string;
  content?: string;
  template?: string;
  clientId?: number;
}

export interface PageFormValues {
  title: string;
  slug: string;
  url?: string;
  type: 'landing' | 'content' | 'blog' | 'product' | 'other';
  template?: string;
  content?: string;
  status: 'published' | 'draft' | 'scheduled';
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
