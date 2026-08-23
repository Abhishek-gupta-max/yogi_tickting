import type { FC } from 'react';
import { clsx } from 'clsx';
import type { TicketStatus } from '../types/ticket.types';
import { STATUS_LABELS } from '../types/ticket.types';

interface Props {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusStyles: Record<TicketStatus, string> = {
  new:                  'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  open:                 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
  assigned:             'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  in_progress:          'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  waiting_for_customer: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  resolved:             'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  closed:               'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
};

const statusDot: Record<TicketStatus, string> = {
  new:                  'bg-indigo-500',
  open:                 'bg-blue-500',
  assigned:             'bg-purple-500',
  in_progress:          'bg-cyan-500 animate-pulse',
  waiting_for_customer: 'bg-amber-500',
  resolved:             'bg-emerald-500',
  closed:               'bg-slate-400',
};

export const TicketStatusBadge: FC<Props> = ({ status, size = 'md', className }) => {
  const sizeCls = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        statusStyles[status] || statusStyles.open,
        sizeCls,
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', statusDot[status])} />
      {STATUS_LABELS[status] || status}
    </span>
  );
};
