import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useSidebarStore } from '@/store/ui.store';
import { AppLayoutSidebar } from './AppLayoutSidebar';
import { AppLayoutHeader } from './AppLayoutHeader';
import { clsx } from 'clsx';

export const AppLayout: FC = () => {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-bg)]">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[1030] bg-black/50 lg:hidden transition-opacity"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <AppLayoutSidebar />

      {/* Main Content Viewport */}
      <div
        className={clsx(
          'flex flex-col flex-1 overflow-hidden transition-all duration-200 ease-out',
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[256px]'
        )}
      >
        {/* Top Header */}
        <AppLayoutHeader />

        {/* Content Area */}
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--surface-bg)]"
        >
          <div className="w-full max-w-full px-4 md:px-5 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 space-y-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
