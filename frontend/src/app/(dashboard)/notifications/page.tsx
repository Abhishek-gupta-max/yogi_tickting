'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Bell, Check } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { id: 'n-1', title: 'Ticket TKT-000001 Assigned', message: 'You have been assigned to ticket: Unable to connect to VPN after macOS update.', time: '10 minutes ago', isRead: false },
    { id: 'n-2', title: 'New Internal Note Added', message: 'Sophia Martinez added an internal note on ticket TKT-000001.', time: '1 hour ago', isRead: true },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Notifications Center</h1>
            <p className="text-xs text-slate-500">In-app alerts and ticket assignment notifications</p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium">
            <Check className="w-4 h-4" /> Mark All as Read
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-2xs">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 flex items-start justify-between ${!n.isRead ? 'bg-indigo-50/30' : ''}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                </div>
                <p className="text-xs text-slate-600">{n.message}</p>
                <span className="text-[10px] text-slate-400 block">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
