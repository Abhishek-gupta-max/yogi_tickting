import type { FC } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Check, CheckCheck, X, AlertTriangle, UserCheck,
  TicketIcon, Shield, Settings, ToggleLeft, ToggleRight,
  Filter, MessageSquare, Zap,
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
  { id: 'n6', type: 'assignment',  priority: 'info',     read: true,  title: 'New Ticket in Your Queue',          body: 'TKT-000102 (Database connection pool exhaustion) has been routed to IT Helpdesk queue.',                     time: '3h ago'  },
  { id: 'n7', type: 'system',      priority: 'warning',  read: true,  title: 'Scheduled Maintenance Tonight',     body: 'TicketFlow will undergo planned maintenance from 02:00–04:00 UTC. SLA timers will be paused.',               time: 'Yesterday'},
  { id: 'n8', type: 'system',      priority: 'info',     read: true,  title: 'AI Routing Model Updated',          body: 'The AI ticket routing model has been updated. Accuracy improved from 89.2% to 94.7%.',                       time: 'Yesterday'},
  { id: 'n9', type: 'comment',     priority: 'info',     read: true,  title: 'Mentioned in TKT-000096',          body: 'Eleanor Vance mentioned you: "@agent please review the network diagram attachment."',                          time: '2d ago'  },
];

const TABS = [
  { id: 'all',         label: 'All',         count: (ns: Notif[]) => ns.length },
  { id: 'unread',      label: 'Unread',      count: (ns: Notif[]) => ns.filter(n => !n.read).length },
  { id: 'sla',         label: 'SLA Alerts',  count: (ns: Notif[]) => ns.filter(n => n.type === 'sla').length },
  { id: 'assignment',  label: 'Assignments', count: (ns: Notif[]) => ns.filter(n => n.type === 'assignment').length },
  { id: 'system',      label: 'System',      count: (ns: Notif[]) => ns.filter(n => n.type === 'system').length },
];

const TYPE_CONFIG: Record<NotifType, { icon: FC<any>; color: string }> = {
  sla:        { icon: AlertTriangle,  color: 'bg-red-500' },
  assignment: { icon: UserCheck,      color: 'bg-indigo-500' },
  comment:    { icon: MessageSquare,  color: 'bg-blue-500' },
  system:     { icon: Shield,         color: 'bg-slate-500' },
  ticket:     { icon: TicketIcon,     color: 'bg-emerald-500' },
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'border-l-red-500 bg-red-500/3',
  warning:  'border-l-amber-500 bg-amber-500/3',
  info:     'border-l-transparent',
};

// Group notifications by date label
function groupByDate(notifs: Notif[]): { label: string; items: Notif[] }[] {
  const groups: Record<string, Notif[]> = {};
  notifs.forEach(n => {
    const key = n.time.includes('ago') || n.time === 'Just now' ? 'Today' : n.time === 'Yesterday' ? 'Yesterday' : 'This Week';
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });
  return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

// Notification preferences state
const PREF_KEYS = [
  { key: 'email_sla',        label: 'SLA breach alerts',       ch: 'Email + Push' },
  { key: 'push_assignment',  label: 'New ticket assignments',   ch: 'Push' },
  { key: 'email_comment',    label: 'New comments / replies',   ch: 'Email' },
  { key: 'push_system',      label: 'System announcements',     ch: 'Push' },
  { key: 'email_digest',     label: 'Daily summary digest',     ch: 'Email' },
];

export const NotificationsPage: FC = () => {
  const { markAllAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('all');
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(Object.fromEntries(PREF_KEYS.map(k => [k.key, true])));
  const [activeSection, setActiveSection] = useState<'feed' | 'settings'>('feed');

  const filtered = notifs.filter(n => {
    if (activeTab === 'unread')     return !n.read;
    if (activeTab === 'all')        return true;
    return n.type === activeTab;
  });

  const grouped = groupByDate(filtered);

  const markRead = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss  = (id: string) => setNotifs(ns => ns.filter(n => n.id !== id));
  const markAllReadLocal = () => { setNotifs(ns => ns.map(n => ({ ...n, read: true }))); markAllAsRead(); toast.success('All notifications marked as read'); };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-title-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-red-500 text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">SLA alerts, assignments, comments, and system updates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection(activeSection === 'feed' ? 'settings' : 'feed')}
            className={clsx('flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
              activeSection === 'settings' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-[var(--surface-card)] border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            <Settings className="w-3.5 h-3.5" /> Preferences
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllReadLocal} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-muted)] hover:text-indigo-500 transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* New notifications banner */}
      <AnimatePresence>
        {unreadCount > 2 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            <Zap className="w-3.5 h-3.5" />
            {unreadCount} unread notifications require your attention
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeSection === 'feed' ? (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* ─── Tabs ───────────────────────────────── */}
            <div className="surface-card">
              <div className="flex items-center overflow-x-auto scrollbar-none p-1">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors',
                      activeTab === tab.id ? 'bg-indigo-500/15 text-indigo-500' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    {tab.label}
                    {tab.count(notifs) > 0 && (
                      <span className={clsx('text-[9px] font-extrabold px-1.5 py-0.5 rounded-full', activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]')}>
                        {tab.count(notifs)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Notifications List ──────────────────── */}
            <div className="surface-card overflow-hidden">
              {grouped.length === 0 ? (
                <div className="py-16 text-center">
                  <Bell className="w-12 h-12 text-[var(--text-muted)] opacity-20 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[var(--text-muted)]">All caught up!</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">No {activeTab !== 'all' ? activeTab : ''} notifications</p>
                </div>
              ) : (
                grouped.map(group => (
                  <div key={group.label}>
                    <div className="px-5 py-2 bg-[var(--surface-card-alt)] border-b border-[var(--surface-border)] text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
                      {group.label}
                    </div>
                    {group.items.map(n => {
                      const conf = TYPE_CONFIG[n.type];
                      const Icon = conf.icon;
                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className={clsx(
                            'notif-item border-l-4 cursor-pointer',
                            PRIORITY_STYLES[n.priority],
                            !n.read && 'unread'
                          )}
                          onClick={() => markRead(n.id)}
                        >
                          <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm', conf.color)}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={clsx('text-xs font-bold', !n.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]')}>
                                  {n.title}
                                </span>
                                <span className={clsx('text-[9px] font-extrabold px-1.5 py-0.5 rounded-full capitalize border',
                                  n.priority === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                  n.priority === 'warning'  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                  'hidden'
                                )}>
                                  {n.priority !== 'info' && n.priority}
                                </span>
                              </div>
                              <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">{n.body}</p>
                          </div>

                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                            <button
                              onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                              className="p-1 rounded-md text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          /* ─── Notification Settings ──────────────────── */
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card p-6 space-y-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-500" /> Notification Preferences
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Control how and when you receive alerts for each event type.</p>

            <div className="space-y-4 divide-y divide-[var(--surface-border)]">
              {PREF_KEYS.map(pref => (
                <div key={pref.key} className="flex items-center justify-between pt-4 first:pt-0">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{pref.label}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{pref.ch}</div>
                  </div>
                  <button
                    onClick={() => { setPrefs(p => ({ ...p, [pref.key]: !p[pref.key] })); toast.success(`${pref.label} ${!prefs[pref.key] ? 'enabled' : 'disabled'}`); }}
                    className="flex-shrink-0"
                  >
                    {prefs[pref.key]
                      ? <ToggleRight className="w-8 h-8 text-indigo-500" />
                      : <ToggleLeft  className="w-8 h-8 text-[var(--text-muted)]" />
                    }
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--surface-border)]">
              <button onClick={() => toast.success('Preferences saved!')} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-500/20 transition-all">
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
