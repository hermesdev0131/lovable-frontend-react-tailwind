
/**
 * Social Media Integration Service
 * Handles connections and posting to various social media platforms
 */

export type SocialMediaPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin';

export interface SocialMediaCredentials {
  platform: SocialMediaPlatform;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  accountId?: string;
  isConnected: boolean;
}

export interface PostContentPayload {
  content: string;
  title?: string;
  mediaUrl?: string;
  scheduledFor?: Date;
}

class SocialMediaService {
  private credentials: Map<SocialMediaPlatform, SocialMediaCredentials> = new Map();

  /**
   * Store credentials for a specific platform
   */
  setCredentials(platform: SocialMediaPlatform, creds: Partial<SocialMediaCredentials>): void {
    const existing = this.credentials.get(platform) || {
      platform,
      isConnected: false
    };
    
    this.credentials.set(platform, { 
      ...existing,
      ...creds,
      isConnected: Boolean(creds.accessToken)
    });
    
    // Store in localStorage for persistence
    this.saveCredentialsToStorage();
  }

  /**
   * Get credentials for a specific platform
   */
  getCredentials(platform: SocialMediaPlatform): SocialMediaCredentials | undefined {
    return this.credentials.get(platform);
  }

  /**
   * Check if a platform is connected
   */
  isPlatformConnected(platform: SocialMediaPlatform): boolean {
    return this.credentials.get(platform)?.isConnected || false;
  }

  /**
   * Get all connected platforms
   */
  getConnectedPlatforms(): SocialMediaPlatform[] {
    return Array.from(this.credentials.entries())
      .filter(([_, creds]) => creds.isConnected)
      .map(([platform]) => platform);
  }

  /**
   * Save credentials to localStorage
   */
  private saveCredentialsToStorage(): void {
    const credsObject: Record<string, SocialMediaCredentials> = {};
    this.credentials.forEach((value, key) => {
      credsObject[key] = value;
    });
    
    localStorage.setItem('social_media_credentials', JSON.stringify(credsObject));
  }

  /**
   * Load credentials from localStorage
   */
  loadCredentialsFromStorage(): void {
    try {
      const stored = localStorage.getItem('social_media_credentials');
      if (stored) {
        const credsObject = JSON.parse(stored) as Record<string, SocialMediaCredentials>;
        Object.entries(credsObject).forEach(([key, value]) => {
          this.credentials.set(key as SocialMediaPlatform, value);
        });
      }
    } catch (error) {
      console.error('Failed to load social media credentials from storage', error);
    }
  }

  /**
   * Post content to a specific platform
   */
  async postToSocialMedia(
    platform: SocialMediaPlatform, 
    payload: PostContentPayload
  ): Promise<{ success: boolean; message: string; postId?: string }> {
    const credentials = this.credentials.get(platform);
    
    if (!credentials?.isConnected) {
      return { 
        success: false, 
        message: `Not connected to ${platform}. Please connect your account first.` 
      };
    }
    
    try {
      // Different implementation based on platform
      switch (platform) {
        case 'facebook':
          return await this.postToFacebook(payload, credentials);
        case 'twitter':
          return await this.postToTwitter(payload, credentials);
        case 'instagram':
          return await this.postToInstagram(payload, credentials);
        case 'linkedin':
          return await this.postToLinkedIn(payload, credentials);
        default:
          return { success: false, message: 'Unsupported platform' };
      }
    } catch (error) {
      console.error(`Error posting to ${platform}:`, error);
      return { 
        success: false, 
        message: `Failed to post to ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Implementation for Facebook posting
   */
  private async postToFacebook(
    payload: PostContentPayload, 
    credentials: SocialMediaCredentials
  ): Promise<{ success: boolean; message: string; postId?: string }> {
    if (!credentials.accessToken || !credentials.accountId) {
      return { success: false, message: 'Missing Facebook credentials' };
    }

    try {
      // Facebook Graph API endpoint
      const endpoint = `https://graph.facebook.com/v18.0/${credentials.accountId}/feed`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: payload.content,
          access_token: credentials.accessToken,
          // Include image if available
          ...(payload.mediaUrl && { attachment: { media_fbid: payload.mediaUrl } }),
          // Schedule if needed
          ...(payload.scheduledFor && { scheduled_publish_time: Math.floor(payload.scheduledFor.getTime() / 1000) }),
          ...(payload.scheduledFor && { published: false }),
        }),
      });

      const data = await response.json();
      
      if (data.id) {
        return { success: true, message: 'Posted to Facebook successfully', postId: data.id };
      } else {
        return { success: false, message: data.error?.message || 'Unknown error posting to Facebook' };
      }
    } catch (error) {
      console.error('Facebook posting error:', error);
      return { success: false, message: 'Error posting to Facebook' };
    }
  }

  /**
   * Implementation for Twitter posting
   */
  private async postToTwitter(
    payload: PostContentPayload, 
    credentials: SocialMediaCredentials
  ): Promise<{ success: boolean; message: string; postId?: string }> {
    // Twitter API implementation would go here
    // For now, returning a placeholder
    // console.log('Would post to Twitter:', payload, 'with credentials:', credentials);
    return { success: false, message: 'Twitter API integration not fully implemented yet' };
  }

  /**
   * Implementation for Instagram posting
   */
  private async postToInstagram(
    payload: PostContentPayload, 
    credentials: SocialMediaCredentials
  ): Promise<{ success: boolean; message: string; postId?: string }> {
    // Instagram API implementation would go here
    // For now, returning a placeholder
    // console.log('Would post to Instagram:', payload, 'with credentials:', credentials);
    return { success: false, message: 'Instagram API integration not fully implemented yet' };
  }

  /**
   * Implementation for LinkedIn posting
   */
  private async postToLinkedIn(
    payload: PostContentPayload, 
    credentials: SocialMediaCredentials
  ): Promise<{ success: boolean; message: string; postId?: string }> {
    // LinkedIn API implementation would go here
    // For now, returning a placeholder
    // console.log('Would post to LinkedIn:', payload, 'with credentials:', credentials);
    return { success: false, message: 'LinkedIn API integration not fully implemented yet' };
  }
}

// Export as a singleton
export const socialMediaService = new SocialMediaService();

// Initialize by loading stored credentials
socialMediaService.loadCredentialsFromStorage();
