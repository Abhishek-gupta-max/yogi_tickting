import type { FC } from 'react';
import { useState } from 'react';
import { UsersRound, Plus, Search, UserPlus, Users, Ticket, X } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Team {
  id: string;
  name: string;
  department: string;
  lead: string;
  members: string[];
  activeTickets: number;
}

const MOCK_TEAMS: Team[] = [
  { id: 'team-sec',   name: 'Security & Auth Response Squad',  department: 'Software Engineering',   lead: 'Sophia Martinez',  members: ['Sophia Martinez', 'David Miller', 'Alex Chen', 'Elena Rostova'], activeTickets: 5 },
  { id: 'team-l1',    name: 'Tier-1 Helpdesk Frontline',        department: 'IT Helpdesk',           lead: 'Marcus Brody',     members: ['Marcus Brody', 'Sarah Connor', 'John Doe', 'Emily Watson', 'Tom Hanks'], activeTickets: 12 },
  { id: 'team-cloud', name: 'Kubernetes & Infrastructure Ops',  department: 'DevOps & Cloud Security',lead: 'Alexander Wright', members: ['Alexander Wright', 'Viktor Krum', 'Hermione Granger'], activeTickets: 3 },
  { id: 'team-billing',name: 'Enterprise Billing & Invoicing',   department: 'Billing & Finance',     lead: 'Rachel Green',     members: ['Rachel Green', 'Monica Geller', 'Chandler Bing'], activeTickets: 2 },
];

export const TeamsPage: FC = () => {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newDept, setNewDept] = useState('IT Helpdesk');
  const [newLead, setNewLead] = useState('');

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.lead.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const created: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      department: newDept,
      lead: newLead || 'Team Lead',
      members: [newLead || 'Team Lead', 'Member 1'],
      activeTickets: 0,
    };

    setTeams([created, ...teams]);
    toast.success(`Team "${created.name}" created!`);
    setShowModal(false);
    setNewTeamName('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Teams & Rosters</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Configure sub-teams, assign agents, and manage ticket distribution pools</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-enterprise btn-enterprise-primary">
          <Plus className="w-4 h-4" /> Create Team
        </button>
      </div>

      {/* Search */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search teams or departments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-input field-input-sm pl-9"
          />
        </div>
        <span className="text-caption text-[var(--text-muted)] ml-auto">{filtered.length} Teams Active</span>
      </div>

      {/* Teams Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Department</th>
                <th>Team Lead</th>
                <th>Members</th>
                <th>Active Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team) => (
                <tr key={team.id} className="group">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-muted)] flex items-center justify-center flex-shrink-0">
                        <UsersRound className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{team.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-[12px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-muted)] px-2 py-0.5 rounded">
                      {team.department}
                    </span>
                  </td>
                  <td className="text-[13px] font-medium text-[var(--text-primary)]">{team.lead}</td>
                  <td>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[13px] text-[var(--text-secondary)] font-medium mr-1">{team.members.length} agents:</span>
                      {team.members.slice(0, 3).map((m, idx) => (
                        <span key={idx} className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-muted)]">
                          {m.split(' ')[0]}
                        </span>
                      ))}
                      {team.members.length > 3 && (
                        <span className="text-[11px] text-[var(--text-muted)]">+{team.members.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={clsx('text-[13px] font-semibold', team.activeTickets > 0 ? 'text-amber-600' : 'text-[var(--text-muted)]')}>
                      {team.activeTickets}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toast.success(`Manage ${team.name}`)}
                      className="text-[13px] font-medium text-[var(--color-primary)] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="drawer-overlay" onClick={() => setShowModal(false)}>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-md bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-6 space-y-4 shadow-xl animate-scale-in">
              <div className="flex items-center justify-between">
                <h2 className="text-section-head text-[var(--text-primary)]">Create Support Team</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="form-field">
                  <label className="form-label">Team Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mobile Support Squad"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="field-input"
                  >
                    <option value="IT Helpdesk">IT Helpdesk</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="DevOps & Cloud Security">DevOps & Cloud Security</option>
                    <option value="Billing & Finance">Billing & Finance</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Team Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Martinez"
                    value={newLead}
                    onChange={(e) => setNewLead(e.target.value)}
                    className="field-input"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-enterprise btn-enterprise-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-enterprise btn-enterprise-primary">
                    Save Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
