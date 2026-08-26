import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  { id: 'agt-1', name: 'Sophia Martinez' },
  { id: 'agt-2', name: 'Marcus Brody' },
  { id: 'agt-3', name: 'Eleanor Vance' },
  { id: 'agt-4', name: 'Clara Oswald' },
];

const PRIORITIES: { value: TicketPriority; label: string; desc: string }[] = [
  { value: 'low',      label: 'Low',      desc: 'Minor issue, non-urgent (SLA: 24h)' },
  { value: 'medium',   label: 'Medium',   desc: 'Standard issue (SLA: 8h)' },
  { value: 'high',     label: 'High',     desc: 'Service degradation (SLA: 2h)' },
  { value: 'critical', label: 'Critical', desc: 'Outage / breach (SLA: 30m)' },
];

export const CreateTicketPage: FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>(['helpdesk']);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: '', description: '', category: 'Software & Apps', departmentId: 'dept-it', priority: 'medium' },
  });

  const currentPriority = watch('priority');
  const currentCategory = watch('category');
  const subcategories   = CATEGORIES[currentCategory] || [];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Header Bar */}
      <div className="page-header-row">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Link to="/tickets" className="btn-enterprise btn-enterprise-secondary btn-icon-sm">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-page-title text-[var(--text-primary)]">Create Ticket</h1>
          </div>
          <p className="text-body-std text-[var(--text-secondary)]">Submit a request to route to the appropriate department and agent</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="surface-card p-6 space-y-5">
          {/* Subject Line */}
          <div className="form-field">
            <label className="form-label">Subject Line *</label>
            <input
              type="text"
              placeholder="e.g. Unable to access SSO portal on mobile device"
              {...register('subject')}
              className={clsx('field-input', errors.subject && 'field-input-error')}
            />
            {errors.subject && <p className="form-error">{errors.subject.message}</p>}
          </div>

          {/* Dept + Category + Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-field">
              <label className="form-label">Department *</label>
              <select {...register('departmentId')} className="field-input cursor-pointer">
                {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Category *</label>
              <select {...register('category')} className="field-input cursor-pointer">
                {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Subcategory</label>
              <select {...register('subcategory')} className="field-input cursor-pointer">
                <option value="">— Select —</option>
                {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Assign To</label>
              <select {...register('assigneeId')} className="field-input cursor-pointer">
                <option value="">Auto-assign</option>
                {AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Due Date</label>
              <input type="datetime-local" {...register('dueDate')} className="field-input cursor-pointer" />
            </div>
          </div>

          {/* Priority Cards */}
          <div className="form-field">
            <label className="form-label">Priority Level *</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PRIORITIES.map(p => {
                const selected = currentPriority === p.value;
                return (
                  <div
                    key={p.value}
                    onClick={() => setValue('priority', p.value)}
                    className={clsx(
                      'p-3.5 rounded-lg border cursor-pointer transition-all',
                      selected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]'
                        : 'border-[var(--surface-border)] bg-[var(--surface-bg)] hover:border-slate-400'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[13px] text-[var(--text-primary)] capitalize">{p.label}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />}
                    </div>
                    <p className="text-caption text-[var(--text-muted)]">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <label className="form-label">Detailed Description *</label>
            <textarea
              rows={6}
              placeholder="Provide step-by-step instructions to reproduce the issue, error messages, and expected behavior…"
              {...register('description')}
              className={clsx('field-input h-auto py-3 font-sans resize-y', errors.description && 'field-input-error')}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          {/* Tags */}
          <div className="form-field">
            <label className="form-label">Tags</label>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="badge bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className="field-input field-input-sm"
              />
              <button type="button" onClick={handleAddTag} className="btn-enterprise btn-enterprise-secondary btn-sm">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between">
          <Link to="/tickets" className="btn-enterprise btn-enterprise-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn-enterprise btn-enterprise-primary">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Ticket</>}
          </button>
        </div>
      </form>
    </div>
  );
};
