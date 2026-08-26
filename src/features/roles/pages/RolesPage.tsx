import type { FC } from 'react';
import { useState } from 'react';
import { ShieldCheck, CheckCircle2, Users, Key } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface RoleConfig {
  key: string;
  name: string;
  badgeColor: string;
  userCount: number;
  description: string;
  permissions: string[];
}

const MOCK_ROLES: RoleConfig[] = [
  {
    key: 'super_admin',
    name: 'Super Admin',
    badgeColor: 'bg-purple-500/10 text-purple-600',
    userCount: 2,
    description: 'Full global platform control, multi-tenant billing, system logs, and organization provisioning.',
    permissions: ['* (Global Full Access)', 'organizations.manage', 'billing.manage', 'system.logs'],
  },
  {
    key: 'company_admin',
    name: 'Company Admin',
    badgeColor: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]',
    userCount: 5,
    description: 'Organization administration: user management, departments, SLA policies, and workflows.',
    permissions: ['users.manage', 'departments.manage', 'sla.configure', 'workflows.manage', 'tickets.all'],
  },
  {
    key: 'manager',
    name: 'Department Manager',
    badgeColor: 'bg-amber-500/10 text-amber-600',
    userCount: 14,
    description: 'Department oversight: view all department tickets, reassign agents, monitor SLA breaches, and generate reports.',
    permissions: ['tickets.department_view', 'tickets.assign', 'reports.view', 'sla.monitor'],
  },
  {
    key: 'agent',
    name: 'Support Agent',
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
    userCount: 42,
    description: 'Frontline ticket handling: reply to customers, post internal notes, update ticket status, and resolve issues.',
    permissions: ['tickets.handle_assigned', 'comments.create_internal', 'tickets.update_status'],
  },
  {
    key: 'customer',
    name: 'End Customer / Client',
    badgeColor: 'bg-blue-500/10 text-blue-600',
    userCount: 850,
    description: 'Customer portal access: create support requests, track status timeline, reply, and access Knowledge Base.',
    permissions: ['portal.access', 'tickets.create_self', 'tickets.reply_self'],
  },
];

export const RolesPage: FC = () => {
  const [roles] = useState<RoleConfig[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(MOCK_ROLES[1]);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Roles & RBAC Permissions</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Configure system access control levels, granular permissions, and security policies</p>
        </div>
      </div>

      {/* Grid: Role List vs Granular Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Role Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {roles.map((role) => {
            const isSelected = selectedRole.key === role.key;
            return (
              <div
                key={role.key}
                onClick={() => setSelectedRole(role)}
                className={clsx(
                  'surface-card p-4 space-y-2 cursor-pointer transition-all',
                  isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' : ''
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={clsx('badge', role.badgeColor)}>
                    {role.name}
                  </span>
                  <span className="text-caption text-[var(--text-muted)] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {role.userCount} users
                  </span>
                </div>
                <p className="text-caption text-[var(--text-secondary)] leading-relaxed">{role.description}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Role Permissions Inspector */}
        <div className="lg:col-span-7">
          <div className="surface-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
              <div>
                <span className={clsx('badge mb-1', selectedRole.badgeColor)}>
                  {selectedRole.name}
                </span>
                <h2 className="text-section-head text-[var(--text-primary)]">Permission Matrix</h2>
              </div>
              <button
                onClick={() => toast.success(`Permissions updated for ${selectedRole.name}`)}
                className="btn-enterprise btn-enterprise-primary"
              >
                Save Matrix
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Key className="w-4 h-4 text-[var(--color-primary)]" /> Granted Scopes ({selectedRole.permissions.length})
              </p>

              <div className="space-y-2">
                {selectedRole.permissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[13px]"
                  >
                    <span className="font-mono text-[var(--color-primary)] font-semibold">{perm}</span>
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[12px]">
                      <CheckCircle2 className="w-4 h-4" /> Granted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
