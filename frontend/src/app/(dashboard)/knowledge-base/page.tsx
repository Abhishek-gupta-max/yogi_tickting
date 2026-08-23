'use client';

import { AppShell } from '@/components/layout/AppShell';
import { BookOpen, Search, Eye, Plus } from 'lucide-react';

export default function KnowledgeBasePage() {
  const articles = [
    { id: 'kb-1', title: 'Troubleshooting Corporate VPN Handshake Failure', summary: 'Step-by-step resolution for IPsec gateway connection drops.', category: 'Network & Security', views: 248 },
    { id: 'kb-2', title: 'Configuring Multi-Factor Authentication (MFA)', summary: 'Guide on setting up TOTP authenticator apps.', category: 'Identity & Access', views: 182 },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Knowledge Base Center</h1>
            <p className="text-xs text-slate-500">Self-service articles and IT troubleshooting guides</p>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500">
            <Plus className="w-4 h-4" /> Publish Article
          </button>
        </div>

        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search knowledge base articles..."
            className="w-full bg-white text-xs border border-slate-200 focus:border-indigo-500 rounded-md pl-9 pr-3 py-2.5 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((a) => (
            <div key={a.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {a.category}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
              <p className="text-xs text-slate-500">{a.summary}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {a.views} views
                </span>
                <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">Read Article &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
