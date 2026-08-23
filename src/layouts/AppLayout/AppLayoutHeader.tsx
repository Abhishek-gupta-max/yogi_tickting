import type { FC } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Search, Bell, Sun, Moon, ChevronRight, Globe, LogOut, Shield,
  ChevronDown, MessageSquare, LayoutGrid, Sparkles, Check, Command, User, X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useSidebarStore, useNotificationStore } from '@/store/ui.store';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore, selectUser } from '@/store/auth.store';
import { formatUtils } from '@/shared/utils';
import toast from 'react-hot-toast';

function useBreadcrumbs(): { label: string; href?: string }[] {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  return parts.map((part, i) => ({
    label: formatUtils.toTitleCase(part.replace(/-/g, ' ')),
    href: i < parts.length - 1 ? `/${parts.slice(0, i + 1).join('/')}` : undefined,
  }));
}

const LANGUAGES = [
  { code: 'en', label: 'English 🇺🇸' },
  { code: 'es', label: 'Español 🇪🇸' },
  { code: 'fr', label: 'Français 🇫🇷' },
  { code: 'de', label: 'Deutsch 🇩🇪' },
];

const APPS_MENU = [
  { name: 'Support Helpdesk', desc: 'Tickets & SLA Queue', href: '/tickets' },
  { name: 'Customer Portal', desc: 'End-user ticketing', href: '/portal' },
  { name: 'Knowledge Base', desc: 'Docs & FAQs', href: '/knowledge-base' },
  { name: 'Reports & Analytics', desc: 'CSAT & Performance', href: '/reports' },
];

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
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/login');
    toast.success('Signed out of TicketFlow');
  };

  return (
    <header
      className={clsx(
        'flex-shrink-0 flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8',
        'h-[72px] surface-glass sticky top-0 backdrop-blur-xl',
        'border-b border-[var(--surface-border)]',
        'transition-all duration-200 relative z-30 shadow-xs'
      )}
    >
      {/* Left section: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={toggleMobile}
          className="lg:hidden h-[42px] w-[42px] flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)] flex-shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-2 min-w-0" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />}
              <span
                className={clsx(
                  'text-xs font-medium truncate',
                  i === breadcrumbs.length - 1
                    ? 'font-bold text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer'
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right section: Command Search, Apps, Lang, Theme, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon Trigger */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden h-[42px] w-[42px] flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)]"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Command Palette Search Bar — 400px width on desktop */}
        <button
          onClick={() => toast.success('Command Palette triggered (⌘K)')}
          className="hidden md:flex items-center justify-between w-[320px] lg:w-[400px] h-[42px] px-3.5 text-xs text-[var(--text-muted)] bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-xl transition-all shadow-xs group"
          aria-label="Open search"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-5 h-5 text-[var(--text-muted)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0" />
            <span className="text-body-sm font-normal truncate">Search tickets, KB articles, commands…</span>
          </div>
          <kbd className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] bg-[var(--surface-muted)] border border-[var(--surface-border)] rounded-md font-mono text-[var(--text-secondary)] font-bold flex-shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Apps Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowAppsMenu(!showAppsMenu)}
            className="h-[42px] w-[42px] flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)]"
            aria-label="Apps Menu"
            title="SaaS Suite Apps"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {showAppsMenu && (
            <div className="absolute right-0 mt-2 w-64 surface-card p-2 space-y-1 shadow-2xl z-50 animate-scale-in">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--surface-border)] mb-1">
                TicketFlow Suite Apps
              </p>
              {APPS_MENU.map((app) => (
                <button
                  key={app.name}
                  onClick={() => {
                    setShowAppsMenu(false);
                    navigate(app.href);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">
                      {app.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">{app.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative h-[42px] w-[42px] flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)]"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold flex items-center justify-center bg-red-500 text-white rounded-full ring-2 ring-[var(--surface-card)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Language Selector */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="h-[42px] px-3.5 flex items-center gap-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)]"
          >
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{selectedLang.code.toUpperCase()}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 surface-card p-1.5 space-y-1 shadow-xl z-50 animate-scale-in">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang);
                    setShowLangMenu(false);
                    toast.success(`Language set to ${lang.label}`);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between',
                    selectedLang.code === lang.code ? 'bg-indigo-500/10 text-indigo-600 font-bold' : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  )}
                >
                  {lang.label}
                  {selectedLang.code === lang.code && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="h-[42px] w-[42px] flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)]"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* User Dropdown Avatar (40px) */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-[var(--surface-hover)] transition-all border border-[var(--surface-border)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs flex-shrink-0">
                {formatUtils.initials(user.fullName)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block mr-1" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 surface-card p-2 space-y-1 shadow-2xl z-50 animate-scale-in">
                <div className="px-3 py-2.5 border-b border-[var(--surface-border)] mb-1">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user.fullName}</div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings/general');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-indigo-600" /> Profile & Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-[var(--surface-border)] mt-1 pt-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-0 h-[72px] bg-[var(--surface-card)] border-b border-[var(--surface-border)] px-4 flex items-center justify-between gap-2 z-50 md:hidden animate-fade-in">
          <div className="flex-1 flex items-center gap-2 bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search tickets, KB articles..."
              className="w-full text-xs bg-transparent text-[var(--text-primary)] outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};
