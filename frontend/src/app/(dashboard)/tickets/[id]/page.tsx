'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import {
  ArrowLeft,
  Clock,
  Send,
  User,
  Shield,
  Building,
  CheckCircle,
  MessageSquare,
  History,
  Lock,
} from 'lucide-react';

export default function TicketWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [activeTab, setActiveTab] = useState<'PUBLIC' | 'INTERNAL' | 'HISTORY'>('PUBLIC');
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  // Mock workspace state matching ServiceNow ticket workspace layout
  const [ticketStatus, setTicketStatus] = useState('OPEN');
  const [assignee, setAssignee] = useState('Sophia Martinez');

  return (
    <AppShell>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-indigo-600">{ticketId || 'TKT-000001'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {ticketStatus}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  HIGH PRIORITY
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Clock className="w-3 h-3" /> SLA HEALTHY
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 mt-1">
                Unable to connect to VPN after macOS Sequoia update
              </h1>
            </div>
          </div>
        </div>

        {/* 3-Column ITSM Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left / Main Section (2 Cols): Description & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Description Box */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    JD
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">John Doe (Requester)</div>
                    <div className="text-[10px] text-slate-400">Submitted on Aug 10, 2026 at 10:30 AM</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                User reports handshake timeout when attempting to connect to corporate IPsec gateway. Tested with both standard Wi-Fi and mobile hotspot.
              </p>
            </div>

            {/* Conversation Stream & Activity Tabs */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
              <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50/50">
                <button
                  onClick={() => { setActiveTab('PUBLIC'); setIsInternal(false); }}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === 'PUBLIC'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Public Reply</span>
                </button>

                <button
                  onClick={() => { setActiveTab('INTERNAL'); setIsInternal(true); }}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === 'INTERNAL'
                      ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Agent Internal Note</span>
                </button>

                <button
                  onClick={() => setActiveTab('HISTORY')}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === 'HISTORY'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Audit History</span>
                </button>
              </div>

              {/* Reply Box */}
              <div className="p-4 space-y-3">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    isInternal
                      ? 'Add an internal note visible only to support agents and managers...'
                      : 'Write a public reply to the customer...'
                  }
                  className={`w-full text-xs p-3 rounded-md border outline-none transition-colors ${
                    isInternal
                      ? 'bg-amber-50/30 border-amber-200 focus:border-amber-500'
                      : 'bg-slate-50 border-slate-200 focus:border-indigo-500'
                  }`}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">
                    {isInternal ? '🔒 Visible only to authorized agents' : '🌐 Customer will receive email notification'}
                  </span>
                  <button
                    onClick={() => setCommentText('')}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold text-white transition-colors ${
                      isInternal ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternal ? 'Post Internal Note' : 'Send Public Reply'}</span>
                  </button>
                </div>
              </div>

              {/* Comment Thread Stream */}
              <div className="divide-y divide-slate-100 border-t border-slate-100 p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    SM
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Sophia Martinez (Agent)</span>
                      <span className="text-[10px] text-slate-400">Aug 10 at 10:45 AM</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      We are investigating the VPN gateway logs. Could you confirm if you are on Cisco AnyConnect 4.10?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-amber-50/60 rounded-md border border-amber-100">
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900">Sophia Martinez (Internal Note)</span>
                      <span className="text-[10px] text-amber-600">Aug 10 at 10:48 AM</span>
                    </div>
                    <p className="text-xs text-amber-900">
                      Potential DNS routes conflict with Sequoia network filter. Escalate to DevOps if unassigned after 2h.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (1 Col): Ticket Metadata Workspace */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Ticket Controls</h3>

              {/* Status Selector */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">State Lifecycle</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-semibold text-slate-800 outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="PENDING">PENDING</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Assigned Support Agent</label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 outline-none"
                >
                  <option value="Sophia Martinez">Sophia Martinez</option>
                  <option value="Eleanor Vance">Eleanor Vance</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>

              {/* Department & Team */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold text-slate-800">Technical Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Team</span>
                  <span className="font-semibold text-slate-800">L1 Escalation</span>
                </div>
              </div>

              {/* SLA Target Section */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="font-semibold text-slate-900">SLA Commitments</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Response Due</span>
                  <span className="font-mono text-emerald-600 font-semibold">11:30 AM (In 45m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolution Due</span>
                  <span className="font-mono text-slate-800">Tomorrow 10:30 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
