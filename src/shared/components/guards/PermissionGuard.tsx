import type { FC, ReactNode } from 'react';
import { usePermission } from '@/shared/hooks/usePermission';
import type { Permission } from '@/types/permission.types';

interface PermissionGuardProps {
  permission: Permission | Permission[];
  mode?: 'all' | 'any';
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard: FC<PermissionGuardProps> = ({
  permission,
  mode = 'all',
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermission();
  const perms = Array.isArray(permission) ? permission : [permission];
  const allowed = mode === 'all' ? hasAllPermissions(perms) : hasAnyPermission(perms);
  return allowed ? <>{children}</> : <>{fallback}</>;
};
