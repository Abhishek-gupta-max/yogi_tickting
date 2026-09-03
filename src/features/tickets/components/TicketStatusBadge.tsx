import type { FC } from 'react';
import { clsx } from 'clsx';
import type { TicketStatus } from '../types/ticket.types';
import { STATUS_LABELS } from '../types/ticket.types';

interface Props {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusStyles: Record<TicketStatus, { bg: string; dot: string }> = {
  new:                  { bg: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)]', dot: 'bg-[var(--color-primary)]' },
  open:                 { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
  assigned:             { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', dot: 'bg-purple-500' },
  in_progress:          { bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', dot: 'bg-cyan-500 animate-pulse' },
  waiting_for_customer: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
  resolved:             { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  closed:               { bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', dot: 'bg-slate-400' },
};

export const TicketStatusBadge: FC<Props> = ({ status, size = 'md', className }) => {
  const conf = statusStyles[status] || statusStyles.open;
  const sizeCls = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={clsx(
        'badge border font-medium capitalize',
        conf.bg,
        sizeCls,
        className
      )}
    >
      <span className={clsx('badge-dot', conf.dot)} />
      {STATUS_LABELS[status] || status.replace(/_/g, ' ')}
    </span>
  );
};
