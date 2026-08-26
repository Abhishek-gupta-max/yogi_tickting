import type { FC } from 'react';
import { useState } from 'react';
import { ShieldCheck, Check, Minus, Users } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface RoleConfig {
  key: string;
  name: string;
  badgeColor: string;
  userCount: number;
  description: string;
}

const MOCK_ROLES: RoleConfig[] = [
  { key: 'super_admin',   name: 'Super Admin',         badgeColor: 'bg-purple-500/10 text-purple-600',            userCount: 2,   description: 'Full global platform control, multi-tenant billing, system logs, and org provisioning.' },
  { key: 'company_admin', name: 'Company Admin',       badgeColor: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]', userCount: 5,   description: 'Organization administration: user management, departments, SLA policies, and workflows.' },
  { key: 'manager',       name: 'Department Manager', badgeColor: 'bg-amber-500/10 text-amber-600',             userCount: 14,  description: 'Department oversight: view all department tickets, reassign agents, monitor SLA breaches, and generate reports.' },
  { key: 'agent',         name: 'Support Agent',       badgeColor: 'bg-emerald-500/10 text-emerald-600',           userCount: 42,  description: 'Frontline ticket handling: reply to customers, post internal notes, update ticket status, and resolve issues.' },
  { key: 'customer',      name: 'End Customer / Client',badgeColor: 'bg-blue-500/10 text-blue-600',              userCount: 850, description: 'Customer portal access: create support requests, track status timeline, reply, and access Knowledge Base.' },
];

const MODULE_PERMISSIONS: { module: string; permissions: Record<string, Record<string, boolean>> }[] = [
  {
    module: 'Tickets',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: true },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: true },
      manager:       { view: true,  create: true,  edit: true,  delete: false, assign: true },
      agent:         { view: true,  create: true,  edit: true,  delete: false, assign: true },
      customer:      { view: true,  create: true,  edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'Users',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      manager:       { view: true,  create: true,  edit: true,  delete: false, assign: false },
      agent:         { view: true,  create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'Departments',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: true },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: true },
      manager:       { view: true,  create: false, edit: false, delete: false, assign: false },
      agent:         { view: true,  create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'Teams',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: true },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: true },
      manager:       { view: true,  create: true,  edit: true,  delete: false, assign: true },
      agent:         { view: true,  create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'SLA Policies',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      manager:       { view: true,  create: false, edit: false, delete: false, assign: false },
      agent:         { view: true,  create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'Workflows',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      manager:       { view: true,  create: false, edit: false, delete: false, assign: false },
      agent:         { view: false, create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'Reports & Analytics',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      company_admin: { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      manager:       { view: true,  create: true,  edit: false, delete: false, assign: false },
      agent:         { view: true,  create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
  {
    module: 'Settings',
    permissions: {
      super_admin:   { view: true,  create: true,  edit: true,  delete: true,  assign: false },
      company_admin: { view: true,  create: true,  edit: true,  delete: false, assign: false },
      manager:       { view: false, create: false, edit: false, delete: false, assign: false },
      agent:         { view: false, create: false, edit: false, delete: false, assign: false },
      customer:      { view: false, create: false, edit: false, delete: false, assign: false },
    },
  },
];

const PERM_ACTIONS = ['view', 'create', 'edit', 'delete', 'assign'] as const;

export const RolesPage: FC = () => {
  const [roles] = useState<RoleConfig[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(MOCK_ROLES[1]);
  const [matrix, setMatrix] = useState(MODULE_PERMISSIONS);

  const togglePerm = (moduleIndex: number, action: string) => {
    setMatrix(prev => prev.map((m, idx) => {
      if (idx !== moduleIndex) return m;
      const rolePerms = m.permissions[selectedRole.key] || {};
      return {
        ...m,
        permissions: {
          ...m.permissions,
          [selectedRole.key]: {
            ...rolePerms,
            [action]: !rolePerms[action],
          },
        },
      };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Roles & Access Control</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Configure system access levels, granular permission matrix, and security scopes</p>
        </div>
        <button onClick={() => toast.success(`Saved permission matrix for ${selectedRole.name}`)} className="btn-enterprise btn-enterprise-primary">
          Save Matrix
        </button>
      </div>

      {/* Grid: Role Cards vs Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Role Cards */}
        <div className="lg:col-span-4 space-y-3">
          {roles.map((role) => {
            const isSelected = selectedRole.key === role.key;
            return (
              <div
                key={role.key}
                onClick={() => setSelectedRole(role)}
                className={clsx(
                  'surface-card p-4 space-y-2 cursor-pointer transition-all',
                  isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' : 'hover:border-[var(--color-primary)]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={clsx('badge', role.badgeColor)}>{role.name}</span>
                  <span className="text-caption text-[var(--text-muted)] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {role.userCount} users
                  </span>
                </div>
                <p className="text-caption text-[var(--text-secondary)] leading-relaxed">{role.description}</p>
              </div>
            );
          })}
        </div>

        {/* Matrix Inspector */}
        <div className="lg:col-span-8">
          <div className="surface-card overflow-hidden">
            <div className="p-4 border-b border-[var(--surface-border)] flex items-center justify-between">
              <div>
                <span className={clsx('badge mb-1', selectedRole.badgeColor)}>{selectedRole.name}</span>
                <h2 className="text-section-head text-[var(--text-primary)]">Granular Permission Matrix</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table-enterprise">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th className="text-center">View</th>
                    <th className="text-center">Create</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                    <th className="text-center">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, idx) => {
                    const rolePerms = row.permissions[selectedRole.key] || {};
                    return (
                      <tr key={row.module}>
                        <td className="font-medium text-[var(--text-primary)]">{row.module}</td>
                        {PERM_ACTIONS.map((action) => {
                          const isAllowed = !!rolePerms[action];
                          return (
                            <td key={action} className="text-center">
                              <button
                                onClick={() => togglePerm(idx, action)}
                                className={clsx(
                                  'w-7 h-7 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer',
                                  isAllowed
                                    ? 'bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-[var(--surface-bg)] text-[var(--text-muted)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)]'
                                )}
                                title={`${action.toUpperCase()} ${row.module}`}
                              >
                                {isAllowed ? <Check className="w-4 h-4 stroke-[3]" /> : <Minus className="w-3 h-3" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
