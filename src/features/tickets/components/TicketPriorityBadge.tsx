import type { FC } from 'react';
import { clsx } from 'clsx';
import { ShieldAlert, AlertCircle, ArrowUpCircle, MinusCircle } from 'lucide-react';
import type { TicketPriority } from '../types/ticket.types';
import { PRIORITY_LABELS } from '../types/ticket.types';

interface Props {
  priority: TicketPriority;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const priorityStyles: Record<TicketPriority, { bg: string; border: string; icon: any }> = {
  low: {
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    border: 'border-slate-300/60 dark:border-slate-700/60',
    icon: MinusCircle,
  },
  medium: {
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    icon: ArrowUpCircle,
  },
  high: {
    bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
    icon: AlertCircle,
  },
  critical: {
    bg: 'bg-red-500/10 text-red-600 dark:text-red-400 font-semibold',
    border: 'border-red-500/40 animate-pulse',
    icon: ShieldAlert,
  },
};

export const TicketPriorityBadge: FC<Props> = ({
  priority,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const conf = priorityStyles[priority] || priorityStyles.low;
  const Icon = conf.icon;

  const sizeCls = size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-[11px] px-2.5 py-0.5 gap-1.5';

  return (
    <span
      className={clsx(
        'badge border font-medium capitalize',
        conf.bg,
        conf.border,
        sizeCls,
        className
      )}
    >
      {showIcon && <Icon className={clsx('flex-shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />}
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
};
