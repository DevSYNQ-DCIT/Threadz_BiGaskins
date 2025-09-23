import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, name } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const profileData = {
      id: userId,
      email: email.toLowerCase().trim(),
      full_name: (name || 'User').trim(),
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error in service role profile creation:', error);
      return res.status(500).json({ 
        error: 'Failed to create profile',
        details: error.message,
        hint: error.hint,
        code: error.code
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error in create-profile API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
