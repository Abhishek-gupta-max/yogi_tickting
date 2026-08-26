import type { FC } from 'react';
import { useState } from 'react';
import { FolderTree, Plus, Search, Mail, X, Users, Clock, Ticket, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Department {
  id: string; name: string; code: string; lead: string; email: string;
  memberCount: number; openTicketCount: number; slaTarget: string; status: 'active' | 'inactive';
}

const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-it',      name: 'IT Helpdesk & Infrastructure',    code: 'IT-HD', lead: 'Marcus Brody',     email: 'it-support@ticketflow.io',  memberCount: 12, openTicketCount: 8,  slaTarget: '2 Hours',  status: 'active' },
  { id: 'dept-eng',     name: 'Software Engineering',            code: 'SWE',   lead: 'Sophia Martinez',  email: 'eng-leads@ticketflow.io',   memberCount: 28, openTicketCount: 14, slaTarget: '4 Hours',  status: 'active' },
  { id: 'dept-devops',  name: 'DevOps & Cloud Security',         code: 'OPS',   lead: 'Alexander Wright', email: 'devops@ticketflow.io',      memberCount: 8,  openTicketCount: 3,  slaTarget: '1 Hour',   status: 'active' },
  { id: 'dept-finance', name: 'Billing & Enterprise Finance',    code: 'FIN',   lead: 'Rachel Green',     email: 'billing@ticketflow.io',     memberCount: 6,  openTicketCount: 2,  slaTarget: '8 Hours',  status: 'active' },
  { id: 'dept-hr',      name: 'Human Resources & Talent',        code: 'HR',    lead: 'Jessica Taylor',   email: 'hr@ticketflow.io',          memberCount: 5,  openTicketCount: 1,  slaTarget: '12 Hours', status: 'active' },
];

export const DepartmentsPage: FC = () => {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptLead, setNewDeptLead] = useState('');
  const [newDeptEmail, setNewDeptEmail] = useState('');

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase()) || d.lead.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) { toast.error('Department Name and Code are required.'); return; }
    const created: Department = { id: `dept-${Date.now()}`, name: newDeptName, code: newDeptCode.toUpperCase(), lead: newDeptLead || 'Unassigned', email: newDeptEmail || `${newDeptCode.toLowerCase()}@ticketflow.io`, memberCount: 1, openTicketCount: 0, slaTarget: '4 Hours', status: 'active' };
    setDepartments([created, ...departments]);
    toast.success(`Department "${created.name}" created!`);
    setShowAddModal(false); setNewDeptName(''); setNewDeptCode(''); setNewDeptLead(''); setNewDeptEmail('');
  };

  const handleToggleStatus = (id: string) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d)));
    toast.success('Department status updated');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Departments</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Organize teams, SLA targets, and ticket routing</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-enterprise btn-enterprise-primary">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Filter */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search departments or leads…" value={search} onChange={(e) => setSearch(e.target.value)} className="field-input field-input-sm pl-9" />
        </div>
        <span className="text-caption text-[var(--text-muted)] ml-auto">{filtered.length} of {departments.length} departments</span>
      </div>

      {/* Departments Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Department</th>
                <th>Code</th>
                <th>Lead</th>
                <th>Email</th>
                <th>Members</th>
                <th>Open Tickets</th>
                <th>SLA Target</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => (
                <tr key={dept.id} className="group">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-muted)] flex items-center justify-center flex-shrink-0">
                        <FolderTree className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{dept.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-[12px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-muted)] px-2 py-0.5 rounded">{dept.code}</span>
                  </td>
                  <td className="text-[13px] font-medium text-[var(--text-primary)]">{dept.lead}</td>
                  <td className="text-[13px] text-[var(--text-muted)]">{dept.email}</td>
                  <td>
                    <span className="flex items-center gap-1 text-[13px] text-[var(--text-primary)]">
                      <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {dept.memberCount}
                    </span>
                  </td>
                  <td>
                    <span className={clsx('text-[13px] font-semibold', dept.openTicketCount > 0 ? 'text-amber-600' : 'text-[var(--text-muted)]')}>
                      {dept.openTicketCount}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-[13px] text-[var(--color-primary)]">
                      <Clock className="w-3.5 h-3.5" /> {dept.slaTarget}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleToggleStatus(dept.id)} className={clsx('badge cursor-pointer', dept.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500')}>
                      <CheckCircle className="w-3 h-3" /> {dept.status}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toast.success(`Configure ${dept.name}`)} className="text-[13px] font-medium text-[var(--color-primary)] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      Configure →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderTree className="w-10 h-10 text-[var(--text-muted)] opacity-20 mb-2" />
            <p className="text-caption text-[var(--text-muted)]">No departments found</p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="drawer-overlay" onClick={() => setShowAddModal(false)}>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-md bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-6 space-y-4 shadow-xl animate-scale-in">
              <div className="flex items-center justify-between">
                <h2 className="text-section-head text-[var(--text-primary)]">Add Department</h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div className="form-field">
                  <label className="form-label">Department Name *</label>
                  <input type="text" placeholder="e.g. Facilities & Operations" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="field-input" required />
                </div>
                <div className="form-field">
                  <label className="form-label">Department Code *</label>
                  <input type="text" placeholder="e.g. FAC" value={newDeptCode} onChange={(e) => setNewDeptCode(e.target.value)} className="field-input" required />
                </div>
                <div className="form-field">
                  <label className="form-label">Department Lead</label>
                  <input type="text" placeholder="e.g. Sarah Jenkins" value={newDeptLead} onChange={(e) => setNewDeptLead(e.target.value)} className="field-input" />
                </div>
                <div className="form-field">
                  <label className="form-label">Contact Email</label>
                  <input type="email" placeholder="e.g. facilities@ticketflow.io" value={newDeptEmail} onChange={(e) => setNewDeptEmail(e.target.value)} className="field-input" />
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-enterprise btn-enterprise-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-enterprise btn-enterprise-primary">Create Department</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
