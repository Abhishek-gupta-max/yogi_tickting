import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket, CheckCircle2, Clock, AlertTriangle, TrendingUp, TrendingDown,
  Plus, ArrowRight, Download, Search, ChevronRight, Sparkles, Zap, ShieldAlert,
  UserPlus, BarChart3, Smile, Hourglass, Layers, Bell, CalendarDays, Activity,
  Megaphone, ChevronLeft, Users, X,
} from 'lucide-react';
import { useAuthStore, selectUser } from '@/store/auth.store';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

// ─── KPI CARDS DATA ──────────────────────────────────────────
const KPI_STATS = [
  { id: 'kpi-open',     label: 'Open Tickets',      value: '142',    delta: '+12.4%', positive: true,  icon: Ticket,       iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',  sparkline: [20,24,18,30,28,38,42], color: '#4F46E5' },
  { id: 'kpi-resolved', label: 'Resolved Today',    value: '38',     delta: '+8.1%',  positive: true,  icon: CheckCircle2, iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', sparkline: [12,16,22,28,31,35,38], color: '#10B981' },
  { id: 'kpi-pending',  label: 'Pending Queue',     value: '18',     delta: '-4.2%',  positive: true,  icon: Hourglass,    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',     sparkline: [25,22,20,19,18,18,18], color: '#F59E0B' },
  { id: 'kpi-sla',      label: 'SLA Breached',      value: '2',      delta: '-50.0%', positive: true,  icon: AlertTriangle, iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',      sparkline: [8,6,5,4,3,3,2],       color: '#EF4444' },
  { id: 'kpi-response', label: 'Avg Response',      value: '4m 12s', delta: '-15.3%', positive: true,  icon: Clock,        iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',       sparkline: [15,12,10,8,6,5,4],    color: '#3B82F6' },
  { id: 'kpi-csat',     label: 'CSAT Score',        value: '98.4%',  delta: '+2.1%',  positive: true,  icon: Smile,        iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',   sparkline: [94,95,96,96,97,98,98.4], color: '#7C3AED' },
];

// ─── CHART DATA ──────────────────────────────────────────────
const VOLUME_DATA = [
  { day: 'Mon', created: 24, resolved: 20 },
  { day: 'Tue', created: 18, resolved: 22 },
  { day: 'Wed', created: 32, resolved: 28 },
  { day: 'Thu', created: 28, resolved: 30 },
  { day: 'Fri', created: 41, resolved: 35 },
  { day: 'Sat', created: 12, resolved: 15 },
  { day: 'Sun', created: 8,  resolved: 10 },
];

const DEPT_DATA = [
  { name: 'IT Helpdesk',  tickets: 45 },
  { name: 'Engineering',  tickets: 32 },
  { name: 'DevOps',      tickets: 18 },
  { name: 'Billing',     tickets: 12 },
  { name: 'HR',          tickets: 8  },
];

const PRIORITY_DATA = [
  { name: 'Critical', value: 7,  color: '#EF4444' },
  { name: 'High',     value: 28, color: '#F97316' },
  { name: 'Medium',   value: 48, color: '#F59E0B' },
  { name: 'Low',      value: 35, color: '#3B82F6' },
];

// ─── RECENT TICKETS ───────────────────────────────────────────
const RECENT_TICKETS = [
  { id: 'tkt-101', ticketNumber: 'TKT-000101', subject: 'SSO Authentication failing with Okta IdP on mobile Safari', priority: 'critical', status: 'in_progress', assignee: 'Sophia Martinez', created: '15m ago', category: 'Security' },
  { id: 'tkt-102', ticketNumber: 'TKT-000102', subject: 'Database connection pool exhaustion during peak hourly sync', priority: 'high', status: 'open', assignee: 'Unassigned', created: '45m ago', category: 'Infrastructure' },
  { id: 'tkt-103', ticketNumber: 'TKT-000103', subject: 'Custom SLA escalation policies per tier configuration', priority: 'medium', status: 'waiting_for_customer', assignee: 'Eleanor Vance', created: '2h ago', category: 'Feature' },
  { id: 'tkt-104', ticketNumber: 'TKT-000104', subject: 'Webhook notification delivery latency exceeding 5 minutes', priority: 'high', status: 'assigned', assignee: 'Sophia Martinez', created: '3h ago', category: 'Integrations' },
  { id: 'tkt-105', ticketNumber: 'TKT-000105', subject: 'Billing export PDF formatting issue on quarterly invoices', priority: 'low', status: 'resolved', assignee: 'Marcus Brody', created: '5h ago', category: 'Billing' },
];

// ─── ACTIVITY FEED ────────────────────────────────────────────
const ACTIVITY_FEED = [
  { id: 'a1', actor: 'Sophia M.', action: 'resolved ticket', target: 'TKT-000098', time: '2m ago',  color: 'bg-emerald-500', icon: CheckCircle2 },
  { id: 'a2', actor: 'Eleanor V.', action: 'assigned ticket to', target: 'Marcus B.', time: '8m ago',  color: 'bg-indigo-500', icon: Users },
  { id: 'a3', actor: 'System',     action: 'SLA breach warning on', target: 'TKT-000101', time: '14m ago', color: 'bg-red-500', icon: AlertTriangle },
  { id: 'a4', actor: 'Marcus B.',  action: 'commented on', target: 'TKT-000102', time: '22m ago', color: 'bg-blue-500', icon: Activity },
  { id: 'a5', actor: 'David M.',   action: 'created ticket', target: 'TKT-000105', time: '1h ago',  color: 'bg-purple-500', icon: Plus },
  { id: 'a6', actor: 'System',     action: 'auto-escalated', target: 'TKT-000099', time: '2h ago',  color: 'bg-amber-500', icon: Zap },
];

// ─── ANNOUNCEMENTS ────────────────────────────────────────────
const ANNOUNCEMENTS = [
  { id: 'ann-1', title: 'Scheduled Maintenance — Aug 10', body: 'Platform maintenance window from 02:00–04:00 UTC. SLA timers will be paused automatically.', type: 'warning', pinned: true },
  { id: 'ann-2', title: 'New Feature: AI Ticket Routing', body: 'TicketFlow AI now auto-routes incoming tickets based on content, department rules, and agent availability.', type: 'info', pinned: false },
];

// ─── TOP AGENTS ───────────────────────────────────────────────
const TOP_AGENTS = [
  { name: 'Sophia Martinez', resolved: 42, csat: 99.1, color: 'from-indigo-600 to-blue-600' },
  { name: 'Marcus Brody',    resolved: 38, csat: 97.8, color: 'from-emerald-600 to-teal-600' },
  { name: 'Eleanor Vance',   resolved: 31, csat: 98.4, color: 'from-purple-600 to-violet-600' },
  { name: 'Clara Oswald',    resolved: 24, csat: 96.2, color: 'from-amber-600 to-orange-600' },
];

// ─── MINI CALENDAR ────────────────────────────────────────────
function getMiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return { cells, today: today.getDate(), month: MONTH_NAMES[month], year };
}

const DUE_DATES: Record<number, string> = { 7: 'TKT-101', 12: 'SLA Review', 15: 'Maint.', 20: 'Report' };

// ─── SPARKLINE SVG ────────────────────────────────────────────
const Sparkline: FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 90},${24 - ((v - min) / (max - min || 1)) * 18}`).join(' ');
  return (
    <svg width="90" height="26" viewBox="0 0 90 26" className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

export const DashboardPage: FC = () => {
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();
  const cal = getMiniCalendar();
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedAnn, setDismissedAnn] = useState<string[]>([]);
  const [calOffset, setCalOffset] = useState(0);

  const filteredTickets = RECENT_TICKETS.filter((t) => {
    if (activeTab === 'open' && t.status !== 'open' && t.status !== 'assigned') return false;
    if (activeTab === 'critical' && t.priority !== 'critical') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.ticketNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const visibleAnns = ANNOUNCEMENTS.filter(a => !dismissedAnn.includes(a.id));
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6 lg:space-y-8 pb-12"
    >
      {/* ─── HERO BANNER ────────────────────────────────────────────────── */}
      <div className="surface-card-premium p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bg-hero-gradient rounded-2xl">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-blue-500/10 rounded-full translate-y-1/2 blur-2xl" />
        </div>

        <div className="space-y-2.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 text-badge-std uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Enterprise Platform · Acme Corp
          </div>
          <h1 className="text-section-head sm:text-page-title text-[var(--text-primary)]">
            {greeting()}, {user?.firstName ?? 'Eleanor'} 👋
          </h1>
          <p className="text-body-std text-[var(--text-secondary)] leading-relaxed">
            Here is your real-time operations summary. <strong className="text-[var(--text-primary)] font-semibold">2 SLA breach warnings</strong> require attention today.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 relative z-10 w-full sm:w-auto">
          <button onClick={() => navigate('/customers')} className="btn-enterprise btn-enterprise-secondary flex-1 sm:flex-initial">
            <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Customer
          </button>
          <button onClick={() => navigate('/reports')} className="btn-enterprise btn-enterprise-secondary flex-1 sm:flex-initial">
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Reports
          </button>
          <button onClick={() => toast.success('Exporting workspace PDF…')} className="btn-enterprise btn-enterprise-secondary flex-1 sm:flex-initial">
            <Download className="w-4 h-4 text-[var(--text-muted)]" /> Export
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tickets/new')}
            className="btn-enterprise btn-enterprise-primary w-full sm:w-auto shadow-md"
          >
            <Plus className="w-5 h-5" /> New Ticket
          </motion.button>
        </div>
      </div>

      {/* ─── ANNOUNCEMENTS ───────────────────────────────────────────── */}
      {visibleAnns.length > 0 && (
        <div className="space-y-3">
          {visibleAnns.map((ann) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className={clsx(
                'flex items-start gap-3.5 p-4 rounded-xl border text-body-std',
                ann.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
              )}
            >
              <Megaphone className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-bold mb-0.5 flex items-center gap-2">
                  {ann.pinned && <span className="text-badge-std uppercase tracking-wider px-2 py-0.5 rounded bg-current/15">Pinned</span>}
                  {ann.title}
                </div>
                <p className="opacity-90 leading-relaxed text-small-std">{ann.body}</p>
              </div>
              <button onClick={() => setDismissedAnn(d => [...d, ann.id])} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-current/10 transition-colors opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── 6 KPI CARDS — FULLY RESPONSIVE GRID (1 → 2 → 3 → 6) ──────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-6">
        {KPI_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              onClick={() => navigate('/tickets')}
              className="kpi-card cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shadow-xs', stat.iconBg)}>
                  <Icon className="w-5 h-5" />
                </div>
                <Sparkline data={stat.sparkline} color={stat.color} />
              </div>

              <div>
                <div className="text-card-value text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors leading-none mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-small-std font-medium text-[var(--text-muted)] truncate">{stat.label}</span>
                  <span className={clsx('inline-flex items-center text-badge-std font-bold', stat.positive ? 'text-emerald-500' : 'text-red-500')}>
                    {stat.positive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                    {stat.delta}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── CHARTS ROW ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart — Ticket Volume */}
        <div className="lg:col-span-8 surface-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--surface-border)] pb-4">
            <div>
              <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Ticket Volume Trends
              </h2>
              <p className="text-small-std text-[var(--text-muted)]">Incoming vs resolved — Last 7 Days</p>
            </div>
            <div className="flex items-center gap-4 text-small-std font-semibold">
              <span className="flex items-center gap-2 text-[var(--text-primary)]"><span className="w-3 h-3 rounded-full bg-indigo-600" /> Created</span>
              <span className="flex items-center gap-2 text-[var(--text-primary)]"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Resolved</span>
            </div>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '12px', fontSize: '13px', padding: '12px 16px' }} />
                <Area type="monotone" dataKey="created" stroke="#4F46E5" strokeWidth={3} fill="url(#gCreated)" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} fill="url(#gResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart — Priority Breakdown */}
        <div className="lg:col-span-4 surface-card p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Priority Breakdown
            </h2>
            <p className="text-small-std text-[var(--text-muted)]">Current active ticket queue</p>
          </div>

          <div className="h-44 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PRIORITY_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={4} dataKey="value">
                  {PRIORITY_DATA.map(e => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '12px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-section-head text-[var(--text-primary)]">118</span>
              <span className="text-badge-std uppercase font-bold text-[var(--text-muted)]">Tickets</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-[var(--surface-border)] pt-4">
            {PRIORITY_DATA.map(p => (
              <div key={p.name} className="flex items-center gap-2 text-small-std">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-[var(--text-muted)] truncate">{p.name}</span>
                <span className="font-bold text-[var(--text-primary)] ml-auto">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── DEPT BAR + TOP AGENTS + CALENDAR ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Dept Bar Chart */}
        <div className="lg:col-span-5 surface-card p-6 space-y-6">
          <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Department Load
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_DATA} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '12px', fontSize: '13px' }} />
                <Bar dataKey="tickets" radius={[0, 6, 6, 0]} fill="url(#barGrad)" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Agents Leaderboard */}
        <div className="lg:col-span-4 surface-card p-6 space-y-6">
          <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Top Agents Today
          </h2>
          <div className="space-y-4">
            {TOP_AGENTS.map((agent, i) => (
              <div key={agent.name} className="flex items-center gap-3">
                <span className="text-small-std font-bold text-[var(--text-muted)] w-4">{i + 1}</span>
                <div className={clsx('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs', agent.color)}>
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-std font-semibold text-[var(--text-primary)] truncate">{agent.name}</div>
                  <div className="text-small-std text-[var(--text-muted)]">{agent.resolved} resolved · CSAT {agent.csat}%</div>
                </div>
                <div className="w-16">
                  <div className="h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all" style={{ width: `${(agent.resolved / 42) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Calendar */}
        <div className="lg:col-span-3 surface-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {cal.month} {cal.year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setCalOffset(c => c - 1)} className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCalOffset(c => c + 1)} className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-badge-std font-bold text-[var(--text-muted)] py-1">{d}</div>
            ))}
            {cal.cells.map((d, i) => (
              <div key={i} className={clsx(
                'text-center text-small-std py-1.5 rounded-lg cursor-pointer transition-colors font-medium',
                d === null ? '' :
                d === cal.today ? 'bg-indigo-600 text-white font-bold shadow-xs' :
                DUE_DATES[d as number] ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 font-semibold' :
                'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              )} title={d && DUE_DATES[d as number] ? DUE_DATES[d as number] : undefined}>
                {d ?? ''}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-small-std pt-2 border-t border-[var(--surface-border)]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Today</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" /> Due Date</span>
          </div>
        </div>
      </div>

      {/* ─── RECENT TICKETS + ACTIVITY FEED ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Tickets Table (48px Sticky Header, 56px Row Height) */}
        <div className="lg:col-span-8 surface-card overflow-hidden">
          <div className="p-6 border-b border-[var(--surface-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-card-title text-[var(--text-primary)]">Recent Workspace Tickets</h2>
              <p className="text-small-std text-[var(--text-muted)]">Real-time ticketing queue</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Filter tickets…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="field-input pl-9 w-40" />
              </div>
              <button onClick={() => navigate('/tickets')} className="btn-enterprise btn-enterprise-secondary">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-enterprise">
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
                    <td className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.ticketNumber}</td>
                    <td className="font-medium text-[var(--text-primary)] max-w-xs truncate group-hover:text-indigo-600 transition-colors">{t.subject}</td>
                    <td>
                      <span className={clsx('text-badge-std uppercase px-2.5 py-1 rounded-md font-bold',
                        t.priority === 'critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse' :
                        t.priority === 'high'     ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        t.priority === 'medium'   ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                     'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      )}>{t.priority}</span>
                    </td>
                    <td>
                      <span className="text-badge-std capitalize px-2.5 py-1 rounded-lg bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] font-semibold">
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-[var(--text-secondary)]">{t.assignee}</td>
                    <td className="text-right">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ChevronRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Live Activity
            </h2>
            <span className="text-badge-std font-bold text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>

          <div className="space-y-0">
            {ACTIVITY_FEED.map((evt) => {
              const Icon = evt.icon;
              return (
                <div key={evt.id} className="timeline-item">
                  <div className={clsx('timeline-dot', evt.color)}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-body-std text-[var(--text-primary)] leading-relaxed">
                      <span className="font-semibold">{evt.actor}</span>
                      {' '}{evt.action}{' '}
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{evt.target}</span>
                    </p>
                    <p className="text-small-std text-[var(--text-muted)] mt-0.5">{evt.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => navigate('/notifications')} className="btn-enterprise btn-enterprise-secondary w-full">
            <Bell className="w-4 h-4" /> View All Activity
          </button>
        </div>
      </div>
    </motion.div>
  );
};
