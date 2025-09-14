import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';

type SignupStep = 'method' | 'email' | 'verification' | 'complete';

const Signup = () => {
    const [step, setStep] = useState<SignupStep>('method');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { 
        signUp, 
        signInWithGoogle, 
        signInWithGitHub, 
        resendVerification 
    } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!email || !password || !name) {
            const errorMsg = 'All fields are required';
            console.error('Validation error:', errorMsg);
            setError(errorMsg);
            return;
        }
        
        if (password.length < 6) {
            const errorMsg = 'Password must be at least 6 characters';
            console.error('Validation error:', errorMsg);
            setError(errorMsg);
            return;
        }
        
        setIsLoading(true);
        console.log('Starting signup process...', { email, name });
        
        try {
            console.log('Calling signUp function...');
            const result = await signUp(email, password, name);
            console.log('Signup result:', result);
            
            if (result && result.success) {
                console.log('Signup successful, showing verification step');
                setStep('verification');
                toast({
                    title: 'Verification email sent',
                    description: 'Please check your email to verify your account.',
                });
                
                // Auto-navigate to login after 5 seconds
                setTimeout(() => {
                    console.log('Navigating to login page...');
                    navigate('/login', { 
                        state: { 
                            email,
                            message: 'Account created successfully! Please verify your email to continue.'
                        },
                        replace: true
                    });
                }, 5000);
            } else {
                const errorMessage = result?.message || 'Failed to create account';
                console.error('Signup failed with result:', { result });
                throw new Error(errorMessage);
            }
        } catch (err: any) {
            console.error('Error in handleEmailSubmit:', {
                name: err.name,
                message: err.message,
                stack: err.stack,
                cause: err.cause,
                response: err.response
            });
            
            let errorMessage = 'Failed to create account. Please try again.';
            
            // Handle specific error cases
            if (err.message.includes('already registered')) {
                errorMessage = 'This email is already registered. Please sign in instead.';
            } else if (err.message.includes('password')) {
                errorMessage = 'Invalid password. Please try again with a stronger password.';
            } else if (err.message.includes('email')) {
                errorMessage = 'Invalid email address. Please check and try again.';
            }
            
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            console.log('Signup process completed');
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        try {
            setIsLoading(true);
            setError('');
            
            if (provider === 'google') {
                await signInWithGoogle();
            } else {
                await signInWithGitHub();
            }
            
            // The OAuth flow will redirect back to the callback URL
            // which will handle the rest of the authentication
            
        } catch (err: any) {
            setError(err.message || `Failed to sign in with ${provider}`);
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'method':
                return (
                    <div className="space-y-6">
                        {/*<div className="space-y-2 text-center">*/}
                        {/*    <h1 className="text-2xl font-bold">Create an account</h1>*/}
                        {/*    <p className="text-muted-foreground">Choose your preferred sign up method</p>*/}
                        {/*</div>*/}
                        
                        <div className="grid gap-4">
                            <Button 
                                variant="outline" 
                                type="button" 
                                className="w-full"
                                onClick={() => setStep('email')}
                                disabled={isLoading}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Continue with Email
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                type="button" 
                                className="w-full"
                                onClick={() => handleOAuthSignIn('google')}
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Continue with Google
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                type="button" 
                                className="w-full"
                                onClick={() => handleOAuthSignIn('github')}
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.755-1.333-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Continue with GitHub
                            </Button>
                        </div>
                        
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{' '}
                            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                );
                
            case 'email':
                return (
                    <div className="space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold">Create an account</h1>
                            <p className="text-muted-foreground">Enter your email and password to sign up</p>
                        </div>
                        
                        {error && (
                            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Kwajo Teri"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 6 characters
                                </p>
                            </div>
                            
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create account'
                                )}
                            </Button>
                            
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => setStep('method')}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                        </form>
                    </div>
                );
                
            case 'verification':
                return (
                    <div className="space-y-8 text-center">
                        <div className="space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <Mail className="h-8 w-8 text-green-600" />
                            </div>
                            
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                                <p className="text-muted-foreground">
                                    We've sent a verification link to 
                                    <span className="mx-1 font-medium text-foreground">{email}</span>
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 rounded-lg border bg-card p-6 text-left shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-medium">Didn't receive an email?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Check your spam folder or click below to resend the verification email.
                                    </p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="whitespace-nowrap"
                                    onClick={async () => {
                                        setIsLoading(true);
                                        try {
                                            const result = await resendVerification(email);
                                            toast({
                                                title: result.success ? 'Email sent!' : 'Error',
                                                description: result.message,
                                                variant: result.success ? 'default' : 'destructive',
                                            });
                                        } catch (error) {
                                            toast({
                                                title: 'Error',
                                                description: 'Failed to resend verification email. Please try again.',
                                                variant: 'destructive',
                                            });
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Mail className="mr-2 h-4 w-4" />
                                    )}
                                    Resend Email
                                </Button>
                            </div>
                        </div>
                        
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => navigate('/login')}
                            disabled={isLoading}
                        >
                            Back to login
                        </Button>
                    </div>
                );
                
            case 'complete':
                return (
                    <div className="space-y-6 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Account created successfully!</h1>
                            <p className="text-muted-foreground">
                                Your account has been created. You can now sign in to your account.
                            </p>
                        </div>
                        
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => navigate('/login')}
                        >
                            Go to login
                        </Button>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Button 
                        variant="ghost" 
                        className="px-0 text-muted-foreground hover:bg-transparent hover:text-black -ml-2 transition-colors"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
                
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {step === 'method' ? 'Create an account' : 
                         step === 'email' ? 'Enter your details' :
                         step === 'verification' ? 'Verify your email' : 'Account created'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {step === 'method' ? 'Choose your preferred sign up method' :
                         step === 'email' ? 'Enter your information to create an account' :
                         step === 'verification' ? 'We sent a verification link to your email' :
                         'Your account has been created successfully'}
                    </p>
                </div>
                
                <Card className="w-full">
                    <CardContent className="p-6">
                        {renderStep()}
                    </CardContent>
                </Card>
                
                {step !== 'verification' && step !== 'complete' && (
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium bg-black-800 hover:underline">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;