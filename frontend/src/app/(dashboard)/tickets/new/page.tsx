'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { api } from '@/lib/api';

export default function CreateTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [customerName, setCustomerName] = useState('John Doe');
  const [customerEmail, setCustomerEmail] = useState('john@customer.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/tickets', {
        title,
        description,
        priority,
        customerName,
        customerEmail,
      });

      if (res.data.id || res.data.ticketNumber) {
        router.push(`/tickets/${res.data.ticketNumber || res.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create ticket. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tickets</span>
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Incident / Ticket</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit an IT service request or report a service disruption</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Issue Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unable to connect to VPN after system update"
              className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-md px-3 py-2 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-md px-3 py-2 outline-none text-slate-900"
              >
                <option value="LOW">LOW — Minor request</option>
                <option value="MEDIUM">MEDIUM — Standard priority</option>
                <option value="HIGH">HIGH — Significant impact</option>
                <option value="URGENT">URGENT — Critical outage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Requester Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-md px-3 py-2 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Steps to Reproduce *</label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete context, error messages, and steps taken..."
              className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-md p-3 outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Incident Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
