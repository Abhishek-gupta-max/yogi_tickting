import type { FC } from 'react';
import { TrendingUp, Sparkles, Brain, ArrowUpRight, Zap, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const AI_INSIGHTS = [
  {
    id: 'ai-1',
    title: 'Surge in Mobile SSO Ticket Traffic Detected',
    desc: 'AI model detects a +34% spike in SAML 2.0 / Okta authentication errors on mobile Safari following iOS 18.1 updates.',
    action: 'Auto-route to Security Squad',
  },
  {
    id: 'ai-2',
    title: 'Resolution Time Optimization Opportunity',
    desc: 'Automating standard billing PDF invoice export requests via email webhooks can save 14 agent hours per week.',
    action: 'Enable Workflow Rule #14',
  },
];

const ANALYTICS_TREND_DATA = [
  { month: 'Jan', volume: 1200, resolved: 1150 },
  { month: 'Feb', volume: 1450, resolved: 1400 },
  { month: 'Mar', volume: 1300, resolved: 1280 },
  { month: 'Apr', volume: 1680, resolved: 1620 },
  { month: 'May', volume: 1900, resolved: 1850 },
  { month: 'Jun', volume: 2100, resolved: 2040 },
];

export const AnalyticsPage: FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Enterprise Analytics & AI Insights</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Real-time operations forecast, CSAT metrics, and automated anomaly detection</p>
        </div>
        <button onClick={() => toast.success('Exporting Analytics PDF')} className="btn-enterprise btn-enterprise-secondary">
          <Download className="w-4 h-4" /> Export Insights
        </button>
      </div>

      {/* AI Insights Card */}
      <div className="surface-card p-6 space-y-4 border-[var(--color-primary-ring)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-card-title text-[var(--text-primary)] flex items-center gap-2">
                TicketFlow AI Operations Intelligence
                <span className="badge bg-[var(--color-primary-muted)] text-[var(--color-primary)] uppercase text-[10px]">Realtime</span>
              </h2>
              <p className="text-caption text-[var(--text-muted)] mt-0.5">Automated pattern recognition & bottleneck detection</p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-[var(--color-primary)] animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {AI_INSIGHTS.map((item) => (
            <div key={item.id} className="p-4 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> {item.title}
                </span>
              </div>
              <p className="text-caption text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              <button
                onClick={() => toast.success(`Executed: ${item.action}`)}
                className="text-caption font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 pt-1"
              >
                {item.action} <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 surface-card p-5 space-y-4">
          <div className="border-b border-[var(--surface-border)] pb-3">
            <h2 className="text-card-title text-[var(--text-primary)]">Monthly Ticket Volume Growth</h2>
            <p className="text-caption text-[var(--text-muted)] mt-0.5">Historical ticket scale over 6 months</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--surface-border)', borderRadius: '8px', fontSize: '13px' }} />
                <Area type="monotone" dataKey="volume" stroke="#635BFF" fill="#635BFF" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 surface-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-card-title text-[var(--text-primary)]">Customer CSAT Rating</h2>
            <p className="text-caption text-[var(--text-muted)] mt-0.5">Average satisfaction rating</p>
          </div>

          <div className="p-6 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-center space-y-2 my-4">
            <div className="text-card-value text-emerald-600">98.4%</div>
            <p className="text-caption text-[var(--text-muted)] font-medium">+2.1% improvement this quarter</p>
            <div className="progress-track mt-3">
              <div className="progress-fill bg-emerald-500" style={{ width: '98.4%' }} />
            </div>
          </div>

          <div className="space-y-2 text-caption text-[var(--text-muted)]">
            <div className="flex items-center justify-between">
              <span>5 Stars (Excellent)</span>
              <span className="font-semibold text-[var(--text-primary)]">92.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>4 Stars (Good)</span>
              <span className="font-semibold text-[var(--text-primary)]">6.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>1-3 Stars</span>
              <span className="font-semibold text-[var(--text-primary)]">1.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
