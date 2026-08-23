import type { FC } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Shield, Mail, CheckCircle, XCircle,
  MoreVertical, Edit, Trash2, Key, TicketIcon, ChevronDown, X,
  Building2, Filter, AlertCircle, Loader2,
} from 'lucide-react';
import { formatUtils } from '@/shared/utils';
import type { UserRole } from '@/types/permission.types';
import { ROLE_LABEL_MAP } from '@/types/permission.types';
import toast from 'react-hot-toast';

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
  { id: 'usr-6', fullName: 'Clara Oswald',     email: 'clara@ticketflow.io',    role: 'agent',         department: 'Tier 2 Support',team:'Escalation',   status: 'invited', lastActive: 'Never',   ticketCount: 0   },
  { id: 'usr-7', fullName: 'James Kirk',       email: 'jkirk@ticketflow.io',    role: 'agent',         department: 'DevOps',      team: 'Cloud Ops',     status: 'disabled',lastActive: '2w ago',  ticketCount: 12  },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin:   'bg-purple-500/10 text-purple-500 border-purple-500/20',
  company_admin: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  manager:       'bg-blue-500/10 text-blue-500 border-blue-500/20',
  agent:         'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  customer:      'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  invited:  'bg-amber-500/10 text-amber-500 border-amber-500/20',
  disabled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const KPI_CARDS = [
  { label: 'Total Users',  value: '7',  icon: Users,      color: 'text-indigo-500 bg-indigo-500/10' },
  { label: 'Active',       value: '5',  icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
  { label: 'Invited',      value: '1',  icon: Mail,        color: 'text-amber-500 bg-amber-500/10' },
  { label: 'Disabled',     value: '1',  icon: XCircle,     color: 'text-red-500 bg-red-500/10' },
];

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
      >
        <div className="w-full max-w-md surface-card p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-500" /> Invite Team Member
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
                  <option value="agent">Support Agent</option>
                  <option value="manager">Manager</option>
                  <option value="company_admin">Company Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Department</label>
                <select value={dept} onChange={e => setDept(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
                  {['IT Helpdesk', 'Engineering', 'DevOps', 'Billing', 'HR', 'Customer Success'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-indigo-600 dark:text-indigo-300">
              An email invitation will be sent with a secure setup link expiring in 48 hours.
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[var(--surface-border)]">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">Cancel</button>
            <motion.button
              onClick={handleInvite} disabled={sending || !email}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 disabled:opacity-50"
            >
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Mail className="w-4 h-4" /> Send Invite</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const UsersListPage: FC = () => {
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('all');
  const [statusFilter,setStatusFilter]= useState('all');
  const [usersList,   setUsersList]   = useState<UserItem[]>(MOCK_USERS);
  const [showInvite,  setShowInvite]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState<string | null>(null);

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
    <div className="space-y-5 animate-fade-in">
      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" /> User & Role Management
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Manage members, roles, permissions, and department assignments</p>
        </div>
        <motion.button
          onClick={() => setShowInvite(true)}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </motion.button>
      </div>

      {/* ─── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_CARDS.map(k => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} whileHover={{ y: -2 }} className="surface-card-premium p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[var(--text-primary)]">{k.value}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{k.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Filter Toolbar ─────────────────────────── */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="company_admin">Company Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <span className="text-xs text-[var(--text-muted)] ml-auto whitespace-nowrap">{filtered.length} of {usersList.length} users</span>
      </div>

      {/* ─── Users Table ─────────────────────────────── */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--surface-border)]">
                {['User', 'Role', 'Department / Team', 'Status', 'Last Active', 'Tickets', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[var(--surface-hover)] transition-colors group">
                  {/* User */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                        {formatUtils.initials(u.fullName)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">{u.fullName}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${ROLE_COLORS[u.role] || ''}`}>
                      <Shield className="w-3 h-3" />{ROLE_LABEL_MAP[u.role] || u.role}
                    </span>
                  </td>
                  {/* Dept/Team */}
                  <td className="px-4 py-3.5">
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{u.department}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{u.team}</div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${STATUS_COLORS[u.status] || ''}`}>
                      {u.status === 'active' ? <CheckCircle className="w-3 h-3" /> : u.status === 'invited' ? <Mail className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {u.status}
                    </span>
                  </td>
                  {/* Last Active */}
                  <td className="px-4 py-3.5 text-xs text-[var(--text-muted)]">{u.lastActive}</td>
                  {/* Tickets */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{u.ticketCount}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5 relative">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {menuOpen === u.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-0 top-8 w-44 surface-card p-1.5 z-50 shadow-2xl"
                          >
                            {[
                              { label: 'Edit User', icon: Edit },
                              { label: 'Reset Password', icon: Key },
                              { label: 'View Tickets', icon: TicketIcon },
                              { label: u.status === 'disabled' ? 'Enable User' : 'Suspend User', icon: u.status === 'disabled' ? CheckCircle : XCircle, danger: u.status !== 'disabled' },
                            ].map(item => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.label}
                                  onClick={() => handleAction(item.label, u)}
                                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${item.danger ? 'text-red-500 hover:bg-red-500/10' : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'}`}
                                >
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
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
            <p className="text-xs text-[var(--text-muted)]">No users match your search</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>{showInvite && <InviteModal onClose={() => setShowInvite(false)} />}</AnimatePresence>
    </div>
  );
};
