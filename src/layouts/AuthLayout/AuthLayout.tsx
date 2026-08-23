import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: FC = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12 bg-gradient-to-b from-indigo-600/10 to-transparent border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">TicketFlow</span>
        </div>

        {/* Hero copy */}
        <div>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Enterprise Ticket Management
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Resolve faster.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Delight customers.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The centralized platform powering support teams at 500+ enterprises worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Tickets Resolved', value: '2.4M+' },
              { label: 'Avg Response Time', value: '4 min' },
              { label: 'CSAT Score', value: '98.2%' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/8">
            <p className="text-sm text-slate-300 italic leading-relaxed mb-3">
              "TicketFlow reduced our support backlog by 60% in the first month. Game-changer."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold text-white">S</div>
              <div>
                <div className="text-xs font-medium text-white">Sarah Chen</div>
                <div className="text-xs text-slate-500">VP Support, Acme Corp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500">© 2026 TicketFlow. Enterprise edition.</p>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">TicketFlow</span>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
