import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserRole, Permission } from '@/types/permission.types';

// ============================================================
// USER TYPES (local to auth domain)
// ============================================================

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  departmentId?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
}

// ============================================================
// AUTH STORE STATE
// ============================================================

interface AuthState {
  // STATE
  user: AuthUser | null;
  accessToken: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiresAt: number | null;

  // ACTIONS
  setUser: (user: AuthUser) => void;
  setTokens: (accessToken: string) => void;
  setPermissions: (permissions: Permission[]) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const initialState = {
  user: null,
  accessToken: null,
  permissions: [] as Permission[],
  isAuthenticated: false,
  isLoading: false,
  sessionExpiresAt: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.isLoading = false;
          }),

        setTokens: (accessToken) =>
          set((state) => {
            state.accessToken = accessToken;
            try {
              const payload = JSON.parse(atob(accessToken.split('.')[1]));
              state.sessionExpiresAt = payload.exp ? payload.exp * 1000 : null;
            } catch {
              state.sessionExpiresAt = null;
            }
          }),

        setPermissions: (permissions) =>
          set((state) => {
            state.permissions = permissions;
          }),

        updateUser: (partial) =>
          set((state) => {
            if (state.user) {
              Object.assign(state.user, partial);
            }
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.accessToken = null;
            state.permissions = [];
            state.isAuthenticated = false;
            state.sessionExpiresAt = null;
            state.isLoading = false;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),
      })),
      {
        name: 'ticketflow-auth',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          permissions: state.permissions,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore', enabled: typeof import.meta !== 'undefined' && import.meta.env?.DEV }
  )
);

// ============================================================
// SELECTORS — Memoized to prevent unnecessary re-renders
// ============================================================
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectPermissions = (state: AuthState) => state.permissions;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectAccessToken = (state: AuthState) => state.accessToken;
export const selectSessionExpiresAt = (state: AuthState) => state.sessionExpiresAt;
