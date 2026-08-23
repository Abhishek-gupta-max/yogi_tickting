import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const OTP_LENGTH = 6;

export const TwoFactorPage: FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isTrusted, setIsTrusted] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setError('');
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    text.split('').forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    // Simulate: any complete code works in demo
    if (code === '000000') {
      setError('Invalid code. Try demo code: 123456');
      return;
    }
    toast.success('Verified! Welcome to your workspace.');
    navigate('/dashboard');
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setResendTimer(30);
    setError('');
    inputRefs.current[0]?.focus();
    toast.success('New verification code sent to your device');
  };

  // Auto-verify when all digits entered
  useEffect(() => {
    if (otp.every(d => d !== '')) handleVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="animate-fade-in"
    >
      {/* Header */}
      <div className="mb-7 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/10 relative">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f172a] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-1.5 tracking-tight">
          Two-Factor Authentication
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Enter the 6-digit code from your authenticator app or SMS to continue.
        </p>
      </div>

      {/* OTP Input */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-4">
          Verification Code
        </label>
        <div className="flex gap-2.5 justify-center">
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className={clsx(
                'w-12 h-14 text-center text-xl font-bold rounded-xl',
                'bg-white/8 border-2 outline-none transition-all duration-150',
                'text-white caret-indigo-400',
                error
                  ? 'border-red-500/60 bg-red-500/5'
                  : digit
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/20'
                  : 'border-white/15 hover:border-white/30 focus:border-indigo-500 focus:bg-indigo-500/5'
              )}
            />
          ))}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-xs text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Verify Button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading || otp.some(d => !d)}
        className={clsx(
          'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white mb-4 transition-all',
          'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500',
          'shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" /> Verify & Sign In</>
        )}
      </button>

      {/* Trusted Device */}
      <div className="flex items-center gap-2.5 mb-5 px-1">
        <input
          id="trusted"
          type="checkbox"
          checked={isTrusted}
          onChange={(e) => setIsTrusted(e.target.checked)}
          className="w-4 h-4 rounded border-white/20 bg-white/8 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
        />
        <label htmlFor="trusted" className="text-xs text-slate-400 cursor-pointer">
          Trust this device for 30 days
        </label>
      </div>

      {/* Resend */}
      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-xs text-slate-500">
            Resend code in <span className="text-indigo-400 font-bold tabular-nums">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Resend verification code
          </button>
        )}
      </div>

      {/* Info box */}
      <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/8 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">Having trouble?</p>
        <p>Use your recovery codes or contact your IT administrator to reset 2FA access.</p>
      </div>

      <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </Link>
    </motion.div>
  );
};
