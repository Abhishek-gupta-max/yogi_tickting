import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Valid email required'),
  password:  z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

const Field: FC<{ id: string; label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }> = ({ id, label, icon, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
      {children}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

const inputCls = (hasError?: boolean) => clsx(
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500',
  'bg-white/8 border outline-none transition-all',
  'focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500',
  hasError ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
);

export const RegisterPage: FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => { await new Promise((r) => setTimeout(r, 1200)); console.log(data); };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-slate-400 text-sm">Start your TicketFlow journey today</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field id="firstName" label="First name" icon={<User className="w-4 h-4" />} error={errors.firstName?.message}>
            <input id="firstName" placeholder="Jane" {...register('firstName')} className={inputCls(!!errors.firstName)} />
          </Field>
          <Field id="lastName" label="Last name" icon={<User className="w-4 h-4" />} error={errors.lastName?.message}>
            <input id="lastName" placeholder="Doe" {...register('lastName')} className={inputCls(!!errors.lastName)} />
          </Field>
        </div>
        <Field id="email" label="Work email" icon={<Mail className="w-4 h-4" />} error={errors.email?.message}>
          <input id="email" type="email" placeholder="you@company.com" {...register('email')} className={inputCls(!!errors.email)} />
        </Field>
        <Field id="password" label="Password" icon={<Lock className="w-4 h-4" />} error={errors.password?.message}>
          <input id="password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" {...register('password')} className={inputCls(!!errors.password)} />
        </Field>
        <Field id="confirmPassword" label="Confirm password" icon={<Lock className="w-4 h-4" />} error={errors.confirmPassword?.message}>
          <input id="confirmPassword" type="password" placeholder="Repeat password" {...register('confirmPassword')} className={inputCls(!!errors.confirmPassword)} />
        </Field>
        <button
          type="submit" disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-60 active:scale-[0.98]"
        >
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</> : <>Create account <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
      </p>
    </div>
  );
};
