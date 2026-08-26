import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Search, Bell, Sun, Moon, ChevronRight, Globe, LogOut,
  ChevronDown, Check, User, X, Plus,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useSidebarStore, useNotificationStore } from '@/store/ui.store';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore, selectUser } from '@/store/auth.store';
import { formatUtils } from '@/shared/utils';
import toast from 'react-hot-toast';

/* ────────────────────────────────────────────────────────────
   BREADCRUMB HOOK
   ──────────────────────────────────────────────────────────── */
function useBreadcrumbs(): { label: string; href?: string }[] {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  return parts.map((part, i) => ({
    label: formatUtils.toTitleCase(part.replace(/-/g, ' ')),
    href: i < parts.length - 1 ? `/${parts.slice(0, i + 1).join('/')}` : undefined,
  }));
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

/* ────────────────────────────────────────────────────────────
   HEADER COMPONENT
   ──────────────────────────────────────────────────────────── */
export const AppLayoutHeader: FC = () => {
  const { toggleMobile } = useSidebarStore();
  const { resolvedTheme, setTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const toggleTheme = useCallback(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'), [resolvedTheme, setTheme]);

  const handleLogout = useCallback(() => {
    useAuthStore.getState().logout();
    navigate('/login');
    toast.success('Signed out of TicketFlow');
  }, [navigate]);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = () => { setShowLangMenu(false); setShowUserMenu(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toast.success('Command Palette (⌘K) — Coming soon');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <header
      className={clsx(
        'flex-shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6',
        'h-[60px] bg-[var(--surface-card)]',
        'border-b border-[var(--surface-border)]',
        'relative z-30'
      )}
    >
      {/* ── Left: Hamburger + Breadcrumbs ────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleMobile}
          className="lg:hidden btn-enterprise btn-enterprise-secondary btn-icon-sm flex-shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>

        <nav className="hidden sm:flex items-center gap-1 min-w-0" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />}
              {crumb.href ? (
                <button
                  onClick={() => navigate(crumb.href!)}
                  className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors truncate"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Right: Search, Quick Create, Notifications, Lang, Theme, User ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Trigger */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden btn-enterprise btn-enterprise-secondary btn-icon-sm"
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Desktop Command Search Bar */}
        <button
          onClick={() => toast.success('Command Palette triggered (⌘K)')}
          className="hidden md:flex items-center justify-between w-[280px] lg:w-[360px] h-[36px] px-3 text-[13px] text-[var(--text-muted)] bg-[var(--surface-bg)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-lg transition-colors group"
          aria-label="Open search"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
            <span className="truncate">Search tickets, users, articles…</span>
          </div>
          <kbd className="flex items-center px-1.5 py-0.5 text-[10px] bg-[var(--surface-card)] border border-[var(--surface-border)] rounded text-[var(--text-muted)] font-mono flex-shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Quick Create */}
        <button
          onClick={() => navigate('/tickets/new')}
          className="btn-enterprise btn-enterprise-primary btn-icon-sm hidden sm:flex"
          aria-label="Quick create"
          title="Create ticket"
        >
          <Plus className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative btn-enterprise btn-enterprise-secondary btn-icon-sm"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] text-[9px] font-bold flex items-center justify-center bg-[var(--color-danger)] text-white rounded-full ring-2 ring-[var(--surface-card)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Language */}
        <div className="relative hidden sm:block" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }}
            className="btn-enterprise btn-enterprise-secondary btn-icon-sm"
            aria-label="Language"
            title={`Language: ${selectedLang.label}`}
          >
            <Globe className="w-[18px] h-[18px]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 shadow-lg z-50 animate-scale-in">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang);
                    setShowLangMenu(false);
                    toast.success(`Language: ${lang.label}`);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center justify-between',
                    selectedLang.code === lang.code
                      ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  )}
                >
                  {lang.label}
                  {selectedLang.code === lang.code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-enterprise btn-enterprise-secondary btn-icon-sm"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-[18px] h-[18px] text-amber-400" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* User Menu */}
        {user && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); }}
              className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                {formatUtils.initials(user.fullName)}
              </div>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)] hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 shadow-lg z-50 animate-scale-in">
                <div className="px-3 py-2 border-b border-[var(--surface-border)] mb-1">
                  <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{user.fullName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</div>
                </div>

                <button
                  onClick={() => { setShowUserMenu(false); navigate('/settings/general'); }}
                  className="w-full text-left px-3 py-2 rounded-md text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-[var(--text-muted)]" /> Profile & Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-[13px] font-medium text-[var(--color-danger)] hover:bg-red-500/10 transition-colors flex items-center gap-2 mt-1 border-t border-[var(--surface-border)] pt-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile Search Overlay ───────────────────────── */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-0 h-[60px] bg-[var(--surface-card)] border-b border-[var(--surface-border)] px-4 flex items-center gap-2 z-50 md:hidden animate-fade-in">
          <div className="flex-1 flex items-center gap-2 bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-lg px-3 h-[36px]">
            <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search tickets, articles…"
              className="w-full text-[13px] bg-transparent text-[var(--text-primary)] outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}
    </header>
  );
};
