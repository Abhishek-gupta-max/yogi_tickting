import type { FC } from 'react';
import { useState } from 'react';
import { GitBranch, MapPin, Plus, Building2, Globe, Users, Phone, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  timezone: string;
  headcount: number;
  isHeadquarters: boolean;
}

const MOCK_BRANCHES: Branch[] = [
  {
    id: 'br-hq',
    name: 'San Francisco HQ Global',
    code: 'SFO-01',
    city: 'San Francisco, CA',
    country: 'United States',
    timezone: 'PST (UTC-8)',
    headcount: 140,
    isHeadquarters: true,
  },
  {
    id: 'br-lon',
    name: 'London EMEA Hub',
    code: 'LON-02',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'GMT (UTC+0)',
    headcount: 65,
    isHeadquarters: false,
  },
  {
    id: 'br-tok',
    name: 'Tokyo APAC Regional Center',
    code: 'TYO-03',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'JST (UTC+9)',
    headcount: 45,
    isHeadquarters: false,
  },
  {
    id: 'br-blr',
    name: 'Bengaluru Tech Innovation Center',
    code: 'BLR-04',
    city: 'Bengaluru',
    country: 'India',
    timezone: 'IST (UTC+5:30)',
    headcount: 90,
    isHeadquarters: false,
  },
];

export const BranchesPage: FC = () => {
  const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('PST (UTC-8)');

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created: Branch = {
      id: `br-${Date.now()}`,
      name,
      code: code.toUpperCase() || 'BR-NEW',
      city: city || 'New City',
      country: country || 'United States',
      timezone,
      headcount: 1,
      isHeadquarters: false,
    };

    setBranches([...branches, created]);
    toast.success(`Branch "${created.name}" added!`);
    setShowModal(false);
    setName('');
    setCode('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-indigo-500" />
            Company Branch Locations
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage regional offices, timezones, and location-based SLA dispatching
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {branches.map((b) => (
          <div key={b.id} className="surface-card p-5 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {b.code}
              </span>
              {b.isHeadquarters && (
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  HQ
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)]">{b.name}</h3>

            <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
              <p className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {b.city}, {b.country}
              </p>
              <p className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Timezone: {b.timezone}
              </p>
              <p className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Staff Headcount: {b.headcount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface-card w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-500" /> Add Office Location
            </h2>
            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Office Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sydney Regional Office"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1">Branch Code</label>
                  <input
                    type="text"
                    placeholder="SYD-05"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Sydney"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">Country</label>
                <input
                  type="text"
                  placeholder="Australia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
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
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
