import type { FC } from 'react';
import { useState } from 'react';
import { Plus, Zap, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
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
    action: 'Assign to Team "Security Squad" & Set Priority to Critical',
    status: 'active',
  },
  {
    id: 'rule-2',
    name: 'Auto-Reply on New Hardware Requests',
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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Workflow Automation</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Build automated rules for ticket routing, auto-replies, and SLA escalations</p>
        </div>
        <button onClick={() => toast.success('Create Automation Rule')} className="btn-enterprise btn-enterprise-primary">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      {/* Rules Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Trigger (WHEN)</th>
                <th>Condition (IF)</th>
                <th>Action (THEN)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{r.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-[12px] text-[var(--color-primary)] font-medium bg-[var(--color-primary-muted)] px-2 py-0.5 rounded">
                      {r.trigger}
                    </span>
                  </td>
                  <td className="text-[13px] text-[var(--text-secondary)] font-mono text-[12px]">{r.condition}</td>
                  <td className="text-[13px] text-emerald-600 font-mono text-[12px]">{r.action}</td>
                  <td>
                    <button
                      onClick={() => toggleRule(r.id)}
                      className={clsx('badge cursor-pointer', r.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500')}
                    >
                      <CheckCircle className="w-3 h-3" /> {r.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
