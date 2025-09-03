import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { resetPassword } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        
        try {
            await resetPassword(email);
            setMessage('Check your email for the password reset link');
            toast({
                title: "Email sent!",
                description: "Check your email for the password reset link",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send reset email. Please try again.",
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
                            Enter your email and we'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {message && (
                                <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
                                    {message}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                variant="luxury"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <div className="text-sm text-center text-muted-foreground">
                                Remember your password?{' '}
                                <Link to="/login" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
