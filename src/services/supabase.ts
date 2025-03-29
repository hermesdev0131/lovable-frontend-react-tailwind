
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/deploymentConfig';

// Default development values - replace these with your actual Supabase project values
const DEFAULT_SUPABASE_URL = 'https://your-project-id.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-anon-key';

// Use environment variables if available, otherwise use defaults
const supabaseUrl = SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Log warning if using default values
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Using default Supabase values. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables for production use.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SendEmailParams {
  to: string;
  subject: string;
  message: string;
  name: string;
  role: string;
}

/**
 * Sends an invitation email via Supabase Edge Function
 */
export const sendInvitationEmail = async ({
  to,
  subject,
  message,
  name,
  role
}: SendEmailParams): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-invitation-email', {
      body: {
        to,
        subject,
        message,
        name,
        role
      }
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error };
  }
};
