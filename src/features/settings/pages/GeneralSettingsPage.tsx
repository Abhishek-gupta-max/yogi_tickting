import type { FC } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2, Palette, Mail, Shield, CreditCard, Monitor,
  ChevronRight, Save, ToggleRight, ToggleLeft, AlertTriangle, Zap,
  Check, Upload,
} from 'lucide-react';
import { clsx } from 'clsx';
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

const BRAND_COLORS = ['#635BFF', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

const ProfileTab: FC = () => {
  const [form, setForm] = useState({ name: 'Acme Corporation', email: 'support@acme.com', timezone: 'UTC+5:30', locale: 'en-US', website: 'https://acme.com', address: '123 Tech Park, San Francisco, CA' });
  const save = async () => { toast.success('Company profile updated!'); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'name', label: 'Company Name', placeholder: 'Acme Corporation' },
          { key: 'email', label: 'Support Email', placeholder: 'support@company.com' },
          { key: 'website', label: 'Website', placeholder: 'https://company.com' },
          { key: 'address', label: 'Address', placeholder: '123 Main St, City, State' },
        ].map(f => (
          <div key={f.key} className="form-field">
            <label className="form-label">{f.label}</label>
            <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="field-input" />
          </div>
        ))}
        <div className="form-field">
          <label className="form-label">Timezone</label>
          <select value={form.timezone} onChange={e => setForm(p => ({...p, timezone: e.target.value}))} className="field-input">
            {['UTC', 'UTC+5:30', 'UTC-5', 'UTC+1', 'UTC+8'].map(tz => <option key={tz}>{tz}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Locale</label>
          <select value={form.locale} onChange={e => setForm(p => ({...p, locale: e.target.value}))} className="field-input">
            {['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-3 border-t border-[var(--surface-border)]">
        <button onClick={save} className="btn-enterprise btn-enterprise-primary">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
};

const BrandingTab: FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#635BFF');
  return (
    <div className="space-y-5">
      <div className="form-field">
        <label className="form-label">Brand Color</label>
        <div className="flex items-center gap-3 flex-wrap">
          {BRAND_COLORS.map(c => (
            <button key={c} onClick={() => { setPrimaryColor(c); toast.success(`Brand color set to ${c}`); }}
              className={clsx('w-8 h-8 rounded-lg transition-all', primaryColor === c ? 'ring-2 ring-offset-2 ring-[var(--color-primary)] scale-110' : 'hover:scale-105')}
              style={{ backgroundColor: c }} />
          ))}
          <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--surface-border)]" />
          <span className="font-mono text-caption text-[var(--text-muted)] font-semibold">{primaryColor}</span>
        </div>
      </div>
      <div className="flex justify-end pt-3 border-t border-[var(--surface-border)]">
        <button onClick={() => toast.success('Branding saved!')} className="btn-enterprise btn-enterprise-primary">
          <Save className="w-4 h-4" /> Save Branding
        </button>
      </div>
    </div>
  );
};

const SecurityTab: FC = () => {
  const [enforce2FA, setEnforce2FA] = useState(true);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)]">
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">Enforce 2FA for all agents</div>
          <p className="text-caption text-[var(--text-muted)] mt-0.5">Require TOTP or SMS verification on login</p>
        </div>
        <button onClick={() => { setEnforce2FA(!enforce2FA); toast.success(`2FA ${enforce2FA ? 'disabled' : 'enabled'}`); }}>
          {enforce2FA ? <ToggleRight className="w-8 h-8 text-[var(--color-primary)]" /> : <ToggleLeft className="w-8 h-8 text-[var(--text-muted)]" />}
        </button>
      </div>
      <div className="flex justify-end pt-3 border-t border-[var(--surface-border)]">
        <button onClick={() => toast.success('Security settings saved!')} className="btn-enterprise btn-enterprise-primary">
          <Save className="w-4 h-4" /> Save Security
        </button>
      </div>
    </div>
  );
};

const AppearanceTab: FC = () => (
  <div className="space-y-4">
    <p className="text-caption text-[var(--text-muted)]">Theme options are accessible via the header toggle icon.</p>
  </div>
);

const BillingTab: FC = () => (
  <div className="space-y-4">
    <div className="p-5 rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)]">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4 text-amber-500" />
        <span className="text-caption font-semibold uppercase tracking-wider text-[var(--color-primary)]">Current Plan</span>
      </div>
      <h3 className="text-page-title text-[var(--text-primary)] mb-1">Enterprise Pro</h3>
      <p className="text-caption text-[var(--text-muted)]">$749 / month · Billed annually</p>
    </div>
  </div>
);

const TAB_CONTENT: Record<Tab, FC> = {
  profile:    ProfileTab,
  branding:   BrandingTab,
  email:      AppearanceTab,
  security:   SecurityTab,
  appearance: AppearanceTab,
  billing:    BillingTab,
};

export const GeneralSettingsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const Content = TAB_CONTENT[activeTab];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-8 space-y-6">
      <div className="page-header">
        <h1 className="text-page-title text-[var(--text-primary)]">Workspace Settings</h1>
        <p className="text-body-std text-[var(--text-secondary)]">Configure your organization, branding, security, and billing preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="surface-card p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-none gap-1">
            {SETTINGS_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left w-full',
                    activeTab === tab.id
                      ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="surface-card p-6">
            <h2 className="text-section-head text-[var(--text-primary)] mb-4 border-b border-[var(--surface-border)] pb-3">
              {SETTINGS_TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
};
