import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, Ticket, Send } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setSubmitted(true);
    toast.success('Password reset link sent!');
  };

  return (
    <div className="animate-fade-in">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/10">
                <Mail className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-1.5 tracking-tight text-center">
                Forgot your password?
              </h1>
              <p className="text-slate-400 text-sm text-center leading-relaxed">
                Enter your work email and we'll send a reset link to your inbox within seconds.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@company.com"
                    className={clsx(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500',
                      'bg-white/8 border transition-all outline-none',
                      'focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500',
                      error ? 'border-red-500/60 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                    )}
                  />
                </div>
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className={clsx(
                  'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all',
                  'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
                  'shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending Reset Link…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Reset Link</>
                )}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 250, damping: 20 }}
              className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <h2 className="text-xl font-extrabold text-white mb-2">Check your inbox!</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              We've sent a password reset link to{' '}
              <span className="text-indigo-300 font-semibold">{email}</span>.
              <br />
              The link expires in 15 minutes.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 mb-6 text-left">
              <p className="text-xs font-semibold text-slate-400 mb-2">Didn't receive it?</p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait up to 2 minutes for delivery</li>
              </ul>
            </div>

            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Try a different email
            </button>

            <Link
              to="/login"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
            >
              Back to Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
