import type { FC } from 'react';
import { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Plus, Users, Key, AlertCircle } from 'lucide-react';
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
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    userCount: 2,
    description: 'Full global platform control, multi-tenant billing, system logs, and organization provisioning.',
    permissions: ['* (Global Full Access)', 'organizations.manage', 'billing.manage', 'system.logs'],
  },
  {
    key: 'company_admin',
    name: 'Company Admin',
    badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    userCount: 5,
    description: 'Organization administration: user management, departments, SLA policies, and workflows.',
    permissions: ['users.manage', 'departments.manage', 'sla.configure', 'workflows.manage', 'tickets.all'],
  },
  {
    key: 'manager',
    name: 'Department Manager',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    userCount: 14,
    description: 'Department oversight: view all department tickets, reassign agents, monitor SLA breaches, and generate reports.',
    permissions: ['tickets.department_view', 'tickets.assign', 'reports.view', 'sla.monitor'],
  },
  {
    key: 'agent',
    name: 'Support Agent',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    userCount: 42,
    description: 'Frontline ticket handling: reply to customers, post internal notes, update ticket status, and resolve issues.',
    permissions: ['tickets.handle_assigned', 'comments.create_internal', 'tickets.update_status'],
  },
  {
    key: 'customer',
    name: 'End Customer / Client',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    userCount: 850,
    description: 'Customer portal access: create support requests, track status timeline, reply, and access Knowledge Base.',
    permissions: ['portal.access', 'tickets.create_self', 'tickets.reply_self'],
  },
];

export const RolesPage: FC = () => {
  const [roles] = useState<RoleConfig[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(MOCK_ROLES[1]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            Roles & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure system access control levels, granular permissions, and security policies
          </p>
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
                className={`surface-card p-4 space-y-2 cursor-pointer transition-all hover:border-indigo-500/40 ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${role.badgeColor}`}>
                    {role.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {role.userCount} users
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{role.description}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Role Permissions Inspector */}
        <div className="lg:col-span-7">
          <div className="surface-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
              <div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${selectedRole.badgeColor}`}>
                  {selectedRole.name}
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">Role Permissions Scope</h2>
              </div>
              <button
                onClick={() => toast.success(`Permissions updated for ${selectedRole.name}`)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Save Permission Matrix
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-500" /> Active Granted Permissions ({selectedRole.permissions.length})
              </p>

              <div className="space-y-2">
                {selectedRole.permissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs"
                  >
                    <span className="font-mono text-indigo-400 font-semibold">{perm}</span>
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
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
