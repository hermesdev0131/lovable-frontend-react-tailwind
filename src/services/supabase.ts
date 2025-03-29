
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/deploymentConfig';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  message: string;
  name: string;
  role: string;
}

export const sendInvitationEmail = async ({
  to,
  subject,
  message,
  name,
  role
}: SendEmailParams) => {
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
