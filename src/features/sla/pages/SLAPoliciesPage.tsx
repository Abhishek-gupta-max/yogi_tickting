import type { FC } from 'react';
import { useState } from 'react';
import { Timer, Plus, ShieldAlert, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface SLARule {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  firstResponseMinutes: number;
  resolutionMinutes: number;
  escalationTarget: string;
  isDefault: boolean;
}

const MOCK_SLA_RULES: SLARule[] = [
  {
    id: 'sla-crit',
    name: 'Critical Security Outage Policy',
    priority: 'critical',
    firstResponseMinutes: 15,
    resolutionMinutes: 60,
    escalationTarget: 'DevOps Lead & VP Engineering',
    isDefault: true,
  },
  {
    id: 'sla-high',
    name: 'High Priority Enterprise Policy',
    priority: 'high',
    firstResponseMinutes: 60,
    resolutionMinutes: 240,
    escalationTarget: 'Department Manager',
    isDefault: true,
  },
  {
    id: 'sla-med',
    name: 'Standard Business Hours Policy',
    priority: 'medium',
    firstResponseMinutes: 240,
    resolutionMinutes: 1440,
    escalationTarget: 'Team Lead',
    isDefault: true,
  },
  {
    id: 'sla-low',
    name: 'General Inquiry SLA',
    priority: 'low',
    firstResponseMinutes: 720,
    resolutionMinutes: 2880,
    escalationTarget: 'Support Agent',
    isDefault: true,
  },
];

export const SLAPoliciesPage: FC = () => {
  const [rules] = useState<SLARule[]>(MOCK_SLA_RULES);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Timer className="w-6 h-6 text-indigo-500" />
            SLA Service Level Agreements & Escalations
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure response time targets, resolution thresholds, and automatic breach escalation triggers
          </p>
        </div>
        <button
          onClick={() => toast.success('Configure new SLA Policy')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add SLA Rule
        </button>
      </div>

      {/* Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map((rule) => (
          <div key={rule.id} className="surface-card p-5 space-y-4 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase ${
                rule.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                rule.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                rule.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {rule.priority} Priority
              </span>
              {rule.isDefault && (
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Default Policy
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)]">{rule.name}</h3>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" /> First Response Target
                </span>
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {rule.firstResponseMinutes >= 60 ? `${rule.firstResponseMinutes / 60} Hours` : `${rule.firstResponseMinutes} Mins`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block flex items-center gap-1">
                  <Timer className="w-3 h-3 text-indigo-400" /> Resolution Target
                </span>
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {rule.resolutionMinutes >= 60 ? `${rule.resolutionMinutes / 60} Hours` : `${rule.resolutionMinutes} Mins`}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 pt-1">
              <ArrowUpRight className="w-4 h-4 text-amber-500" /> Escalation Target: <strong className="text-[var(--text-primary)]">{rule.escalationTarget}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
