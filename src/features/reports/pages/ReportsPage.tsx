import type { FC } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Ticket, CheckCircle2, Clock,
  Smile, Users, BarChart3, Download, Filter, Calendar,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const DATE_TABS = ['7D', '30D', '90D', 'Custom'] as const;
type DateTab = typeof DATE_TABS[number];

const KPI_DATA: Record<DateTab, { label: string; value: string; delta: string; positive: boolean; icon: FC<any>; color: string }[]> = {
  '7D': [
    { label: 'Total Tickets',    value: '284',   delta: '+12.4%', positive: true,  icon: Ticket,       color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Resolved',         value: '261',   delta: '+8.1%',  positive: true,  icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '4m 12s',delta: '-15.3%', positive: true,  icon: Clock,        color: 'text-blue-500 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '98.4%', delta: '+2.1%',  positive: true,  icon: Smile,        color: 'text-purple-500 bg-purple-500/10' },
  ],
  '30D': [
    { label: 'Total Tickets',    value: '1,142', delta: '+5.2%',  positive: true,  icon: Ticket,       color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Resolved',         value: '1,089', delta: '+3.1%',  positive: true,  icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '6m 32s',delta: '-8.3%',  positive: true,  icon: Clock,        color: 'text-blue-500 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '97.2%', delta: '+1.4%',  positive: true,  icon: Smile,        color: 'text-purple-500 bg-purple-500/10' },
  ],
  '90D': [
    { label: 'Total Tickets',    value: '3,847', delta: '-2.1%',  positive: false, icon: Ticket,       color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Resolved',         value: '3,692', delta: '-1.8%',  positive: false, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '9m 14s',delta: '+4.1%',  positive: false, icon: Clock,        color: 'text-blue-500 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '96.8%', delta: '-0.6%',  positive: false, icon: Smile,        color: 'text-purple-500 bg-purple-500/10' },
  ],
  'Custom': [
    { label: 'Total Tickets',    value: '—',     delta: '—',      positive: true,  icon: Ticket,       color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Resolved',         value: '—',     delta: '—',      positive: true,  icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '—',     delta: '—',      positive: true,  icon: Clock,        color: 'text-blue-500 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '—',     delta: '—',      positive: true,  icon: Smile,        color: 'text-purple-500 bg-purple-500/10' },
  ],
};

const VOLUME_DATA = [
  { day: 'Mon', created: 24, resolved: 20, prev: 20 },
  { day: 'Tue', created: 18, resolved: 22, prev: 16 },
  { day: 'Wed', created: 32, resolved: 28, prev: 28 },
  { day: 'Thu', created: 28, resolved: 30, prev: 24 },
  { day: 'Fri', created: 41, resolved: 35, prev: 36 },
  { day: 'Sat', created: 12, resolved: 15, prev: 10 },
  { day: 'Sun', created: 8,  resolved: 10, prev: 7  },
];

const RESOLUTION_RATE = [
  { week: 'W1', rate: 88 }, { week: 'W2', rate: 91 },
  { week: 'W3', rate: 94 }, { week: 'W4', rate: 96 },
  { week: 'W5', rate: 93 }, { week: 'W6', rate: 97 },
  { week: 'W7', rate: 98 }, { week: 'W8', rate: 99 },
];

const CATEGORY_DATA = [
  { name: 'Software & Apps',     value: 38, color: '#6366f1' },
  { name: 'Security & Auth',     value: 22, color: '#EF4444' },
  { name: 'Network & Infra',     value: 18, color: '#3b82f6' },
  { name: 'Hardware',            value: 12, color: '#f59e0b' },
  { name: 'Billing',             value: 6,  color: '#22c55e' },
  { name: 'Other',               value: 4,  color: '#94a3b8' },
];

const DEPT_DATA = [
  { name: 'IT',        tickets: 45, resolved: 40 },
  { name: 'Eng',       tickets: 32, resolved: 28 },
  { name: 'DevOps',    tickets: 18, resolved: 17 },
  { name: 'Billing',   tickets: 12, resolved: 11 },
  { name: 'HR',        tickets: 8,  resolved: 8  },
];

const AGENTS = [
  { name: 'Sophia Martinez', tickets: 42, resolved: 40, avgTime: '3m 48s', csat: 99.1, color: 'from-indigo-500 to-blue-600' },
  { name: 'Marcus Brody',    tickets: 38, resolved: 36, avgTime: '5m 12s', csat: 97.8, color: 'from-emerald-500 to-teal-600' },
  { name: 'Eleanor Vance',   tickets: 31, resolved: 29, avgTime: '6m 20s', csat: 98.4, color: 'from-purple-500 to-violet-600' },
  { name: 'Clara Oswald',    tickets: 24, resolved: 22, avgTime: '8m 02s', csat: 96.2, color: 'from-amber-500 to-orange-600' },
];

export const ReportsPage: FC = () => {
  const [activeDate, setActiveDate] = useState<DateTab>('7D');
  const kpis = KPI_DATA[activeDate];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 pb-12 animate-fade-in">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" /> Reports & Analytics
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Performance metrics, SLA compliance, and team efficiency insights</p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Date Range Tabs */}
          <div className="flex items-center p-1 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl gap-1">
            {DATE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveDate(tab)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors', activeDate === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]')}>
                {tab}
              </button>
            ))}
          </div>
          {activeDate === 'Custom' && (
            <input type="date" className="px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none" />
          )}
          <button onClick={() => toast.success('Exporting CSV report…')} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-muted)] hover:text-indigo-500 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={() => toast.success('Exporting PDF report…')} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} whileHover={{ y: -3 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="surface-card-premium p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}><Icon className="w-5 h-5" /></div>
                <span className={clsx('flex items-center gap-1 text-xs font-bold', k.positive ? 'text-emerald-500' : 'text-red-500')}>
                  {k.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {k.delta}
                </span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">{k.value}</div>
                <div className="text-xs text-[var(--text-muted)]">{k.label}</div>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--surface-border)] pt-2">
                vs. previous {activeDate} period
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Charts Row 1 ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Volume Area Chart */}
        <div className="lg:col-span-8 surface-card-premium p-6 space-y-4">
          <div className="border-b border-[var(--surface-border)] pb-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Ticket Volume</h2>
            <p className="text-xs text-[var(--text-muted)]">Created vs Resolved vs Previous Period</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="prev" stroke="#94a3b8" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Previous" />
                <Area type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2.5} fill="url(#rCreated)" name="Created" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2.5} fill="url(#rResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="lg:col-span-4 surface-card-premium p-6 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Category Distribution</h2>
            <p className="text-xs text-[var(--text-muted)]">Ticket types breakdown</p>
          </div>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={46} outerRadius={66} paddingAngle={4} dataKey="value">
                  {CATEGORY_DATA.map(e => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '10px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {CATEGORY_DATA.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="flex-1 text-[var(--text-muted)] truncate">{c.name}</span>
                <span className="font-bold text-[var(--text-primary)]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Charts Row 2 ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Rate Line Chart */}
        <div className="surface-card-premium p-6 space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Resolution Rate Trend</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RESOLUTION_RATE} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '12px', fontSize: '12px' }} formatter={(v: any) => [`${v}%`, 'Resolution Rate']} />
                <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Bar */}
        <div className="surface-card-premium p-6 space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Department Performance</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="tickets"  name="Total" radius={[4, 4, 0, 0]} fill="#6366f150" />
                <Bar dataKey="resolved" name="Resolved" radius={[4, 4, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Agent Performance Table ──────────────────── */}
      <div className="surface-card-premium overflow-hidden">
        <div className="p-5 border-b border-[var(--surface-border)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Agent Performance
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Ranked by tickets resolved in period</p>
          </div>
          <button onClick={() => toast.success('Exporting agent report…')} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-indigo-500 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--surface-border)]">
                {['Rank', 'Agent', 'Tickets Handled', 'Resolved', 'Avg Resolution', 'CSAT Score'].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {AGENTS.map((a, i) => (
                <tr key={a.name} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="px-5 py-4 font-bold text-[var(--text-muted)]">#{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.color} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}>
                        {a.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-[var(--text-primary)]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-[var(--text-primary)]">{a.tickets}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-primary)]">{a.resolved}</span>
                      <div className="w-20 h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(a.resolved / a.tickets) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold">{Math.round((a.resolved / a.tickets) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{a.avgTime}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={clsx('font-extrabold', a.csat >= 99 ? 'text-emerald-500' : a.csat >= 97 ? 'text-indigo-500' : 'text-amber-500')}>{a.csat}%</span>
                      <div className="w-16 h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${a.csat}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
