import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2, Mail, Lock, ArrowRight, Shield, Users, UserCheck,
  Eye, EyeOff, Ticket, CheckCircle2, Globe, ChevronDown,
  Zap, BarChart3, HeadphonesIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_ROLES = [
  { label: 'Company Admin', email: 'admin@ticketflow.io', role: 'company_admin', desc: 'Full access', icon: UserCheck },
  { label: 'Support Agent', email: 'agent@ticketflow.io', role: 'agent', desc: 'Ticket queue', icon: Users },
  { label: 'Dept. Manager', email: 'manager@ticketflow.io', role: 'manager', desc: 'Team oversight', icon: Shield },
  { label: 'Super Admin', email: 'superadmin@ticketflow.io', role: 'super_admin', desc: 'Platform ops', icon: Shield },
];

const ORGS = [
  { id: 'org-1', name: 'Acme Enterprise', plan: 'Enterprise Plan' },
  { id: 'org-2', name: 'Globex Cloud Inc', plan: 'Pro SaaS' },
  { id: 'org-3', name: 'Initech Solutions', plan: 'Business' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Automated SLA Enforcement',
    desc: 'Real-time breach detection with automatic escalation and routing.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Multi-channel Support',
    desc: 'Email, portal, Slack, and API — unified in a single workspace.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Agent performance, CSAT scores, and resolution trends at a glance.',
  },
];

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setPermissions = useAuthStore((s) => s.setPermissions);

  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(ORGS[0]);
  const [showOrgMenu, setShowOrgMenu] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@ticketflow.io', password: 'password123', remember: true },
  });

  const performLogin = async (email: string, pass: string) => {
    try {
      const res = await authApi.login({ email, password: pass });
      setTokens(res.accessToken);
      setUser(res.user);
      setPermissions(res.permissions);
      toast.success(`Welcome back, ${res.user.fullName}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    await performLogin(data.email, data.password);
  };

  const handleDemoLogin = async (email: string, roleName: string) => {
    setLoadingRole(roleName);
    setValue('email', email);
    setValue('password', 'password123');
    await performLogin(email, 'password123');
    setLoadingRole(null);
  };

  return (
    <div className="min-h-screen flex bg-[var(--surface-bg)] text-[var(--text-primary)] font-sans antialiased">

      {/* ─── LEFT PANEL — Dark Branding & Highlights (50% desktop) ─── */}
      <div className="hidden lg:flex lg:w-1/2 auth-illustration-bg relative overflow-hidden flex-col justify-between p-10 xl:p-14">

        {/* Background Grid Accent */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top Gradient Line Accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

        {/* 1. BRANDING HEADER */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md flex-shrink-0">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-[18px] leading-none tracking-tight">TicketFlow</div>
              <div className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mt-1">ENTERPRISE ITSM</div>
            </div>
          </div>
        </div>

        {/* 2. MAIN COPY & FEATURES */}
        <div className="relative z-10 max-w-[460px] my-auto py-8">
          <h1 className="text-[40px] xl:text-[46px] font-extrabold text-white leading-[1.15] tracking-tight mb-4">
            Enterprise<br />Service Management
          </h1>
          <p className="text-white/60 text-[15px] xl:text-[16px] leading-relaxed mb-8">
            Streamline ticket routing, SLA enforcement, and team collaboration — all in one unified workspace.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3.5 p-2 rounded-lg transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-white/90 leading-tight mb-1">{f.title}</div>
                    <div className="text-[13px] text-white/45 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-6">
            {[
              { v: '2.4M+', l: 'Tickets resolved' },
              { v: '99.6%', l: 'SLA compliance' },
              { v: '<4 min', l: 'Avg response' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-white font-extrabold text-[26px] xl:text-[28px] leading-tight">{s.v}</div>
                <div className="text-white/45 text-[12px] font-medium mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. COMPLIANCE BAR */}
        <div className="relative z-10 flex items-center gap-2 text-white/30 text-[11px] font-medium pt-4 border-t border-white/5">
          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
          <span>SOC2 Type II · ISO 27001 · GDPR · 99.99% Uptime SLA</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Login Card Area (50% desktop) ─── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between overflow-y-auto px-4 sm:px-8 lg:px-12 py-8 min-h-screen">

        {/* Mobile Header (Shown on <1024px) */}
        <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-[var(--surface-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-sm">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-[16px] text-[var(--text-primary)] block leading-none">TicketFlow</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Enterprise ITSM</span>
          </div>
        </div>

        {/* Login Panel Card (Centered vertically & horizontally) */}
        <div className="w-full max-w-[460px] mx-auto my-auto py-4">
          <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--surface-border)] space-y-6">

            {/* Header: Welcome back */}
            <div>
              <h2 className="text-[28px] sm:text-[30px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
                Welcome back
              </h2>
              <p className="text-[14px] text-[var(--text-muted)] mt-1.5">
                Sign in to your workspace to continue
              </p>
            </div>

            {/* Organization Selector */}
            <div className="relative">
              <label htmlFor="org-select-btn" className="text-[13px] font-medium text-[var(--text-primary)] mb-2 block">
                Organization
              </label>
              <button
                id="org-select-btn"
                type="button"
                onClick={() => setShowOrgMenu(!showOrgMenu)}
                className="field-input h-11 flex items-center justify-between cursor-pointer px-3.5 rounded-lg w-full"
                aria-expanded={showOrgMenu}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{selectedOrg.name.charAt(0)}</span>
                  </div>
                  <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">{selectedOrg.name}</span>
                </div>
                <ChevronDown className={clsx(
                  'w-4 h-4 text-[var(--text-muted)] transition-transform duration-150 flex-shrink-0 ml-2',
                  showOrgMenu && 'rotate-180'
                )} />
              </button>

              {showOrgMenu && (
                <div
                  className="absolute top-full mt-1.5 left-0 right-0 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 z-50 shadow-xl animate-scale-in"
                  role="listbox"
                >
                  {ORGS.map((org) => (
                    <button
                      key={org.id}
                      role="option"
                      aria-selected={selectedOrg.id === org.id}
                      onClick={() => { setSelectedOrg(org); setShowOrgMenu(false); }}
                      className={clsx(
                        'w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors',
                        selectedOrg.id === org.id
                          ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      )}
                    >
                      <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">{org.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{org.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">{org.plan}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Demo Quick Access Cards */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
              <p className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-2.5">
                Demo Access — One click login
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {DEMO_ROLES.map((r) => {
                  const Icon = r.icon;
                  const isLoading = loadingRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleDemoLogin(r.email, r.role)}
                      disabled={!!loadingRole || isSubmitting}
                      className={clsx(
                        'flex items-center gap-2.5 h-[52px] px-3 rounded-lg text-left transition-all border',
                        'bg-[var(--surface-card)] border-[var(--surface-border)]',
                        'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] hover:shadow-xs',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 text-white">
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-[var(--text-primary)] truncate leading-tight">{r.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--surface-border)]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Or sign in manually</span>
              <div className="flex-1 h-px bg-[var(--surface-border)]" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              {/* Email Address */}
              <div className="form-field">
                <label htmlFor="login-email" className="text-[13px] font-medium text-[var(--text-primary)] mb-1.5 block">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    {...register('email')}
                    className={clsx('field-input h-11 pl-10 pr-3.5 rounded-lg', errors.email && 'field-input-error')}
                  />
                </div>
                {errors.email && <p className="form-error mt-1">{errors.email.message}</p>}
              </div>

              {/* Password & Baseline Forgot Password Link */}
              <div className="form-field">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-[13px] font-medium text-[var(--text-primary)] block">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[12px] font-semibold text-[var(--color-primary)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={clsx('field-input h-11 pl-10 pr-10 rounded-lg', errors.password && 'field-input-error')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="form-error mt-1">{errors.password.message}</p>}
              </div>

              {/* Checkbox (Remember me) */}
              <div className="flex items-center gap-2 pt-1 pb-1">
                <input
                  id="remember"
                  type="checkbox"
                  {...register('remember')}
                  className="w-4 h-4 rounded border-[var(--surface-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <label htmlFor="remember" className="text-[13px] font-medium text-[var(--text-secondary)] cursor-pointer select-none leading-none">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Primary Action: Sign In */}
              <button
                type="submit"
                disabled={isSubmitting || !!loadingRole}
                className="w-full h-11 btn-enterprise btn-enterprise-primary text-[14px] font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Sign in to Workspace
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Secondary Action: SSO */}
            <button
              type="button"
              onClick={() => toast.success('SSO — configure SAML 2.0 in Settings')}
              className="w-full h-11 btn-enterprise btn-enterprise-secondary text-[14px] font-semibold rounded-lg"
            >
              <Globe className="w-4 h-4 text-[var(--color-primary)]" />
              Continue with SSO
            </button>

            {/* Create Organization Link */}
            <p className="text-center text-[13px] text-[var(--text-muted)] font-medium pt-1">
              Need a workspace?{' '}
              <Link to="/register" className="text-[var(--color-primary)] hover:underline font-semibold">
                Create organization
              </Link>
            </p>

            {/* Security Badges */}
            <div className="pt-4 border-t border-[var(--surface-border)] flex items-center justify-center gap-3.5 flex-wrap">
              {['SOC 2 Certified', 'GDPR Ready', '256-bit AES', '99.99% Uptime'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* Empty space filler for vertical centering balance */}
        <div className="hidden lg:block h-2" />
      </div>

    </div>
  );
};
