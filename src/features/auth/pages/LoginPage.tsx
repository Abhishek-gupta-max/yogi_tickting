import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Loader2, Mail, Lock, ArrowRight, Shield, Users, UserCheck,
  Eye, EyeOff, Ticket, BarChart3, CheckCircle2, Zap, Globe,
  ChevronDown,
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
  { label: 'Company Admin', email: 'admin@ticketflow.io', role: 'company_admin', color: 'from-indigo-500 to-blue-600', badge: 'Admin', desc: 'Acme Corp', icon: UserCheck },
  { label: 'Support Agent', email: 'agent@ticketflow.io', role: 'agent', color: 'from-emerald-500 to-teal-600', badge: 'Agent', desc: 'Frontline', icon: Users },
  { label: 'Dept. Manager', email: 'manager@ticketflow.io', role: 'manager', color: 'from-amber-500 to-orange-600', badge: 'Mgr', desc: 'IT Helpdesk', icon: Shield },
  { label: 'Super Admin', email: 'superadmin@ticketflow.io', role: 'super_admin', color: 'from-purple-500 to-violet-600', badge: 'SA', desc: 'Platform', icon: Shield },
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
  { label: 'Avg Response Time', value: '< 4 min' },
];

const FloatingCard: FC<{ delay: number; className: string; children: React.ReactNode }> = ({ delay, className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className={clsx('absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl', className)}
  >
    {children}
  </motion.div>
);

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
    <div className="min-h-screen flex">
      {/* ─── LEFT PANEL — Illustration ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] auth-illustration-bg relative overflow-hidden flex-col">
        {/* Decorative circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Brand */}
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">TicketFlow</div>
              <div className="text-indigo-200/70 text-[10px] font-semibold uppercase tracking-widest">Enterprise Platform</div>
            </div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <FloatingCard delay={0.3} className="top-28 right-8 w-52">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-white text-xs font-bold">SLA Compliance</div>
              <div className="text-white/50 text-[10px]">Live Monitoring</div>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">99.6%</div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '99.6%' }} />
          </div>
        </FloatingCard>

        <FloatingCard delay={0.5} className="top-64 left-8 w-44">
          <div className="text-white/60 text-[10px] font-semibold mb-1.5">TICKETS TODAY</div>
          <div className="text-2xl font-extrabold text-white">142</div>
          <div className="flex items-center gap-1 mt-1">
            <Zap className="w-3 h-3 text-amber-300" />
            <span className="text-emerald-300 text-[10px] font-bold">+12% from yesterday</span>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.7} className="bottom-40 right-10 w-56">
          <div className="text-white/60 text-[10px] font-semibold mb-2 uppercase tracking-wider">Resolution Speed</div>
          <div className="space-y-1.5">
            {[{ label: 'Critical', w: '88%', c: '#f87171' }, { label: 'High', w: '95%', c: '#fb923c' }, { label: 'Medium', w: '99%', c: '#34d399' }].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-white/70 text-[10px] w-14">{b.label}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: b.w, backgroundColor: b.c }} />
                </div>
                <span className="text-white text-[10px] font-bold">{b.w}</span>
              </div>
            ))}
          </div>
        </FloatingCard>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-sm"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-5 backdrop-blur-sm">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
              ServiceNow-Grade Enterprise Platform
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              The Smartest Way to Manage Enterprise Support
            </h1>
            <p className="text-indigo-100/70 text-sm leading-relaxed mb-8">
              Streamline ticket routing, SLA enforcement, and team collaboration — all in one beautifully designed workspace.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="text-white font-extrabold text-lg">{s.value}</div>
                  <div className="text-white/50 text-[10px] font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 pb-6 px-8 flex items-center gap-2 text-white/40 text-[11px]">
          <Globe className="w-3.5 h-3.5" />
          <span>SOC2 Type II · ISO 27001 · GDPR Compliant · 99.99% Uptime SLA</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Login Form ────────────────────────────────── */}
      <div className="w-full lg:w-[48%] flex flex-col bg-[var(--surface-bg)] overflow-y-auto">
        {/* Mobile brand header */}
        <div className="lg:hidden flex items-center gap-2.5 p-5 border-b border-[var(--surface-border)]">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--text-primary)]">TicketFlow</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 max-w-md mx-auto w-full lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1.5 tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Sign in to your workspace to continue
              </p>
            </div>

            {/* Organization Selector */}
            <div className="mb-5 relative">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Organization
              </label>
              <button
                type="button"
                onClick={() => setShowOrgMenu(!showOrgMenu)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-primary)] text-sm font-medium hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[9px] font-bold">{selectedOrg.name.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[var(--text-primary)]">{selectedOrg.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{selectedOrg.plan}</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
              </button>

              {showOrgMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute top-full mt-1.5 left-0 right-0 surface-card p-1.5 z-50 shadow-2xl"
                >
                  {ORGS.map(org => (
                    <button
                      key={org.id}
                      onClick={() => { setSelectedOrg(org); setShowOrgMenu(false); }}
                      className={clsx(
                        'w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-colors',
                        selectedOrg.id === org.id ? 'bg-indigo-500/10 text-indigo-500 font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                      )}
                    >
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[9px] font-bold">{org.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{org.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{org.plan}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Demo Role Quick-Login */}
            <div className="mb-6 p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
              <p className="text-[10px] font-bold text-indigo-500 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> One-Click Demo Access
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
                        'flex items-center gap-2 p-2.5 rounded-xl text-left transition-all border',
                        'bg-[var(--surface-bg)] border-[var(--surface-border)] hover:border-indigo-400/50',
                        'hover:shadow-md hover:shadow-indigo-500/5',
                        'disabled:opacity-50 disabled:cursor-not-allowed group'
                      )}
                    >
                      <div className={clsx('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm', r.color)}>
                        {isLoading
                          ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                          : <Icon className="w-3.5 h-3.5 text-white" />
                        }
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">{r.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[var(--surface-border)]" />
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Or sign in with credentials</span>
              <div className="flex-1 h-px bg-[var(--surface-border)]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    {...register('email')}
                    className={clsx(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[var(--text-primary)]',
                      'bg-[var(--surface-bg)] border transition-all outline-none',
                      'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
                      errors.email
                        ? 'border-red-500/60 bg-red-500/5'
                        : 'border-[var(--surface-border)] hover:border-[var(--text-muted)]'
                    )}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-sm font-semibold text-[var(--text-primary)]">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-400 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={clsx(
                      'w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-[var(--text-primary)]',
                      'bg-[var(--surface-bg)] border transition-all outline-none',
                      'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
                      errors.password
                        ? 'border-red-500/60 bg-red-500/5'
                        : 'border-[var(--surface-border)] hover:border-[var(--text-muted)]'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  type="checkbox"
                  {...register('remember')}
                  className="w-4 h-4 rounded border-[var(--surface-border)] bg-[var(--surface-bg)] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                />
                <label htmlFor="remember" className="text-xs text-[var(--text-muted)] cursor-pointer">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !!loadingRole}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all',
                  'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600',
                  'hover:from-indigo-500 hover:to-blue-500',
                  'shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40',
                  'disabled:opacity-60 disabled:cursor-not-allowed'
                )}
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
              </motion.button>
            </form>

            {/* SSO Divider */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => toast.success('SSO login — configure SAML 2.0 in Settings')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-[var(--text-primary)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)] transition-all"
              >
                <Globe className="w-4 h-4 text-indigo-500" />
                Continue with SSO / Enterprise Login
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
              Need a workspace?{' '}
              <Link to="/register" className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors">
                Create organization account
              </Link>
            </p>

            {/* Trust badges */}
            <div className="mt-8 pt-5 border-t border-[var(--surface-border)] flex items-center justify-center gap-4 flex-wrap">
              {['SOC2 Certified', 'GDPR Ready', '256-bit AES', '99.99% Uptime'].map((t) => (
                <span key={t} className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
