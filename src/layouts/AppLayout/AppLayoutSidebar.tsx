import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Ticket, Users, Building2, FolderTree, UsersRound,
  ShieldCheck, Timer, Workflow, BarChart3, TrendingUp, BookOpen,
  Settings, ChevronLeft, ChevronRight, LogOut, UserCircle,
  GitBranch, Command, ChevronDown, Check, FileText,
} from 'lucide-react';
import { useSidebarStore } from '@/store/ui.store';
import { useAuthStore, selectUser } from '@/store/auth.store';
import { formatUtils } from '@/shared/utils';
import type { NavGroup } from '@/types/global.types';
import type { UserRole } from '@/types/permission.types';
import toast from 'react-hot-toast';

/* ────────────────────────────────────────────────────────────
   WORKSPACE DATA
   ──────────────────────────────────────────────────────────── */
const WORKSPACES = [
  { id: 'org-1', name: 'Acme Enterprise', plan: 'Enterprise' },
  { id: 'org-2', name: 'Globex Cloud Inc', plan: 'Pro' },
];

/* ────────────────────────────────────────────────────────────
   NAV CONFIG — Per role, structured per spec:
   OVERVIEW · MANAGEMENT · INSIGHTS · CONTENT · SYSTEM
   ──────────────────────────────────────────────────────────── */
const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  super_admin: [
    {
      label: 'Platform',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'organizations', label: 'Organizations', href: '/organizations', icon: Building2 },
        { id: 'users', label: 'All Users', href: '/settings/users', icon: Users },
      ],
    },
    {
      label: 'Insights',
      items: [
        { id: 'reports', label: 'Reports', href: '/reports', icon: BarChart3 },
        { id: 'analytics', label: 'Analytics', href: '/analytics', icon: TrendingUp },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'system', label: 'Audit Logs', href: '/system/logs', icon: FileText },
        { id: 'settings', label: 'Settings', href: '/settings/general', icon: Settings },
      ],
    },
  ],
  company_admin: [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'tickets', label: 'All Tickets', href: '/tickets', icon: Ticket, badge: '142' },
      ],
    },
    {
      label: 'Management',
      items: [
        { id: 'customers', label: 'Customers', href: '/customers', icon: UserCircle },
        { id: 'users', label: 'Users', href: '/settings/users', icon: Users },
        { id: 'departments', label: 'Departments', href: '/settings/departments', icon: FolderTree },
        { id: 'teams', label: 'Teams', href: '/settings/teams', icon: UsersRound },
        { id: 'branches', label: 'Branches', href: '/settings/branches', icon: GitBranch },
      ],
    },
    {
      label: 'Configuration',
      items: [
        { id: 'roles', label: 'Roles', href: '/settings/roles', icon: ShieldCheck },
        { id: 'sla', label: 'SLA Policies', href: '/settings/sla', icon: Timer },
        { id: 'workflows', label: 'Workflows', href: '/settings/workflows', icon: Workflow },
      ],
    },
    {
      label: 'Insights',
      items: [
        { id: 'reports', label: 'Reports', href: '/reports', icon: BarChart3 },
        { id: 'analytics', label: 'Analytics', href: '/analytics', icon: TrendingUp },
      ],
    },
    {
      label: 'Content',
      items: [
        { id: 'kb', label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'settings', label: 'Settings', href: '/settings/general', icon: Settings },
        { id: 'logs', label: 'Audit Logs', href: '/system/logs', icon: FileText },
      ],
    },
  ],
  manager: [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'tickets', label: 'Tickets', href: '/tickets', icon: Ticket, badge: '142' },
        { id: 'customers', label: 'Customers', href: '/customers', icon: UserCircle },
      ],
    },
    {
      label: 'Management',
      items: [
        { id: 'users', label: 'Users', href: '/settings/users', icon: Users },
        { id: 'departments', label: 'Departments', href: '/settings/departments', icon: FolderTree },
        { id: 'teams', label: 'Teams', href: '/settings/teams', icon: UsersRound },
      ],
    },
    {
      label: 'Insights',
      items: [
        { id: 'reports', label: 'Reports', href: '/reports', icon: BarChart3 },
        { id: 'analytics', label: 'Analytics', href: '/analytics', icon: TrendingUp },
      ],
    },
  ],
  agent: [
    {
      label: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'tickets', label: 'My Tickets', href: '/tickets', icon: Ticket, badge: '14' },
        { id: 'customers', label: 'Customers', href: '/customers', icon: UserCircle },
        { id: 'kb', label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
      ],
    },
  ],
  customer: [
    {
      label: 'Portal',
      items: [
        { id: 'portal', label: 'My Tickets', href: '/portal', icon: Ticket, badge: '3' },
        { id: 'kb', label: 'Help Center', href: '/knowledge-base', icon: BookOpen },
      ],
    },
  ],
};

/* ────────────────────────────────────────────────────────────
   SIDEBAR COMPONENT
   ──────────────────────────────────────────────────────────── */
export const AppLayoutSidebar: FC = () => {
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebarStore();
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();

  const [activeWorkspace, setActiveWorkspace] = useState(WORKSPACES[0]);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const navGroups = user ? (NAV_CONFIG[user.role] ?? []) : [];

  const handleLogout = useCallback(() => {
    useAuthStore.getState().logout();
    navigate('/login');
    toast.success('Signed out successfully');
  }, [navigate]);

  return (
    <aside
      aria-label="Main navigation"
      className={clsx(
        'fixed left-0 top-0 h-full flex flex-col z-[1040] transition-all duration-200 ease-out',
        'bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]',
        isCollapsed ? 'w-[72px]' : 'w-[256px]',
        'lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* ── Workspace Switcher ─────────────────────────────── */}
      <div className={clsx(
        'flex items-center h-[60px] flex-shrink-0 px-3 border-b border-[var(--sidebar-border)]',
        isCollapsed ? 'justify-center' : 'gap-2'
      )}>
        {!isCollapsed ? (
          <div className="relative w-full flex items-center">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex-1 flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white flex-shrink-0">
                <Command className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-white truncate">
                  {activeWorkspace.name}
                </div>
                <div className="text-[11px] text-[var(--sidebar-text)] truncate">{activeWorkspace.plan}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--sidebar-text)] flex-shrink-0" />
            </button>

            {/* Collapse toggle */}
            <button
              onClick={toggleCollapsed}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-[var(--sidebar-text)] hover:text-white hover:bg-white/8 transition-colors flex-shrink-0 ml-1"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Workspace Dropdown */}
            {showWorkspaceMenu && (
              <div className="absolute left-0 top-full mt-1 w-full bg-[#0F172A] border border-[var(--sidebar-border)] rounded-lg p-1 shadow-xl z-50 animate-scale-in">
                {WORKSPACES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws);
                      setShowWorkspaceMenu(false);
                      toast.success(`Switched to ${ws.name}`);
                    }}
                    className={clsx(
                      'w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors',
                      activeWorkspace.id === ws.id
                        ? 'bg-[var(--color-primary-muted)] text-[var(--sidebar-active-text)] font-semibold'
                        : 'text-[var(--sidebar-text)] hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <div className="text-left">
                      <div className="font-medium">{ws.name}</div>
                      <div className="text-[10px] opacity-60">{ws.plan}</div>
                    </div>
                    {activeWorkspace.id === ws.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
              <Command className="w-4 h-4" />
            </div>
          </>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex mx-auto mt-2 w-8 h-8 items-center justify-center rounded-md text-[var(--sidebar-text)] hover:text-white hover:bg-white/8 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6 scrollbar-none" aria-label="Primary">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--sidebar-text)] opacity-50">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon as FC<{ className?: string }>;
              return (
                <NavLink
                  key={item.id}
                  to={item.href ?? '#'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2.5 h-[36px] rounded-md text-[13px] font-medium transition-colors relative',
                      isActive
                        ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]'
                        : 'text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)] hover:bg-[var(--sidebar-hover)]',
                      isCollapsed ? 'justify-center px-0' : 'px-3'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator pill */}
                      {isActive && (
                        <span className="absolute left-0 top-[8px] bottom-[8px] w-[3px] rounded-r-full bg-[var(--color-primary)]" />
                      )}
                      <span className="flex items-center gap-2.5 min-w-0 flex-1">
                        {Icon && <Icon className={clsx('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-[var(--sidebar-active-text)]' : '')} />}
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </span>

                      {!isCollapsed && item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--color-primary-muted)] text-[var(--sidebar-active-text)] min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom Section ──────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-[var(--sidebar-border)] p-2 space-y-1">
        {user && (
          <div className={clsx(
            'flex items-center gap-2.5 px-2 py-2 rounded-md',
            isCollapsed && 'justify-center px-0'
          )}>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {formatUtils.initials(user.fullName)}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white truncate">{user.fullName}</div>
                  <div className="text-[11px] text-[var(--sidebar-text)] truncate capitalize">{user.role.replace('_', ' ')}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[var(--sidebar-text)] hover:text-red-400 transition-colors p-1 rounded-md hover:bg-white/5"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
