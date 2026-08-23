'use client';

import { AppShell } from '@/components/layout/AppShell';
import { CheckSquare, Check, X, Clock } from 'lucide-react';

export default function ApprovalsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pending Approvals Workflow</h1>
          <p className="text-xs text-slate-500">Review and action high-impact ticket approval requests</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-600 text-xs">TKT-000001</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">APPROVAL PENDING</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mt-1">Requesting VPN Gateway Access for External Auditor</h3>
              <p className="text-xs text-slate-500 mt-0.5">Requested by: Eleanor Vance &bull; 2 hours ago</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold">
                <X className="w-4 h-4" /> Reject
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold">
                <Check className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
