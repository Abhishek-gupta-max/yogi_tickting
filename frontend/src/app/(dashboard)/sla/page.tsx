'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Clock, Plus } from 'lucide-react';

export default function SLAPage() {
  const policies = [
    { id: 'sla-1', name: 'Critical Incident SLA', priority: 'URGENT', response: '15 min', resolution: '4 hours', isDefault: false },
    { id: 'sla-2', name: 'Standard Service Request SLA', priority: 'MEDIUM', response: '60 min', resolution: '24 hours', isDefault: true },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">SLA Policy Configuration</h1>
            <p className="text-xs text-slate-500">Define Service Level Agreement response and resolution time targets</p>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500">
            <Plus className="w-4 h-4" /> Add SLA Policy
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Policy Name</th>
                <th className="px-4 py-3">Priority Level</th>
                <th className="px-4 py-3">Target Response Time</th>
                <th className="px-4 py-3">Target Resolution Time</th>
                <th className="px-4 py-3">Default Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-600">{p.response}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800">{p.resolution}</td>
                  <td className="px-4 py-3">
                    {p.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Default
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
