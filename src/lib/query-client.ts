import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        30_000,         // 30 seconds
      gcTime:           5 * 60_000,     // 5 minutes
      retry:            2,
      retryDelay:       (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: true,
      refetchOnReconnect:   true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
