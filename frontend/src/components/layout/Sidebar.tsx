'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  Users,
  Building2,
  Users2,
  Clock,
  CheckSquare,
  BarChart3,
  BookOpen,
  Bell,
  ShieldCheck,
  Settings,
  HelpCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Ticket Center', href: '/tickets', icon: Ticket },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Departments', href: '/departments', icon: Building2 },
  { label: 'Teams', href: '/teams', icon: Users2 },
  { label: 'SLA Policies', href: '/sla', icon: Clock },
  { label: 'Approvals', href: '/approvals', icon: CheckSquare },
  { label: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
  { label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Audit Logs', href: '/audit-logs', icon: ShieldCheck },
  { label: 'Admin Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-600/30">
          TF
        </div>
        <div>
          <span className="font-semibold text-white tracking-wide text-base">TicketFlow</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 ml-2">
            ITSM
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span>v1.0.0 Enterprise</span>
        <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-pointer" />
      </div>
    </aside>
  );
}
