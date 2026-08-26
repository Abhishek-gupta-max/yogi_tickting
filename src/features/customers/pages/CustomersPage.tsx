import type { FC } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UserCheck, Plus, Search, Mail, Phone, Building,
  Ticket, MoreVertical, X, Loader2,
  Building2, Star,
} from 'lucide-react';
import { formatUtils } from '@/shared/utils';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface Customer {
  id: string; name: string; email: string; phone: string; company: string;
  tier: 'Enterprise' | 'Pro' | 'Starter'; openTickets: number; totalTickets: number;
  csat: number; status: 'Active' | 'Pending' | 'Disabled'; location: string; lastActivity: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c-1', name: 'David Miller',  email: 'david@acme.com',    phone: '+1 (555) 234-5678', company: 'Acme Enterprises', tier: 'Enterprise', openTickets: 3, totalTickets: 24, csat: 98, status: 'Active', location: 'San Francisco, CA', lastActivity: '2h ago' },
  { id: 'c-2', name: 'Rachel Green',  email: 'rachel@globex.com', phone: '+1 (555) 876-5432', company: 'Globex Corp',      tier: 'Enterprise', openTickets: 1, totalTickets: 15, csat: 100, status: 'Active', location: 'New York, NY', lastActivity: '5h ago' },
  { id: 'c-3', name: 'Robert Chen',   email: 'rchen@apex.io',     phone: '+1 (555) 345-6789', company: 'Apex Systems',     tier: 'Pro',        openTickets: 0, totalTickets: 8,  csat: 95, status: 'Active', location: 'Austin, TX', lastActivity: '1d ago' },
  { id: 'c-4', name: 'Kenji Sato',    email: 'sato@tokyotech.jp', phone: '+81 3 1234 5678',   company: 'Tokyo Tech Labs',  tier: 'Enterprise', openTickets: 5, totalTickets: 42, csat: 96, status: 'Active', location: 'Tokyo, Japan', lastActivity: '30m ago' },
  { id: 'c-5', name: 'Emily Watson',  email: 'emily@horizon.co',  phone: '+44 20 7946 0912',  company: 'Horizon Media',    tier: 'Pro',        openTickets: 2, totalTickets: 11, csat: 92, status: 'Active', location: 'London, UK', lastActivity: '3h ago' },
  { id: 'c-6', name: 'Carlos Mendez', email: 'carlos@solaris.es', phone: '+34 91 123 4567',   company: 'Solaris Energy',   tier: 'Starter',    openTickets: 0, totalTickets: 3,  csat: 90, status: 'Pending', location: 'Madrid, Spain', lastActivity: '5d ago' },
];

const TIER_BADGE: Record<string, string> = {
  Enterprise: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]',
  Pro:        'bg-blue-500/10 text-blue-600',
  Starter:    'bg-slate-500/10 text-slate-500',
};

const STATUS_BADGE: Record<string, string> = {
  Active:   'bg-emerald-500/10 text-emerald-600',
  Pending:  'bg-amber-500/10 text-amber-600',
  Disabled: 'bg-red-500/10 text-red-500',
};

export const CustomersPage: FC = () => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [tier, setTier] = useState<'Enterprise' | 'Pro' | 'Starter'>('Enterprise');

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleAddCustomer = () => {
    if (!name || !email) { toast.error('Please enter name and email'); return; }
    const newCust: Customer = { id: `c-${Date.now()}`, name, email, phone: '+1 (555) 000-0000', company: company || 'Independent', tier, openTickets: 0, totalTickets: 0, csat: 100, status: 'Active', location: 'Remote', lastActivity: 'Just now' };
    setCustomers([newCust, ...customers]);
    toast.success(`Customer ${name} added successfully!`);
    setShowAddModal(false); setName(''); setEmail(''); setCompany('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* ─── Header ─────────────────────────────────── */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Customers</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Client accounts, support tiers, and ticket history</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-enterprise btn-enterprise-primary">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* ─── KPI Stats ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Accounts', value: customers.length, icon: Building2, color: 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]' },
          { label: 'Enterprise', value: customers.filter(c => c.tier === 'Enterprise').length, icon: Star, color: 'text-amber-600 bg-amber-500/10' },
          { label: 'Open Tickets', value: customers.reduce((a, b) => a + b.openTickets, 0), icon: Ticket, color: 'text-blue-600 bg-blue-500/10' },
          { label: 'Avg CSAT', value: '96.8%', icon: UserCheck, color: 'text-emerald-600 bg-emerald-500/10' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi-card flex-row items-center">
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', k.color)}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[var(--text-primary)]">{k.value}</div>
                <div className="text-caption text-[var(--text-muted)]">{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Filter Bar ─────────────────────────────── */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, or company…" className="field-input field-input-sm pl-9" />
        </div>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="field-input field-input-sm w-auto">
          <option value="all">All Tiers</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Pro">Pro</option>
          <option value="Starter">Starter</option>
        </select>
        <span className="text-caption text-[var(--text-muted)] ml-auto">Showing {filtered.length} of {customers.length}</span>
      </div>

      {/* ─── Customers Table ────────────────────────── */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Open Tickets</th>
                <th>Total Tickets</th>
                <th>Status</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelectedCustomer(c)} className="cursor-pointer group">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white font-semibold flex items-center justify-center text-[11px] flex-shrink-0">
                        {formatUtils.initials(c.name)}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{c.name}</div>
                        <span className={clsx('badge text-[10px] mt-0.5', TIER_BADGE[c.tier])}>{c.tier}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[13px] text-[var(--text-secondary)]">{c.company}</td>
                  <td className="text-[13px] text-[var(--text-secondary)]">{c.email}</td>
                  <td className="text-[13px] text-[var(--text-muted)]">{c.phone}</td>
                  <td><span className={clsx('text-[13px] font-semibold', c.openTickets > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]')}>{c.openTickets}</span></td>
                  <td className="text-[13px] text-[var(--text-primary)] font-medium">{c.totalTickets}</td>
                  <td><span className={clsx('badge', STATUS_BADGE[c.status])}>{c.status}</span></td>
                  <td className="text-[13px] text-[var(--text-muted)]">{c.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <UserCheck className="w-10 h-10 text-[var(--text-muted)] opacity-20 mb-2" />
            <p className="text-caption text-[var(--text-muted)]">No customers found</p>
          </div>
        )}
      </div>

      {/* ─── Add Customer Modal ────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="drawer-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-md bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-section-head text-[var(--text-primary)]">Add Customer</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div className="form-field">
                    <label className="form-label">Full Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. David Miller" className="field-input" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Email Address *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="david@company.com" className="field-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-field">
                      <label className="form-label">Company</label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="field-input" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Tier</label>
                      <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="field-input">
                        <option value="Enterprise">Enterprise</option>
                        <option value="Pro">Pro</option>
                        <option value="Starter">Starter</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 btn-enterprise btn-enterprise-secondary">Cancel</button>
                  <button onClick={handleAddCustomer} className="flex-1 btn-enterprise btn-enterprise-primary">Save Customer</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Customer Details Drawer ──────────────── */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="drawer-overlay" onClick={() => setSelectedCustomer(null)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} onClick={(e) => e.stopPropagation()} className="drawer-panel w-full max-w-md p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white font-semibold flex items-center justify-center text-sm">
                    {formatUtils.initials(selectedCustomer.name)}
                  </div>
                  <div>
                    <h2 className="text-section-head text-[var(--text-primary)]">{selectedCustomer.name}</h2>
                    <p className="text-caption text-[var(--text-muted)]">{selectedCustomer.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="p-4 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)] space-y-2.5">
                  {[
                    ['Email', selectedCustomer.email],
                    ['Phone', selectedCustomer.phone],
                    ['Location', selectedCustomer.location],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">{label}</span>
                      <span className="font-medium text-[var(--text-primary)]">{val}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Tier</span>
                    <span className={clsx('badge', TIER_BADGE[selectedCustomer.tier])}>{selectedCustomer.tier}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[var(--color-primary-muted)] border border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-center">
                    <div className="text-lg font-bold text-[var(--color-primary)]">{selectedCustomer.openTickets}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Open Tickets</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-center">
                    <div className="text-lg font-bold text-emerald-600">{selectedCustomer.csat}%</div>
                    <div className="text-[11px] text-[var(--text-muted)]">CSAT</div>
                  </div>
                </div>

                <button onClick={() => { toast.success(`Opening tickets for ${selectedCustomer.name}`); setSelectedCustomer(null); }} className="w-full btn-enterprise btn-enterprise-primary mt-2">
                  <Ticket className="w-4 h-4" /> View Tickets ({selectedCustomer.totalTickets})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
