
type WebsitePage = {
  views?: number;
  conversions?: number;
  bounceRate?: number;
  status?: string;
  type?: string;
};

export const calculateWebsiteStats = (websitePages: WebsitePage[]) => {
  const totalPages = websitePages.length;
  const publishedPages = websitePages.filter(page => page.status === 'published').length;
  const totalViews = websitePages.reduce((sum, page) => sum + (page.views || 0), 0);
  const totalConversions = websitePages.reduce((sum, page) => sum + (page.conversions || 0), 0);
  const avgBounceRate = websitePages.length > 0 
    ? websitePages.reduce((sum, page) => sum + (page.bounceRate || 0), 0) / websitePages.length 
    : 0;
  
  // Landing pages specifically
  const landingPages = websitePages.filter(page => page.type === 'landing');
  const landingPageViews = landingPages.reduce((sum, page) => sum + (page.views || 0), 0);
  const landingPageConversions = landingPages.reduce((sum, page) => sum + (page.conversions || 0), 0);

  return {
    totalPages,
    publishedPages,
    totalViews,
    totalConversions,
    avgBounceRate,
    landingPages,
    landingPageViews,
    landingPageConversions
  };
};
