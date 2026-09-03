import type { FC } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, CheckCheck, X, AlertTriangle, UserCheck,
  Ticket as TicketIcon, Shield, Settings,
  MessageSquare, Filter,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNotificationStore } from '@/store/ui.store';
import toast from 'react-hot-toast';

type NotifType = 'sla' | 'assignment' | 'comment' | 'system' | 'ticket';

interface Notif {
  id: string; type: NotifType; title: string; body: string;
  time: string; read: boolean; priority: 'critical' | 'warning' | 'info';
}

const INITIAL_NOTIFS: Notif[] = [
  { id: 'n1', type: 'sla',        priority: 'critical', read: false, title: 'SLA Breach — TKT-000101',           body: 'Critical ticket TKT-000101 has breached its 30-min SLA threshold. Immediate escalation required.',            time: '2m ago'  },
  { id: 'n2', type: 'sla',        priority: 'warning',  read: false, title: 'SLA At Risk — TKT-000103',          body: 'TKT-000103 is approaching its SLA deadline. Remaining time: 12 minutes.',                                     time: '8m ago'  },
  { id: 'n3', type: 'assignment',  priority: 'info',     read: false, title: 'Ticket Assigned to You',            body: 'TKT-000105 (Billing export PDF issue) has been assigned to you by Eleanor Vance.',                           time: '22m ago' },
  { id: 'n4', type: 'comment',     priority: 'info',     read: false, title: 'New Reply on TKT-000099',           body: 'Marcus Brody left a comment: "I\'ve identified the root cause. Will push a fix in 30 minutes."',             time: '1h ago'  },
  { id: 'n5', type: 'ticket',      priority: 'info',     read: true,  title: 'Ticket Status Updated — TKT-000098',body: 'TKT-000098 has been resolved by Sophia Martinez.',                                                          time: '2h ago'  },
];

const TYPE_CONFIG: Record<NotifType, { icon: FC<any>; color: string }> = {
  sla:        { icon: AlertTriangle,  color: 'bg-red-500 text-white' },
  assignment: { icon: UserCheck,      color: 'bg-[var(--color-primary)] text-white' },
  comment:    { icon: MessageSquare,  color: 'bg-blue-500 text-white' },
  system:     { icon: Shield,         color: 'bg-slate-500 text-white' },
  ticket:     { icon: TicketIcon,     color: 'bg-emerald-500 text-white' },
};

export const NotificationsPage: FC = () => {
  const { markAllAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'sla'>('all');
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);

  const filtered = notifs.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'sla') return n.type === 'sla';
    return true;
  });

  const markRead = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss  = (id: string) => setNotifs(ns => ns.filter(n => n.id !== id));
  const markAllReadLocal = () => { setNotifs(ns => ns.map(n => ({ ...n, read: true }))); markAllAsRead(); toast.success('All notifications marked as read'); };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)] flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="badge bg-red-500 text-white font-bold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-body-std text-[var(--text-secondary)]">SLA alerts, assignments, comments, and system updates</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllReadLocal} className="btn-enterprise btn-enterprise-secondary btn-sm">
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="surface-card p-3 flex items-center gap-2">
        {[
          { id: 'all',    label: 'All Notifications' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'sla',    label: 'SLA Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              activeTab === tab.id
                ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="surface-card overflow-hidden">
        <div className="divide-y divide-[var(--surface-border)]">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-10 h-10 text-[var(--text-muted)] opacity-20 mx-auto mb-2" />
              <p className="text-caption text-[var(--text-muted)]">No notifications</p>
            </div>
          ) : (
            filtered.map(n => {
              const conf = TYPE_CONFIG[n.type];
              const Icon = conf.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={clsx(
                    'p-4 flex items-start gap-3 transition-colors cursor-pointer group relative',
                    !n.read ? 'bg-[var(--surface-hover)] border-l-2 border-l-[var(--color-primary)]' : ''
                  )}
                >
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', conf.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={clsx('font-semibold flex items-center gap-1.5', !n.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]')}>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />}
                        {n.title}
                      </span>
                      <span className="text-caption text-[var(--text-muted)]">{n.time}</span>
                    </div>
                    <p className="text-caption text-[var(--text-muted)] leading-relaxed">{n.body}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }} className="p-1 rounded text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
