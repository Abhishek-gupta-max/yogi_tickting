import type { FC } from 'react';
import { useState } from 'react';
import { FolderTree, Plus, Users, Clock, Mail, Search, CheckCircle2, Shield, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Department {
  id: string;
  name: string;
  code: string;
  lead: string;
  email: string;
  memberCount: number;
  openTicketCount: number;
  slaTarget: string;
  status: 'active' | 'inactive';
}

const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dept-it',
    name: 'IT Helpdesk & Infrastructure',
    code: 'IT-HD',
    lead: 'Marcus Brody',
    email: 'it-support@ticketflow.io',
    memberCount: 12,
    openTicketCount: 8,
    slaTarget: '2 Hours',
    status: 'active',
  },
  {
    id: 'dept-eng',
    name: 'Software Engineering',
    code: 'SWE',
    lead: 'Sophia Martinez',
    email: 'eng-leads@ticketflow.io',
    memberCount: 28,
    openTicketCount: 14,
    slaTarget: '4 Hours',
    status: 'active',
  },
  {
    id: 'dept-devops',
    name: 'DevOps & Cloud Security',
    code: 'OPS',
    lead: 'Alexander Wright',
    email: 'devops@ticketflow.io',
    memberCount: 8,
    openTicketCount: 3,
    slaTarget: '1 Hour',
    status: 'active',
  },
  {
    id: 'dept-finance',
    name: 'Billing & Enterprise Finance',
    code: 'FIN',
    lead: 'Rachel Green',
    email: 'billing@ticketflow.io',
    memberCount: 6,
    openTicketCount: 2,
    slaTarget: '8 Hours',
    status: 'active',
  },
  {
    id: 'dept-hr',
    name: 'Human Resources & Talent',
    code: 'HR',
    lead: 'Jessica Taylor',
    email: 'hr@ticketflow.io',
    memberCount: 5,
    openTicketCount: 1,
    slaTarget: '12 Hours',
    status: 'active',
  },
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
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.lead.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) {
      toast.error('Department Name and Code are required.');
      return;
    }

    const created: Department = {
      id: `dept-${Date.now()}`,
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      lead: newDeptLead || 'Unassigned Lead',
      email: newDeptEmail || `${newDeptCode.toLowerCase()}@ticketflow.io`,
      memberCount: 1,
      openTicketCount: 0,
      slaTarget: '4 Hours',
      status: 'active',
    };

    setDepartments([created, ...departments]);
    toast.success(`Department "${created.name}" created!`);
    setShowAddModal(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptLead('');
    setNewDeptEmail('');
  };

  const handleToggleStatus = (id: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d))
    );
    toast.success('Department status updated');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-indigo-500" />
            Department Management
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Organize support teams, SLA targets, and ticket routing across company departments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Search & Filter */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search departments or leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <span className="text-xs text-[var(--text-muted)]">Showing {filtered.length} of {departments.length} departments</span>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((dept) => (
          <div
            key={dept.id}
            className="surface-card p-5 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  {dept.code}
                </span>
                <button
                  onClick={() => handleToggleStatus(dept.id)}
                  className={clsx(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full capitalize cursor-pointer transition-colors',
                    dept.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  {dept.status}
                </button>
              </div>

              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{dept.name}</h3>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mb-3">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> {dept.email}
              </p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Members</span>
                  <span className="font-bold text-[var(--text-primary)]">{dept.memberCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Open Tickets</span>
                  <span className="font-bold text-amber-500">{dept.openTicketCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">SLA Target</span>
                  <span className="font-bold text-indigo-500">{dept.slaTarget}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-3 text-xs text-[var(--text-muted)]">
              <span>Lead: <strong className="text-[var(--text-primary)]">{dept.lead}</strong></span>
              <button
                onClick={() => toast.success(`Managing ${dept.name}`)}
                className="text-indigo-500 hover:text-indigo-400 font-semibold"
              >
                Configure →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-500" /> Add New Department
            </h2>
            <form onSubmit={handleCreateDepartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Facilities & Operations"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Department Code</label>
                <input
                  type="text"
                  placeholder="e.g. FAC"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Department Lead</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={newDeptLead}
                  onChange={(e) => setNewDeptLead(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  placeholder="e.g. facilities@ticketflow.io"
                  value={newDeptEmail}
                  onChange={(e) => setNewDeptEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[var(--surface-border)] pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--surface-border)] text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 font-semibold"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
