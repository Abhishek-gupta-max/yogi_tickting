import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      immer((set) => ({
        isCollapsed:  false,
        isMobileOpen: false,

        toggleCollapsed: () =>
          set((state) => { state.isCollapsed = !state.isCollapsed; }),

        setCollapsed: (collapsed) =>
          set((state) => { state.isCollapsed = collapsed; }),

        toggleMobile: () =>
          set((state) => { state.isMobileOpen = !state.isMobileOpen; }),

        closeMobile: () =>
          set((state) => { state.isMobileOpen = false; }),
      })),
      { name: 'tf-sidebar' }
    ),
    { name: 'SidebarStore', enabled: typeof import.meta !== 'undefined' && import.meta.env?.DEV }
  )
);

// Notification Store
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  href?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    immer((set) => ({
      notifications: [],
      unreadCount:   0,

      setNotifications: (notifications) =>
        set((state) => {
          state.notifications = notifications;
          state.unreadCount = notifications.filter((n) => !n.isRead).length;
        }),

      markAsRead: (id) =>
        set((state) => {
          const n = state.notifications.find((n) => n.id === id);
          if (n && !n.isRead) {
            n.isRead = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }),

      markAllAsRead: () =>
        set((state) => {
          state.notifications.forEach((n) => { n.isRead = true; });
          state.unreadCount = 0;
        }),

      addNotification: (notification) =>
        set((state) => {
          state.notifications.unshift(notification);
          if (!notification.isRead) state.unreadCount += 1;
        }),
    })),
    { name: 'NotificationStore', enabled: typeof import.meta !== 'undefined' && import.meta.env?.DEV }
  )
);
