import type { FC } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, Plus, Search, Mail, Phone, Building, ExternalLink,
  Ticket, CheckCircle, Shield, MoreVertical, X, Loader2, Sparkles,
  Building2, Globe, Star, ArrowUpRight, Filter,
} from 'lucide-react';
import { formatUtils } from '@/shared/utils';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tier: 'Enterprise' | 'Pro' | 'Starter';
  openTickets: number;
  totalTickets: number;
  csat: number;
  status: 'Active' | 'Pending' | 'Disabled';
  location: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c-1', name: 'David Miller',    email: 'david@acme.com',      phone: '+1 (555) 234-5678', company: 'Acme Enterprises',   tier: 'Enterprise', openTickets: 3, totalTickets: 24, csat: 98, status: 'Active', location: 'San Francisco, CA' },
  { id: 'c-2', name: 'Rachel Green',    email: 'rachel@globex.com',   phone: '+1 (555) 876-5432', company: 'Globex Corp',        tier: 'Enterprise', openTickets: 1, totalTickets: 15, csat: 100, status: 'Active', location: 'New York, NY' },
  { id: 'c-3', name: 'Robert Chen',     email: 'rchen@apex.io',       phone: '+1 (555) 345-6789', company: 'Apex Systems',       tier: 'Pro',        openTickets: 0, totalTickets: 8,  csat: 95, status: 'Active', location: 'Austin, TX' },
  { id: 'c-4', name: 'Kenji Sato',      email: 'sato@tokyotech.jp',   phone: '+81 3 1234 5678',   company: 'Tokyo Tech Labs',    tier: 'Enterprise', openTickets: 5, totalTickets: 42, csat: 96, status: 'Active', location: 'Tokyo, Japan' },
  { id: 'c-5', name: 'Emily Watson',    email: 'emily@horizon.co',    phone: '+44 20 7946 0912',  company: 'Horizon Media',      tier: 'Pro',        openTickets: 2, totalTickets: 11, csat: 92, status: 'Active', location: 'London, UK' },
  { id: 'c-6', name: 'Carlos Mendez',   email: 'carlos@solaris.es',   phone: '+34 91 123 4567',   company: 'Solaris Energy',     tier: 'Starter',    openTickets: 0, totalTickets: 3,  csat: 90, status: 'Pending', location: 'Madrid, Spain' },
];

const TIER_BADGES: Record<string, string> = {
  Enterprise: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-extrabold',
  Pro:        'bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold',
  Starter:    'bg-slate-500/10 text-slate-500 border-slate-500/20 font-medium',
};

export const CustomersPage: FC = () => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [tier, setTier] = useState<'Enterprise' | 'Pro' | 'Starter'>('Enterprise');

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleAddCustomer = () => {
    if (!name || !email) {
      toast.error('Please enter name and email');
      return;
    }
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      name,
      email,
      phone: '+1 (555) 000-0000',
      company: company || 'Independent',
      tier,
      openTickets: 0,
      totalTickets: 0,
      csat: 100,
      status: 'Active',
      location: 'Remote',
    };
    setCustomers([newCust, ...customers]);
    toast.success(`Customer ${name} added successfully!`);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setCompany('');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* ─── Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-500" /> Customer Directory & Accounts
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Client accounts, support entitlement tiers, contact details, and ticket history
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </motion.button>
      </div>

      {/* ─── KPI Stats Bar ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Client Accounts', value: customers.length, icon: Building2, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Enterprise Tier Clients', value: customers.filter(c => c.tier === 'Enterprise').length, icon: Star, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Active Support Tickets', value: customers.reduce((a, b) => a + b.openTickets, 0), icon: Ticket, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Avg Customer CSAT', value: '96.8%', icon: Sparkles, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} whileHover={{ y: -2 }} className="surface-card-premium p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[var(--text-primary)]">{k.value}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{k.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Filter Bar ─────────────────────────────────────── */}
      <div className="surface-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or company..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="Enterprise">Enterprise Tier</option>
            <option value="Pro">Pro Tier</option>
            <option value="Starter">Starter Tier</option>
          </select>
        </div>

        <span className="text-xs text-[var(--text-muted)] ml-auto">
          Showing {filtered.length} of {customers.length} clients
        </span>
      </div>

      {/* ─── Customer Cards Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <motion.div
            key={c.id}
            onClick={() => setSelectedCustomer(c)}
            whileHover={{ y: -3 }}
            className="surface-card p-5 space-y-4 hover:border-indigo-500/40 cursor-pointer transition-all shadow-xs hover:shadow-md hover:shadow-indigo-500/5 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {formatUtils.initials(c.name)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] truncate">{c.email}</p>
                </div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TIER_BADGES[c.tier]}`}>
                {c.tier}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--surface-border)] text-xs text-[var(--text-muted)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
                  <Building className="w-3.5 h-3.5 text-indigo-500" /> {c.company}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">{c.location}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                  <strong className="text-[var(--text-primary)]">{c.openTickets}</strong> open / {c.totalTickets} total
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <Star className="w-3 h-3 fill-current" /> {c.csat}% CSAT
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Add Customer Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="drawer-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="w-full max-w-md surface-card p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                  <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-500" /> Add Customer Account
                  </h2>
                  <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="david@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tier</label>
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none"
                      >
                        <option value="Enterprise">Enterprise</option>
                        <option value="Pro">Pro</option>
                        <option value="Starter">Starter</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[var(--surface-border)]">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCustomer}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md shadow-indigo-500/20"
                  >
                    Save Customer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Customer Details Drawer ──────────────────────────── */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="drawer-overlay" onClick={() => setSelectedCustomer(null)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="drawer-panel w-full max-w-md p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {formatUtils.initials(selectedCustomer.name)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">{selectedCustomer.name}</h2>
                    <p className="text-xs text-[var(--text-muted)]">{selectedCustomer.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-1.5 rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Email</span>
                    <span className="font-semibold text-[var(--text-primary)]">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Phone</span>
                    <span className="font-semibold text-[var(--text-primary)]">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Support Tier</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TIER_BADGES[selectedCustomer.tier]}`}>
                      {selectedCustomer.tier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Location</span>
                    <span className="font-semibold text-[var(--text-primary)]">{selectedCustomer.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-center">
                    <div className="text-lg font-extrabold text-indigo-500">{selectedCustomer.openTickets}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Open Tickets</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
                    <div className="text-lg font-extrabold text-emerald-500">{selectedCustomer.csat}%</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Satisfaction Rating</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      toast.success(`Opening tickets for ${selectedCustomer.name}`);
                      setSelectedCustomer(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                  >
                    <Ticket className="w-4 h-4" /> View All Client Tickets ({selectedCustomer.totalTickets})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
