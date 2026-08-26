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
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Organizations</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Super Admin platform management for SaaS tenants and subscriptions</p>
        </div>

        <button
          onClick={() => toast.success('New organization provisioning dialog opened')}
          className="btn-enterprise btn-enterprise-primary"
        >
          <Plus className="w-4 h-4" /> Provision Tenant
        </button>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan Tier</th>
                <th>User Count</th>
                <th>Total Tickets</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORGS.map((org) => (
                <tr key={org.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {org.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{org.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                      {org.plan}
                    </span>
                  </td>
                  <td className="text-[13px] font-medium text-[var(--text-primary)]">{org.users} users</td>
                  <td className="text-[13px] text-[var(--text-secondary)]">{org.tickets}</td>
                  <td>
                    <span className="badge bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" /> {org.status}
                    </span>
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
