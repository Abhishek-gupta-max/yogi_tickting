import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Very Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Weak', color: '#f97316' };
  if (score === 3) return { score, label: 'Fair', color: '#f59e0b' };
  if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
  return { score, label: 'Very Strong', color: '#10b981' };
}

const REQUIREMENTS = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
];

export const ResetPasswordPage: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getStrength(password);
  const allMet = REQUIREMENTS.every(r => r.test(password));
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet || !passwordsMatch) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setDone(true);
    toast.success('Password reset successfully!');
    setTimeout(() => navigate('/login'), 2500);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4 animate-fade-in"
      >
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-xl font-extrabold text-white mb-2">Password Updated!</h2>
        <p className="text-slate-400 text-sm mb-4">
          Your password has been reset successfully.<br />
          Redirecting you to sign in…
        </p>
        <div className="w-32 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%', animation: 'shimmer 2.5s linear' }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="animate-fade-in"
    >
      {/* Icon Header */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/10">
          <ShieldCheck className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight text-center">
          Set New Password
        </h1>
        <p className="text-slate-400 text-sm text-center">
          Create a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="block text-sm font-semibold text-slate-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="new-password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 bg-white/8 border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Meter */}
          {password.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-400">Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••••"
              className={clsx(
                'w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500',
                'bg-white/8 border outline-none transition-all',
                'focus:ring-2 focus:ring-indigo-500/40',
                confirm.length > 0
                  ? passwordsMatch
                    ? 'border-emerald-500/60 focus:border-emerald-500'
                    : 'border-red-500/60 focus:border-red-500'
                  : 'border-white/10 hover:border-white/20 focus:border-indigo-500'
              )}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirm.length > 0 && !passwordsMatch && (
            <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
          )}
          {passwordsMatch && (
            <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Passwords match
            </p>
          )}
        </div>

        {/* Requirements Checklist */}
        {password.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-white/5 border border-white/8 space-y-1.5">
            {REQUIREMENTS.map((req) => {
              const met = req.test(password);
              return (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  <div className={clsx('w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors', met ? 'bg-emerald-500/20' : 'bg-white/10')}>
                    {met && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <span className={met ? 'text-emerald-300' : 'text-slate-500'}>{req.label}</span>
                </div>
              );
            })}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading || !allMet || !passwordsMatch}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all',
            'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
            'shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Updating Password…</>
          ) : (
            <><ShieldCheck className="w-4 h-4" /> Reset Password</>
          )}
        </button>
      </form>

      <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </Link>
    </motion.div>
  );
};
