import type { FC } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Ticket, Users, Building2, FolderTree, UsersRound,
  ShieldCheck, Timer, Workflow, BarChart3, TrendingUp, BookOpen,
  Settings, ChevronLeft, ChevronRight, LogOut, UserCircle,
  Layers, GitBranch, Command, ChevronDown, Check, Sparkles, Plus,
} from 'lucide-react';
import { useSidebarStore } from '@/store/ui.store';
import { useAuthStore, selectUser } from '@/store/auth.store';
import { formatUtils } from '@/shared/utils';
import type { NavGroup } from '@/types/global.types';
import type { UserRole } from '@/types/permission.types';
import toast from 'react-hot-toast';

const WORKSPACES = [
  { id: 'org-1', name: 'Acme Enterprise', plan: 'Enterprise Plan' },
  { id: 'org-2', name: 'Globex Cloud Inc', plan: 'Pro SaaS' },
];

const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  super_admin: [
    {
      label: 'Platform',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'organizations', label: 'Organizations', href: '/organizations', icon: Building2 },
        { id: 'users', label: 'All Users', href: '/settings/users', icon: Users },
        { id: 'system', label: 'System Logs', href: '/system/logs', icon: Layers },
      ],
    },
    {
      label: 'Reports & Insights',
      items: [
        { id: 'reports', label: 'Reports', href: '/reports', icon: BarChart3 },
        { id: 'analytics', label: 'Analytics', href: '/analytics', icon: TrendingUp },
      ],
    },
  ],
  company_admin: [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { id: 'tickets', label: 'All Tickets', href: '/tickets', icon: Ticket, badge: '142' },
        { id: 'customers', label: 'Customers', href: '/customers', icon: UserCircle },
      ],
    },
    {
      label: 'Management',
      items: [
        { id: 'users', label: 'Users', href: '/settings/users', icon: Users },
        { id: 'departments', label: 'Departments', href: '/settings/departments', icon: FolderTree },
        { id: 'teams', label: 'Teams', href: '/settings/teams', icon: UsersRound },
        { id: 'branches', label: 'Branches', href: '/settings/branches', icon: GitBranch },
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
      label: 'Team',
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

export const AppLayoutSidebar: FC = () => {
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebarStore();
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();

  const [activeWorkspace, setActiveWorkspace] = useState(WORKSPACES[0]);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const navGroups = user ? (NAV_CONFIG[user.role] ?? []) : [];

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/login');
    toast.success('Signed out successfully');
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full flex flex-col z-[1040] transition-all duration-200 ease-out',
        'bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shadow-2xl',
        isCollapsed ? 'w-[72px]' : 'w-[280px]',
        'lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Workspace Switcher Header (72px height) */}
      <div className={clsx(
        'flex items-center h-[72px] flex-shrink-0 px-4 border-b border-[var(--sidebar-border)] relative',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed ? (
          <div className="relative w-full">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md flex-shrink-0 ring-1 ring-white/20">
                  <Command className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {activeWorkspace.name}
                  </div>
                  <div className="text-[10px] text-[var(--sidebar-text)] truncate">{activeWorkspace.plan}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--sidebar-text)]" />
            </button>

            {/* Workspace Dropdown */}
            {showWorkspaceMenu && (
              <div className="absolute left-0 top-full mt-2 w-full surface-card p-1.5 space-y-1 shadow-2xl z-50 animate-scale-in bg-slate-900 border-white/10 text-white">
                {WORKSPACES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws);
                      setShowWorkspaceMenu(false);
                      toast.success(`Switched workspace to ${ws.name}`);
                    }}
                    className={clsx(
                      'w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors',
                      activeWorkspace.id === ws.id ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'hover:bg-white/5 text-slate-300'
                    )}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{ws.name}</div>
                      <div className="text-[10px] text-slate-400">{ws.plan}</div>
                    </div>
                    {activeWorkspace.id === ws.id && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md ring-1 ring-white/20">
            <Command className="w-5 h-5" />
          </div>
        )}

        {/* Collapse toggle — desktop */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-[var(--sidebar-text)] hover:text-white hover:bg-white/10 transition-colors ml-1"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex mx-auto mt-3 w-8 h-8 items-center justify-center rounded-lg text-[var(--sidebar-text)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation Groups with 32px (space-y-8) Section Spacing */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--sidebar-text)] opacity-60">
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
                      'flex items-center justify-between px-3 h-[44px] rounded-xl text-btn-std transition-all duration-200 group relative',
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400 font-semibold border-l-2 border-indigo-500'
                        : 'text-[var(--sidebar-text)] hover:text-white hover:bg-white/5 border-l-2 border-transparent',
                      isCollapsed && 'justify-center px-0'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        {Icon && (
                          <Icon className={clsx('w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-indigo-400' : 'text-[var(--sidebar-text)]')} />
                        )}
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="text-badge-std px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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

      {/* Bottom Profile Section */}
      <div className="flex-shrink-0 border-t border-[var(--sidebar-border)] p-3 space-y-1">
        <NavLink
          to="/settings/general"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 h-[44px] rounded-xl text-btn-std transition-colors',
              isActive ? 'bg-indigo-500/15 text-indigo-400 font-semibold' : 'text-[var(--sidebar-text)] hover:text-white hover:bg-white/5',
              isCollapsed && 'justify-center px-0'
            )
          }
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Settings & Billing</span>}
        </NavLink>

        {user && (
          <div className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5', isCollapsed && 'justify-center px-1')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md">
              {formatUtils.initials(user.fullName)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
                <div className="text-[10px] text-[var(--sidebar-text)] truncate capitalize">{user.role.replace('_', ' ')}</div>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="text-[var(--sidebar-text)] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/10"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
