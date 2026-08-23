'use client';

import { AppShell } from '@/components/layout/AppShell';
import { BarChart3, TrendingUp, Users, Clock, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Reports & Analytics Engine</h1>
            <p className="text-xs text-slate-500">Service performance trends, resolution rates, and SLA compliance metrics</p>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold">
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Monthly Ticket Volume</span>
            <div className="text-2xl font-bold text-slate-900">1,248</div>
            <div className="text-xs text-emerald-600 font-semibold">+14% vs last month</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Mean Time to Resolution (MTTR)</span>
            <div className="text-2xl font-bold text-slate-900">3.8 Hours</div>
            <div className="text-xs text-emerald-600 font-semibold">-25 min MTTR reduction</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">SLA Compliance Rate</span>
            <div className="text-2xl font-bold text-emerald-600">97.2%</div>
            <div className="text-xs text-slate-400">Target &gt;95%</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
