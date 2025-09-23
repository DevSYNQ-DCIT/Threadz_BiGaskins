import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Types and interfaces
export type UserRole = 'user' | 'admin';

export interface User {
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

export interface SignUpResponse {
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

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to fetch user profile
    const fetchUserProfile = useCallback(async (userId: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
                console.error('Error fetching user profile:', error);
                throw error;
            }

            return profile;
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            throw error;
        }
    }, []);

    // Handle auth state changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    setSession(session);

                    // For password reset flow
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
                        const profile = await fetchUserProfile(session.user.id);
                        
                        setUser({
                            id: session.user.id,
                            email: session.user.email!,
                            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
                            role: (profile?.role as UserRole) || 'user',
                            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                            created_at: profile?.created_at,
                            updated_at: profile?.updated_at
                        });
                    } catch (error) {
                        console.error('Error handling auth state change:', error);
                    }
                } else {
                    setSession(null);
                    setUser(null);
                }
                setIsLoading(false);
            }
        );

        // Initial session check
        const checkSession = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (currentSession) {
                    const profile = await fetchUserProfile(currentSession.user.id);
                    setSession(currentSession);
                    setUser({
                        id: currentSession.user.id,
                        email: currentSession.user.email!,
                        name: profile?.full_name || currentSession.user.user_metadata?.full_name || 'User',
                        role: (profile?.role as UserRole) || 'user',
                        avatar_url: profile?.avatar_url || currentSession.user.user_metadata?.avatar_url,
                        created_at: profile?.created_at,
                        updated_at: profile?.updated_at
                    });
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchUserProfile]);

    // Auth methods will be implemented here
    const signUp = async (email: string, password: string, name: string): Promise<SignUpResponse> => {
        setIsLoading(true);
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedName = name.trim();
        
        console.log('Starting signup process...', { email: normalizedEmail, name: normalizedName });
        
        // We'll store the user ID to use for profile creation
        let userId: string | null = null;
        
        try {
            // 1. First sign up the user with Supabase Auth
            console.log('Attempting to create auth user...');
            
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: normalizedEmail,
                password: password.trim(),
                options: {
                    data: {
                        full_name: normalizedName,
                        email: normalizedEmail
                    },
                    emailRedirectTo: `http://localhost:8080/auth/callback`,
                    emailConfirm: true
                },
            });

            if (authError) {
                console.error('Auth error:', authError);
                throw new Error(authError.message || 'Failed to create user account');
            }

            // Store the user ID for profile creation
            if (authData.user) {
                userId = authData.user.id;
                
                // Prepare profile data
                const profileData = {
                    id: userId,
                    email: normalizedEmail,
                    full_name: normalizedName,
                    role: 'customer',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                console.log('Creating/updating profile with data:', profileData);
                
                try {
                    // Try with the current session first
                    const { data: profileDataResult, error: profileError } = await supabase
                        .from('profiles')
                        .upsert(profileData)
                        .select()
                        .single();
                    
                    if (profileError) {
                        console.warn('First profile creation attempt failed, trying with service role key...', profileError);
                        
                        // If first attempt fails, try with service role key (bypasses RLS)
                        const { data: serviceProfileData, error: serviceError } = await fetch('/api/create-profile', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId,
                                email: normalizedEmail,
                                name: normalizedName
                            }),
                        }).then(res => res.json());
                        
                        if (serviceError) {
                            console.error('Service role profile creation failed:', serviceError);
                            throw new Error(`Failed to create user profile: ${serviceError.message}`);
                        }
                        
                        console.log('Profile created using service role key');
                    } else {
                        console.log('Profile created/updated successfully', profileDataResult);
                    }
                } catch (profileError: any) {
                    console.error('Profile creation error:', profileError);
                    
                    // Don't delete the auth user if profile creation fails
                    // The user can complete profile setup after email verification
                    console.warn('Profile creation failed, but auth user was created. User can complete setup after email verification.');
                    
                    // Still continue with the signup process since the auth user was created
                    // The profile can be created when the user verifies their email
                }
            }

            // 3. If signup was successful but user is not confirmed yet
            if (authData.user && !authData.user.identities?.length) {
                console.log('User needs email verification');
                return {
                    success: true,
                    message: 'A confirmation email has been sent. Please check your email to verify your account.',
                    data: {
                        ...authData,
                        requiresConfirmation: true
                    }
                };
            }

            // 4. If we get here, signup was successful
            return {
                success: true,
                message: 'Account created successfully!',
                data: authData
            };

        } catch (error: any) {
            console.error('Signup process failed:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: error.cause
            });
            
            // Re-throw with a more user-friendly message if needed
            if (!error.message.includes('already registered')) {
                error.message = 'Failed to create account. ' + (error.message || 'Please try again.');
            }
            
            throw error;
            
        } finally {
            console.log('Signup process completed');
            setIsLoading(false);
        }
    };

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

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `http://localhost:8080/auth/callback`,
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
                    redirectTo: `http://localhost:8080/auth/callback`,
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
                    emailRedirectTo: `http://localhost:8080/auth/callback`,
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
            redirectTo: `http://localhost:8080/reset-password`,
            skipBrowserRedirect: true,
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

    const isAdmin = (): boolean => {
        // Check if user exists and has admin role
        return !!user && user.role === 'admin';
    };

    const value = {
        user,
        session,
        isLoading,
        login,
        signUp,
        logout,
        signInWithGoogle,
        signInWithGitHub,
        resetPassword,
        updatePassword,
        resendVerification,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };