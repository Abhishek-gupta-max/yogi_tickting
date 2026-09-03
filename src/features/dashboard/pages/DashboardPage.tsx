import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, CheckCircle2, Clock, AlertTriangle, TrendingUp, TrendingDown,
  Plus, ArrowRight, Download, ChevronRight, Zap, Bell,
  UserPlus, BarChart3, Smile, Hourglass, Activity,
  Users, Search, Filter, Shield, MessageSquare,
} from 'lucide-react';
import { useAuthStore, selectUser } from '@/store/auth.store';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

/* ────────────────────────────────────────────────────────────
   MOCK DASHBOARD DATA
   ──────────────────────────────────────────────────────────── */
const KPI_STATS = [
  { id: 'kpi-open',     label: 'Open Tickets',   value: '142',    delta: '+12.4%', positive: true,  icon: Ticket,       color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-muted)]' },
  { id: 'kpi-resolved', label: 'Resolved Today',  value: '38',     delta: '+8.1%',  positive: true,  icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'kpi-pending',  label: 'Pending Queue',   value: '18',     delta: '-4.2%',  positive: true,  icon: Hourglass,    color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'kpi-sla',      label: 'SLA Breached',    value: '2',      delta: '-50.0%', positive: true,  icon: AlertTriangle,color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  { id: 'kpi-response', label: 'Avg Response',    value: '4m 12s', delta: '-15.3%', positive: true,  icon: Clock,        color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'kpi-csat',     label: 'CSAT Score',      value: '98.4%',  delta: '+2.1%',  positive: true,  icon: Smile,        color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-muted)]' },
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
  { name: 'Medium',   value: 48, color: '#F59E0B' },
  { name: 'Low',      value: 35, color: '#64748B' },
];

const RECENT_TICKETS = [
  { id: 'tkt-101', ticketNumber: 'TKT-000101', subject: 'SSO Authentication failing with Okta IdP on mobile Safari', priority: 'critical', status: 'in_progress', assignee: 'Sophia Martinez', updated: '15m ago' },
  { id: 'tkt-102', ticketNumber: 'TKT-000102', subject: 'Database connection pool exhaustion during peak hourly sync', priority: 'high', status: 'open', assignee: 'Unassigned', updated: '45m ago' },
  { id: 'tkt-103', ticketNumber: 'TKT-000103', subject: 'Custom SLA escalation policies per tier configuration', priority: 'medium', status: 'pending', assignee: 'Eleanor Vance', updated: '2h ago' },
  { id: 'tkt-104', ticketNumber: 'TKT-000104', subject: 'Webhook notification delivery latency exceeding 5 minutes', priority: 'high', status: 'open', assignee: 'Sophia Martinez', updated: '3h ago' },
  { id: 'tkt-105', ticketNumber: 'TKT-000105', subject: 'Billing export PDF formatting issue on quarterly invoices', priority: 'low', status: 'resolved', assignee: 'Marcus Brody', updated: '5h ago' },
];

const LIVE_ACTIVITIES = [
  { id: 'a1', actor: 'Sophia Martinez', action: 'resolved ticket',       target: 'TKT-000098', time: '2m ago',  type: 'success', icon: CheckCircle2 },
  { id: 'a2', actor: 'Eleanor Vance',   action: 'assigned ticket to',    target: 'Marcus Brody', time: '8m ago', type: 'info', icon: Users },
  { id: 'a3', actor: 'SLA Engine',      action: 'breach alert on',       target: 'TKT-000101', time: '14m ago', type: 'danger', icon: AlertTriangle },
  { id: 'a4', actor: 'Marcus Brody',    action: 'added internal note on',target: 'TKT-000102', time: '22m ago', type: 'info', icon: MessageSquare },
  { id: 'a5', actor: 'David Miller',    action: 'opened new ticket',     target: 'TKT-000105', time: '1h ago',  type: 'primary', icon: Plus },
  { id: 'a6', actor: 'Workflow Engine', action: 'auto-escalated',        target: 'TKT-000099', time: '2h ago',  type: 'warning', icon: Zap },
];

const TYPE_CONFIG: Record<string, { bg: string; text: string }> = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  info:    { bg: 'bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400' },
  danger:  { bg: 'bg-red-500/10',     text: 'text-red-600 dark:text-red-400' },
  primary: { bg: 'bg-[var(--color-primary-muted)]', text: 'text-[var(--color-primary)]' },
  warning: { bg: 'bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400' },
};

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  high:     'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  medium:   'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low:      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

const STATUS_BADGE: Record<string, string> = {
  open:         'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]',
  in_progress:  'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  pending:      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  resolved:     'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

const PRIORITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-amber-500',
  low:      'bg-slate-400',
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
    <div className="space-y-6 pb-8 animate-fade-in w-full">

      {/* ─── 1. PAGE HEADER ROW ───────────────────────────── */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">
            {greeting()}, {user?.firstName ?? 'User'}
          </h1>
          <p className="text-body-std text-[var(--text-secondary)]">
            Real-time service operations overview.{' '}
            <span className="font-semibold text-red-600 dark:text-red-400">2 SLA breach warnings</span> require immediate attention.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('/customers')} className="btn-enterprise btn-enterprise-secondary btn-sm">
            <UserPlus className="w-4 h-4" /> Customer
          </button>
          <button onClick={() => navigate('/reports')} className="btn-enterprise btn-enterprise-secondary btn-sm hidden sm:flex">
            <BarChart3 className="w-4 h-4" /> Reports
          </button>
          <button onClick={() => toast.success('Exporting PDF report…')} className="btn-enterprise btn-enterprise-secondary btn-sm hidden sm:flex">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => navigate('/tickets/new')} className="btn-enterprise btn-enterprise-primary">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>
      </div>

      {/* ─── 2. KPI METRICS CARDS (Fluid 6-Col Grid) ────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
        {KPI_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={() => navigate('/tickets')}
              className="kpi-card cursor-pointer group w-full"
            >
              <div className="flex items-center justify-between">
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', stat.bg)}>
                  <Icon className={clsx('w-[18px] h-[18px]', stat.color)} />
                </div>
                <span className={clsx(
                  'inline-flex items-center gap-0.5 text-[11px] font-semibold',
                  stat.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.delta}
                </span>
              </div>
              <div>
                <div className="text-card-value text-[var(--text-primary)] leading-tight">{stat.value}</div>
                <div className="text-caption text-[var(--text-muted)] font-medium mt-1">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 3. CHARTS ROW (8 Col Volume + 4 Col Priority) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

        {/* Volume Trend Chart (8 Col) */}
        <div className="lg:col-span-8 surface-card p-5 lg:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-card-title text-[var(--text-primary)]">Ticket Volume Trends</h2>
              <p className="text-caption text-[var(--text-muted)] mt-0.5">Incoming created vs resolved tickets — Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-[12px] font-medium text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />Created</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Resolved</span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#635BFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '12px', padding: '8px 12px', boxShadow: 'var(--shadow-md)' }}
                  cursor={{ stroke: 'var(--surface-border)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="created" stroke="#635BFF" strokeWidth={2.5} fill="url(#gCreated)" dot={false} />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} fill="url(#gResolved)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Chart (4 Col) */}
        <div className="lg:col-span-4 surface-card p-5 lg:p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-card-title text-[var(--text-primary)]">Priority Breakdown</h2>
            <p className="text-caption text-[var(--text-muted)] mt-0.5">Active queue severity distribution</p>
          </div>

          <div className="h-48 sm:h-52 w-full relative flex items-center justify-center my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PRIORITY_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {PRIORITY_DATA.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[24px] font-extrabold text-[var(--text-primary)] leading-none">118</span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--surface-border)]">
            {PRIORITY_DATA.map(p => (
              <div key={p.name} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-[12px] font-medium text-[var(--text-secondary)] truncate">{p.name}</span>
                </div>
                <span className="text-[12px] font-bold text-[var(--text-primary)] ml-2">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 4. RECENT TICKETS + ACTIVITY FEED (8 Col + 4 Col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

        {/* Recent Tickets Table (8 Col) */}
        <div className="lg:col-span-8 surface-card overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[var(--surface-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-card-title text-[var(--text-primary)]">Recent Tickets</h2>
                <p className="text-caption text-[var(--text-muted)] mt-0.5">Real-time incoming support requests</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search subject or ID…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="field-input field-input-sm pl-9 w-44 sm:w-52"
                  />
                </div>
                <button onClick={() => navigate('/tickets')} className="btn-enterprise btn-enterprise-secondary btn-sm flex-shrink-0">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table-enterprise">
                <thead>
                  <tr>
                    <th className="text-left">Ticket</th>
                    <th className="text-left">Subject</th>
                    <th className="text-left">Priority</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Assignee</th>
                    <th className="text-right">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => (
                    <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)} className="cursor-pointer group">
                      <td className="text-left">
                        <span className="font-mono text-[13px] font-semibold text-[var(--color-primary)]">{t.ticketNumber}</span>
                      </td>
                      <td className="text-left">
                        <span className="text-[var(--text-primary)] font-medium max-w-xs md:max-w-md truncate block group-hover:text-[var(--color-primary)] transition-colors text-[13px]">
                          {t.subject}
                        </span>
                      </td>
                      <td className="text-left">
                        <span className={clsx('badge border capitalize', PRIORITY_BADGE[t.priority])}>
                          <span className={clsx('w-1.5 h-1.5 rounded-full', PRIORITY_DOT[t.priority])} />
                          {t.priority}
                        </span>
                      </td>
                      <td className="text-left">
                        <span className={clsx('badge border capitalize', STATUS_BADGE[t.status] || 'bg-[var(--surface-muted)] text-[var(--text-muted)]')}>
                          {t.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="text-left text-[var(--text-secondary)] text-[13px]">{t.assignee}</td>
                      <td className="text-right text-[12px] text-[var(--text-muted)] font-medium">
                        {t.updated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Adaptive Card View */}
            <div className="sm:hidden divide-y divide-[var(--surface-border)]">
              {filteredTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="w-full text-left p-4 hover:bg-[var(--surface-hover)] transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-bold text-[var(--color-primary)]">{t.ticketNumber}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={clsx('badge border capitalize', PRIORITY_BADGE[t.priority])}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full', PRIORITY_DOT[t.priority])} />
                        {t.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)] line-clamp-2 leading-relaxed">{t.subject}</p>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                    <span>{t.assignee}</span>
                    <span>{t.updated}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity & Notifications (4 Col — Expanded Width & Visual Rhythm) */}
        <div className="lg:col-span-4 surface-card p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--surface-border)]">
              <div className="flex items-center gap-2">
                <h2 className="text-card-title text-[var(--text-primary)]">Live Activity</h2>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="live-dot" />
                  Live
                </span>
              </div>
              <button
                onClick={() => navigate('/notifications')}
                className="text-[12px] font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Activity Stream */}
            <div className="space-y-3.5">
              {LIVE_ACTIVITIES.map((evt) => {
                const Icon = evt.icon;
                const conf = TYPE_CONFIG[evt.type] || TYPE_CONFIG.primary;
                return (
                  <div key={evt.id} className="flex items-start justify-between gap-3 group p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', conf.bg)}>
                        <Icon className={clsx('w-4 h-4', conf.text)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-[var(--text-primary)] leading-snug">
                          <span className="font-semibold">{evt.actor}</span>{' '}
                          <span className="text-[var(--text-secondary)]">{evt.action}</span>{' '}
                          <span className="font-semibold text-[var(--color-primary)]">{evt.target}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] font-medium whitespace-nowrap flex-shrink-0 text-right">
                      {evt.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => navigate('/notifications')}
            className="btn-enterprise btn-enterprise-secondary btn-sm w-full mt-5"
          >
            <Bell className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Notification Feed
          </button>
        </div>
      </div>
    </div>
  );
};
