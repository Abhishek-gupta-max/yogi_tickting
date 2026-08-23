import { format, formatDistanceToNow, isPast, differenceInMinutes, differenceInHours, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@/config/app.config';

// Inline types to avoid circular imports from features
type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
type TicketStatus = 'new' | 'open' | 'assigned' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';

export const dateUtils = {
  format: (date: Date | string, fmt = DATE_FORMATS.display) =>
    format(typeof date === 'string' ? parseISO(date) : date, fmt),

  formatDatetime: (date: Date | string) =>
    format(typeof date === 'string' ? parseISO(date) : date, DATE_FORMATS.datetime),

  formatRelative: (date: Date | string) =>
    formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }),

  isOverdue: (dueDate: Date | string) =>
    isPast(typeof dueDate === 'string' ? parseISO(dueDate) : dueDate),

  getSLAStatus: (dueDate: Date | string): 'normal' | 'warning' | 'breached' => {
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    const minsLeft = differenceInMinutes(due, new Date());
    if (minsLeft < 0) return 'breached';
    if (minsLeft < 60) return 'warning';
    return 'normal';
  },

  getTimeRemaining: (dueDate: Date | string): string => {
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    if (isPast(due)) return 'Overdue';
    const hoursLeft = differenceInHours(due, new Date());
    if (hoursLeft < 1) return `${differenceInMinutes(due, new Date())}m left`;
    if (hoursLeft < 24) return `${hoursLeft}h left`;
    return `${Math.floor(hoursLeft / 24)}d left`;
  },
};

// Format utils
export const formatUtils = {
  ticketId: (id: string | number) => `TKT-${String(id).padStart(6, '0')}`,
  truncate:  (text: string, length = 100) => text.length > length ? `${text.slice(0, length)}…` : text,
  initials:  (name: string) => name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase(),
  bytesToHuman: (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },
  toTitleCase: (str: string) => str.replace(/\b\w/g, (c) => c.toUpperCase()),
  toCamelCase: (str: string) => str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
  toSlug: (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
  pluralize: (count: number, singular: string, plural?: string) =>
    count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + 's'}`,
};

// Color utils

export const priorityColorMap: Record<TicketPriority, { bg: string; text: string; border: string; dot: string }> = {
  low:      { bg: 'bg-slate-100 dark:bg-slate-800',  text: 'text-slate-600 dark:text-slate-300',  border: 'border-slate-200', dot: 'bg-slate-400' },
  medium:   { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  high:     { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200', dot: 'bg-orange-500' },
  critical: { bg: 'bg-red-50 dark:bg-red-900/20',    text: 'text-red-700 dark:text-red-400',    border: 'border-red-200',    dot: 'bg-red-500'  },
};

export const statusColorMap: Record<TicketStatus, { bg: string; text: string }> = {
  new:                    { bg: 'bg-indigo-50 dark:bg-indigo-900/20',  text: 'text-indigo-700 dark:text-indigo-400'  },
  open:                   { bg: 'bg-blue-50 dark:bg-blue-900/20',      text: 'text-blue-700 dark:text-blue-400'      },
  assigned:               { bg: 'bg-purple-50 dark:bg-purple-900/20',  text: 'text-purple-700 dark:text-purple-400'  },
  in_progress:            { bg: 'bg-cyan-50 dark:bg-cyan-900/20',      text: 'text-cyan-700 dark:text-cyan-400'      },
  waiting_for_customer:   { bg: 'bg-amber-50 dark:bg-amber-900/20',    text: 'text-amber-700 dark:text-amber-400'    },
  resolved:               { bg: 'bg-green-50 dark:bg-green-900/20',    text: 'text-green-700 dark:text-green-400'    },
  closed:                 { bg: 'bg-slate-100 dark:bg-slate-800',      text: 'text-slate-600 dark:text-slate-300'    },
};

// String utils
export const stringUtils = {
  isEmpty:     (s: string | null | undefined): boolean => !s || s.trim().length === 0,
  isNotEmpty:  (s: string | null | undefined): boolean => !!s && s.trim().length > 0,
  capitalizeFirst: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
  stripHtml:   (html: string) => html.replace(/<[^>]*>/g, ''),
  countWords:  (s: string) => s.trim().split(/\s+/).filter(Boolean).length,
};
