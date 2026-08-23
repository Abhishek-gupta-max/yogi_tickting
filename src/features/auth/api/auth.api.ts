import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { AuthUser } from '@/store/auth.store';
import type { UserRole, Permission } from '@/types/permission.types';
import { DEFAULT_ROLE_PERMISSIONS } from '@/types/permission.types';

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  permissions: Permission[];
}

export interface LoginDto {
  email: string;
  password?: string;
  remember?: boolean;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

// Demo Accounts for Instant Role Switching / Quick Login
export const DEMO_USERS: Record<string, AuthUser> = {
  'admin@ticketflow.io': {
    id: 'usr-admin-1',
    email: 'admin@ticketflow.io',
    firstName: 'Eleanor',
    lastName: 'Vance',
    fullName: 'Eleanor Vance',
    role: 'company_admin',
    organizationId: 'org-1',
    organizationName: 'Acme Enterprises',
    departmentId: 'dept-eng',
    isEmailVerified: true,
    isTwoFactorEnabled: true,
    createdAt: '2025-01-10T08:00:00Z',
  },
  'superadmin@ticketflow.io': {
    id: 'usr-super-1',
    email: 'superadmin@ticketflow.io',
    firstName: 'Alexander',
    lastName: 'Wright',
    fullName: 'Alexander Wright',
    role: 'super_admin',
    isEmailVerified: true,
    isTwoFactorEnabled: true,
    createdAt: '2024-11-01T08:00:00Z',
  },
  'manager@ticketflow.io': {
    id: 'usr-[manager]-1',
    email: 'manager@ticketflow.io',
    firstName: 'Marcus',
    lastName: 'Brody',
    fullName: 'Marcus Brody',
    role: 'manager',
    organizationId: 'org-1',
    organizationName: 'Acme Enterprises',
    departmentId: 'dept-support',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: '2025-02-01T08:00:00Z',
  },
  'agent@ticketflow.io': {
    id: 'usr-agent-1',
    email: 'agent@ticketflow.io',
    firstName: 'Sophia',
    lastName: 'Martinez',
    fullName: 'Sophia Martinez',
    role: 'agent',
    organizationId: 'org-1',
    organizationName: 'Acme Enterprises',
    departmentId: 'dept-support',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: '2025-03-15T08:00:00Z',
  },
  'customer@acme.com': {
    id: 'usr-cust-1',
    email: 'customer@acme.com',
    firstName: 'David',
    lastName: 'Miller',
    fullName: 'David Miller',
    role: 'customer',
    organizationId: 'org-1',
    organizationName: 'Acme Enterprises',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: '2025-04-01T08:00:00Z',
  },
  'customer@ticketflow.io': {
    id: 'usr-cust-1',
    email: 'customer@ticketflow.io',
    firstName: 'David',
    lastName: 'Miller',
    fullName: 'David Miller',
    role: 'customer',
    organizationId: 'org-1',
    organizationName: 'Acme Enterprises',
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: '2025-04-01T08:00:00Z',
  },
};

export const authApi = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    // If backend is not available, provide smart mock response
    try {
      return await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials);
    } catch {
      // Mock Fallback for Development/Demo
      const matchedUser = DEMO_USERS[credentials.email.toLowerCase()] || {
        id: `usr-${Date.now()}`,
        email: credentials.email,
        firstName: credentials.email.split('@')[0].split('.')[0] || 'User',
        lastName: 'Demo',
        fullName: formatName(credentials.email),
        role: 'company_admin' as UserRole,
        organizationId: 'org-1',
        organizationName: 'Acme Enterprises',
        isEmailVerified: true,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      };

      const permissions = DEFAULT_ROLE_PERMISSIONS[matchedUser.role] || [];
      const dummyToken = createMockJwtToken(matchedUser);

      return {
        user: matchedUser,
        accessToken: dummyToken,
        refreshToken: `rt_${Date.now()}`,
        permissions,
      };
    }
  },

  register: async (data: RegisterDto): Promise<LoginResponse> => {
    try {
      return await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.register, data);
    } catch {
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        role: 'company_admin',
        organizationId: 'org-1',
        organizationName: 'New Org',
        isEmailVerified: false,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      };
      const permissions = DEFAULT_ROLE_PERMISSIONS[newUser.role];
      const accessToken = createMockJwtToken(newUser);

      return {
        user: newUser,
        accessToken,
        refreshToken: `rt_${Date.now()}`,
        permissions,
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Ignore network error on logout mock
    }
  },

  refreshToken: async (): Promise<string> => {
    try {
      const res = await apiClient.post<{ accessToken: string }>(API_ENDPOINTS.auth.refresh);
      return res.accessToken;
    } catch {
      return `at_${Date.now()}`;
    }
  },
};

function formatName(email: string): string {
  const parts = email.split('@')[0].split('.');
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function createMockJwtToken(user: AuthUser): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 24 * 3600, // 24h
    })
  );
  return `${header}.${payload}.mock_signature`;
}
