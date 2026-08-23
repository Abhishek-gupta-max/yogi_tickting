import type { FC } from 'react';
import { useState } from 'react';
import { UsersRound, Plus, FolderTree, Shield, Search, CheckCircle2, UserPlus, Mail } from 'lucide-react';
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
  {
    id: 'team-sec',
    name: 'Security & Auth Response Squad',
    department: 'Software Engineering',
    lead: 'Sophia Martinez',
    members: ['Sophia Martinez', 'David Miller', 'Alex Chen', 'Elena Rostova'],
    activeTickets: 5,
  },
  {
    id: 'team-l1',
    name: 'Tier-1 Helpdesk Frontline',
    department: 'IT Helpdesk',
    lead: 'Marcus Brody',
    members: ['Marcus Brody', 'Sarah Connor', 'John Doe', 'Emily Watson', 'Tom Hanks'],
    activeTickets: 12,
  },
  {
    id: 'team-cloud',
    name: 'Kubernetes & Infrastructure Ops',
    department: 'DevOps & Cloud Security',
    lead: 'Alexander Wright',
    members: ['Alexander Wright', 'Viktor Krum', 'Hermione Granger'],
    activeTickets: 3,
  },
  {
    id: 'team-billing',
    name: 'Enterprise Billing & Invoicing',
    department: 'Billing & Finance',
    lead: 'Rachel Green',
    members: ['Rachel Green', 'Monica Geller', 'Chandler Bing'],
    activeTickets: 2,
  },
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
    toast.success(`Team "${created.name}" created successfully!`);
    setShowModal(false);
    setNewTeamName('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <UsersRound className="w-6 h-6 text-indigo-500" />
            Support Teams & Rosters
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure sub-teams, assign agents, and manage ticket distribution pools
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Team
        </button>
      </div>

      {/* Search */}
      <div className="surface-card p-4 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams or departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <span className="text-xs text-[var(--text-muted)]">{filtered.length} Teams Active</span>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((team) => (
          <div key={team.id} className="surface-card p-5 space-y-4 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {team.department}
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">{team.name}</h3>
              </div>
              <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                {team.activeTickets} Active Tickets
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[var(--text-muted)]">Team Lead: <strong className="text-[var(--text-primary)]">{team.lead}</strong></p>
              <div>
                <p className="text-[var(--text-muted)] mb-1.5 font-semibold">Assigned Agents ({team.members.length}):</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {team.members.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] text-[11px] font-medium"
                    >
                      {m}
                    </span>
                  ))}
                  <button
                    onClick={() => toast.success(`Add member to ${team.name}`)}
                    className="p-1 rounded-lg border border-dashed border-indigo-500/40 text-indigo-500 hover:bg-indigo-500/10"
                    title="Add Team Member"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-indigo-500" /> Create New Support Team
            </h2>
            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Team Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile iOS Support Squad"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none"
                >
                  <option value="IT Helpdesk">IT Helpdesk</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="DevOps & Cloud Security">DevOps & Cloud Security</option>
                  <option value="Billing & Finance">Billing & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Team Lead</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Martinez"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[var(--surface-border)] pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--surface-border)] text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 font-semibold"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
