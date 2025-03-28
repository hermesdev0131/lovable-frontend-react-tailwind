
// Create a type adapter to handle context vs component type differences
type ContextWebsitePage = {
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
};

// Type adapter function to ensure consistency
export const adaptWebsitePageForComponents = (page: ContextWebsitePage) => {
  return {
    id: String(page.id),
    title: page.title,
    slug: page.url || '',
    url: page.url,
    status: page.status,
    type: page.type,
    visits: page.views || 0,
    views: page.views || 0,
    conversions: page.conversions || 0,
    bounceRate: page.bounceRate || 0,
    lastUpdated: page.updatedAt,
    updatedAt: page.updatedAt,
    createdAt: page.createdAt,
    clientId: String(page.clientId)
  };
};
