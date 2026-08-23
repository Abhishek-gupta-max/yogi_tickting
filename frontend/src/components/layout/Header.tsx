'use client';

import { Search, Bell, Building, LogOut, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Global Quick Search (Ctrl+K) */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, knowledge base, users... (Ctrl+K)"
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tenant & User Right Bar */}
      <div className="flex items-center gap-4">
        {/* Tenant Organization Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Building className="w-3.5 h-3.5 text-indigo-600" />
          <span>Acme Enterprises</span>
          <span className="text-[10px] text-slate-400 font-mono">ACME</span>
        </div>

        {/* Notifications Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200"></div>

        {/* User Profile Menu */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs border border-indigo-200">
            EV
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-slate-800">Eleanor Vance</div>
            <div className="text-slate-400 font-medium text-[10px]">ORGANIZATION_ADMIN</div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('itsm_access_token');
              window.location.href = '/login';
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
