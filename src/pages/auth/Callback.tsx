import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Callback() {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session
    const checkSession = async () => {
      // The session will be automatically handled by the AuthProvider
      // We just need to wait a moment for it to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (session) {
        toast({
          title: 'Email verified!',
          description: 'Your email has been verified successfully.',
        });
      } else {
        toast({
          title: 'Verification failed',
          description: 'Unable to verify your email. Please try again.',
          variant: 'destructive',
        });
      }
      
      // Redirect to home page
      navigate('/');
    };

    checkSession();
  }, [session, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Verifying your email...</h1>
        <p>Please wait while we verify your email address.</p>
      </div>
    </div>
  );
}
