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
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
const AuthProvider = ({ children }: { children: ReactNode }) => {
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
        console.log('Starting signup process...', { email, name });
        
        try {
            // 1. First sign up the user with Supabase Auth
            console.log('Attempting to create auth user...');
            
            // Log environment variables (without sensitive data)
            console.log('Supabase URL:', 
                import.meta.env.VITE_SUPABASE_URL 
                    ? `${import.meta.env.VITE_SUPABASE_URL.substring(0, 20)}...` 
                    : 'Not set');

            const signUpPayload = {
                email: email.toLowerCase().trim(),
                password: password.trim(),
                options: {
                    data: {
                        full_name: name.trim(),
                        email: email.toLowerCase().trim(),
                    },
                    emailRedirectTo: `http://localhost:8080/auth/callback`,
                },
            };
            
            console.log('Signup payload (sanitized):', {
                ...signUpPayload,
                password: '***', // Don't log actual password
                options: {
                    ...signUpPayload.options,
                    data: {
                        ...signUpPayload.options.data,
                        email: signUpPayload.options.data.email ? '***@***' : 'missing'
                    }
                }
            });

            // Make the signup request
            const { data, error } = await supabase.auth.signUp(signUpPayload);

            if (error) {
                console.error(' Auth signup error:', {
                    name: error.name,
                    message: error.message,
                    status: error.status,
                    cause: error.cause,
                    stack: error.stack,
                    // Include additional error details if available
                    ...(error as any).response?.data && { responseData: (error as any).response.data },
                    ...(error as any).response?.statusText && { statusText: (error as any).response.statusText }
                });

                // Handle specific error cases
                if (error.message.includes('already registered')) {
                    throw new Error('This email is already registered. Please sign in instead.');
                } else if (error.message.includes('password')) {
                    throw new Error('Invalid password. Please use a stronger password.');
                } else if (error.message.includes('email')) {
                    throw new Error('Invalid email address. Please check and try again.');
                } else if (error.status === 500) {
                    console.error(' 500 Error Details:', {
                        status: error.status,
                        statusText: (error as any).statusText || 'No status text',
                        response: (error as any).response || 'No response details',
                        config: {
                            url: (error as any).config?.url,
                            method: (error as any).config?.method,
                            headers: {
                                ...(error as any).config?.headers,
                                // Don't log auth headers
                                Authorization: (error as any).config?.headers?.Authorization ? '***' : undefined
                            }
                        }
                    });
                    
                    // Test database connection
                    try {
                        console.log(' Testing database connection...');
                        const { data: testData, error: testError } = await supabase
                            .from('profiles')
                            .select('count')
                            .limit(1);
                            
                        if (testError) {
                            console.error(' Database connection test failed:', testError);
                            throw new Error('Database connection issue. Please try again later.');
                        }
                        
                        console.log(' Database connection test successful');
                    } catch (testError) {
                        console.error(' Database test error:', testError);
                    }
                    
                    throw new Error('Unable to create user account. Please try again later.');
                }
                
                throw error;
            }

            console.log('Auth user created:', { userId: data.user?.id });

            // 2. If signup was successful but user is not confirmed yet
            if (data.user && !data.user.identities?.length) {
                console.log('User needs email verification');
                return {
                    success: true,
                    message: 'A confirmation email has been sent. Please check your email to verify your account.',
                    data: {
                        ...data,
                        requiresConfirmation: true
                    }
                };
            }

            // 3. Create user profile in the database
            if (data.user) {
                try {
                    const profileData = {
                        id: data.user.id,
                        email: email.toLowerCase().trim(),
                        full_name: name.trim(),
                        role: 'user',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    
                    console.log('Creating profile with data:', profileData);
                    
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .upsert(profileData)
                        .select()
                        .single();

                    if (profileError) {
                        console.error('Profile creation error:', {
                            message: profileError.message,
                            details: profileError.details,
                            hint: profileError.hint,
                            code: profileError.code
                        });
                        
                        // Try to delete the auth user if profile creation fails
                        try {
                            console.log('Attempting to clean up auth user due to profile creation failure...');
                            const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
                            if (deleteError) {
                                console.error('Failed to clean up auth user:', deleteError);
                            } else {
                                console.log('Successfully cleaned up auth user');
                            }
                        } catch (deleteError) {
                            console.error('Error during auth user cleanup:', deleteError);
                        }
                        
                        throw new Error(profileError.message || 'Failed to create user profile. Please try again.');
                    }
                    
                    console.log('Profile created successfully:', profile);
                    
                    // Update the user state
                    setUser({
                        id: data.user.id,
                        email: email.toLowerCase().trim(),
                        name: name.trim(),
                        role: 'user',
                        created_at: profile.created_at,
                        updated_at: profile.updated_at
                    });
                    
                    return {
                        success: true,
                        message: 'Account created successfully!',
                        data: {
                            ...data,
                            profile
                        }
                    };
                    
                } catch (profileError: any) {
                    console.error('Error in profile creation:', {
                        name: profileError.name,
                        message: profileError.message,
                        stack: profileError.stack
                    });
                    
                    throw new Error(profileError.message || 'Failed to set up your account. Please try again.');
                }
            }
            
            // If we get here, something unexpected happened
            throw new Error('An unexpected error occurred during signup');
            
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

export { AuthProvider, useAuth };