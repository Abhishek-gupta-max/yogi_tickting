import type { FC } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users, UserPlus, Search, Shield, Mail, CheckCircle, XCircle,
  MoreVertical, Edit, Key, TicketIcon, X,
  Loader2, AlertCircle,
} from 'lucide-react';
import { formatUtils } from '@/shared/utils';
import type { UserRole } from '@/types/permission.types';
import { ROLE_LABEL_MAP } from '@/types/permission.types';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface UserItem {
  id: string; fullName: string; email: string; role: UserRole;
  department: string; team: string; status: 'active' | 'invited' | 'disabled';
  lastActive: string; ticketCount: number;
}

const MOCK_USERS: UserItem[] = [
  { id: 'usr-1', fullName: 'Eleanor Vance',    email: 'admin@ticketflow.io',    role: 'company_admin', department: 'Executive',    team: 'Leadership',    status: 'active',  lastActive: '2m ago',  ticketCount: 0   },
  { id: 'usr-2', fullName: 'Sophia Martinez',  email: 'agent@ticketflow.io',    role: 'agent',         department: 'Support',     team: 'Tier 1 Support', status: 'active', lastActive: '5m ago',  ticketCount: 42  },
  { id: 'usr-3', fullName: 'Marcus Brody',     email: 'manager@ticketflow.io',  role: 'manager',       department: 'IT Helpdesk', team: 'IT Core',        status: 'active', lastActive: '1h ago',  ticketCount: 38  },
  { id: 'usr-4', fullName: 'Alexander Wright', email: 'superadmin@ticketflow.io',role:'super_admin',    department: 'Platform',    team: 'Engineering',   status: 'active',  lastActive: '10m ago', ticketCount: 0   },
  { id: 'usr-5', fullName: 'David Miller',     email: 'customer@acme.com',      role: 'customer',      department: 'External',    team: '—',             status: 'active',  lastActive: '3h ago',  ticketCount: 5   },
  { id: 'usr-6', fullName: 'Clara Oswald',     email: 'clara@ticketflow.io',    role: 'agent',         department: 'Tier 2',      team: 'Escalation',    status: 'invited', lastActive: 'Never',   ticketCount: 0   },
  { id: 'usr-7', fullName: 'James Kirk',       email: 'jkirk@ticketflow.io',    role: 'agent',         department: 'DevOps',      team: 'Cloud Ops',     status: 'disabled',lastActive: '2w ago',  ticketCount: 12  },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin:   'bg-purple-500/10 text-purple-600',
  company_admin: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]',
  manager:       'bg-blue-500/10 text-blue-600',
  agent:         'bg-emerald-500/10 text-emerald-600',
  customer:      'bg-slate-500/10 text-slate-500',
};

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-emerald-500/10 text-emerald-600',
  invited:  'bg-amber-500/10 text-amber-600',
  disabled: 'bg-red-500/10 text-red-500',
};

const STATUS_ICON: Record<string, FC<{ className?: string }>> = {
  active: CheckCircle,
  invited: Mail,
  disabled: XCircle,
};

const KPI_CARDS = [
  { label: 'Total Users',  value: '7',  icon: Users,       color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
  { label: 'Active',       value: '5',  icon: CheckCircle, color: 'text-emerald-600 bg-emerald-500/10' },
  { label: 'Invited',      value: '1',  icon: Mail,        color: 'text-amber-600 bg-amber-500/10' },
  { label: 'Disabled',     value: '1',  icon: XCircle,     color: 'text-red-600 bg-red-500/10' },
];

/* ─── Invite Modal ─────────────────────────────────────────── */
const InviteModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('agent');
  const [dept, setDept] = useState('IT Helpdesk');
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!email.includes('@')) { toast.error('Enter a valid email'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    toast.success(`Invitation sent to ${email}`);
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-section-head text-[var(--text-primary)]">Invite Team Member</h2>
            <button onClick={onClose} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-4">
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com" className="field-input pl-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-field">
                <label className="form-label">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="field-input">
                  <option value="agent">Support Agent</option>
                  <option value="manager">Manager</option>
                  <option value="company_admin">Company Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Department</label>
                <select value={dept} onChange={e => setDept(e.target.value)} className="field-input">
                  {['IT Helpdesk', 'Engineering', 'DevOps', 'Billing', 'HR', 'Customer Success'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-primary-muted)] border border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[13px] text-[var(--color-primary)]">
              An email invitation with a secure setup link will be sent (expires in 48h).
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
            <button onClick={onClose} className="flex-1 btn-enterprise btn-enterprise-secondary">Cancel</button>
            <button onClick={handleInvite} disabled={sending || !email} className="flex-1 btn-enterprise btn-enterprise-primary disabled:opacity-50">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Mail className="w-4 h-4" /> Send Invite</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Users List Page ──────────────────────────────────────── */
export const UsersListPage: FC = () => {
  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [usersList,    setUsersList]    = useState<UserItem[]>(MOCK_USERS);
  const [showInvite,   setShowInvite]   = useState(false);
  const [menuOpen,     setMenuOpen]     = useState<string | null>(null);

  const filtered = usersList.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleAction = (action: string, user: UserItem) => {
    setMenuOpen(null);
    toast.success(`${action}: ${user.fullName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* ─── Header ─────────────────────────────────── */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Users</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Manage members, roles, permissions, and department assignments</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-enterprise btn-enterprise-primary">
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* ─── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_CARDS.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi-card flex-row items-center">
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', k.color)}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[var(--text-primary)]">{k.value}</div>
                <div className="text-caption text-[var(--text-muted)]">{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Filter Toolbar ─────────────────────────── */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="field-input field-input-sm pl-9" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="field-input field-input-sm w-auto">
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="company_admin">Company Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="field-input field-input-sm w-auto">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <span className="text-caption text-[var(--text-muted)] ml-auto whitespace-nowrap">{filtered.length} of {usersList.length} users</span>
      </div>

      {/* ─── Users Table ─────────────────────────────── */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                {['User', 'Role', 'Department / Team', 'Status', 'Last Active', 'Tickets', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const StatusIcon = STATUS_ICON[u.status];
                return (
                  <tr key={u.id} className="group">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white font-semibold flex items-center justify-center text-[11px] flex-shrink-0">
                          {formatUtils.initials(u.fullName)}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[var(--text-primary)]">{u.fullName}</div>
                          <div className="text-[11px] text-[var(--text-muted)]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={clsx('badge', ROLE_COLORS[u.role] || '')}>
                        <Shield className="w-3 h-3" />{ROLE_LABEL_MAP[u.role] || u.role}
                      </span>
                    </td>
                    <td>
                      <div className="text-[13px] font-medium text-[var(--text-primary)]">{u.department}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{u.team}</div>
                    </td>
                    <td>
                      <span className={clsx('badge', STATUS_COLORS[u.status] || '')}>
                        <StatusIcon className="w-3 h-3" /> {u.status}
                      </span>
                    </td>
                    <td className="text-[13px] text-[var(--text-muted)]">{u.lastActive}</td>
                    <td><span className="text-[13px] font-semibold text-[var(--text-primary)]">{u.ticketCount}</span></td>
                    <td className="relative">
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {menuOpen === u.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute right-0 top-8 w-44 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 z-50 shadow-lg">
                              {[
                                { label: 'Edit User', icon: Edit, danger: false },
                                { label: 'Reset Password', icon: Key, danger: false },
                                { label: 'View Tickets', icon: TicketIcon, danger: false },
                                { label: u.status === 'disabled' ? 'Enable User' : 'Suspend User', icon: u.status === 'disabled' ? CheckCircle : XCircle, danger: u.status !== 'disabled' },
                              ].map(item => {
                                const Icon = item.icon;
                                return (
                                  <button key={item.label} onClick={() => handleAction(item.label, u)}
                                    className={clsx('w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-colors',
                                      item.danger ? 'text-red-500 hover:bg-red-500/10' : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]')}>
                                    <Icon className="w-3.5 h-3.5" /> {item.label}
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
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-[var(--text-muted)] opacity-20 mx-auto mb-2" />
            <p className="text-caption text-[var(--text-muted)]">No users match your search</p>
          </div>
        )}
      </div>

      <AnimatePresence>{showInvite && <InviteModal onClose={() => setShowInvite(false)} />}</AnimatePresence>
    </div>
  );
};
