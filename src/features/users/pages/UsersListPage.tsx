import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users, UserPlus, Search, Shield, Mail, CheckCircle, XCircle,
  MoreVertical, Edit, Key, TicketIcon, X, Loader2, AlertCircle,
  Building2, Ticket, ChevronDown, Check,
} from 'lucide-react';
import { formatUtils } from '@/shared/utils';
import type { UserRole } from '@/types/permission.types';
import { ROLE_LABEL_MAP } from '@/types/permission.types';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  team: string;
  status: 'active' | 'invited' | 'disabled';
  lastActive: string;
  ticketCount: number;
}

const MOCK_USERS: UserItem[] = [
  { id: 'usr-1', fullName: 'Eleanor Vance',    email: 'admin@ticketflow.io',    role: 'company_admin', department: 'Executive',    team: 'Leadership',    status: 'active',  lastActive: '2m ago',  ticketCount: 0   },
  { id: 'usr-2', fullName: 'Sophia Martinez',  email: 'agent@ticketflow.io',    role: 'agent',         department: 'Support',     team: 'Tier 1 Support', status: 'active', lastActive: '5m ago',  ticketCount: 42  },
  { id: 'usr-3', fullName: 'Marcus Brody',     email: 'manager@ticketflow.io',  role: 'manager',       department: 'IT Helpdesk', team: 'IT Core',        status: 'active', lastActive: '1h ago',  ticketCount: 38  },
  { id: 'usr-4', fullName: 'Alexander Wright', email: 'superadmin@ticketflow.io',role: 'super_admin',   department: 'Platform',    team: 'Engineering',   status: 'active',  lastActive: '10m ago', ticketCount: 0   },
  { id: 'usr-5', fullName: 'David Miller',     email: 'customer@acme.com',      role: 'customer',      department: 'External',    team: '—',             status: 'active',  lastActive: '3h ago',  ticketCount: 5   },
  { id: 'usr-6', fullName: 'Clara Oswald',     email: 'clara@ticketflow.io',    role: 'agent',         department: 'Tier 2',      team: 'Escalation',    status: 'invited', lastActive: 'Never',   ticketCount: 0   },
  { id: 'usr-7', fullName: 'James Kirk',       email: 'jkirk@ticketflow.io',    role: 'agent',         department: 'DevOps',      team: 'Cloud Ops',     status: 'disabled',lastActive: '2w ago',  ticketCount: 12  },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin:   'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  company_admin: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]',
  manager:       'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  agent:         'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  customer:      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  invited:  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  disabled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const STATUS_ICON: Record<string, FC<{ className?: string }>> = {
  active: CheckCircle,
  invited: Mail,
  disabled: XCircle,
};

const KPI_CARDS = [
  { label: 'Total Users',  value: '7',  icon: Users,       color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-muted)]' },
  { label: 'Active',       value: '5',  icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Invited',      value: '1',  icon: Mail,        color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-500/10' },
  { label: 'Disabled',     value: '1',  icon: XCircle,     color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-500/10' },
];

/* ────────────────────────────────────────────────────────────
   INVITE MEMBER MODAL
   ──────────────────────────────────────────────────────────── */
const InviteModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('agent');
  const [dept, setDept] = useState('IT Helpdesk');
  const [sending, setSending] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email address'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    toast.success(`Invitation sent to ${email}`);
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
      >
        <div className="w-full max-w-md bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-6 space-y-5 shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
            <h2 className="text-section-head text-[var(--text-primary)] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[var(--color-primary)]" /> Invite Team Member
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="form-field">
              <label htmlFor="invite-email" className="form-label form-label-required">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="field-input pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-field">
                <label htmlFor="invite-role" className="form-label">Role</label>
                <select
                  id="invite-role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="field-input cursor-pointer"
                >
                  <option value="agent">Support Agent</option>
                  <option value="manager">Manager</option>
                  <option value="company_admin">Company Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="invite-dept" className="form-label">Department</label>
                <select
                  id="invite-dept"
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  className="field-input cursor-pointer"
                >
                  {['IT Helpdesk', 'Engineering', 'DevOps', 'Billing', 'HR', 'Customer Success'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--color-primary-muted)] border border-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-xs text-[var(--color-primary)] leading-relaxed flex items-start gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>An invitation with a secure setup link will be sent. Setup links expire in 48 hours.</span>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-enterprise btn-enterprise-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || !email}
                className="flex-1 btn-enterprise btn-enterprise-primary disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" /> Send Invite
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   USERS LIST PAGE
   ──────────────────────────────────────────────────────────── */
export const UsersListPage: FC = () => {
  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [usersList,    setUsersList]    = useState<UserItem[]>(MOCK_USERS);
  const [showInvite,   setShowInvite]   = useState(false);
  const [menuOpen,     setMenuOpen]     = useState<string | null>(null);

  const actionRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = usersList.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleAction = (action: string, user: UserItem) => {
    setMenuOpen(null);
    if (action.includes('Suspend') || action.includes('Enable')) {
      setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'disabled' ? 'active' : 'disabled' } : u));
      toast.success(`${user.fullName} is now ${user.status === 'disabled' ? 'active' : 'disabled'}`);
    } else {
      toast.success(`${action}: ${user.fullName}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* ─── Page Header Row ─────────────────────────────── */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Users</h1>
          <p className="text-body-std text-[var(--text-secondary)]">
            Manage members, roles, permissions, and department assignments
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-enterprise btn-enterprise-primary"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* ─── KPI Cards Grid ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_CARDS.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi-card flex-row items-center">
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', k.bg)}>
                <Icon className={clsx('w-[18px] h-[18px]', k.color)} />
              </div>
              <div>
                <div className="text-[22px] font-bold text-[var(--text-primary)] leading-tight">{k.value}</div>
                <div className="text-caption text-[var(--text-muted)] font-medium mt-0.5">{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Filter Toolbar ─────────────────────────────── */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="field-input field-input-sm pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="field-input field-input-sm w-auto cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="company_admin">Company Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="field-input field-input-sm w-auto cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Counter */}
        <span className="text-caption text-[var(--text-muted)] font-medium sm:ml-auto whitespace-nowrap">
          Showing {filtered.length} of {usersList.length} users
        </span>
      </div>

      {/* ─── Desktop Users Table ─────────────────────────── */}
      <div className="surface-card overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Role</th>
                <th className="text-left">Department / Team</th>
                <th className="text-left">Status</th>
                <th className="text-left">Last Active</th>
                <th className="text-left">Tickets</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const StatusIcon = STATUS_ICON[u.status];
                return (
                  <tr key={u.id} className="group">
                    {/* User */}
                    <td className="text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                          {formatUtils.initials(u.fullName)}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">{u.fullName}</div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="text-left">
                      <span className={clsx('badge border', ROLE_COLORS[u.role] || '')}>
                        <Shield className="w-3 h-3" />
                        {ROLE_LABEL_MAP[u.role] || u.role}
                      </span>
                    </td>

                    {/* Department / Team */}
                    <td className="text-left">
                      <div className="text-[13px] font-medium text-[var(--text-primary)] leading-tight">{u.department}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{u.team}</div>
                    </td>

                    {/* Status */}
                    <td className="text-left">
                      <span className={clsx('badge border capitalize', STATUS_COLORS[u.status] || '')}>
                        <StatusIcon className="w-3 h-3" />
                        {u.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="text-left text-[13px] text-[var(--text-muted)]">{u.lastActive}</td>

                    {/* Tickets */}
                    <td className="text-left">
                      <span className="text-[13px] font-semibold text-[var(--text-primary)]">{u.ticketCount}</span>
                    </td>

                    {/* Actions */}
                    <td className="text-right relative">
                      <div ref={menuOpen === u.id ? actionRef : null} className="inline-block relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                          className="btn-enterprise btn-enterprise-tertiary btn-icon-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {menuOpen === u.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 w-44 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 z-50 shadow-lg text-left"
                            >
                              {[
                                { label: 'Edit User', icon: Edit, danger: false },
                                { label: 'Reset Password', icon: Key, danger: false },
                                { label: 'View Tickets', icon: TicketIcon, danger: false },
                                { label: u.status === 'disabled' ? 'Enable User' : 'Suspend User', icon: u.status === 'disabled' ? CheckCircle : XCircle, danger: u.status !== 'disabled' },
                              ].map(item => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.label}
                                    onClick={() => handleAction(item.label, u)}
                                    className={clsx(
                                      'w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                                      item.danger
                                        ? 'text-red-500 hover:bg-red-500/10'
                                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                                    )}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                    {item.label}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Mobile Adaptive Cards (<768px) ───────────── */}
        <div className="sm:hidden divide-y divide-[var(--surface-border)]">
          {filtered.map(u => {
            const StatusIcon = STATUS_ICON[u.status];
            return (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                      {formatUtils.initials(u.fullName)}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[var(--text-primary)]">{u.fullName}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{u.email}</div>
                    </div>
                  </div>
                  <span className={clsx('badge border capitalize flex-shrink-0', STATUS_COLORS[u.status])}>
                    <StatusIcon className="w-3 h-3" /> {u.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--surface-border)]">
                  <span className={clsx('badge border', ROLE_COLORS[u.role])}>
                    <Shield className="w-3 h-3" />
                    {ROLE_LABEL_MAP[u.role] || u.role}
                  </span>
                  <span className="text-[var(--text-muted)]">{u.department} · {u.team}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
                  <span>Tickets: <strong className="text-[var(--text-primary)]">{u.ticketCount}</strong></span>
                  <span>Active: {u.lastActive}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-[var(--text-muted)] opacity-20 mx-auto mb-2" />
            <p className="text-caption text-[var(--text-muted)]">No users match your search criteria</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AnimatePresence>
    </div>
  );
};
