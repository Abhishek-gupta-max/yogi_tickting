'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Building2, Plus } from 'lucide-react';

export default function DepartmentsPage() {
  const departments = [
    { id: 'd-1', name: 'Technical Support', code: 'TECH-SUP', description: 'Tier 1 & Tier 2 customer incident resolution', manager: 'Eleanor Vance', teams: 2, users: 8 },
    { id: 'd-2', name: 'Billing & Accounts', code: 'BILLING', description: 'Invoicing, subscription and payment queries', manager: 'Marcus Brody', teams: 1, users: 4 },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Departments Directory</h1>
            <p className="text-xs text-slate-500">Manage organizational departments, managers, and team assignments</p>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{d.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{d.code}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">{d.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Manager: <strong className="text-slate-800">{d.manager}</strong></span>
                <span className="text-[11px] text-slate-400">{d.teams} Teams &bull; {d.users} Members</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
