import type { FC } from 'react';
import { useState } from 'react';
import { GitBranch, MapPin, Plus, Globe, Users, X } from 'lucide-react';
import { clsx } from 'clsx';
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
  { id: 'br-hq',  name: 'San Francisco HQ Global',         code: 'SFO-01', city: 'San Francisco, CA', country: 'United States',  timezone: 'PST (UTC-8)',   headcount: 140, isHeadquarters: true },
  { id: 'br-lon', name: 'London EMEA Hub',                 code: 'LON-02', city: 'London',             country: 'United Kingdom', timezone: 'GMT (UTC+0)',   headcount: 65,  isHeadquarters: false },
  { id: 'br-tok', name: 'Tokyo APAC Regional Center',      code: 'TYO-03', city: 'Tokyo',              country: 'Japan',          timezone: 'JST (UTC+9)',   headcount: 45,  isHeadquarters: false },
  { id: 'br-blr', name: 'Bengaluru Tech Innovation Center',code: 'BLR-04', city: 'Bengaluru',          country: 'India',          timezone: 'IST (UTC+5:30)',headcount: 90,  isHeadquarters: false },
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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Branch Locations</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Manage regional offices, timezones, and location-based SLA dispatching</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-enterprise btn-enterprise-primary">
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Timezone</th>
                <th>Staff Count</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-muted)] flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">{b.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-[12px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-muted)] px-2 py-0.5 rounded">
                      {b.code}
                    </span>
                  </td>
                  <td className="text-[13px] text-[var(--text-primary)]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {b.city}, {b.country}
                    </span>
                  </td>
                  <td className="text-[13px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {b.timezone}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-primary)] font-medium">
                      <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {b.headcount}
                    </span>
                  </td>
                  <td>
                    {b.isHeadquarters ? (
                      <span className="badge bg-emerald-500/10 text-emerald-600">Headquarters</span>
                    ) : (
                      <span className="badge bg-slate-500/10 text-slate-500">Regional Branch</span>
                    )}
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
                <h2 className="text-section-head text-[var(--text-primary)]">Add Office Location</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div className="form-field">
                  <label className="form-label">Office Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sydney Regional Office"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="form-field">
                    <label className="form-label">Branch Code</label>
                    <input
                      type="text"
                      placeholder="SYD-05"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="field-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      placeholder="Sydney"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    placeholder="Australia"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="field-input"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-enterprise btn-enterprise-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-enterprise btn-enterprise-primary">
                    Add Branch
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
