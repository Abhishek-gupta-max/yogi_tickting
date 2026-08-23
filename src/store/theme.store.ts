import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(resolved: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', resolved);
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      immer((set) => ({
        theme:         'light' as Theme,
        resolvedTheme: 'light' as 'light' | 'dark',

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
            const resolved = resolveTheme(theme);
            state.resolvedTheme = resolved;
            applyTheme(resolved);
          }),
      })),
      {
        name: 'tf-theme',
        onRehydrateStorage: () => (state) => {
          if (state) {
            const resolved = resolveTheme(state.theme);
            applyTheme(resolved);
            state.resolvedTheme = resolved;
          }
        },
      }
    ),
    { name: 'ThemeStore', enabled: typeof import.meta !== 'undefined' && import.meta.env?.DEV }
  )
);
