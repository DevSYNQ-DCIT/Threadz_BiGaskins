import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Check for redirect state from signup
    useEffect(() => {
        if (location.state?.message) {
            toast({
                title: 'Account created!',
                description: location.state.message,
            });
            
            // Clear the state to prevent showing the message again on refresh
            window.history.replaceState({}, document.title);
            
            // Pre-fill the email if provided
            if (location.state.email) {
                setEmail(location.state.email);
            }
        }
    }, [location.state, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast({
                title: "Welcome back!",
                description: "You have been logged in successfully.",
            });
            navigate('/');
        } catch (error) {
            toast({
                title: "Login failed",
                description: "Please check your credentials and try again.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="mb-4 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Card className="w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-serif text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
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
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forgot-password" className="text-xs text-muted-foreground font-medium hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className="text-sm text-center text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;