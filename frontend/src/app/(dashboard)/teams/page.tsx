'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Users2, Plus } from 'lucide-react';

export default function TeamsPage() {
  const teams = [
    { id: 't-1', name: 'L1 Incident Escalation Team', code: 'L1-ESC', department: 'Technical Support', lead: 'Sophia Martinez', members: 5 },
    { id: 't-2', name: 'DevOps Infrastructure Team', code: 'DEVOPS', department: 'Technical Support', lead: 'Alexander Wright', members: 3 },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Support Teams Directory</h1>
            <p className="text-xs text-slate-500">Configure functional support teams, leads, and member rosters</p>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500">
            <Plus className="w-4 h-4" /> Create Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{t.code} &bull; {t.department}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Team Lead: <strong className="text-slate-800">{t.lead}</strong></span>
                <span className="text-[11px] text-slate-400">{t.members} Members</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
