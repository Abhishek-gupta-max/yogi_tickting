import { useCallback } from 'react';
import { useAuthStore, selectPermissions, selectUser } from '@/store/auth.store';
import type { Permission } from '@/types/permission.types';

export function usePermission() {
  const permissions = useAuthStore(selectPermissions);
  const user = useAuthStore(selectUser);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (permissions.includes('*')) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => perms.every(hasPermission),
    [hasPermission]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => perms.some(hasPermission),
    [hasPermission]
  );

  const hasRole = useCallback(
    (role: string): boolean => user?.role === role,
    [user]
  );

  return { hasPermission, hasAllPermissions, hasAnyPermission, hasRole };
}
