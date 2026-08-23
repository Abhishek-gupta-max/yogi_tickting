'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  ChevronDown,
  Clock,
  User,
  Users,
  CheckCircle2,
  TrendingUp,
  Zap,
  Ticket,
  Sliders,
  Check,
  Key,
} from 'lucide-react';
import { api } from '@/lib/api';

// Demo Accounts matching the reference image
const DEMO_ACCOUNTS = [
  {
    role: 'Company Admin',
    email: 'admin@ticketflow.io',
    password: 'Admin123!',
    title: 'Company Admin',
    subtitle: 'Acme Corp',
    iconBg: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
  },
  {
    role: 'Support Agent',
    email: 'agent@ticketflow.io',
    password: 'Admin123!',
    title: 'Support Agent',
    subtitle: 'Frontline',
    iconBg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
  },
  {
    role: 'Dept. Manager',
    email: 'manager@ticketflow.io',
    password: 'Admin123!',
    title: 'Dept. Manager',
    subtitle: 'IT Helpdesk',
    iconBg: 'bg-amber-600/20 text-amber-400 border border-amber-500/30',
  },
  {
    role: 'Super Admin',
    email: 'superadmin@ticketflow.io',
    password: 'Admin123!',
    title: 'Super Admin',
    subtitle: 'Platform',
    iconBg: 'bg-purple-600/20 text-purple-400 border border-purple-500/30',
  },
];

const ORGANIZATIONS = [
  { id: 'org-1', name: 'Acme Enterprise', plan: 'Enterprise Plan', avatar: 'A', avatarBg: 'bg-blue-600' },
  { id: 'org-2', name: 'Stark Industries', plan: 'Pro Tier Plan', avatar: 'S', avatarBg: 'bg-amber-600' },
  { id: 'org-3', name: 'Wayne Global Corp', plan: 'Enterprise Plan', avatar: 'W', avatarBg: 'bg-purple-600' },
];

export default function LoginPage() {
  const router = useRouter();

  // State
  const [email, setEmail] = useState('admin@ticketflow.io');
  const [password, setPassword] = useState('Admin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email || !email.trim()) {
      errors.email = 'Please enter a valid email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.accessToken) {
        localStorage.setItem('itsm_access_token', res.data.accessToken);
        router.push('/dashboard');
      } else {
        localStorage.setItem('itsm_access_token', 'demo-jwt-token');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setFieldErrors({});
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#060A17] text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#635BFF]/30 selection:text-[#F8FAFC] relative overflow-x-hidden">
      {/* Background Mesh Network Effect at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#635BFF]/10 via-[#060A17]/80 to-[#060A17] pointer-events-none z-0"></div>

      {/* ─── TOP LEFT BRAND HEADER ─────────────────────────────────────────── */}
      <header className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-10 mb-6 lg:mb-0">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] sm:w-[42px] sm:h-[42px] rounded-xl bg-[#10192E] border border-[#1F2E4D] flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
            {/* Custom 2x2 TicketFlow Icon */}
            <div className="grid grid-cols-2 gap-1 p-1">
              <div className="w-2 h-2 rounded-[2px] bg-white"></div>
              <div className="w-2 h-2 rounded-[2px] bg-[#635BFF]"></div>
              <div className="w-2 h-2 rounded-[2px] bg-[#635BFF]"></div>
              <div className="w-2 h-2 rounded-[2px] bg-white"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] sm:text-[20px] leading-[22px] font-bold text-white tracking-tight">
              TicketFlow
            </span>
            <span className="text-[9px] sm:text-[10px] leading-[12px] font-bold tracking-[0.15em] text-[#7C8BA1] uppercase mt-0.5">
              ENTERPRISE PLATFORM
            </span>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─────────────────────────────────────────── */}
      <main className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 z-10 my-auto py-4">

        {/* ─── LEFT COLUMN: HERO, METRICS & SLA (Responsive Order on Mobile) ── */}
        <div className="w-full lg:w-[54%] flex flex-col space-y-6 order-2 lg:order-1">

          {/* Eyebrow Badge & SLA Live Monitoring Top Floating Card */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10192D]/90 border border-[#1A2640] text-slate-300 text-[11px] sm:text-[12px] font-medium shadow-sm">
                <Sliders className="w-3.5 h-3.5 text-[#635BFF]" />
                <span>ServiceNow-Grade Enterprise Platform</span>
              </div>

              <h1 className="text-[28px] sm:text-[40px] lg:text-[50px] leading-[34px] sm:leading-[48px] lg:leading-[58px] font-bold text-white max-w-[560px] tracking-tight">
                The Smartest Way to<br />
                Manage Enterprise<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8257E5] via-[#635BFF] to-[#A885FF] drop-shadow-[0_0_25px_rgba(99,91,255,0.4)]">
                  Support
                </span>
              </h1>
            </div>

            {/* Live Monitoring Floating SLA Badge */}
            <div className="bg-[#0F172A]/90 border border-[#1E293B] rounded-[16px] p-4 w-full sm:w-[220px] shadow-2xl shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#00E599]/20 flex items-center justify-center text-[#00E599]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-white leading-tight">SLA Compliance</div>
                  <div className="text-[10px] text-[#64748B]">Live Monitoring</div>
                </div>
              </div>
              <div className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight my-1">
                99.6%
              </div>
              <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                <div className="bg-[#00E599] h-full w-[99.6%] rounded-full shadow-[0_0_10px_#00E599]"></div>
              </div>
            </div>
          </div>

          {/* Hero Subtitle Description */}
          <p className="text-[14px] sm:text-[16px] leading-[22px] sm:leading-[26px] text-[#94A3B8] max-w-[520px]">
            Streamline ticket routing, SLA enforcement, and team collaboration — all in one beautifully designed workspace.
          </p>

          {/* 4 Compact Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[540px]">
            <div className="bg-[#0D1527] border border-[#1A2640] rounded-[14px] p-4 flex items-center justify-between shadow-md hover:border-[#26375A] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6E56CF]/20 text-[#9E86FF] flex items-center justify-center shrink-0 border border-[#6E56CF]/30">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[20px] font-bold text-white leading-tight">142</div>
                  <div className="text-[11px] font-medium text-[#64748B]">Open Tickets</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#00E599] bg-[#00E599]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#00E599]/20">
                <TrendingUp className="w-2.5 h-2.5" /> 12.4%
              </span>
            </div>

            <div className="bg-[#0D1527] border border-[#1A2640] rounded-[14px] p-4 flex items-center gap-3 shadow-md hover:border-[#26375A] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#6E56CF]/20 text-[#9E86FF] flex items-center justify-center shrink-0 border border-[#6E56CF]/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-white leading-tight">4,200+</div>
                <div className="text-[11px] font-medium text-[#64748B]">Enterprise Clients</div>
              </div>
            </div>

            <div className="bg-[#0D1527] border border-[#1A2640] rounded-[14px] p-4 flex items-center gap-3 shadow-md hover:border-[#26375A] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#6E56CF]/20 text-[#9E86FF] flex items-center justify-center shrink-0 border border-[#6E56CF]/30">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-white leading-tight">2.4M+</div>
                <div className="text-[11px] font-medium text-[#64748B]">Tickets Resolved</div>
              </div>
            </div>

            <div className="bg-[#0D1527] border border-[#1A2640] rounded-[14px] p-4 flex items-center gap-3 shadow-md hover:border-[#26375A] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#6E56CF]/20 text-[#9E86FF] flex items-center justify-center shrink-0 border border-[#6E56CF]/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-white leading-tight">&lt; 4 min</div>
                <div className="text-[11px] font-medium text-[#64748B]">Avg Response Time</div>
              </div>
            </div>
          </div>

          {/* Performance & SLA Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[540px]">
            {/* Left Box: SLA Compliance */}
            <div className="bg-[#0D1527] border border-[#1A2640] rounded-[14px] p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#00E599]/20 text-[#00E599] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-white leading-none">99.6%</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">SLA Compliance</div>
                </div>
              </div>
              <div className="w-full bg-[#16223A] h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-[#00E599] h-full w-[99.6%] rounded-full"></div>
              </div>
            </div>

            {/* Right Box: Resolution Speed Horizontal Bars */}
            <div className="bg-[#0D1527] border border-[#1A2640] rounded-[14px] p-4 space-y-2 shadow-md">
              <div className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">RESOLUTION SPEED</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Critical</span>
                  <div className="flex items-center gap-2 w-32 sm:w-36">
                    <div className="w-full bg-[#16223A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF4D6D] h-full w-[88%] rounded-full"></div>
                    </div>
                    <span className="font-bold text-white text-[10px]">88%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">High</span>
                  <div className="flex items-center gap-2 w-32 sm:w-36">
                    <div className="w-full bg-[#16223A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF8C00] h-full w-[95%] rounded-full"></div>
                    </div>
                    <span className="font-bold text-white text-[10px]">95%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Medium</span>
                  <div className="flex items-center gap-2 w-32 sm:w-36">
                    <div className="w-full bg-[#16223A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00E599] h-full w-[99%] rounded-full"></div>
                    </div>
                    <span className="font-bold text-white text-[10px]">99%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Compliance Bottom Horizontal Bar */}
          <div className="bg-[#0D1527]/80 border border-[#1A2640] rounded-[14px] p-3.5 max-w-[540px] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#635BFF] shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="text-white block font-semibold">SOC 2 Type II</strong> Certified
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF8C00] shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="text-white block font-semibold">GDPR</strong> Compliant
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#FF8C00] shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="text-white block font-semibold">256-bit AES</strong> Encryption
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E599] shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="text-white block font-semibold">99.99%</strong> Uptime SLA
              </div>
            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: AUTHENTICATION CARD (Order-1 on Mobile for Speed) ─ */}
        <div className="w-full lg:w-[46%] flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="w-full max-w-[490px] bg-[#0B1222]/95 border border-[#1D2B45] rounded-[20px] sm:rounded-[24px] p-5 sm:p-9 shadow-2xl backdrop-blur-xl space-y-5">

            {/* Welcome Back Header */}
            <div className="space-y-1">
              <h2 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-[13px] text-[#8A99AD]">
                Sign in to your workspace to continue
              </p>
            </div>

            {/* Organization Dropdown */}
            <div className="space-y-1.5 relative">
              <label className="block text-[10px] font-bold tracking-[0.12em] text-[#64748B] uppercase">
                ORGANIZATION
              </label>

              <button
                type="button"
                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                className="w-full h-[52px] bg-[#131D33] hover:bg-[#182643] border border-[#213252] focus:border-[#635BFF] rounded-xl px-3.5 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full ${selectedOrg.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {selectedOrg.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white leading-tight">{selectedOrg.name}</div>
                    <div className="text-[10px] text-[#64748B]">{selectedOrg.plan}</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#64748B]" />
              </button>

              {/* Dropdown Options */}
              {isOrgDropdownOpen && (
                <div className="absolute top-[78px] left-0 w-full bg-[#131D33] border border-[#213252] rounded-xl shadow-2xl z-30 divide-y divide-[#213252] overflow-hidden">
                  {ORGANIZATIONS.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        setSelectedOrg(org);
                        setIsOrgDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#182643] text-left transition-colors"
                    >
                      <div className={`w-6 h-6 rounded-full ${org.avatarBg} text-white font-bold text-xs flex items-center justify-center`}>
                        {org.avatar}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-white">{org.name}</div>
                        <div className="text-[10px] text-[#64748B]">{org.plan}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* One-Click Demo Access Cards */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold tracking-[0.12em] text-[#7C8BA1] uppercase">
                ONE-CLICK DEMO ACCESS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleDemoClick(acc)}
                    className="bg-[#131D33]/90 hover:bg-[#182643] border border-[#213252] hover:border-[#635BFF] rounded-xl p-2.5 flex items-center gap-2.5 text-left transition-all cursor-pointer group"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${acc.iconBg} shrink-0`}>
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-white truncate group-hover:text-[#635BFF] transition-colors leading-tight">
                        {acc.title}
                      </div>
                      <div className="text-[10px] text-[#64748B] truncate">
                        {acc.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="w-full border-t border-[#1E2B45]"></div>
              <span className="absolute bg-[#0B1222] px-3 text-[10px] font-bold tracking-widest text-[#475569]">
                OR SIGN IN WITH CREDENTIALS
              </span>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Login Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#94A3B8]">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="admin@ticketflow.io"
                  className={`w-full bg-[#0F182B] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#475569] outline-none transition-colors ${
                    fieldErrors.email ? 'border-rose-500' : 'border-[#213252] focus:border-[#6E56CF]'
                  }`}
                />
                {fieldErrors.email && (
                  <span className="text-[11px] text-rose-400 block">{fieldErrors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#94A3B8]">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-[#6E56CF] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    placeholder="••••••••••••"
                    className={`w-full bg-[#0F182B] border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-[#475569] outline-none transition-colors ${
                      fieldErrors.password ? 'border-rose-500' : 'border-[#213252] focus:border-[#6E56CF]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="text-[11px] text-rose-400 block">{fieldErrors.password}</span>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded bg-[#635BFF] flex items-center justify-center cursor-pointer transition-colors ${
                    rememberMe ? 'bg-[#635BFF]' : 'bg-[#16223A] border border-[#213252]'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
                <span
                  onClick={() => setRememberMe(!rememberMe)}
                  className="text-xs text-[#94A3B8] cursor-pointer select-none"
                >
                  Keep me signed in for 30 days
                </span>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#635BFF] to-[#7C3AED] hover:from-[#544CF0] hover:to-[#6D28D9] text-white font-semibold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#635BFF]/30 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign in to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* SSO & Create Account Links */}
            <div className="space-y-3 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#1E2B45]"></div>
                <span className="absolute bg-[#0B1222] px-2 text-[10px] font-bold text-[#475569]">OR</span>
              </div>

              <button
                type="button"
                className="w-full bg-[#131D33] hover:bg-[#182643] border border-[#213252] text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#635BFF]" />
                <span>Continue with SSO / Enterprise Login</span>
              </button>

              <div className="text-center text-xs text-[#8A99AD]">
                Need a workspace?{' '}
                <a href="#" className="font-semibold text-[#6E56CF] hover:underline">
                  Create organization account
                </a>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ─── FOOTER MATCHING SCREENSHOT ───────────────────────────────────── */}
      <footer className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569] z-10 pt-4">
        <div>© 2026 TicketFlow Enterprise Platform. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#94A3B8] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#94A3B8] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#94A3B8] transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
