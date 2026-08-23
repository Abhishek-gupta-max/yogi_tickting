import type { FC } from 'react';
import { useState } from 'react';
import { Layers, Shield, Terminal, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  message: string;
  ip: string;
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-02T19:55:12Z',
    level: 'info',
    service: 'AuthService',
    message: 'User admin@ticketflow.io authenticated via JWT (Acme Org)',
    ip: '192.168.1.102',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-02T19:50:04Z',
    level: 'warn',
    service: 'SLAMonitor',
    message: 'Ticket TKT-000104 SLA target breached for high-priority payload',
    ip: '10.0.4.12',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-02T19:42:30Z',
    level: 'info',
    service: 'WorkflowEngine',
    message: 'Triggered auto-assignment rule "Auto-Assign Critical SSO" for TKT-000101',
    ip: '10.0.2.88',
  },
  {
    id: 'log-4',
    timestamp: '2026-08-02T19:30:15Z',
    level: 'info',
    service: 'DatabasePool',
    message: 'PostgreSQL connection pool reset (100/100 active connections closed)',
    ip: '127.0.0.1',
  },
];

export const SystemLogsPage: FC = () => {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            System Audit & API Event Logs
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time audit trails, authentication logs, and infrastructure events
          </p>
        </div>
        <button
          onClick={() => toast.success('Refreshed audit logs')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      {/* Terminal View Container */}
      <div className="surface-card p-4 rounded-2xl font-mono text-xs space-y-2 bg-[var(--sidebar-bg)] text-slate-200 border border-[var(--surface-border)] shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2 text-slate-400">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> Live Audit Log Output (Stream)
          </span>
          <span>Buffer: 4 events</span>
        </div>

        {logs.map((l) => (
          <div key={l.id} className="flex items-start gap-3 py-1.5 border-b border-white/5 font-mono text-[11px]">
            <span className="text-slate-500 whitespace-nowrap">{l.timestamp}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
              l.level === 'warn' ? 'bg-amber-500/20 text-amber-300' :
              l.level === 'error' ? 'bg-red-500/20 text-red-300' :
              'bg-emerald-500/20 text-emerald-300'
            }`}>
              {l.level}
            </span>
            <span className="text-indigo-400 font-bold whitespace-nowrap">[{l.service}]</span>
            <span className="text-slate-200 flex-1">{l.message}</span>
            <span className="text-slate-500">{l.ip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
