import type { FC } from 'react';
import { Building2, Plus, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_ORGS = [
  { id: 'org-1', name: 'Acme Enterprises', plan: 'Enterprise VIP', users: 142, tickets: '1.2k', status: 'Active' },
  { id: 'org-2', name: 'Globex Corporation', plan: 'Enterprise', users: 89, tickets: '640', status: 'Active' },
  { id: 'org-3', name: 'Apex Systems', plan: 'Business Pro', users: 45, tickets: '310', status: 'Active' },
  { id: 'org-4', name: 'Tokyo Tech Labs', plan: 'Enterprise', users: 112, tickets: '980', status: 'Active' },
];

export const OrganizationsListPage: FC = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-500" /> Multi-Tenant Organizations
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Super Admin platform management for SaaS tenants and subscriptions
          </p>
        </div>

        <button
          onClick={() => toast.success('New organization provisioning dialog opened')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Provision Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ORGS.map((org) => (
          <div key={org.id} className="surface-card p-5 space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
                  {org.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">{org.name}</h3>
                  <span className="text-[10px] text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {org.plan}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> {org.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--surface-border)] text-xs text-[var(--text-muted)]">
              <div>
                Users: <span className="font-semibold text-[var(--text-primary)]">{org.users}</span>
              </div>
              <div>
                Total Tickets: <span className="font-semibold text-[var(--text-primary)]">{org.tickets}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
