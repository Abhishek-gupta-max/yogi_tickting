import type { FC } from 'react';
import { useState } from 'react';
import { Timer, Plus, Clock, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
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
  { id: 'sla-crit', name: 'Critical Outage Policy',     priority: 'critical', firstResponseMinutes: 15,  resolutionMinutes: 60,   escalationTarget: 'DevOps Lead & VP Eng', isDefault: true },
  { id: 'sla-high', name: 'High Priority Policy',      priority: 'high',     firstResponseMinutes: 60,  resolutionMinutes: 240,  escalationTarget: 'Department Manager',   isDefault: true },
  { id: 'sla-med',  name: 'Standard Business Hours',    priority: 'medium',   firstResponseMinutes: 240, resolutionMinutes: 1440, escalationTarget: 'Team Lead',            isDefault: true },
  { id: 'sla-low',  name: 'General Inquiry SLA',        priority: 'low',      firstResponseMinutes: 720, resolutionMinutes: 2880, escalationTarget: 'Support Agent',        isDefault: true },
];

export const SLAPoliciesPage: FC = () => {
  const [rules] = useState<SLARule[]>(MOCK_SLA_RULES);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">SLA Policies & Escalations</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Configure response time targets, resolution thresholds, and automatic breach escalation triggers</p>
        </div>
        <button onClick={() => toast.success('Configure new SLA Policy')} className="btn-enterprise btn-enterprise-primary">
          <Plus className="w-4 h-4" /> Add SLA Rule
        </button>
      </div>

      {/* Rules Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Priority Scope</th>
                <th>First Response Target</th>
                <th>Resolution Target</th>
                <th>Escalation Target</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-muted)] flex items-center justify-center flex-shrink-0">
                        <Timer className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{rule.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={clsx(
                      'badge uppercase',
                      rule.priority === 'critical' ? 'bg-red-500/10 text-red-600' :
                      rule.priority === 'high' ? 'bg-orange-500/10 text-orange-600' :
                      rule.priority === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-slate-500/10 text-slate-600'
                    )}>
                      {rule.priority}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-[13px] text-[var(--text-primary)] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      {rule.firstResponseMinutes >= 60 ? `${rule.firstResponseMinutes / 60}h` : `${rule.firstResponseMinutes}m`}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-[13px] text-[var(--text-primary)] font-medium">
                      <Timer className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      {rule.resolutionMinutes >= 60 ? `${rule.resolutionMinutes / 60}h` : `${rule.resolutionMinutes}m`}
                    </span>
                  </td>
                  <td className="text-[13px] text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> {rule.escalationTarget}
                    </span>
                  </td>
                  <td>
                    {rule.isDefault && <span className="badge bg-[var(--color-primary-muted)] text-[var(--color-primary)]">Default Policy</span>}
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
