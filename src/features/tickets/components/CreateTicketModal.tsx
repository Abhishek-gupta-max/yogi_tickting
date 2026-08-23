import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UploadCloud, Tag, Plus, Loader2 } from 'lucide-react';
import { useCreateTicket } from '../hooks/useTickets';
import type { TicketPriority } from '../types/ticket.types';
import { PRIORITY_LABELS } from '../types/ticket.types';
import { clsx } from 'clsx';
import { useState } from 'react';

const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(15, 'Description must be at least 15 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  category: z.string().min(1, 'Please select a category'),
  departmentId: z.string().optional(),
  tags: z.string().optional(),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: FC<Props> = ({ isOpen, onClose }) => {
  const createMutation = useCreateTicket();
  const [tagInput, setTagInput] = useState('');
  const [tagsList, setTagsList] = useState<string[]>(['support', 'urgent']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      description: '',
      priority: 'medium',
      category: 'Software Support',
    },
  });

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tagsList.includes(tagInput.trim().toLowerCase())) {
      setTagsList([...tagsList, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsList(tagsList.filter((t) => t !== tagToRemove));
  };

  const onSubmit = async (data: CreateTicketFormData) => {
    await createMutation.mutateAsync({
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      category: data.category,
      departmentId: data.departmentId,
      tags: tagsList,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="surface-card w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--surface-border)] bg-[var(--surface-card-alt)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Create New Support Ticket</h2>
            <p className="text-xs text-[var(--text-muted)]">Submit an issue or service request to the desk</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Unable to connect to SSO endpoint"
              {...register('subject')}
              className={clsx(
                'w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)]',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-[var(--text-primary)]',
                errors.subject && 'border-red-500'
              )}
            />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                {...register('priority')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-[var(--text-primary)]"
              >
                {(['low', 'medium', 'high', 'critical'] as TicketPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]} Priority
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-[var(--text-primary)]"
              >
                <option value="Software Support">Software Support</option>
                <option value="Security & Auth">Security & Auth</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Hardware Provisioning">Hardware Provisioning</option>
                <option value="Billing & Invoicing">Billing & Invoicing</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe the issue, steps to reproduce, or expected behavior..."
              {...register('description')}
              className={clsx(
                'w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--surface-bg)] border border-[var(--surface-border)]',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-[var(--text-primary)] resize-none',
                errors.description && 'border-red-500'
              )}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Tags & Labels
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type tag and press enter..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] focus:outline-none text-[var(--text-primary)]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 text-xs font-medium bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-xl text-[var(--text-primary)] hover:bg-[var(--surface-border)] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* File Upload Dropzone Mock */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Attachments (Screenshots/Logs)
            </label>
            <div className="border-2 border-dashed border-[var(--surface-border)] rounded-xl p-4 text-center hover:border-indigo-500/50 transition-colors cursor-pointer bg-[var(--surface-bg)]">
              <UploadCloud className="w-6 h-6 mx-auto text-[var(--text-muted)] mb-1" />
              <p className="text-xs text-[var(--text-primary)] font-medium">Click to upload or drag & drop files</p>
              <p className="text-[10px] text-[var(--text-muted)]">PNG, JPG, PDF, TXT up to 10MB</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--surface-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-60 transition-all"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Ticket…
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
