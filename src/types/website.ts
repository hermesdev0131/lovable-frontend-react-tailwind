
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
  url: string;
  status: 'published' | 'draft' | 'scheduled';
  type: 'landing' | 'content' | 'blog' | 'product' | 'other';
  visits: number;
  views: number;
  conversions: number;
  bounceRate: number;
  updatedAt: string;
  lastUpdated: string;
  createdAt: string;
  clientId: number | null;
}

export interface PageFormValues {
  title: string;
  slug: string;
  url: string;
  type: 'landing' | 'content' | 'blog' | 'product' | 'other';
  template?: string;
  content?: string;
  status: 'published' | 'draft' | 'scheduled';
}
