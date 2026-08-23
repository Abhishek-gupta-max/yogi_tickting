import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsLoading } from '@/store/auth.store';
import { PageLoader } from '@/shared/components/feedback/PageLoader';

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading       = useAuthStore(selectIsLoading);
  const location        = useLocation();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
