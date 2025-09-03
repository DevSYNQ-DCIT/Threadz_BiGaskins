import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updatePassword } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords don't match",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            // First try to update the password directly
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;
            
            toast({
                title: "Success!",
                description: "Your password has been updated. You can now log in with your new password.",
            });
            
            // Sign out the user to ensure clean state
            await supabase.auth.signOut();
            
            // Redirect to login
            navigate('/login');
        } catch (error: unknown) {
            console.error('Password reset error:', error);
            let errorMessage = 'Failed to update password. Please try again.';
            
                if (error instanceof Error) {
                    errorMessage = error.message.includes('invalid_grant') || 
                                 error.message.includes('Auth session missing')
                        ? 'The password reset link is invalid or has expired. Please request a new one.'
                        : error.message || errorMessage;
                }
                
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-serif text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your new password
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                variant="luxury"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
