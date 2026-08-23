import type { FC } from 'react';
import { useState } from 'react';
import { Workflow, Plus, Zap, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'paused';
}

const MOCK_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Auto-Assign Critical SSO Issues to Security Squad',
    trigger: 'On Ticket Created',
    condition: 'Category == "Security & Auth" OR Tags contains "sso"',
    action: 'Assign to Team "Security & Auth Squad" & Set Priority to Critical',
    status: 'active',
  },
  {
    id: 'rule-2',
    name: 'Auto-Reply on New Hardware Provisioning Requests',
    trigger: 'On Ticket Created',
    condition: 'Category == "HR & IT Equipment"',
    action: 'Send Email Template "Hardware Request Intake Received"',
    status: 'active',
  },
  {
    id: 'rule-3',
    name: 'Escalate Unassigned Tickets Breaching 2-Hour SLA',
    trigger: 'On SLA Warning (2h remaining)',
    condition: 'Assignee == null AND Status == "new"',
    action: 'Escalate to IT Department Manager & Broadcast Slack Notification',
    status: 'active',
  },
];

export const WorkflowsPage: FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>(MOCK_RULES);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r))
    );
    toast.success('Workflow rule updated');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Workflow className="w-6 h-6 text-indigo-500" />
            Workflow Automation & Triggers
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Build IF-THIS-THEN-THAT rules for auto-assignment, auto-replies, and SLA escalations
          </p>
        </div>
        <button
          onClick={() => toast.success('Create new Automation Workflow Rule')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((r) => (
          <div key={r.id} className="surface-card p-5 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">{r.name}</h3>
              </div>
              <button
                onClick={() => toggleRule(r.id)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase cursor-pointer ${
                  r.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {r.status}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-semibold">WHEN (Trigger)</span>
                <span className="font-mono text-indigo-400 font-semibold">{r.trigger}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-semibold">IF (Condition)</span>
                <span className="font-mono text-[var(--text-primary)]">{r.condition}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-semibold">THEN (Action)</span>
                <span className="font-mono text-emerald-400 font-semibold">{r.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
