import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type UserRole = 'user' | 'admin';

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

type AuthUser = {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
    };
    created_at: string;
    updated_at: string;
};

interface SignUpResponse {
    success: boolean;
    message: string;
    data: any;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<SignUpResponse>;
    resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    isLoading: boolean;
    isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Create a separate component to avoid Fast Refresh issues
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and set the user
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    setSession(session);

                    // For password reset flow, we don't need to fetch the profile
                    if (window.location.pathname === '/reset-password') {
                        setUser({
                            id: session.user.id,
                            email: session.user.email!,
                            name: 'User',
                            role: 'user'
                        });
                        setIsLoading(false);
                        return;
                    }

                    // Get or create user profile for normal auth flow
                    try {
                        const { data: profile, error } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
                            console.error('Error fetching user profile:', error);
                        }

                        setUser({
                            id: session.user.id,
                            email: session.user.email!,
                            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
                            role: profile?.role || 'user',
                            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                        });
                    } catch (error) {
                        console.error('Error in auth state change:', error);
                    }
                } else {
                    setSession(null);
                    setUser(null);
                }
                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            // 1. First sign up the user with Supabase Auth
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

            if (error) {
                // Handle specific error cases
                if (error.message.includes('already registered')) {
                    throw new Error('This email is already registered. Please sign in instead.');
                }
                throw error;
            }

            // 2. If signup was successful but user is not confirmed yet
            if (data.user && !data.user.identities?.length) {
                throw new Error('This email is already registered. Please sign in instead.');
            }

            // 3. Create user profile in the database
            if (data.user) {
                try {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: data.user.id,
                            email: email.toLowerCase(),
                            full_name: name,
                            role: 'user',
                            updated_at: new Date().toISOString(),
                        });

                    if (profileError) throw profileError;
                } catch (profileError) {
                    console.error('Profile creation error:', profileError);
                    // Don't fail the signup if profile creation fails - we can retry later
                }
            }

            // 4. Return success response
            return {
                success: true,
                message: 'Account created successfully! Please check your email to verify your account.',
                data
            };
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signInWithGitHub = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with GitHub:', error);
            throw error;
        }
    };

    const resendVerification = async (email: string) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            return {
                success: true,
                message: 'Verification email resent successfully!',
            };
        } catch (error: any) {
            console.error('Error resending verification email:', error);
            return {
                success: false,
                message: error.message || 'Failed to resend verification email',
            };
        }
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword: string) => {
      try {
        // No need for session — Supabase reads token from URL automatically
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          console.error('Password update error:', error);
          if (error.message.includes('invalid_grant') || error.message.includes('Auth session missing')) {
            throw new Error('The password reset link is invalid or has expired. Please request a new one.');
          }
          throw new Error(error.message || 'Failed to update password');
        }

        return { success: true, message: 'Password updated successfully' };
      } catch (error: any) {
        console.error('Error in updatePassword:', error);
        throw error;
      }
    };

    const logout = async () => {
        try {
            // Clear local state first
            setUser(null);
            setSession(null);

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            // Force a hard reload to clear any remaining state
            window.location.href = '/login';

            return true;
        } catch (error) {
            console.error('Error signing out:', error);
            // Even if there's an error, we should still clear local state
            setUser(null);
            setSession(null);
            window.location.href = '/login';
            return false;
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };
    const value = React.useMemo(() => ({
        user,
        session,
        login,
        signUp,
        resendVerification,
        signInWithGoogle,
        signInWithGitHub,
        resetPassword,
        updatePassword,
        logout,
        isLoading,
        isAdmin,
    }), [user, session, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}