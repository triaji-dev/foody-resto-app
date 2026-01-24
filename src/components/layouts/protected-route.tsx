'use client';

import { useAuth } from '@/features/auth/use-auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(ROUTES.AUTH_LOGIN);
      } else if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages (login/register)
        router.push(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, isLoading, router, requireAuth]);

  if (isLoading) {
    // Basic loading state
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
      </div>
    );
  }

  // If validation fails, we don't render children (layout effects handles redirect)
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
