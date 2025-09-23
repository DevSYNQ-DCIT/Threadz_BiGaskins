import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  requiredRole = 'user',
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If no user is logged in, redirect to login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // If admin access is required but user is not an admin, redirect to home
      if (requiredRole === 'admin' && !isAdmin()) {
        router.push('/');
      }
    }
  }, [user, isLoading, isAdmin, requiredRole, router, redirectTo]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is authenticated and has the required role, render children
  if (user && (requiredRole !== 'admin' || isAdmin())) {
    return <>{children}</>;
  }

  // Default return (will be replaced by router redirect)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}
