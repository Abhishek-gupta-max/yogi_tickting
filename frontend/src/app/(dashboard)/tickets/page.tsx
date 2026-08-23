'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Clock,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

const SAMPLE_TICKETS = [
  {
    id: 'tkt-1',
    number: 'TKT-000001',
    title: 'Unable to connect to VPN after macOS Sequoia update',
    requester: 'John Doe',
    category: 'Network & Security',
    priority: 'HIGH',
    status: 'OPEN',
    assignee: 'Sophia Martinez',
    team: 'L1 Incident Escalation',
    slaState: 'HEALTHY',
    createdAt: '2026-08-10 10:30 AM',
  },
  {
    id: 'tkt-2',
    number: 'TKT-000002',
    title: 'Billing query regarding monthly invoice line item #4',
    requester: 'Pepper Potts',
    category: 'Billing',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignee: 'Eleanor Vance',
    team: 'Accounts Team',
    slaState: 'HEALTHY',
    createdAt: '2026-08-10 11:15 AM',
  },
  {
    id: 'tkt-3',
    number: 'TKT-000003',
    title: 'Feature Request: Bulk Export analytics reports to CSV',
    requester: 'Bruce Wayne',
    category: 'Feature Request',
    priority: 'LOW',
    status: 'PENDING',
    assignee: 'Unassigned',
    team: 'Product Ops',
    slaState: 'WARNING',
    createdAt: '2026-08-10 02:00 PM',
  },
];

export default function TicketListPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Ticket Workspace</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage, filter, and assign tenant service requests</p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
          {['ALL', 'MY_TICKETS', 'UNASSIGNED', 'OPEN', 'IN_PROGRESS', 'PENDING', 'SLA_BREACHED', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Ticket # (e.g. TKT-000001), title, requester..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-md pl-9 pr-3 py-2 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Ticket #</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned Agent</th>
                  <th className="px-4 py-3">SLA Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SAMPLE_TICKETS.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                      <Link href={`/tickets/${t.number}`} className="hover:underline">
                        {t.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                      <Link href={`/tickets/${t.number}`} className="hover:text-indigo-600">
                        {t.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{t.requester}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{t.assignee}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.slaState === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {t.slaState}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{t.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
