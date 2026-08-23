'use client';

import { AppShell } from '@/components/layout/AppShell';
import {
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Plus,
  Users,
  Building,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Title & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ITSM Operational Command Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time service health, SLA compliance, and ticket operations</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/tickets/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </a>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Volume</span>
              <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">1,248</span>
              <span className="text-xs text-emerald-600 font-medium ml-2 inline-flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Total recorded tenant incidents</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Open Incidents</span>
              <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">42</span>
              <span className="text-xs text-slate-500 font-medium ml-2">Active queue</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Requires agent response</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Resolved Rate</span>
              <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">96.4%</span>
              <span className="text-xs text-emerald-600 font-medium ml-2">Target &gt;95%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">First contact resolution</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">SLA Breaches</span>
              <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-rose-600">3</span>
              <span className="text-xs text-rose-600 font-medium ml-2">Escalated</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Urgent attention needed</div>
          </div>
        </div>

        {/* Priority & Agent Workload Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Incident Stream</h2>
            <div className="divide-y divide-slate-100">
              {[
                { number: 'TKT-000001', title: 'Unable to connect to VPN after macOS Sequoia update', status: 'OPEN', priority: 'HIGH', time: '10 min ago' },
                { number: 'TKT-000002', title: 'Billing query regarding monthly invoice item #4', status: 'IN_PROGRESS', priority: 'MEDIUM', time: '25 min ago' },
                { number: 'TKT-000003', title: 'Feature Request: Export CSV capability for analytics', status: 'PENDING', priority: 'LOW', time: '1 hour ago' },
              ].map((t) => (
                <div key={t.number} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">{t.number}</span>
                      <span className="text-xs font-semibold text-slate-800">{t.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{t.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Queue Metrics</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Unassigned Tickets</span>
                <span className="font-bold text-slate-800">5</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Average Response Time</span>
                <span className="font-bold text-slate-800">18 min</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Average Resolution Time</span>
                <span className="font-bold text-slate-800">4.2 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Customer CSAT</span>
                <span className="font-bold text-emerald-600">96.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
