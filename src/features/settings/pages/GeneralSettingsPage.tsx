import type { FC } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Palette, Mail, Shield, CreditCard, User, Globe, Lock,
  Eye, Bell, Upload, Check, X, ChevronRight, Loader2, Save,
  Clock, ToggleRight, ToggleLeft, AlertTriangle, Zap, Monitor,
  Layers, Info,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore, selectUser } from '@/store/auth.store';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'branding' | 'email' | 'security' | 'appearance' | 'billing';

const SETTINGS_TABS: { id: Tab; label: string; icon: FC<any>; desc: string }[] = [
  { id: 'profile',    label: 'Company Profile',  icon: Building2, desc: 'Org details, timezone, locale' },
  { id: 'branding',   label: 'Branding',          icon: Palette,   desc: 'Logo, colors, favicon' },
  { id: 'email',      label: 'Email Templates',   icon: Mail,      desc: 'Notifications & replies' },
  { id: 'security',   label: 'Security',          icon: Shield,    desc: '2FA, sessions, IP allowlist' },
  { id: 'appearance', label: 'Appearance',        icon: Monitor,   desc: 'Theme, density, layout' },
  { id: 'billing',    label: 'Billing & Plan',    icon: CreditCard,desc: 'Plan, usage, invoices' },
];

const EMAIL_TEMPLATES = [
  { id: 'et-1', name: 'Ticket Created',       preview: 'Hi {{customer_name}}, your ticket #{{ticket_number}} has been received…',    active: true  },
  { id: 'et-2', name: 'Ticket Resolved',      preview: 'Great news! Ticket #{{ticket_number}} has been resolved by {{agent_name}}…',  active: true  },
  { id: 'et-3', name: 'Agent Reply',          preview: 'You have a new reply from {{agent_name}} on ticket #{{ticket_number}}…',       active: true  },
  { id: 'et-4', name: 'SLA Breach Warning',   preview: 'URGENT: Ticket #{{ticket_number}} is approaching SLA deadline in {{time}}…',  active: true  },
  { id: 'et-5', name: 'Weekly Report Digest', preview: 'Here\'s your weekly summary: {{open_count}} open, {{resolved_count}} resolved…', active: false },
];

const BRAND_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const ProfileTab: FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: 'Acme Corporation', email: 'support@acme.com', timezone: 'UTC+5:30', locale: 'en-US', website: 'https://acme.com', address: '123 Tech Park, San Francisco, CA' });
  const save = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 900)); setIsSaving(false); toast.success('Company profile updated!'); };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'name', label: 'Company Name', placeholder: 'Acme Corporation' },
          { key: 'email', label: 'Support Email', placeholder: 'support@company.com' },
          { key: 'website', label: 'Website', placeholder: 'https://company.com' },
          { key: 'address', label: 'Address', placeholder: '123 Main St, City, State' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{f.label}</label>
            <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Timezone</label>
          <select value={form.timezone} onChange={e => setForm(p => ({...p, timezone: e.target.value}))}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
            {['UTC', 'UTC+5:30', 'UTC-5', 'UTC+1', 'UTC+8'].map(tz => <option key={tz}>{tz}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Locale</label>
          <select value={form.locale} onChange={e => setForm(p => ({...p, locale: e.target.value}))}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
            {['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
        <motion.button onClick={save} disabled={isSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 disabled:opacity-50 shadow-md shadow-indigo-500/20">
          {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </motion.button>
      </div>
    </div>
  );
};

const BrandingTab: FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [logoUploaded, setLogoUploaded] = useState(false);
  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Company Logo</label>
        <div className="flex items-center gap-4">
          <div className={clsx('w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all cursor-pointer',
            logoUploaded ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--surface-border)] hover:border-indigo-500/50 bg-[var(--surface-bg)]')}
            onClick={() => { setLogoUploaded(true); toast.success('Logo uploaded!'); }}>
            {logoUploaded
              ? <Check className="w-8 h-8 text-indigo-500" />
              : <Upload className="w-6 h-6 text-[var(--text-muted)]" />
            }
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">{logoUploaded ? 'Logo uploaded ✓' : 'Click to upload logo'}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">PNG, SVG up to 2 MB. Recommended: 200×200px</p>
            {logoUploaded && <button onClick={() => setLogoUploaded(false)} className="mt-1.5 text-[10px] font-semibold text-red-500 hover:text-red-400 transition-colors">Remove</button>}
          </div>
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Brand Color</label>
        <div className="flex items-center gap-3 flex-wrap">
          {BRAND_COLORS.map(c => (
            <button key={c} onClick={() => { setPrimaryColor(c); toast.success(`Brand color set to ${c}`); }}
              className={clsx('w-9 h-9 rounded-xl transition-all shadow-sm', primaryColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105')}
              style={{ backgroundColor: c }} />
          ))}
          <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
            className="w-9 h-9 rounded-xl cursor-pointer border border-[var(--surface-border)] bg-[var(--surface-bg)]" title="Custom color" />
          <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{primaryColor}</span>
        </div>
      </div>

      {/* Favicon */}
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Favicon</label>
        <button onClick={() => toast.success('Favicon uploaded!')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--surface-border)] bg-[var(--surface-bg)] text-[var(--text-muted)] hover:text-indigo-500 hover:border-indigo-500/40 transition-colors">
          <Upload className="w-3.5 h-3.5" /> Upload Favicon (ICO / PNG, 32×32)
        </button>
      </div>

      {/* Preview Bar */}
      <div className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Live Preview</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ backgroundColor: primaryColor }}>A</div>
          <div>
            <div className="text-xs font-bold" style={{ color: primaryColor }}>Acme Corporation</div>
            <div className="text-[10px] text-[var(--text-muted)]">Enterprise Support Platform</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
        <button onClick={() => toast.success('Branding saved!')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md shadow-indigo-500/20">
          <Save className="w-4 h-4" /> Save Branding
        </button>
      </div>
    </div>
  );
};

const EmailTemplatesTab: FC = () => {
  const [templates, setTemplates] = useState(EMAIL_TEMPLATES);
  const [preview, setPreview] = useState<string | null>(null);
  const toggleTemplate = (id: string) => setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t));

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--text-muted)]">
        Customize automated email notifications sent to customers and agents. Use <code className="text-indigo-400 font-mono">{'{{variable}}'}</code> for dynamic values.
      </p>
      <div className="space-y-3">
        {templates.map(t => (
          <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-indigo-500/30 transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[var(--text-primary)]">{t.name}</span>
                <span className={clsx('text-[9px] font-extrabold px-1.5 py-0.5 rounded-full', t.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]')}>
                  {t.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">{t.preview}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setPreview(preview === t.id ? null : t.id)} className="opacity-0 group-hover:opacity-100 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all">
                {preview === t.id ? 'Close' : 'Preview'}
              </button>
              <button onClick={() => toggleTemplate(t.id)}>
                {t.active ? <ToggleRight className="w-7 h-7 text-indigo-500" /> : <ToggleLeft className="w-7 h-7 text-[var(--text-muted)]" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecurityTab: FC = () => {
  const [enforce2FA,    setEnforce2FA]    = useState(true);
  const [sessionTime,  setSessionTime]   = useState('30');
  const [ipAllowlist,  setIpAllowlist]   = useState('');
  const [isSaving,     setIsSaving]      = useState(false);
  const save = async () => { setIsSaving(true); await new Promise(r => setTimeout(r, 800)); setIsSaving(false); toast.success('Security settings saved!'); };

  return (
    <div className="space-y-6">
      {/* 2FA Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" /> Enforce 2FA for all agents
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Require TOTP or SMS verification on every login</p>
        </div>
        <button onClick={() => { setEnforce2FA(!enforce2FA); toast.success(`2FA ${enforce2FA ? 'disabled' : 'enabled'}`); }}>
          {enforce2FA ? <ToggleRight className="w-9 h-9 text-indigo-500" /> : <ToggleLeft className="w-9 h-9 text-[var(--text-muted)]" />}
        </button>
      </div>

      {/* Session Timeout */}
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Session Timeout</label>
        <div className="flex items-center gap-3">
          {['15', '30', '60', '120', '480'].map(t => (
            <button key={t} onClick={() => setSessionTime(t)}
              className={clsx('px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors',
                sessionTime === t ? 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30' : 'border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface-bg)]')}>
              {parseInt(t) >= 60 ? `${parseInt(t)/60}h` : `${t}m`}
            </button>
          ))}
        </div>
      </div>

      {/* IP Allowlist */}
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          IP Allowlist <span className="font-normal text-[var(--text-muted)]">(Optional)</span>
        </label>
        <textarea
          value={ipAllowlist} onChange={e => setIpAllowlist(e.target.value)}
          placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;203.0.113.5"
          rows={4}
          className="w-full px-3.5 py-3 rounded-xl text-xs font-mono bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y"
        />
        <p className="text-[10px] text-[var(--text-muted)] mt-1">One IP/CIDR per line. Leave empty to allow all IPs.</p>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Changing security settings affects all users in your organization immediately.</span>
      </div>

      <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
        <button onClick={save} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 disabled:opacity-50 shadow-md">
          {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Security Settings</>}
        </button>
      </div>
    </div>
  );
};

const AppearanceTab: FC = () => {
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default');
  const THEMES = [
    { id: 'light',  label: 'Light',  preview: 'bg-slate-100 border-slate-200' },
    { id: 'dark',   label: 'Dark',   preview: 'bg-slate-900 border-slate-700' },
    { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-slate-100 to-slate-900 border-slate-400' },
  ];
  const [selectedTheme, setSelectedTheme] = useState('dark');
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => { setSelectedTheme(t.id); toast.success(`${t.label} theme applied`); }}
              className={clsx('p-4 rounded-xl border-2 text-center transition-all', selectedTheme === t.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-[var(--surface-border)] hover:border-indigo-400/40')}>
              <div className={clsx('w-full h-12 rounded-lg mb-2 border', t.preview)} />
              <span className={clsx('text-xs font-semibold', selectedTheme === t.id ? 'text-indigo-500' : 'text-[var(--text-muted)]')}>{t.label}</span>
              {selectedTheme === t.id && <Check className="w-3.5 h-3.5 text-indigo-500 mx-auto mt-1" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Layout Density</label>
        <div className="flex items-center gap-2">
          {(['compact', 'default', 'comfortable'] as const).map(d => (
            <button key={d} onClick={() => { setDensity(d); toast.success(`Density set to ${d}`); }}
              className={clsx('flex-1 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-colors',
                density === d ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface-bg)]')}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const BillingTab: FC = () => {
  const USAGES = [
    { label: 'Agents Used',     value: 12, max: 25,  unit: '' },
    { label: 'Monthly Tickets', value: 1142, max: 5000, unit: '' },
    { label: 'Storage Used',    value: 4.2, max: 10, unit: ' GB' },
  ];
  return (
    <div className="space-y-5">
      {/* Current Plan */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600/90 to-blue-700/90 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Current Plan</span>
          </div>
          <h3 className="text-2xl font-extrabold mb-1">Enterprise Pro</h3>
          <p className="text-indigo-200 text-sm">$749 / month · Billed annually · Renews Dec 31, 2025</p>
          <div className="flex items-center gap-3 mt-3">
            <button onClick={() => toast.success('Opening upgrade options…')} className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors">Upgrade Plan</button>
            <button onClick={() => toast.success('Cancellation flow triggered…')} className="text-xs text-indigo-200/60 hover:text-indigo-100 transition-colors">Cancel subscription</button>
          </div>
        </div>
      </div>

      {/* Usage Meters */}
      <div className="surface-card p-5 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Plan Usage</h3>
        {USAGES.map(u => {
          const pct = Math.round((u.value / u.max) * 100);
          const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-indigo-500';
          return (
            <div key={u.label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[var(--text-primary)]">{u.label}</span>
                <span className="text-[var(--text-muted)] font-medium">{u.value}{u.unit} / {u.max}{u.unit} ({pct}%)</span>
              </div>
              <div className="progress-track">
                <div className={clsx('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div className="surface-card overflow-hidden">
        <div className="p-4 border-b border-[var(--surface-border)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Invoices</h3>
        </div>
        <div className="divide-y divide-[var(--surface-border)]">
          {[
            { period: 'November 2025', amount: '$749.00', status: 'Paid' },
            { period: 'October 2025',  amount: '$749.00', status: 'Paid' },
            { period: 'September 2025',amount: '$749.00', status: 'Paid' },
          ].map(inv => (
            <div key={inv.period} className="flex items-center justify-between px-5 py-3.5 text-xs">
              <span className="text-[var(--text-secondary)]">{inv.period}</span>
              <span className="font-bold text-[var(--text-primary)]">{inv.amount}</span>
              <span className="text-emerald-500 font-semibold">{inv.status}</span>
              <button onClick={() => toast.success(`Downloading ${inv.period} invoice…`)} className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TAB_CONTENT: Record<Tab, FC> = {
  profile:    ProfileTab,
  branding:   BrandingTab,
  email:      EmailTemplatesTab,
  security:   SecurityTab,
  appearance: AppearanceTab,
  billing:    BillingTab,
};

export const GeneralSettingsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const user = useAuthStore(selectUser);
  const Content = TAB_CONTENT[activeTab];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-title-lg font-bold text-[var(--text-primary)]">Workspace Settings</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Configure your organization, branding, security, and billing preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Responsive Tab Navigation ───────────────────── */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="surface-card p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-none gap-1 lg:sticky lg:top-24">
            {SETTINGS_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'settings-sidebar-item flex-shrink-0 lg:w-full min-w-[140px] lg:min-w-0',
                    activeTab === tab.id && 'active'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="font-semibold text-xs truncate">{tab.label}</div>
                    <div className="text-[10px] opacity-60 truncate hidden sm:block">{tab.desc}</div>
                  </div>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0 text-indigo-600 dark:text-indigo-400 hidden lg:block" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Right Content Panel ───────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="surface-card p-6"
            >
              <div className="mb-5 pb-4 border-b border-[var(--surface-border)]">
                <div className="flex items-center gap-2">
                  {SETTINGS_TABS.find(t => t.id === activeTab)?.icon && (() => {
                    const Icon = SETTINGS_TABS.find(t => t.id === activeTab)!.icon;
                    return <Icon className="w-5 h-5 text-indigo-500" />;
                  })()}
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    {SETTINGS_TABS.find(t => t.id === activeTab)?.label}
                  </h2>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {SETTINGS_TABS.find(t => t.id === activeTab)?.desc}
                </p>
              </div>
              <Content />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
