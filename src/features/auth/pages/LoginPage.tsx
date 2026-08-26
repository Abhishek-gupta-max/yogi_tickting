import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2, Mail, Lock, ArrowRight, Shield, Users, UserCheck,
  Eye, EyeOff, Ticket, CheckCircle2, Globe, ChevronDown,
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

const STATS = [
  { label: 'Tickets Resolved', value: '2.4M+' },
  { label: 'Enterprise Clients', value: '4,200+' },
  { label: 'SLA Compliance', value: '99.6%' },
  { label: 'Avg Response', value: '<4 min' },
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
    <div className="min-h-screen flex bg-[var(--surface-bg)]">
      {/* ─── LEFT PANEL — Dark branding ─────────────────── */}
      <div className="hidden lg:flex lg:w-[50%] auth-illustration-bg relative overflow-hidden flex-col">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Brand */}
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-base leading-none">TicketFlow</div>
              <div className="text-white/40 text-[10px] font-medium uppercase tracking-widest mt-0.5">Enterprise ITSM</div>
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-16">
          <div className="max-w-md">
            <h1 className="text-[36px] font-bold text-white leading-tight tracking-tight mb-4">
              Enterprise Service Management
            </h1>
            <p className="text-white/50 text-[15px] leading-relaxed mb-10">
              Streamline ticket routing, SLA enforcement, and team collaboration in one workspace.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="border border-white/8 rounded-lg p-4">
                  <div className="text-white font-bold text-xl">{s.value}</div>
                  <div className="text-white/40 text-[12px] font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom compliance */}
        <div className="relative z-10 pb-6 px-8 flex items-center gap-3 text-white/25 text-[11px]">
          <Globe className="w-3.5 h-3.5" />
          <span>SOC2 Type II · ISO 27001 · GDPR · 99.99% Uptime</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Login Form ───────────────────── */}
      <div className="w-full lg:w-[50%] flex flex-col overflow-y-auto">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2 p-5 border-b border-[var(--surface-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[var(--text-primary)]">TicketFlow</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 max-w-[440px] mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-page-title text-[var(--text-primary)] mb-1">
              Welcome back
            </h2>
            <p className="text-[14px] text-[var(--text-muted)]">
              Sign in to your workspace to continue
            </p>
          </div>

          {/* Organization Selector */}
          <div className="mb-6 relative">
            <label className="form-label mb-1.5 block">Organization</label>
            <button
              type="button"
              onClick={() => setShowOrgMenu(!showOrgMenu)}
              className="field-input flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">{selectedOrg.name.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{selectedOrg.name}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            </button>

            {showOrgMenu && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 z-50 shadow-lg animate-scale-in">
                {ORGS.map(org => (
                  <button
                    key={org.id}
                    onClick={() => { setSelectedOrg(org); setShowOrgMenu(false); }}
                    className={clsx(
                      'w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors',
                      selectedOrg.id === org.id
                        ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-medium'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                    )}
                  >
                    <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">{org.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{org.plan}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo Quick-Login */}
          <div className="mb-6 p-4 rounded-lg bg-[var(--color-primary-muted)] border border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]">
            <p className="text-[11px] font-semibold text-[var(--color-primary)] mb-3 uppercase tracking-wider">
              Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
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
                      'flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors border',
                      'bg-[var(--surface-card)] border-[var(--surface-border)]',
                      'hover:border-[var(--color-primary)]',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      {isLoading
                        ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        : <Icon className="w-3.5 h-3.5 text-white" />
                      }
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[var(--text-primary)]">{r.label}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{r.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[var(--surface-border)]" />
            <span className="text-[11px] font-medium text-[var(--text-muted)]">Or sign in with credentials</span>
            <div className="flex-1 h-px bg-[var(--surface-border)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
            <div className="form-field">
              <label htmlFor="login-email" className="form-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  className={clsx(
                    'field-input pl-10',
                    errors.email && 'field-input-error'
                  )}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-field">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="form-label">Password</label>
                <Link to="/forgot-password" className="text-[12px] text-[var(--color-primary)] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={clsx(
                    'field-input pl-10 pr-10',
                    errors.password && 'field-input-error'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                {...register('remember')}
                className="w-4 h-4 rounded border-[var(--surface-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0 cursor-pointer accent-[var(--color-primary)]"
              />
              <label htmlFor="remember" className="text-[13px] text-[var(--text-muted)] cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !!loadingRole}
              className="w-full btn-enterprise btn-enterprise-primary btn-lg disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* SSO */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => toast.success('SSO — configure SAML 2.0 in Settings')}
              className="w-full btn-enterprise btn-enterprise-secondary btn-lg"
            >
              <Globe className="w-4 h-4 text-[var(--color-primary)]" />
              Continue with SSO
            </button>
          </div>

          <p className="mt-6 text-center text-[13px] text-[var(--text-muted)]">
            Need a workspace?{' '}
            <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
              Create organization
            </Link>
          </p>

          {/* Trust badges */}
          <div className="mt-8 pt-5 border-t border-[var(--surface-border)] flex items-center justify-center gap-4 flex-wrap">
            {['SOC2 Certified', 'GDPR Ready', '256-bit AES', '99.99% Uptime'].map((t) => (
              <span key={t} className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                <CheckCircle2 className="w-3 h-3 text-[var(--color-success)]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
