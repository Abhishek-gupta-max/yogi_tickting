import type { FC } from 'react';
import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Ticket, CheckCircle2, Clock,
  Smile, Users, BarChart3, Download,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const DATE_TABS = ['7D', '30D', '90D', 'Custom'] as const;
type DateTab = typeof DATE_TABS[number];

const KPI_DATA: Record<DateTab, { label: string; value: string; delta: string; positive: boolean; icon: FC<any>; color: string }[]> = {
  '7D': [
    { label: 'Total Tickets',    value: '284',   delta: '+12.4%', positive: true,  icon: Ticket,       color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
    { label: 'Resolved',         value: '261',   delta: '+8.1%',  positive: true,  icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '4m 12s',delta: '-15.3%', positive: true,  icon: Clock,        color: 'text-blue-600 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '98.4%', delta: '+2.1%',  positive: true,  icon: Smile,        color: 'text-purple-600 bg-purple-500/10' },
  ],
  '30D': [
    { label: 'Total Tickets',    value: '1,142', delta: '+5.2%',  positive: true,  icon: Ticket,       color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
    { label: 'Resolved',         value: '1,089', delta: '+3.1%',  positive: true,  icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '6m 32s',delta: '-8.3%',  positive: true,  icon: Clock,        color: 'text-blue-600 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '97.2%', delta: '+1.4%',  positive: true,  icon: Smile,        color: 'text-purple-600 bg-purple-500/10' },
  ],
  '90D': [
    { label: 'Total Tickets',    value: '3,847', delta: '-2.1%',  positive: false, icon: Ticket,       color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
    { label: 'Resolved',         value: '3,692', delta: '-1.8%',  positive: false, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '9m 14s',delta: '+4.1%',  positive: false, icon: Clock,        color: 'text-blue-600 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '96.8%', delta: '-0.6%',  positive: false, icon: Smile,        color: 'text-purple-600 bg-purple-500/10' },
  ],
  'Custom': [
    { label: 'Total Tickets',    value: '—',     delta: '—',      positive: true,  icon: Ticket,       color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
    { label: 'Resolved',         value: '—',     delta: '—',      positive: true,  icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Avg Response',     value: '—',     delta: '—',      positive: true,  icon: Clock,        color: 'text-blue-600 bg-blue-500/10' },
    { label: 'CSAT Score',       value: '—',     delta: '—',      positive: true,  icon: Smile,        color: 'text-purple-600 bg-purple-500/10' },
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
  { name: 'Software & Apps',     value: 38, color: '#635BFF' },
  { name: 'Security & Auth',     value: 22, color: '#EF4444' },
  { name: 'Network & Infra',     value: 18, color: '#3B82F6' },
  { name: 'Hardware',            value: 12, color: '#F59E0B' },
  { name: 'Billing',             value: 6,  color: '#10B981' },
  { name: 'Other',               value: 4,  color: '#64748B' },
];

const DEPT_DATA = [
  { name: 'IT',        tickets: 45, resolved: 40 },
  { name: 'Eng',       tickets: 32, resolved: 28 },
  { name: 'DevOps',    tickets: 18, resolved: 17 },
  { name: 'Billing',   tickets: 12, resolved: 11 },
  { name: 'HR',        tickets: 8,  resolved: 8  },
];

const AGENTS = [
  { name: 'Sophia Martinez', tickets: 42, resolved: 40, avgTime: '3m 48s', csat: 99.1 },
  { name: 'Marcus Brody',    tickets: 38, resolved: 36, avgTime: '5m 12s', csat: 97.8 },
  { name: 'Eleanor Vance',   tickets: 31, resolved: 29, avgTime: '6m 20s', csat: 98.4 },
  { name: 'Clara Oswald',    tickets: 24, resolved: 22, avgTime: '8m 02s', csat: 96.2 },
];

export const ReportsPage: FC = () => {
  const [activeDate, setActiveDate] = useState<DateTab>('7D');
  const kpis = KPI_DATA[activeDate];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Reports & Analytics</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Performance metrics, SLA compliance, and team efficiency insights</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-0.5 bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-lg h-[32px]">
            {DATE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDate(tab)}
                className={clsx(
                  'h-7 px-2.5 rounded-md text-[12px] font-medium transition-colors',
                  activeDate === tab ? 'bg-[var(--surface-card)] text-[var(--color-primary)] shadow-xs font-semibold' : 'text-[var(--text-muted)]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button onClick={() => toast.success('Exporting CSV report…')} className="btn-enterprise btn-enterprise-secondary btn-sm">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={() => toast.success('Exporting PDF report…')} className="btn-enterprise btn-enterprise-primary btn-sm">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi-card">
              <div className="flex items-center justify-between">
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', k.color)}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <span className={clsx('flex items-center gap-0.5 text-[11px] font-semibold', k.positive ? 'text-emerald-600' : 'text-red-500')}>
                  {k.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {k.delta}
                </span>
              </div>
              <div>
                <div className="text-card-value text-[var(--text-primary)]">{k.value}</div>
                <div className="text-caption text-[var(--text-muted)]">{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 surface-card p-5">
          <div className="mb-4 border-b border-[var(--surface-border)] pb-3">
            <h2 className="text-card-title text-[var(--text-primary)]">Ticket Volume</h2>
            <p className="text-caption text-[var(--text-muted)] mt-0.5">Created vs Resolved vs Previous Period</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#635BFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '13px' }} />
                <Area type="monotone" dataKey="created" stroke="#635BFF" strokeWidth={2} fill="url(#rCreated)" name="Created" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fill="url(#rResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 surface-card p-5">
          <div className="mb-4">
            <h2 className="text-card-title text-[var(--text-primary)]">Category Distribution</h2>
            <p className="text-caption text-[var(--text-muted)] mt-0.5">Ticket types breakdown</p>
          </div>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={46} outerRadius={66} paddingAngle={3} dataKey="value">
                  {CATEGORY_DATA.map(e => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-3 border-t border-[var(--surface-border)]">
            {CATEGORY_DATA.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-caption">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-[var(--text-muted)] truncate flex-1">{c.name}</span>
                <span className="font-semibold text-[var(--text-primary)]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="surface-card overflow-hidden">
        <div className="p-4 border-b border-[var(--surface-border)] flex items-center justify-between">
          <div>
            <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--color-primary)]" /> Agent Performance
            </h2>
            <p className="text-caption text-[var(--text-muted)]">Ranked by tickets resolved</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Agent</th>
                <th>Handled</th>
                <th>Resolved</th>
                <th>Avg Time</th>
                <th>CSAT</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((a, i) => (
                <tr key={a.name}>
                  <td className="font-semibold text-[var(--text-muted)]">#{i + 1}</td>
                  <td>
                    <span className="font-medium text-[var(--text-primary)]">{a.name}</span>
                  </td>
                  <td className="font-semibold text-[var(--text-primary)]">{a.tickets}</td>
                  <td><span className="font-semibold text-emerald-600">{a.resolved}</span></td>
                  <td className="text-[var(--text-muted)]">{a.avgTime}</td>
                  <td><span className="font-bold text-[var(--color-primary)]">{a.csat}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
