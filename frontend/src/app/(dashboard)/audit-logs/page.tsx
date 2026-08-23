'use client';

import { AppShell } from '@/components/layout/AppShell';
import { ShieldCheck } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = [
    { id: 'al-1', action: 'USER_LOGIN', user: 'Eleanor Vance', entity: 'User', ip: '192.168.1.45', time: '2026-08-10 10:25 AM' },
    { id: 'al-2', action: 'TICKET_CREATED', user: 'John Doe', entity: 'Ticket (TKT-000001)', ip: '192.168.1.88', time: '2026-08-10 10:30 AM' },
    { id: 'al-3', action: 'ROLE_ASSIGNED', user: 'Eleanor Vance', entity: 'User (agent@acme.com)', ip: '192.168.1.45', time: '2026-08-10 11:00 AM' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Security Audit Trail</h1>
          <p className="text-xs text-slate-500">Immutable security logs, user authentication events, and data mutations</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action Event</th>
                <th className="px-4 py-3">Performed By</th>
                <th className="px-4 py-3">Entity Target</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{l.time}</td>
                  <td className="px-4 py-3 font-bold text-indigo-600">{l.action}</td>
                  <td className="px-4 py-3 text-slate-800 font-sans font-medium">{l.user}</td>
                  <td className="px-4 py-3 text-slate-600 font-sans">{l.entity}</td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
