import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  BookOpen,
  Send,
  LifeBuoy,
  RefreshCw,
} from 'lucide-react';
import { clsx } from 'clsx';
import { ticketsApi } from '@/features/tickets/api/tickets.api';
import type { Ticket, TicketComment } from '@/features/tickets/types/ticket.types';
import toast from 'react-hot-toast';

export const CustomerPortalPage: FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'open' | 'closed' | 'all'>('open');

  useEffect(() => {
    loadCustomerTickets();
  }, []);

  const loadCustomerTickets = async () => {
    try {
      const res = await ticketsApi.getTickets({ pageSize: 50 });
      setTickets(res.data);
      if (res.data.length > 0 && !selectedTicket) {
        setSelectedTicket(res.data[0]);
        loadComments(res.data[0].id);
      }
    } catch {
      toast.error('Failed to load tickets.');
    }
  };

  const loadComments = async (ticketId: string) => {
    try {
      const comms = await ticketsApi.getComments(ticketId);
      setComments(comms.filter((c) => !c.isInternal)); // Only public comments for customer
    } catch {
      setComments([]);
    }
  };

  const handleSelectTicket = (t: Ticket) => {
    setSelectedTicket(t);
    loadComments(t.id);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      await ticketsApi.addComment(selectedTicket.id, replyText, false);
      toast.success('Reply submitted successfully!');
      setReplyText('');
      loadComments(selectedTicket.id);
    } catch {
      toast.error('Failed to post reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'open' && (t.status === 'resolved' || t.status === 'closed')) return false;
    if (activeTab === 'closed' && t.status !== 'resolved' && t.status !== 'closed') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.ticketNumber.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Customer Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-5 h-5 text-indigo-200" />
            <h1 className="text-xl font-bold">Customer Help & Support Center</h1>
          </div>
          <p className="text-xs text-indigo-100 max-w-xl">
            Track active requests, submit new issues, attach debug logs, and communicate directly with support engineering teams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/knowledge-base"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
          >
            <BookOpen className="w-4 h-4" /> Browse FAQs
          </Link>
          <Link
            to="/tickets/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-50 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Create New Ticket
          </Link>
        </div>
      </div>

      {/* Main Grid: Ticket List + Ticket Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="surface-card p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search my tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('open')}
                className={clsx(
                  'flex-1 py-1.5 rounded-lg transition-colors',
                  activeTab === 'open' ? 'bg-[var(--surface-card)] text-indigo-500 shadow-sm' : 'text-[var(--text-muted)]'
                )}
              >
                Active ({tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length})
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={clsx(
                  'flex-1 py-1.5 rounded-lg transition-colors',
                  activeTab === 'closed' ? 'bg-[var(--surface-card)] text-indigo-500 shadow-sm' : 'text-[var(--text-muted)]'
                )}
              >
                Resolved ({tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={clsx(
                  'flex-1 py-1.5 rounded-lg transition-colors',
                  activeTab === 'all' ? 'bg-[var(--surface-card)] text-indigo-500 shadow-sm' : 'text-[var(--text-muted)]'
                )}
              >
                All ({tickets.length})
              </button>
            </div>
          </div>

          {/* Ticket Card List */}
          <div className="space-y-2.5">
            {filteredTickets.length === 0 ? (
              <div className="surface-card p-8 text-center text-xs text-[var(--text-muted)]">
                No tickets match your filter criteria.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className={clsx(
                      'p-4 rounded-xl border cursor-pointer transition-all surface-card hover:border-indigo-500/40',
                      isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5' : ''
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-semibold text-indigo-500">{t.ticketNumber}</span>
                      <span className={clsx(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full capitalize',
                        t.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        t.status === 'in_progress' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' :
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      )}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1 mb-1">{t.subject}</h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-2">{t.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-t border-[var(--surface-border)] pt-2 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {t.commentCount} replies
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Ticket Details & Timeline */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="surface-card p-6 space-y-6">
              {/* Ticket Banner */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    Opened on {new Date(selectedTicket.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">{selectedTicket.subject}</h2>
                <div className="p-3.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Status Stepper */}
              <div className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">Ticket Status Lifecycle</p>
                <div className="flex items-center justify-between relative">
                  {['new', 'open', 'assigned', 'in_progress', 'resolved'].map((st, i) => {
                    const steps = ['new', 'open', 'assigned', 'in_progress', 'resolved'];
                    const currentIdx = steps.indexOf(selectedTicket.status);
                    const isCompleted = i <= currentIdx;
                    return (
                      <div key={st} className="flex flex-col items-center gap-1 relative z-10">
                        <div className={clsx(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                          isCompleted ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-[var(--surface-border)] text-[var(--text-muted)]'
                        )}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className="text-[10px] font-semibold capitalize text-[var(--text-muted)]">
                          {st.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Public Conversation Feed */}
              <div className="space-y-4 border-t border-[var(--surface-border)] pt-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  Support Conversation ({comments.length})
                </h3>

                {comments.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">No responses yet. Support agent will reply shortly.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--text-primary)]">{c.author.fullName}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{new Date(c.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Box */}
              <div className="space-y-2 border-t border-[var(--surface-border)] pt-4">
                <textarea
                  rows={3}
                  placeholder="Type a reply to support engineering..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">Replies are visible to support agents.</span>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={isSubmittingReply || !replyText.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card p-12 text-center text-sm text-[var(--text-muted)]">
              Select a ticket to view conversation timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
