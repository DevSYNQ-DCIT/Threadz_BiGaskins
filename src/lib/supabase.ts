import { createClient } from '@supabase/supabase-js';

// For testing - Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://vanzoqoooqnvotjaiiyr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbnpvcW9vb3Fudm90amFpaXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzM1MTgsImV4cCI6MjA3MjMwOTUxOH0.JaGDeSyGo1HZcjMtZGzgS0g7jbF89nmjkkwFHVWvQvw';

// Log the values to verify they're being set
console.log('Supabase URL:', SUPABASE_URL ? '✅ Present' : '❌ Missing');
console.log('Supabase Key:', SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials. Please update supabase.ts with your actual credentials.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    
    // Return success status and data
    return { 
      success: true, 
      message: 'Account created successfully! Please check your email to confirm your account.',
      data 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create account',
      data: null 
    };
  }
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
