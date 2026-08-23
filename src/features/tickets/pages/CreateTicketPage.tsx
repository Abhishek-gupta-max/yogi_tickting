import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Ticket, Send, Paperclip, Tag as TagIcon,
  Building2, FolderTree, ShieldAlert, Loader2, CheckCircle2,
  Calendar, UserCheck, Save, X, Upload, Image, FileText,
  Bold, Italic, Code, List, Link2, Quote,
} from 'lucide-react';
import { clsx } from 'clsx';
import { ticketsApi } from '../api/tickets.api';
import type { TicketPriority } from '../types/ticket.types';
import toast from 'react-hot-toast';

const schema = z.object({
  subject:      z.string().min(5, 'Subject must be at least 5 characters'),
  description:  z.string().min(15, 'Description must be at least 15 characters'),
  category:     z.string().min(1, 'Please select a category'),
  subcategory:  z.string().optional(),
  departmentId: z.string().min(1, 'Please select a department'),
  priority:     z.enum(['low', 'medium', 'high', 'critical']),
  assigneeId:   z.string().optional(),
  dueDate:      z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES: Record<string, string[]> = {
  'Software & Apps':        ['Desktop App', 'Mobile App', 'Web Portal', 'API Integration'],
  'Hardware & Equipment':   ['Laptop', 'Monitor', 'Printer', 'Peripheral'],
  'Network & Infrastructure': ['VPN', 'Wi-Fi', 'Firewall', 'DNS'],
  'Security & Auth':        ['SSO / SAML', 'MFA', 'Password Reset', 'Account Lockout'],
  'Billing & Subscriptions':['Invoice', 'Payment Failure', 'Plan Upgrade', 'Refund'],
  'HR & Employee Requests': ['Onboarding', 'Offboarding', 'Policy', 'Benefits'],
  'Feature Request':        ['New Feature', 'Enhancement', 'UX Improvement', 'API Request'],
  'General Support':        ['Account Access', 'Documentation', 'Training', 'Other'],
};

const DEPARTMENTS = [
  { id: 'dept-it',      name: 'IT Helpdesk' },
  { id: 'dept-eng',     name: 'Software Engineering' },
  { id: 'dept-devops',  name: 'DevOps & Cloud Infra' },
  { id: 'dept-finance', name: 'Billing & Finance' },
  { id: 'dept-hr',      name: 'Human Resources' },
  { id: 'dept-support', name: 'Customer Success' },
];

const AGENTS = [
  { id: 'agt-1', name: 'Sophia Martinez',  initials: 'SM', color: 'from-indigo-500 to-blue-600' },
  { id: 'agt-2', name: 'Marcus Brody',     initials: 'MB', color: 'from-emerald-500 to-teal-600' },
  { id: 'agt-3', name: 'Eleanor Vance',    initials: 'EV', color: 'from-purple-500 to-violet-600' },
  { id: 'agt-4', name: 'Clara Oswald',     initials: 'CO', color: 'from-amber-500 to-orange-600' },
];

const PRIORITIES: { value: TicketPriority; label: string; desc: string; color: string; bg: string }[] = [
  { value: 'low',      label: 'Low',      desc: 'Minor issue, non-urgent (SLA: 24h)',          color: 'text-slate-600 dark:text-slate-300',   bg: 'bg-slate-100 dark:bg-slate-800/60' },
  { value: 'medium',   label: 'Medium',   desc: 'Standard issue, single user (SLA: 8h)',        color: 'text-amber-700 dark:text-amber-300',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { value: 'high',     label: 'High',     desc: 'Service degradation, multiple users (SLA: 2h)',color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { value: 'critical', label: 'Critical', desc: 'Complete outage or security breach (SLA: 30m)',color: 'text-red-700 dark:text-red-300',       bg: 'bg-red-50 dark:bg-red-900/20', },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'border-slate-300 ring-slate-200', medium: 'border-amber-400 ring-amber-100',
  high: 'border-orange-400 ring-orange-100', critical: 'border-red-500 ring-red-100',
};

export const CreateTicketPage: FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>(['helpdesk']);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: '', description: '', category: 'Software & Apps', departmentId: 'dept-it', priority: 'medium' },
  });

  const currentPriority  = watch('priority');
  const currentCategory  = watch('category');
  const subcategories    = CATEGORIES[currentCategory] || [];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleSimulateFileDrop = () => {
    const fakeFiles = [
      { name: 'error-screenshot.png', size: '1.2 MB', type: 'image' },
      { name: 'stacktrace.txt', size: '24 KB', type: 'text' },
      { name: 'diagnostic-report.pdf', size: '3.8 MB', type: 'pdf' },
    ];
    setAttachments(prev => [...prev, fakeFiles[prev.length % 3]]);
    toast.success('File attached!');
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    toast.success('Draft saved! You can continue editing anytime.');
  };

  const applyFormat = (format: string) => {
    toast.success(`Applied: ${format} formatting`);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const created = await ticketsApi.createTicket({
        subject: data.subject, description: data.description,
        category: data.category, priority: data.priority,
        departmentId: data.departmentId, tags,
      });
      toast.success(`Ticket ${created.ticketNumber} created successfully!`);
      navigate(`/tickets/${created.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create ticket.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* ─── Header Bar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-6">
        <div className="flex items-center gap-4">
          <Link to="/tickets" className="btn-enterprise btn-enterprise-secondary h-[42px] w-[42px] px-0 justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-page-title text-[var(--text-primary)] flex items-center gap-3">
              <Ticket className="w-7 h-7 text-indigo-600 dark:text-indigo-400" /> Create Support Ticket
            </h1>
            <p className="text-body-std text-[var(--text-muted)] mt-0.5">
              Submit a request to route to the appropriate department and agent
              {isDraft && <span className="ml-2 text-amber-500 font-semibold">• Draft saved</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={handleSaveDraft}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn-enterprise btn-enterprise-secondary"
          >
            <Save className="w-4 h-4 text-amber-500" /> Save Draft
          </motion.button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ─── Main Form Card — 24px padding & 18px radius ──────── */}
        <div className="surface-card p-6 space-y-6">

          {/* Subject Line */}
          <div>
            <label className="block text-card-title text-[var(--text-primary)] mb-2">
              Subject Line <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Unable to access SSO portal on mobile device"
              {...register('subject')}
              className={clsx('field-input', errors.subject && 'border-red-500')}
            />
            {errors.subject && <p className="mt-1.5 text-small-std text-red-500">{errors.subject.message}</p>}
          </div>

          {/* Dept + Category + Subcategory — 24px Grid Gap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-body-std font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" /> Department <span className="text-red-500">*</span>
              </label>
              <select {...register('departmentId')} className="field-input cursor-pointer">
                {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-body-std font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-indigo-600" /> Category <span className="text-red-500">*</span>
              </label>
              <select {...register('category')} className="field-input cursor-pointer">
                {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-body-std font-semibold text-[var(--text-primary)] mb-2">Subcategory</label>
              <select {...register('subcategory')} className="field-input cursor-pointer">
                <option value="">— Select —</option>
                {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee + Due Date — 24px Grid Gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-body-std font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" /> Assign To
              </label>
              <select {...register('assigneeId')} className="field-input cursor-pointer">
                <option value="">Auto-assign</option>
                {AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-body-std font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" /> Due Date
              </label>
              <input
                type="datetime-local"
                {...register('dueDate')}
                className="field-input cursor-pointer"
              />
            </div>
          </div>

          {/* Priority Cards — 18px Radius & 24px Padding */}
          <div>
            <label className="block text-body-std font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" /> Priority Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRIORITIES.map(p => {
                const selected = currentPriority === p.value;
                return (
                  <motion.label
                    key={p.value}
                    onClick={() => setValue('priority', p.value)}
                    whileHover={{ scale: 1.02 }}
                    className={clsx(
                      'p-5 rounded-[18px] border-2 cursor-pointer transition-all flex flex-col justify-between gap-3',
                      selected
                        ? `${PRIORITY_COLORS[p.value]} ring-2 bg-opacity-50`
                        : 'border-[var(--surface-border)] hover:border-indigo-400/40 bg-[var(--surface-card)]',
                      selected && p.bg
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={clsx('text-badge-std px-2.5 py-1 rounded-md uppercase font-bold', p.bg, p.color, p.value === 'critical' && selected && 'animate-pulse')}>
                        {p.label}
                      </span>
                      {selected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <p className="text-small-std text-[var(--text-muted)] leading-relaxed">{p.desc}</p>
                  </motion.label>
                );
              })}
            </div>
          </div>

          {/* Description with mini Toolbar */}
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            {/* Format Toolbar */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[var(--surface-card-alt)] border border-[var(--surface-border)] border-b-0 rounded-t-xl">
              {[
                { icon: Bold,      label: 'Bold' },
                { icon: Italic,    label: 'Italic' },
                { icon: Code,      label: 'Code' },
                { icon: List,      label: 'List' },
                { icon: Link2,     label: 'Link' },
                { icon: Quote,     label: 'Quote' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => applyFormat(label)}
                  title={label}
                  className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <textarea
              rows={6}
              placeholder="Provide step-by-step instructions to reproduce the issue, error messages, and expected vs. actual behavior…"
              {...register('description')}
              className={clsx(
                'w-full px-4 py-3 text-sm outline-none transition-all font-sans resize-y rounded-b-xl rounded-t-none',
                'bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)]',
                'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
                errors.description && 'border-red-500/70'
              )}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <TagIcon className="w-4 h-4 text-indigo-500" /> Tags
            </label>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add tag (Enter to add)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--surface-border)] outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button type="button" onClick={handleAddTag} className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors">
                + Add
              </button>
            </div>
          </div>

          {/* Attachment Drop Zone */}
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-indigo-500" /> Attachments
            </label>
            <motion.div
              onClick={handleSimulateFileDrop}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
              className={clsx(
                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/5'
                  : 'border-[var(--surface-border)] hover:border-indigo-500/50 bg-[var(--surface-bg)]/50 hover:bg-indigo-500/3'
              )}
            >
              <Upload className={clsx('w-8 h-8 mx-auto mb-2.5 transition-colors', isDragging ? 'text-indigo-500' : 'text-[var(--text-muted)]')} />
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {isDragging ? 'Drop files here' : 'Click or drag files to attach'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">PNG, JPG, PDF, TXT, LOG — up to 25 MB each</p>
            </motion.div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
                    <div className="flex items-center gap-2.5">
                      {file.type === 'image' ? <Image className="w-4 h-4 text-indigo-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                      <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[var(--text-muted)]">{file.size}</span>
                      <button type="button" onClick={() => setAttachments(a => a.filter((_, i) => i !== idx))} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Submit Bar ─────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link to="/tickets" className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-60"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Ticket</>}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};
