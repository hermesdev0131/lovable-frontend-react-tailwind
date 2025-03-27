
export interface ContentItem {
  id: number;
  title: string;
  content: string;
  type: 'blog' | 'social' | 'email' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'scheduled' | 'draft';
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  scheduledFor?: string;
  platform?: string;
  media?: string | null;
  rejectionReason?: string;
}

export interface WebsitePage {
  id: number;
  title: string;
  slug: string;
  content: string;
  url?: string;
  status: 'published' | 'draft' | 'scheduled';
  createdAt: string;
  updatedAt: string;
  type?: 'landing' | 'blog' | 'product' | 'other';
  views?: number;
  conversions?: number;
  bounceRate?: number;
}

export interface Webhook {
  id: number;
  name: string;
  url: string;
  event: string;
  active: boolean;
  lastTriggered?: string;
  createdAt: string;
}
