import type { FC } from 'react';
import { useState } from 'react';
import { TrendingUp, Sparkles, Brain, Cpu, ArrowUpRight, BarChart2, Calendar, Download, RefreshCw, Zap } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const AI_INSIGHTS = [
  {
    id: 'ai-1',
    title: 'Surge in Mobile SSO Ticket Traffic Detected',
    desc: 'AI model detects a +34% spike in SAML 2.0 / Okta authentication errors specifically on mobile Safari devices following iOS 18.1 updates.',
    action: 'Auto-route to Security Squad',
    severity: 'high',
  },
  {
    id: 'ai-2',
    title: 'Resolution Time Optimization Opportunity',
    desc: 'Automating standard billing PDF invoice export requests via email webhooks can save 14 agent hours per week.',
    action: 'Enable Workflow Rule #14',
    severity: 'medium',
  },
];

const ANALYTICS_TREND_DATA = [
  { month: 'Jan', volume: 1200, resolved: 1150, csat: 96 },
  { month: 'Feb', volume: 1450, resolved: 1400, csat: 97 },
  { month: 'Mar', volume: 1300, resolved: 1280, csat: 95 },
  { month: 'Apr', volume: 1680, resolved: 1620, csat: 98 },
  { month: 'May', volume: 1900, resolved: 1850, csat: 98.4 },
  { month: 'Jun', volume: 2100, resolved: 2040, csat: 99 },
];

export const AnalyticsPage: FC = () => {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            Enterprise Analytics & AI Predictive Insights
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time operations forecast, CSAT satisfaction metrics, and automated anomaly detection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success('Exporting Analytics PDF Report')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--surface-border)] bg-[var(--surface-bg)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          >
            <Download className="w-3.5 h-3.5" /> Export Insights
          </button>
        </div>
      </div>

      {/* ─── AI INSIGHTS CARD ────────────────────────────────────────────── */}
      <div className="surface-card-premium p-6 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                TicketFlow AI Ops Intelligence
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  REALTIME
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">Automated pattern recognition & bottleneck detection</p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {AI_INSIGHTS.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> {item.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              <button
                onClick={() => toast.success(`Executed AI Action: ${item.action}`)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1"
              >
                {item.action} <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CHARTS ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Volume Growth */}
        <div className="lg:col-span-8 surface-card-premium p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">Monthly Ticket Volume Growth</h2>
              <p className="text-xs text-[var(--text-muted)]">Historical ticket scale over 6 months</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--surface-border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={3} />
                <Area type="monotone" dataKey="resolved" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CSAT Satisfaction Gauge */}
        <div className="lg:col-span-4 surface-card-premium p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Customer CSAT Score Trend</h2>
            <p className="text-xs text-[var(--text-muted)]">Average satisfaction rating out of 100%</p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-center space-y-2">
            <div className="text-4xl font-extrabold text-emerald-500 tracking-tight">98.4%</div>
            <p className="text-xs text-[var(--text-muted)] font-medium">+2.1% improvement from last quarter</p>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98.4%' }} />
            </div>
          </div>

          <div className="space-y-2 text-xs text-[var(--text-muted)]">
            <div className="flex items-center justify-between">
              <span>5 Stars (Excellent)</span>
              <span className="font-bold text-[var(--text-primary)]">92.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>4 Stars (Good)</span>
              <span className="font-bold text-[var(--text-primary)]">6.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>1-3 Stars</span>
              <span className="font-bold text-[var(--text-primary)]">1.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
