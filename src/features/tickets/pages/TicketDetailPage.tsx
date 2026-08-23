import type { FC } from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MessageSquare, Lock, Send, UserCheck, CheckCircle,
  RotateCcw, Clock, Paperclip, Activity, AlertTriangle, Loader2,
  Tag, Users, Link2, ChevronRight, Eye, ThumbsUp, Heart, Smile,
  FileText, Image as ImageIcon, Download, ExternalLink, Plus,
  MessageCircle, GitCommit, UserPlus, Shield, X,
} from 'lucide-react';
import {
  useTicket, useUpdateTicketStatus, useAssignTicket,
  useTicketComments, useAddComment, useTicketTimeline,
} from '../hooks/useTickets';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { TicketPriorityBadge } from '../components/TicketPriorityBadge';
import { dateUtils, formatUtils } from '@/shared/utils';
import type { TicketStatus } from '../types/ticket.types';
import { STATUS_LABELS, TICKET_TRANSITIONS } from '../types/ticket.types';
import { PageLoader, ErrorState } from '@/shared/components/feedback';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

// Mock data for static display enhancements
const MOCK_WATCHERS = [
  { id: 'w1', name: 'Eleanor Vance',  initials: 'EV', color: 'from-purple-500 to-violet-600' },
  { id: 'w2', name: 'Marcus Brody',   initials: 'MB', color: 'from-emerald-500 to-teal-600' },
  { id: 'w3', name: 'Clara Oswald',   initials: 'CO', color: 'from-amber-500 to-orange-600' },
];

const MOCK_ATTACHMENTS = [
  { id: 'att-1', name: 'error-screenshot.png',  size: '1.2 MB', type: 'image' },
  { id: 'att-2', name: 'stacktrace-dump.txt',   size: '24 KB',  type: 'text' },
  { id: 'att-3', name: 'diagnostic-report.pdf', size: '3.8 MB', type: 'pdf' },
];

const MOCK_RELATED = [
  { id: 'rel-1', ticketNumber: 'TKT-000098', subject: 'Okta integration timeout on enterprise SSO', priority: 'high', status: 'resolved' },
  { id: 'rel-2', ticketNumber: 'TKT-000089', subject: 'SAML 2.0 configuration error in staging', priority: 'medium', status: 'closed' },
];

const EMOJI_REACTIONS = ['👍', '❤️', '👀', '🎉', '😮'];

const SLA_COLORS: Record<string, string> = {
  breached: 'bg-red-500/10 border-red-500/20 text-red-500',
  at_risk:  'bg-amber-500/10 border-amber-500/20 text-amber-500',
  ok:       'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
};

const TIMELINE_ICONS: Record<string, { icon: FC<any>; color: string }> = {
  created:    { icon: Plus,          color: 'bg-indigo-500' },
  assigned:   { icon: UserCheck,     color: 'bg-purple-500' },
  status:     { icon: GitCommit,     color: 'bg-blue-500' },
  comment:    { icon: MessageCircle, color: 'bg-slate-500' },
  internal:   { icon: Lock,          color: 'bg-amber-500' },
  resolved:   { icon: CheckCircle,   color: 'bg-emerald-500' },
  sla_breach: { icon: AlertTriangle, color: 'bg-red-500' },
};

export const TicketDetailPage: FC = () => {
  const { ticketId = '' } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const { data: ticket, isLoading, error } = useTicket(ticketId);
  const { data: comments = [] }  = useTicketComments(ticketId);
  const { data: timeline = [] }  = useTicketTimeline(ticketId);

  const updateStatusMutation = useUpdateTicketStatus();
  const assignMutation       = useAssignTicket();
  const addCommentMutation   = useAddComment(ticketId);

  const [commentText,    setCommentText]    = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [activeTab,      setActiveTab]      = useState<'comments' | 'timeline'>('comments');
  const [watchers,       setWatchers]       = useState(MOCK_WATCHERS);
  const [reactions,      setReactions]      = useState<Record<string, string[]>>({});
  const [showAddWatcher, setShowAddWatcher] = useState(false);

  if (isLoading) return <PageLoader message="Loading ticket details…" />;
  if (error || !ticket) {
    return (
      <div className="py-12">
        <ErrorState
          title="Ticket Not Found"
          description="This ticket does not exist or has been removed."
          onRetry={() => navigate('/tickets')}
        />
      </div>
    );
  }

  const availableTransitions = TICKET_TRANSITIONS[ticket.status] || [];
  const slaStatus = ticket.slaStatus || 'ok';

  const handleStatusChange = async (newStatus: TicketStatus) => {
    await updateStatusMutation.mutateAsync({ id: ticket.id, status: newStatus });
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    await addCommentMutation.mutateAsync({ content: commentText, isInternal: isInternalNote });
    setCommentText('');
  };

  const toggleReaction = (commentId: string, emoji: string) => {
    setReactions(prev => {
      const existing = prev[commentId] || [];
      const updated  = existing.includes(emoji) ? existing.filter(e => e !== emoji) : [...existing, emoji];
      return { ...prev, [commentId]: updated };
    });
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* ─── Breadcrumb Nav ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <button onClick={() => navigate('/tickets')} className="hover:text-indigo-500 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tickets
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="font-mono font-bold text-indigo-500">{ticket.ticketNumber}</span>
      </div>

      {/* ─── Ticket Header ───────────────────────────────────── */}
      <div className="surface-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-lg font-extrabold text-indigo-500">{ticket.ticketNumber}</span>
            <TicketStatusBadge status={ticket.status} size="md" />
            <TicketPriorityBadge priority={ticket.priority} size="md" />
            {slaStatus === 'breached' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> SLA BREACHED
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={ticket.status}
              onChange={e => handleStatusChange(e.target.value as TicketStatus)}
              disabled={updateStatusMutation.isPending}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--surface-card-alt)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value={ticket.status}>Current: {STATUS_LABELS[ticket.status]}</option>
              {availableTransitions.map(st => (
                <option key={st} value={st}>→ {STATUS_LABELS[st]}</option>
              ))}
            </select>

            {!ticket.assignee && (
              <button
                onClick={() => assignMutation.mutate({ id: ticket.id, agentId: 'usr-agent-1', agentName: 'Sophia Martinez' })}
                disabled={assignMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" /> Assign to Me
              </button>
            )}

            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
              <button
                onClick={() => handleStatusChange('resolved')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Resolve
              </button>
            )}

            {(ticket.status === 'resolved' || ticket.status === 'closed') && (
              <button
                onClick={() => handleStatusChange('open')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reopen
              </button>
            )}
          </div>
        </div>

        <h1 className="text-xl font-bold text-[var(--text-primary)] leading-tight">{ticket.subject}</h1>
      </div>

      {/* ─── 2-Column Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Description */}
          <div className="surface-card p-6">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Issue Description
            </h3>
            <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>
          </div>

          {/* Activity Tabs */}
          <div className="surface-card overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--surface-border)] bg-[var(--surface-card-alt)]">
              <div className="flex items-center gap-2">
                {[
                  { id: 'comments', label: `Replies (${comments.length})`, icon: MessageSquare },
                  { id: 'timeline', label: `Audit Log (${timeline.length})`, icon: Activity },
                ] .map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                        activeTab === tab.id ? 'bg-[var(--surface-card)] text-indigo-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* ─ Comments Tab ─ */}
              {activeTab === 'comments' && (
                <div className="space-y-5">
                  {/* Reply Composer */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-[var(--surface-bg)] rounded-xl p-1 w-fit border border-[var(--surface-border)]">
                      <button
                        onClick={() => setIsInternalNote(false)}
                        className={clsx('px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5',
                          !isInternalNote ? 'bg-[var(--surface-card)] text-indigo-500 shadow-sm' : 'text-[var(--text-muted)]')}
                      >
                        <Eye className="w-3 h-3" /> Public Reply
                      </button>
                      <button
                        onClick={() => setIsInternalNote(true)}
                        className={clsx('px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5',
                          isInternalNote ? 'bg-amber-500/15 text-amber-500 shadow-sm' : 'text-[var(--text-muted)]')}
                      >
                        <Lock className="w-3 h-3" /> Internal Note
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder={isInternalNote ? '🔒 Internal note — only visible to agents…' : 'Reply to customer… (@mention to notify agents)'}
                      className={clsx(
                        'w-full p-3.5 rounded-xl text-sm outline-none resize-none transition-all',
                        'bg-[var(--surface-bg)] border',
                        isInternalNote
                          ? 'border-amber-500/30 focus:ring-2 focus:ring-amber-500/25 bg-amber-500/3'
                          : 'border-[var(--surface-border)] focus:ring-2 focus:ring-indigo-500/25 text-[var(--text-primary)]'
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => toast.success('Attach file to comment')} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface-hover)]" title="Attach file">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <motion.button
                        onClick={handlePostComment}
                        disabled={!commentText.trim() || addCommentMutation.isPending}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className={clsx(
                          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md',
                          isInternalNote ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                      >
                        {addCommentMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        {isInternalNote ? 'Add Note' : 'Post Reply'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Comment Thread */}
                  <div className="space-y-4 pt-4 border-t border-[var(--surface-border)]">
                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
                        <p className="text-xs text-[var(--text-muted)]">No replies yet — start the conversation</p>
                      </div>
                    ) : (
                      comments.map(cm => (
                        <motion.div
                          key={cm.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={clsx(
                            'p-4 rounded-xl border transition-all group',
                            cm.isInternal ? 'bg-amber-500/3 border-amber-500/15' : 'bg-[var(--surface-card-alt)] border-[var(--surface-border)]'
                          )}
                        >
                          <div className="flex items-start justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                                {formatUtils.initials(cm.author.fullName)}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[var(--text-primary)]">{cm.author.fullName}</span>
                                {cm.isInternal && (
                                  <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Lock className="w-2.5 h-2.5" /> Internal Note
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[11px] text-[var(--text-muted)]">{dateUtils.formatRelative(cm.createdAt)}</span>
                          </div>

                          <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line mb-3">
                            {cm.content}
                          </p>

                          {/* Emoji Reactions */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(reactions[cm.id] || []).map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => toggleReaction(cm.id, emoji)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-indigo-400 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {EMOJI_REACTIONS.map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction(cm.id, emoji)}
                                  className="text-sm hover:scale-125 transition-transform"
                                  title={`React with ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ─ Timeline Tab ─ */}
              {activeTab === 'timeline' && (
                <div className="space-y-0">
                  {timeline.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-10 h-10 text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
                      <p className="text-xs text-[var(--text-muted)]">No activity recorded yet</p>
                    </div>
                  ) : (
                    timeline.map(evt => {
                      const conf = TIMELINE_ICONS[evt.type] || TIMELINE_ICONS.status;
                      const Icon = conf.icon;
                      return (
                        <div key={evt.id} className="timeline-item">
                          <div className={clsx('timeline-dot', conf.color)}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className="text-xs font-medium text-[var(--text-primary)]">{evt.description}</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              by <span className="font-semibold">{evt.actor.fullName}</span> · {dateUtils.formatRelative(evt.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
        <div className="space-y-4">

          {/* SLA Status */}
          <div className="surface-card p-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> SLA Target
            </h3>
            <div className={clsx('p-3 rounded-xl border flex items-center justify-between text-xs', SLA_COLORS[slaStatus] || SLA_COLORS.ok)}>
              <span className="font-semibold">Due in</span>
              <span className="font-extrabold tabular-nums">{dateUtils.getTimeRemaining(ticket.dueDate || '')}</span>
            </div>
            {slaStatus === 'breached' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-red-500 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Resolution overdue — escalate now
              </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="surface-card p-4 space-y-3 text-xs">
            <h3 className="font-extrabold uppercase tracking-widest text-[var(--text-muted)] pb-2 border-b border-[var(--surface-border)] text-[10px]">
              Ticket Details
            </h3>
            {[
              { label: 'Customer',   value: ticket.customer?.fullName || 'Anonymous', sub: ticket.customer?.email },
              { label: 'Assignee',   value: ticket.assignee?.fullName || 'Unassigned' },
              { label: 'Department', value: ticket.departmentId || 'IT Helpdesk' },
              { label: 'Category',   value: ticket.category || '—' },
              { label: 'Created',    value: dateUtils.formatDatetime(ticket.createdAt) },
              { label: 'Updated',    value: dateUtils.formatRelative(ticket.updatedAt) },
            ].map(row => (
              <div key={row.label}>
                <span className="text-[var(--text-muted)] block mb-0.5">{row.label}</span>
                <span className="font-semibold text-[var(--text-primary)]">{row.value}</span>
                {row.sub && <span className="block text-[10px] text-[var(--text-muted)]">{row.sub}</span>}
              </div>
            ))}
          </div>

          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="surface-card p-4 space-y-2">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-indigo-500" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ticket.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Watchers */}
          <div className="surface-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-indigo-500" /> Watchers ({watchers.length})
              </h3>
              <button
                onClick={() => { setShowAddWatcher(!showAddWatcher); toast.success('Watcher invitation sent!'); }}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-indigo-500 hover:bg-indigo-500/5 transition-colors"
                title="Add watcher"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchers.map(w => (
                <div key={w.id} title={w.name} className="relative group">
                  <div className={clsx('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold cursor-pointer shadow-sm', w.color)}>
                    {w.initials}
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {w.name}
                  </div>
                </div>
              ))}
              <button
                onClick={() => toast.success('Watcher added!')}
                className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--surface-border)] flex items-center justify-center text-[var(--text-muted)] hover:border-indigo-500/50 hover:text-indigo-500 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div className="surface-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" /> Attachments ({MOCK_ATTACHMENTS.length})
              </h3>
              <button onClick={() => toast.success('Upload attachment')} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-indigo-500 hover:bg-indigo-500/5 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {MOCK_ATTACHMENTS.map(att => (
                <div key={att.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] group hover:border-indigo-500/30 transition-colors">
                  {att.type === 'image'
                    ? <ImageIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    : <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[var(--text-primary)] truncate">{att.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{att.size}</div>
                  </div>
                  <button onClick={() => toast.success(`Downloading ${att.name}…`)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[var(--text-muted)] hover:text-indigo-500 transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tickets */}
          <div className="surface-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                <Link2 className="w-3.5 h-3.5 text-indigo-500" /> Related Tickets
              </h3>
              <button onClick={() => toast.success('Link related ticket')} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-indigo-500 hover:bg-indigo-500/5 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {MOCK_RELATED.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => navigate(`/tickets/${rt.id}`)}
                  className="w-full text-left p-2.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-indigo-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-indigo-500">{rt.ticketNumber}</span>
                    <span className={clsx('text-[9px] font-extrabold px-1.5 py-0.5 rounded-full capitalize',
                      rt.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                    )}>{rt.status}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] group-hover:text-indigo-500 transition-colors line-clamp-2 leading-relaxed">{rt.subject}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
