
import { toast } from "@/hooks/use-toast";

// Interface for Mailchimp API credentials
export interface MailchimpCredentials {
  apiKey: string;
  server: string; // The server prefix (e.g., 'us1')
}

// Interface for a Mailchimp campaign
export interface MailchimpCampaign {
  id: string;
  web_id: number;
  type: string;
  status: string;
  create_time: string;
  archive_url: string;
  long_archive_url: string;
  settings: {
    subject_line: string;
    title: string;
    from_name: string;
    reply_to: string;
  };
  tracking: {
    opens: boolean;
    html_clicks: boolean;
    text_clicks: boolean;
  };
}

// Store Mailchimp credentials in localStorage
export const storeMailchimpCredentials = (credentials: MailchimpCredentials): void => {
  localStorage.setItem('mailchimp_credentials', JSON.stringify(credentials));
};

// Get Mailchimp credentials from localStorage
export const getMailchimpCredentials = (): MailchimpCredentials | null => {
  const credentials = localStorage.getItem('mailchimp_credentials');
  return credentials ? JSON.parse(credentials) : null;
};

// Clear Mailchimp credentials from localStorage
export const clearMailchimpCredentials = (): void => {
  localStorage.removeItem('mailchimp_credentials');
};

// Check if Mailchimp is connected
export const isMailchimpConnected = (): boolean => {
  return !!getMailchimpCredentials();
};

// Validate Mailchimp API Key format
export const validateApiKeyFormat = (apiKey: string): boolean => {
  // Mailchimp API keys follow the format: {key}-{dc}
  // Where {dc} is the data center (e.g., us1, us2)
  return /^[a-f0-9]{32}-[a-z]{2}[0-9]{1}$/.test(apiKey);
};

// Extract server from API key
export const extractServerFromApiKey = (apiKey: string): string => {
  const parts = apiKey.split('-');
  return parts.length > 1 ? parts[1] : '';
};

// Test Mailchimp connection
export const testMailchimpConnection = async (credentials: MailchimpCredentials): Promise<boolean> => {
  try {
    const { apiKey, server } = credentials;
    
    // Make a request to Mailchimp API to verify the API key
    const response = await fetch(`https://${server}.api.mailchimp.com/3.0/`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`any:${apiKey}`)}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return true;
    } else {
      console.error('Mailchimp API Error:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Mailchimp Connection Error:', error);
    return false;
  }
};

// Create a campaign in Mailchimp
export const createCampaign = async (
  subject: string, 
  content: string
): Promise<string | null> => {
  const credentials = getMailchimpCredentials();
  
  if (!credentials) {
    toast({
      title: "Mailchimp Not Connected",
      description: "Please connect your Mailchimp account first.",
      variant: "destructive"
    });
    return null;
  }
  
  try {
    const { apiKey, server } = credentials;
    
    // Step 1: Create a campaign
    const createResponse = await fetch(`https://${server}.api.mailchimp.com/3.0/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`any:${apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'regular',
        settings: {
          subject_line: subject,
          title: subject,
          from_name: 'Your Company',
          reply_to: 'noreply@yourdomain.com',
        }
      })
    });
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Failed to create campaign: ${errorData.detail}`);
    }
    
    const campaignData = await createResponse.json();
    const campaignId = campaignData.id;
    
    // Step 2: Set the content for the campaign
    const contentResponse = await fetch(`https://${server}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${btoa(`any:${apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html: `<html><body>${content}</body></html>`
      })
    });
    
    if (!contentResponse.ok) {
      const errorData = await contentResponse.json();
      throw new Error(`Failed to set campaign content: ${errorData.detail}`);
    }
    
    return campaignId;
  } catch (error) {
    console.error('Mailchimp Campaign Creation Error:', error);
    toast({
      title: "Campaign Creation Failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Schedule a campaign in Mailchimp
export const scheduleCampaign = async (
  campaignId: string, 
  scheduledDate: Date
): Promise<boolean> => {
  const credentials = getMailchimpCredentials();
  
  if (!credentials) return false;
  
  try {
    const { apiKey, server } = credentials;
    
    const response = await fetch(`https://${server}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`any:${apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        schedule_time: scheduledDate.toISOString()
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to schedule campaign: ${errorData.detail}`);
    }
    
    return true;
  } catch (error) {
    console.error('Mailchimp Schedule Campaign Error:', error);
    toast({
      title: "Campaign Scheduling Failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Get campaigns from Mailchimp
export const getCampaigns = async (): Promise<MailchimpCampaign[]> => {
  const credentials = getMailchimpCredentials();
  
  if (!credentials) return [];
  
  try {
    const { apiKey, server } = credentials;
    
    const response = await fetch(`https://${server}.api.mailchimp.com/3.0/campaigns?count=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`any:${apiKey}`)}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get campaigns: ${errorData.detail}`);
    }
    
    const data = await response.json();
    return data.campaigns;
  } catch (error) {
    console.error('Mailchimp Get Campaigns Error:', error);
    toast({
      title: "Get Campaigns Failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Send a test email for a campaign
export const sendTestEmail = async (campaignId: string, email: string): Promise<boolean> => {
  const credentials = getMailchimpCredentials();
  
  if (!credentials) return false;
  
  try {
    const { apiKey, server } = credentials;
    
    const response = await fetch(`https://${server}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`any:${apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test_emails: [email],
        send_type: 'html'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send test email: ${errorData.detail}`);
    }
    
    return true;
  } catch (error) {
    console.error('Mailchimp Send Test Email Error:', error);
    toast({
      title: "Test Email Failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    return false;
  }
};
