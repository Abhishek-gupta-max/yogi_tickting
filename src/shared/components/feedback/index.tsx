import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export * from './PageLoader';
export * from './ErrorBoundary';

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
}) => {
  const sizes = {
    sm: { wrapper: 'py-8', iconBox: 'w-10 h-10', iconInner: 'w-5 h-5', title: 'text-sm', desc: 'text-xs' },
    md: { wrapper: 'py-16', iconBox: 'w-14 h-14', iconInner: 'w-7 h-7', title: 'text-base', desc: 'text-sm' },
    lg: { wrapper: 'py-24', iconBox: 'w-20 h-20', iconInner: 'w-10 h-10', title: 'text-lg', desc: 'text-base' },
  }[size];

  return (
    <div className={clsx('flex flex-col items-center justify-center text-center', sizes.wrapper, className)}>
      {icon && (
        <div className={clsx('rounded-2xl bg-[var(--surface-muted)] flex items-center justify-center mb-4 text-[var(--text-muted)]', sizes.iconBox)}>
          <span className={sizes.iconInner}>{icon}</span>
        </div>
      )}
      <h3 className={clsx('font-semibold text-[var(--text-primary)] mb-1', sizes.title)}>{title}</h3>
      {description && (
        <p className={clsx('text-[var(--text-muted)] max-w-sm mb-5', sizes.desc)}>{description}</p>
      )}
      {action}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
      <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
    <p className="text-sm text-[var(--text-muted)] max-w-sm mb-5">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
      >
        Try again
      </button>
    )}
  </div>
);

export const LoadingSpinner: FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return (
    <svg
      className={clsx('animate-spin text-indigo-500', s, className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

export const SuspenseFallback: FC = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <LoadingSpinner size="lg" />
  </div>
);

export const SkeletonLine: FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('skeleton h-4 rounded', className)} />
);

export const SkeletonCard: FC = () => (
  <div className="surface-card p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="skeleton w-10 h-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-32" />
        <SkeletonLine className="w-20" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonLine />
      <SkeletonLine className="w-4/5" />
      <SkeletonLine className="w-3/5" />
    </div>
  </div>
);
