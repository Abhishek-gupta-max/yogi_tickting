'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Users, Plus, Mail, Shield, UserCheck } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 'usr-1', name: 'Eleanor Vance', email: 'admin@acme.com', role: 'ORGANIZATION_ADMIN', department: 'Executive', team: 'Management', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Sophia Martinez', email: 'agent@acme.com', role: 'AGENT', department: 'Technical Support', team: 'L1 Escalation', status: 'ACTIVE' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tenant User Directory</h1>
            <p className="text-xs text-slate-500">Manage user accounts, roles, and department assignments</p>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500">
            <Plus className="w-4 h-4" /> Invite User
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.department}</td>
                  <td className="px-4 py-3 text-slate-600">{u.team}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {u.status}
                    </span>
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
