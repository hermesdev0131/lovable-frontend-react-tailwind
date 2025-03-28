
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
  url: string; // Added missing url property
  status: 'published' | 'draft' | 'scheduled'; // Added 'scheduled' option
  type: 'landing' | 'content' | 'blog' | 'product' | 'other'; // Added 'product' option
  visits: number;
  views: number; // Added views property
  conversions: number; // Added conversions property
  bounceRate: number; // Added bounceRate property
  updatedAt: string; // Added updatedAt property
  lastUpdated: string;
  createdAt: string;
}

export interface PageFormValues {
  title: string;
  slug: string;
  url: string; // Added url field to match the forms
  type: 'landing' | 'content' | 'blog' | 'product' | 'other';
  template?: string;
  content?: string;
  status: 'published' | 'draft' | 'scheduled';
}
