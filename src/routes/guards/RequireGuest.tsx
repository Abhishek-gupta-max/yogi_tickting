import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsLoading } from '@/store/auth.store';
import { PageLoader } from '@/shared/components/feedback/PageLoader';

interface RequireGuestProps {
  children: ReactNode;
  redirectTo?: string;
}

export const RequireGuest: FC<RequireGuestProps> = ({ children, redirectTo = '/' }) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading       = useAuthStore(selectIsLoading);

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
};
