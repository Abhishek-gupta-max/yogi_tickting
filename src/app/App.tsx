import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './AppProviders';
import { router } from '@/routes';
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
