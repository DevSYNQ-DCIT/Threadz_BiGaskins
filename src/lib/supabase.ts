import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Debug: Log environment variables (remove in production)
console.log('Loading Supabase with environment:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing',
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables. Please check your .env.local file.';
  console.error('❌', errorMessage);
  console.log('Current environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl || 'undefined',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined'
  });
  throw new Error(errorMessage);
}

// Initialize Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Ensure email confirmation is required
    signInOptions: {
      email: true,
      password: true,
      emailConfirm: true
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test the connection (optional, for debugging)
supabase.auth.getSession()
  .then(({ data: { session } }) => {
    console.log('Supabase initialized successfully!', {
      isAuthenticated: !!session?.user,
      user: session?.user?.email || 'No user logged in'
    });
  })
  .catch(error => {
    console.error('Supabase initialization warning:', error.message);
  });

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred with the database');
};

// Type for the database schema
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          avatar_url: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          avatar_url?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          avatar_url?: string | null;
          updated_at?: string;
          created_at?: string;
        };
      };
    };
  };
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `http://localhost:8080/auth/callback`,
      },
    });

    if (error) handleSupabaseError(error);

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
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:8080/auth/callback`,
      },
    });

    if (error) handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error('Google signin error:', error);
    throw error;
  }
};

export const signInWithGitHub = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `http://localhost:8080/auth/callback`,
      },
    });

    if (error) handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error('GitHub signin error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) handleSupabaseError(error);
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
};
