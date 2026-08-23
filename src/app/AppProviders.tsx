import type { FC, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/query-client';

// Initialize interceptors (must happen before any API calls)
import '@/services/api/interceptors/auth.interceptor';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background:  'var(--surface-card)',
            color:       'var(--text-primary)',
            border:      '1px solid var(--surface-border)',
            boxShadow:   'var(--shadow-lg)',
            borderRadius: 'var(--radius-xl)',
            fontSize:    '0.875rem',
            padding:     '12px 16px',
            maxWidth:    '400px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            duration: 6000,
          },
        }}
      />

      {/* TanStack Query Devtools — dev only */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
};
