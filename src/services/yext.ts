
import { toast } from "@/hooks/use-toast";

export interface YextCredentials {
  apiKey: string;
  businessId: string;
}

export interface YextReview {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  authorPhoto?: string;
  date: string;
  platform: string;
  status: 'published' | 'flagged';
  replied: boolean;
  replyText?: string;
}

export interface YextRatingData {
  date: string;
  average: string;
  volume: number;
}

// Function to store Yext credentials in localStorage
export const storeYextCredentials = (credentials: YextCredentials): void => {
  localStorage.setItem('yextCredentials', JSON.stringify(credentials));
};

// Function to get Yext credentials from localStorage
export const getYextCredentials = (): YextCredentials | null => {
  const credentials = localStorage.getItem('yextCredentials');
  return credentials ? JSON.parse(credentials) : null;
};

// Function to clear Yext credentials from localStorage
export const clearYextCredentials = (): void => {
  localStorage.removeItem('yextCredentials');
};

// Function to validate API key format
export const validateYextApiKey = (apiKey: string): boolean => {
  // Yext API keys typically have a specific format
  return /^[a-zA-Z0-9_-]{20,}$/.test(apiKey);
};

// Function to test Yext connection with provided credentials
export const testYextConnection = async (credentials: YextCredentials): Promise<boolean> => {
  try {
    const { apiKey, businessId } = credentials;
    
    // API endpoint for Yext Knowledge API (adjust according to Yext's API documentation)
    const endpoint = `https://api.yext.com/v2/accounts/me/entities/${businessId}?api_key=${apiKey}&v=20231130`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      console.error('Yext connection test failed:', await response.text());
      return false;
    }
    
    const data = await response.json();
    return data && data.response && data.response.entity ? true : false;
  } catch (error) {
    console.error('Error testing Yext connection:', error);
    return false;
  }
};

// Function to fetch reviews from Yext API
export const fetchYextReviews = async (credentials: YextCredentials, filters?: any): Promise<YextReview[]> => {
  try {
    const { apiKey, businessId } = credentials;
    
    // Construct the query parameters
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      v: '20231130',
      entityId: businessId
    });
    
    // Add filters if provided
    if (filters) {
      if (filters.dateRange) {
        const today = new Date();
        let startDate = new Date();
        
        switch (filters.dateRange) {
          case '7d':
            startDate.setDate(today.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(today.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(today.getDate() - 90);
            break;
          case '1y':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        }
        
        queryParams.append('startDate', startDate.toISOString().split('T')[0]);
        queryParams.append('endDate', today.toISOString().split('T')[0]);
      }
      
      if (filters.platform) {
        queryParams.append('source', filters.platform);
      }
      
      if (filters.rating) {
        queryParams.append('rating', filters.rating.toString());
      }
    }
    
    // API endpoint for Yext Reviews API
    const endpoint = `https://api.yext.com/v2/accounts/me/reviews?${queryParams.toString()}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Yext API response to our format
    if (data && data.response && data.response.reviews) {
      return data.response.reviews.map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.content,
        authorName: review.authorName || 'Anonymous',
        authorPhoto: review.authorPhoto || undefined,
        date: review.publishDate,
        platform: review.source || 'Unknown',
        status: review.status === 'LIVE' ? 'published' : 'flagged',
        replied: !!review.response,
        replyText: review.response?.content
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Yext reviews:', error);
    toast({
      title: "Error Fetching Reviews",
      description: "Could not retrieve reviews from Yext.",
      variant: "destructive"
    });
    return [];
  }
};

// Function to fetch rating aggregates over time from Yext API
export const fetchYextRatingData = async (credentials: YextCredentials, period: string = '30d'): Promise<YextRatingData[]> => {
  try {
    const { apiKey, businessId } = credentials;
    
    // Calculate date range based on period
    const today = new Date();
    let startDate = new Date();
    let days = 30;
    
    switch (period) {
      case '7d':
        days = 7;
        startDate.setDate(today.getDate() - 7);
        break;
      case '30d':
        days = 30;
        startDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        days = 90;
        startDate.setDate(today.getDate() - 90);
        break;
      case '1y':
        days = 365;
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }
    
    // API endpoint for Yext Analytics API
    const endpoint = `https://api.yext.com/v2/accounts/me/analytics/reviews?api_key=${apiKey}&v=20231130&entityId=${businessId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${today.toISOString().split('T')[0]}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rating data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // If we have daily data from the API
    if (data && data.response && data.response.dailyMetrics) {
      return data.response.dailyMetrics.map((metric: any) => ({
        date: metric.date,
        average: metric.averageRating.toFixed(1),
        volume: metric.reviewCount
      }));
    }
    
    // If no data, return empty array with dates based on the period
    const emptyData: YextRatingData[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      emptyData.push({
        date: date.toISOString().split('T')[0],
        average: "0.0",
        volume: 0
      });
    }
    
    return emptyData;
  } catch (error) {
    console.error('Error fetching Yext rating data:', error);
    toast({
      title: "Error Fetching Ratings",
      description: "Could not retrieve rating data from Yext.",
      variant: "destructive"
    });
    
    // Return empty dataset on error
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      average: "0.0",
      volume: 0,
    }));
  }
};

// Function to fetch platform distribution data from Yext API
export const fetchYextPlatformData = async (credentials: YextCredentials): Promise<any[]> => {
  try {
    const { apiKey, businessId } = credentials;
    
    // API endpoint for Yext Reviews API with source breakdown
    const endpoint = `https://api.yext.com/v2/accounts/me/analytics/reviews/sources?api_key=${apiKey}&v=20231130&entityId=${businessId}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch platform data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.response && data.response.sources) {
      return data.response.sources.map((source: any) => ({
        name: source.source,
        reviews: source.reviewCount,
        average: source.averageRating
      }));
    }
    
    // Return common platform data if API doesn't provide it
    return [
      { name: 'Google', reviews: 0, average: 0 },
      { name: 'Yelp', reviews: 0, average: 0 },
      { name: 'Facebook', reviews: 0, average: 0 },
      { name: 'TripAdvisor', reviews: 0, average: 0 }
    ];
  } catch (error) {
    console.error('Error fetching Yext platform data:', error);
    toast({
      title: "Error Fetching Platform Data",
      description: "Could not retrieve platform distribution from Yext.",
      variant: "destructive"
    });
    
    // Return default platform data on error
    return [
      { name: 'Google', reviews: 0, average: 0 },
      { name: 'Yelp', reviews: 0, average: 0 },
      { name: 'Facebook', reviews: 0, average: 0 },
      { name: 'TripAdvisor', reviews: 0, average: 0 }
    ];
  }
};

// Function to respond to a review
export const respondToYextReview = async (
  credentials: YextCredentials, 
  reviewId: string, 
  responseText: string
): Promise<boolean> => {
  try {
    const { apiKey, businessId } = credentials;
    
    // API endpoint for responding to a review
    const endpoint = `https://api.yext.com/v2/accounts/me/reviews/${reviewId}/responses?api_key=${apiKey}&v=20231130`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entityId: businessId,
        content: responseText
      })
    });
    
    if (!response.ok) {
      console.error('Failed to respond to review:', await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error responding to review:', error);
    return false;
  }
};
