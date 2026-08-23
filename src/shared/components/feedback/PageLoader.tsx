import type { FC } from 'react';

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: FC<PageLoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--surface-bg)] z-50">
      {/* Animated logo mark */}
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        {/* Spinner ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/20 animate-ping" />
      </div>

      {/* Dot loader */}
      <div className="flex items-center gap-1.5 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500"
            style={{ animation: `pulseSoft 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      {message && (
        <p className="text-sm text-[var(--text-muted)] animate-pulse">{message}</p>
      )}
    </div>
  );
};
