
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

// Added missing types that are referenced by other components
export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  type: 'landing' | 'content' | 'blog' | 'other';
  visits: number;
  lastUpdated: string;
  createdAt: string;
}

export interface PageFormValues {
  title: string;
  slug: string;
  type: 'landing' | 'content' | 'blog' | 'other';
  template?: string;
  content?: string;
  status: 'published' | 'draft';
}
