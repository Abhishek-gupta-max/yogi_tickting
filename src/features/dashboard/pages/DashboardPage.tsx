import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, CheckCircle2, Clock, AlertTriangle, TrendingUp, TrendingDown,
  Plus, ArrowRight, Download, Search, ChevronRight, Zap, ShieldAlert,
  UserPlus, BarChart3, Smile, Hourglass, Layers, Bell, Activity,
  Users, X,
} from 'lucide-react';
import { useAuthStore, selectUser } from '@/store/auth.store';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

/* ────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────── */
const KPI_STATS = [
  { id: 'kpi-open',     label: 'Open Tickets',   value: '142',    delta: '+12.4%', positive: true,  icon: Ticket,       color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
  { id: 'kpi-resolved', label: 'Resolved Today',  value: '38',     delta: '+8.1%',  positive: true,  icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
  { id: 'kpi-pending',  label: 'Pending Queue',   value: '18',     delta: '-4.2%',  positive: true,  icon: Hourglass,    color: 'text-amber-600 bg-amber-500/10' },
  { id: 'kpi-sla',      label: 'SLA Breached',    value: '2',      delta: '-50%',   positive: true,  icon: AlertTriangle, color: 'text-red-600 bg-red-500/10' },
  { id: 'kpi-response', label: 'Avg Response',    value: '4m 12s', delta: '-15.3%', positive: true,  icon: Clock,        color: 'text-blue-600 bg-blue-500/10' },
  { id: 'kpi-csat',     label: 'CSAT Score',      value: '98.4%',  delta: '+2.1%',  positive: true,  icon: Smile,        color: 'text-purple-600 bg-purple-500/10' },
];

const VOLUME_DATA = [
  { day: 'Mon', created: 24, resolved: 20 },
  { day: 'Tue', created: 18, resolved: 22 },
  { day: 'Wed', created: 32, resolved: 28 },
  { day: 'Thu', created: 28, resolved: 30 },
  { day: 'Fri', created: 41, resolved: 35 },
  { day: 'Sat', created: 12, resolved: 15 },
  { day: 'Sun', created: 8,  resolved: 10 },
];

const PRIORITY_DATA = [
  { name: 'Critical', value: 7,  color: '#EF4444' },
  { name: 'High',     value: 28, color: '#F97316' },
  { name: 'Medium',   value: 48, color: '#EAB308' },
  { name: 'Low',      value: 35, color: '#64748B' },
];

const RECENT_TICKETS = [
  { id: 'tkt-101', ticketNumber: 'TKT-000101', subject: 'SSO Authentication failing with Okta IdP on mobile Safari', priority: 'critical', status: 'in_progress', assignee: 'Sophia Martinez', created: '15m ago' },
  { id: 'tkt-102', ticketNumber: 'TKT-000102', subject: 'Database connection pool exhaustion during peak hourly sync', priority: 'high', status: 'open', assignee: 'Unassigned', created: '45m ago' },
  { id: 'tkt-103', ticketNumber: 'TKT-000103', subject: 'Custom SLA escalation policies per tier configuration', priority: 'medium', status: 'pending', assignee: 'Eleanor Vance', created: '2h ago' },
  { id: 'tkt-104', ticketNumber: 'TKT-000104', subject: 'Webhook notification delivery latency exceeding 5 minutes', priority: 'high', status: 'open', assignee: 'Sophia Martinez', created: '3h ago' },
  { id: 'tkt-105', ticketNumber: 'TKT-000105', subject: 'Billing export PDF formatting issue on quarterly invoices', priority: 'low', status: 'resolved', assignee: 'Marcus Brody', created: '5h ago' },
];

const ACTIVITY_FEED = [
  { id: 'a1', actor: 'Sophia M.', action: 'resolved ticket', target: 'TKT-000098', time: '2m ago',  color: 'bg-emerald-500', icon: CheckCircle2 },
  { id: 'a2', actor: 'Eleanor V.', action: 'assigned ticket to', target: 'Marcus B.', time: '8m ago', color: 'bg-[var(--color-primary)]', icon: Users },
  { id: 'a3', actor: 'System',     action: 'SLA breach warning on', target: 'TKT-000101', time: '14m ago', color: 'bg-red-500', icon: AlertTriangle },
  { id: 'a4', actor: 'Marcus B.',  action: 'commented on', target: 'TKT-000102', time: '22m ago', color: 'bg-blue-500', icon: Activity },
  { id: 'a5', actor: 'David M.',   action: 'created ticket', target: 'TKT-000105', time: '1h ago', color: 'bg-purple-500', icon: Plus },
  { id: 'a6', actor: 'System',     action: 'auto-escalated', target: 'TKT-000099', time: '2h ago', color: 'bg-amber-500', icon: Zap },
];

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600',
  high:     'bg-orange-500/10 text-orange-600',
  medium:   'bg-amber-500/10 text-amber-600',
  low:      'bg-slate-500/10 text-slate-600',
};

const STATUS_BADGE: Record<string, string> = {
  open:         'bg-[var(--color-primary-muted)] text-[var(--color-primary)]',
  in_progress:  'bg-indigo-500/10 text-indigo-600',
  pending:      'bg-amber-500/10 text-amber-600',
  resolved:     'bg-emerald-500/10 text-emerald-600',
};

/* ────────────────────────────────────────────────────────────
   DASHBOARD PAGE
   ──────────────────────────────────────────────────────────── */
export const DashboardPage: FC = () => {
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredTickets = RECENT_TICKETS.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.subject.toLowerCase().includes(q) || t.ticketNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-8 animate-fade-in">

      {/* ─── PAGE HEADER ─────────────────────────────────── */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">
            {greeting()}, {user?.firstName ?? 'User'}
          </h1>
          <p className="text-body-std text-[var(--text-secondary)]">
            Real-time service operations overview. <span className="font-medium text-[var(--color-danger)]">2 SLA breach warnings</span> require attention.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('/customers')} className="btn-enterprise btn-enterprise-secondary btn-sm">
            <UserPlus className="w-4 h-4" /> Customer
          </button>
          <button onClick={() => navigate('/reports')} className="btn-enterprise btn-enterprise-secondary btn-sm">
            <BarChart3 className="w-4 h-4" /> Reports
          </button>
          <button onClick={() => toast.success('Exporting PDF…')} className="btn-enterprise btn-enterprise-secondary btn-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => navigate('/tickets/new')} className="btn-enterprise btn-enterprise-primary">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>
      </div>

      {/* ─── KPI CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={() => navigate('/tickets')}
              className="kpi-card cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', stat.color)}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <span className={clsx(
                  'inline-flex items-center gap-0.5 text-[11px] font-semibold',
                  stat.positive ? 'text-emerald-600' : 'text-red-500'
                )}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.delta}
                </span>
              </div>
              <div>
                <div className="text-card-value text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-caption text-[var(--text-muted)] mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── CHARTS ROW ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart — Ticket Volume (8 col) */}
        <div className="lg:col-span-8 surface-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-card-title text-[var(--text-primary)]">Ticket Volume Trends</h2>
              <p className="text-caption text-[var(--text-muted)] mt-0.5">Incoming vs resolved — Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-caption font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" /> Created</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved</span>
            </div>
          </div>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#635BFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '13px', padding: '10px 14px' }} />
                <Area type="monotone" dataKey="created" stroke="#635BFF" strokeWidth={2} fill="url(#gCreated)" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fill="url(#gResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart — Priority (4 col) */}
        <div className="lg:col-span-4 surface-card p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="text-card-title text-[var(--text-primary)]">Priority Breakdown</h2>
            <p className="text-caption text-[var(--text-muted)] mt-0.5">Active ticket queue</p>
          </div>

          <div className="h-40 relative flex items-center justify-center flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PRIORITY_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                  {PRIORITY_DATA.map(e => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[22px] font-bold text-[var(--text-primary)]">118</span>
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[var(--surface-border)]">
            {PRIORITY_DATA.map(p => (
              <div key={p.name} className="flex items-center gap-2 text-caption">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-[var(--text-muted)] truncate">{p.name}</span>
                <span className="font-semibold text-[var(--text-primary)] ml-auto">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RECENT TICKETS + ACTIVITY ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Tickets (8 col) */}
        <div className="lg:col-span-8 surface-card overflow-hidden">
          <div className="p-5 border-b border-[var(--surface-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-card-title text-[var(--text-primary)]">Recent Tickets</h2>
              <p className="text-caption text-[var(--text-muted)] mt-0.5">Real-time queue</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="field-input field-input-sm pl-8 w-36"
                />
              </div>
              <button onClick={() => navigate('/tickets')} className="btn-enterprise btn-enterprise-secondary btn-sm">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)} className="cursor-pointer group">
                    <td>
                      <span className="font-mono text-[13px] font-semibold text-[var(--color-primary)]">{t.ticketNumber}</span>
                    </td>
                    <td>
                      <span className="text-[var(--text-primary)] font-medium max-w-[280px] truncate block group-hover:text-[var(--color-primary)] transition-colors">
                        {t.subject}
                      </span>
                    </td>
                    <td>
                      <span className={clsx('badge', PRIORITY_BADGE[t.priority])}>
                        <span className="badge-dot" style={{ backgroundColor: 'currentColor' }} />
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={clsx('badge', STATUS_BADGE[t.status] || 'bg-[var(--surface-muted)] text-[var(--text-muted)]')}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-[var(--text-secondary)] text-[13px]">{t.assignee}</td>
                    <td className="text-right">
                      <span className="text-[var(--color-primary)] font-medium flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[13px]">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed (4 col) */}
        <div className="lg:col-span-4 surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-card-title text-[var(--text-primary)]">Live Activity</h2>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>

          <div className="space-y-0">
            {ACTIVITY_FEED.map((evt) => {
              const Icon = evt.icon;
              return (
                <div key={evt.id} className="timeline-item">
                  <div className={clsx('timeline-dot', evt.color)}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-[13px] text-[var(--text-primary)] leading-relaxed">
                      <span className="font-medium">{evt.actor}</span>
                      {' '}{evt.action}{' '}
                      <span className="font-semibold text-[var(--color-primary)]">{evt.target}</span>
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{evt.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => navigate('/notifications')} className="btn-enterprise btn-enterprise-secondary btn-sm w-full mt-4">
            <Bell className="w-4 h-4" /> View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};
