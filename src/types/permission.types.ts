// ============================================================
// PERMISSION & ROLE TYPES
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'company_admin'
  | 'manager'
  | 'agent'
  | 'customer';

export type Permission =
  // Tickets
  | 'tickets.view'
  | 'tickets.create'
  | 'tickets.edit'
  | 'tickets.delete'
  | 'tickets.assign'
  | 'tickets.merge'
  | 'tickets.transfer'
  | 'tickets.close'
  | 'tickets.reopen'
  | 'tickets.view_internal_notes'
  | 'tickets.add_internal_notes'
  // Users
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.invite'
  | 'users.manage_roles'
  // Organizations
  | 'organizations.view'
  | 'organizations.create'
  | 'organizations.edit'
  | 'organizations.delete'
  | 'organizations.manage_subscription'
  // Departments
  | 'departments.view'
  | 'departments.create'
  | 'departments.edit'
  | 'departments.delete'
  // Teams
  | 'teams.view'
  | 'teams.create'
  | 'teams.edit'
  | 'teams.delete'
  // Roles
  | 'roles.view'
  | 'roles.create'
  | 'roles.edit'
  | 'roles.delete'
  // Reports
  | 'reports.view'
  | 'reports.export'
  | 'reports.view_all'
  // SLA
  | 'sla.view'
  | 'sla.create'
  | 'sla.edit'
  | 'sla.delete'
  // Workflows
  | 'workflows.view'
  | 'workflows.create'
  | 'workflows.edit'
  | 'workflows.delete'
  // Settings
  | 'settings.view'
  | 'settings.edit'
  | 'settings.manage_integrations'
  // Knowledge Base
  | 'knowledge_base.view'
  | 'knowledge_base.create'
  | 'knowledge_base.edit'
  | 'knowledge_base.delete'
  // Customers
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  // Wildcard (Super Admin)
  | '*';

export const ROLE_LABEL_MAP: Record<UserRole, string> = {
  super_admin:   'Super Admin',
  company_admin: 'Company Admin',
  manager:       'Manager',
  agent:         'Agent',
  customer:      'Customer',
};

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: ['*'],
  company_admin: [
    'tickets.view', 'tickets.create', 'tickets.edit', 'tickets.delete',
    'tickets.assign', 'tickets.merge', 'tickets.transfer', 'tickets.close',
    'tickets.reopen', 'tickets.view_internal_notes', 'tickets.add_internal_notes',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.invite', 'users.manage_roles',
    'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
    'teams.view', 'teams.create', 'teams.edit', 'teams.delete',
    'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
    'reports.view', 'reports.export', 'reports.view_all',
    'sla.view', 'sla.create', 'sla.edit', 'sla.delete',
    'workflows.view', 'workflows.create', 'workflows.edit', 'workflows.delete',
    'settings.view', 'settings.edit', 'settings.manage_integrations',
    'knowledge_base.view', 'knowledge_base.create', 'knowledge_base.edit', 'knowledge_base.delete',
    'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
  ],
  manager: [
    'tickets.view', 'tickets.create', 'tickets.edit', 'tickets.assign',
    'tickets.close', 'tickets.reopen', 'tickets.view_internal_notes', 'tickets.add_internal_notes',
    'users.view', 'departments.view', 'teams.view',
    'reports.view', 'reports.export',
    'sla.view', 'workflows.view',
    'customers.view', 'customers.create', 'customers.edit',
    'knowledge_base.view',
  ],
  agent: [
    'tickets.view', 'tickets.create', 'tickets.edit', 'tickets.close',
    'tickets.reopen', 'tickets.add_internal_notes',
    'customers.view', 'knowledge_base.view',
  ],
  customer: [
    'tickets.view', 'tickets.create',
    'knowledge_base.view',
  ],
};
