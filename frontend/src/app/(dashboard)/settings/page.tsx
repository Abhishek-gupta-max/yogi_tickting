'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Settings, Building, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tenant Organization Settings</h1>
          <p className="text-xs text-slate-500">Configure tenant profile, default ticket priorities, and email integrations</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Organization Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue="Acme Enterprises"
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tenant Code</label>
              <input
                type="text"
                disabled
                defaultValue="ACME"
                className="w-full bg-slate-100 border border-slate-200 rounded-md px-3 py-2 text-slate-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
            <input
              type="email"
              defaultValue="support@acme.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md text-xs">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
