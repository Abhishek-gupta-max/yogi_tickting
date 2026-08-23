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
          className="fixed inset-0 z-[1030] bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar (280px Desktop / 72px Collapsed / Drawer Mobile) */}
      <AppLayoutSidebar />

      {/* Main Content Viewport */}
      <div
        className={clsx(
          'flex flex-col flex-1 overflow-hidden transition-all duration-200 ease-out',
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]'
        )}
      >
        {/* Top Header (72px) */}
        <AppLayoutHeader />

        {/* Responsive Content Container — Max 1600px */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--surface-bg)]"
        >
          <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
