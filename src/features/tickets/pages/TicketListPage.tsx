import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket as TicketIcon, Plus, Search, SlidersHorizontal, LayoutGrid,
  List as ListIcon, RefreshCw, Tag, MessageSquare, Filter,
  Download, Eye, EyeOff, X, ChevronDown, CheckSquare, Square,
  Trash2, UserCheck, MoreHorizontal, ArrowUpDown, AlertCircle,
  Clock, Calendar, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { TicketPriorityBadge } from '../components/TicketPriorityBadge';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { DataTable } from '@/shared/components/data-display/DataTable/DataTable';
import { useDebounce } from '@/shared/hooks';
import type { Ticket, TicketStatus, TicketPriority } from '../types/ticket.types';
import { formatUtils, dateUtils } from '@/shared/utils';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

// Skeleton Row Component
const SkeletonRow: FC = () => (
  <tr>
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className={clsx('skeleton h-4 rounded-lg', i === 1 ? 'w-48' : i === 0 ? 'w-24' : 'w-20')} />
      </td>
    ))}
  </tr>
);

// Empty State Component
const EmptyState: FC<{ filtered: boolean; onClear: () => void }> = ({ filtered, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6">
    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
      <TicketIcon className="w-10 h-10 text-indigo-400 opacity-60" />
    </div>
    <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
      {filtered ? 'No tickets match your filters' : 'No tickets yet'}
    </h3>
    <p className="text-xs text-[var(--text-muted)] text-center max-w-xs mb-6">
      {filtered
        ? 'Try adjusting or clearing your filters to see more results.'
        : 'Create your first support ticket to get started with the helpdesk queue.'}
    </p>
    {filtered ? (
      <button onClick={onClear} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/15 transition-colors">
        <X className="w-3.5 h-3.5" /> Clear All Filters
      </button>
    ) : (
      <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500 transition-all">
        <Plus className="w-4 h-4" /> Create First Ticket
      </button>
    )}
  </div>
);

const STATUS_TABS = [
  { id: 'all',                   label: 'All Tickets',  count: '142' },
  { id: 'new',                   label: 'New',          count: '12'  },
  { id: 'open',                  label: 'Open',         count: '38'  },
  { id: 'assigned',              label: 'Assigned',     count: '24'  },
  { id: 'in_progress',           label: 'In Progress',  count: '18'  },
  { id: 'waiting_for_customer',  label: 'Waiting',      count: '8'   },
  { id: 'resolved',              label: 'Resolved',     count: '31'  },
  { id: 'closed',                label: 'Closed',       count: '11'  },
];

const COLUMNS_CONFIG = [
  { key: 'ticketNumber', label: 'Ticket ID',    defaultVisible: true },
  { key: 'subject',      label: 'Subject',      defaultVisible: true },
  { key: 'status',       label: 'Status',       defaultVisible: true },
  { key: 'priority',     label: 'Priority',     defaultVisible: true },
  { key: 'assignee',     label: 'Assignee',     defaultVisible: true },
  { key: 'category',     label: 'Category',     defaultVisible: true },
  { key: 'updatedAt',    label: 'Last Activity', defaultVisible: true },
];

export const TicketListPage: FC = () => {
  const navigate = useNavigate();

  // State
  const [viewMode,       setViewMode]       = useState<'table' | 'kanban'>('table');
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page,           setPage]           = useState(1);
  const [selectedIds,    setSelectedIds]    = useState<string[]>([]);
  const [isCreateOpen,   setIsCreateOpen]   = useState(false);
  const [showFilters,    setShowFilters]    = useState(false);
  const [showColMenu,    setShowColMenu]    = useState(false);
  const [visibleCols,    setVisibleCols]    = useState<string[]>(COLUMNS_CONFIG.filter(c => c.defaultVisible).map(c => c.key));
  const [dateFilter,     setDateFilter]     = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const { data: paginatedTickets, isLoading, refetch } = useTickets({
    search: debouncedSearch,
    status:   statusFilter   !== 'all' ? (statusFilter   as TicketStatus)   : undefined,
    priority: priorityFilter !== 'all' ? (priorityFilter as TicketPriority) : undefined,
    page,
    pageSize: 10,
  });

  const updateStatusMutation = useUpdateTicketStatus();
  const tickets = paginatedTickets?.data || [];
  const meta    = paginatedTickets?.meta;

  const isFiltered = statusFilter !== 'all' || priorityFilter !== 'all' || !!search || !!dateFilter || !!assigneeFilter;

  const handleRowClick = (ticket: Ticket) => navigate(`/tickets/${ticket.id}`);

  const handleSelectRow = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSelectAll = () =>
    setSelectedIds(selectedIds.length === tickets.length ? [] : tickets.map(t => t.id));

  const handleClearFilters = () => {
    setSearch(''); setStatusFilter('all'); setPriorityFilter('all');
    setDateFilter(''); setAssigneeFilter(''); setPage(1);
  };

  const toggleCol = (key: string) =>
    setVisibleCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedIds.length} ticket(s) as CSV…`);
    setSelectedIds([]);
  };

  const handleBulkAssign = () => {
    toast.success(`${selectedIds.length} ticket(s) assigned to Sophia Martinez`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    toast.error(`${selectedIds.length} ticket(s) archived`);
    setSelectedIds([]);
  };

  // Columns definition
  const columns = COLUMNS_CONFIG
    .filter(c => visibleCols.includes(c.key))
    .map(col => {
      const def: any = { key: col.key, header: col.label };
      if (col.key === 'ticketNumber') {
        def.width = '110px';
        def.cell = (t: Ticket) => (
          <span className="font-mono text-xs font-bold text-indigo-500 dark:text-indigo-400">{t.ticketNumber}</span>
        );
      }
      if (col.key === 'subject') {
        def.cell = (t: Ticket) => (
          <div className="max-w-sm">
            <div className="font-medium text-[var(--text-primary)] hover:text-indigo-500 transition-colors line-clamp-1">{t.subject}</div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)]">
              <span>{t.category || 'General'}</span>
              {t.tags?.length > 0 && (
                <><span>·</span><span className="inline-flex items-center gap-0.5 text-indigo-400"><Tag className="w-2.5 h-2.5" />#{t.tags[0]}</span></>
              )}
            </div>
          </div>
        );
      }
      if (col.key === 'status')   def.cell = (t: Ticket) => <TicketStatusBadge status={t.status} size="sm" />;
      if (col.key === 'priority') def.cell = (t: Ticket) => <TicketPriorityBadge priority={t.priority} size="sm" />;
      if (col.key === 'category') {
        def.width = '120px';
        def.cell = (t: Ticket) => <span className="text-xs text-[var(--text-secondary)]">{t.category || '—'}</span>;
      }
      if (col.key === 'assignee') {
        def.width = '150px';
        def.cell = (t: Ticket) => t.assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {formatUtils.initials(t.assignee.fullName)}
            </div>
            <span className="text-xs text-[var(--text-primary)] truncate">{t.assignee.fullName}</span>
          </div>
        ) : <span className="text-xs text-[var(--text-muted)] italic">Unassigned</span>;
      }
      if (col.key === 'updatedAt') {
        def.width = '130px';
        def.cell = (t: Ticket) => (
          <div className="text-xs text-[var(--text-muted)]">
            <div>{dateUtils.formatRelative(t.updatedAt)}</div>
            {t.commentCount > 0 && (
              <div className="flex items-center gap-1 text-[10px] mt-0.5">
                <MessageSquare className="w-2.5 h-2.5" /> {t.commentCount}
              </div>
            )}
          </div>
        );
      }
      return def;
    });

  return (
    <div className="space-y-8 animate-fade-in pb-12">

      {/* ─── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-page-title text-[var(--text-primary)] flex items-center gap-3">
            <TicketIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" /> Support Ticket Management
          </h1>
          <p className="text-body-std text-[var(--text-muted)] mt-1">
            Centralized queue for customer requests, SLA tracking, and team collaboration
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Refresh */}
          <button
            onClick={() => refetch()}
            title="Refresh Queue"
            className="btn-enterprise btn-enterprise-secondary h-[42px] w-[42px] px-0 justify-center"
          >
            <RefreshCw className={clsx('w-5 h-5', isLoading && 'animate-spin')} />
          </button>

          {/* Export */}
          <button
            onClick={() => toast.success('Exporting tickets as CSV…')}
            className="btn-enterprise btn-enterprise-secondary h-[42px] w-[42px] px-0 justify-center"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-[var(--surface-card-alt)] border border-[var(--surface-border)] rounded-xl h-[42px]">
            <button
              onClick={() => setViewMode('table')}
              className={clsx('h-8 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5', viewMode === 'table' ? 'bg-[var(--surface-card)] text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]')}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={clsx('h-8 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5', viewMode === 'kanban' ? 'bg-[var(--surface-card)] text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]')}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
          </div>

          {/* Create Ticket */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateOpen(true)}
            className="btn-enterprise btn-enterprise-primary shadow-md"
          >
            <Plus className="w-5 h-5" /> Create Ticket
          </motion.button>
        </div>
      </div>

      {/* ─── Filter Toolbar Card ─────────────────────────────────── */}
      <div className="surface-card p-6 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--surface-border)]">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id); setPage(1); }}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-btn-std transition-all whitespace-nowrap',
                statusFilter === tab.id
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              )}
            >
              {tab.label}
              <span className={clsx('text-badge-std px-2 py-0.5 rounded-full', statusFilter === tab.id ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]')}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Filter Controls — 44px Inputs & 42px Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search — Exactly 320px width & 44px height */}
          <div className="relative w-full sm:w-80 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search ticket ID, subject, or tag…"
              className="field-input pl-10"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                className="field-input pr-8 cursor-pointer appearance-none"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'btn-enterprise btn-enterprise-secondary',
                showFilters && 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30'
              )}
            >
              <Filter className="w-5 h-5" /> Filters {isFiltered && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
            </button>

            {/* Column Visibility */}
            <div className="relative">
              <button
                onClick={() => setShowColMenu(!showColMenu)}
                className="btn-enterprise btn-enterprise-secondary"
              >
                <Eye className="w-5 h-5" /> Columns
              </button>
              {showColMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 surface-card p-2 z-50 shadow-2xl space-y-1"
                >
                  <p className="text-badge-std text-[var(--text-muted)] uppercase tracking-wider px-2 py-1">Visible Columns</p>
                  {COLUMNS_CONFIG.map(col => (
                    <button
                      key={col.key}
                      onClick={() => toggleCol(col.key)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-body-std text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      {visibleCols.includes(col.key)
                        ? <CheckSquare className="w-4 h-4 text-indigo-600" />
                        : <Square className="w-4 h-4 text-[var(--text-muted)]" />
                      }
                      {col.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Clear filters */}
            {isFiltered && (
              <button onClick={handleClearFilters} className="btn-enterprise bg-red-500/10 text-red-600 hover:bg-red-500/15 border border-red-500/20">
                <X className="w-5 h-5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filter Expansion */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-[var(--surface-border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Date Range</label>
                  <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last Quarter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Assignee</label>
                  <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
                    <option value="">All Agents</option>
                    <option value="me">Assigned to Me</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="sophia">Sophia Martinez</option>
                    <option value="marcus">Marcus Brody</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Department</label>
                  <select className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
                    <option>All Departments</option>
                    <option>IT Helpdesk</option>
                    <option>Engineering</option>
                    <option>DevOps</option>
                    <option>Billing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">SLA Status</label>
                  <select className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-primary)] focus:outline-none">
                    <option>All Statuses</option>
                    <option>Within SLA</option>
                    <option>At Risk</option>
                    <option>Breached</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bulk Action Bar ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-semibold shadow-xl shadow-indigo-500/30"
          >
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" />
              {selectedIds.length} ticket{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex-1 h-px bg-indigo-500/40" />
            <button onClick={handleBulkAssign} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
              <UserCheck className="w-3.5 h-3.5" /> Assign
            </button>
            <button onClick={() => { toast.success(`Status updated for ${selectedIds.length} tickets`); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5" /> Change Status
            </button>
            <button onClick={handleBulkExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/30 hover:bg-red-500/50 transition-colors text-red-200">
              <Trash2 className="w-3.5 h-3.5" /> Archive
            </button>
            <button onClick={() => setSelectedIds([])} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main View ───────────────────────────────────────────── */}
      {viewMode === 'table' ? (
        <div className="surface-card overflow-hidden">
          {/* Table with skeleton / empty / data states */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--surface-border)]">
                    {['', 'ID', 'Subject', 'Status', 'Priority', 'Assignee', 'Activity'].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            ) : tickets.length === 0 ? (
              <EmptyState filtered={isFiltered} onClear={handleClearFilters} />
            ) : (
              <DataTable
                columns={columns}
                data={tickets}
                isLoading={false}
                onRowClick={handleRowClick}
                page={meta?.page || 1}
                total={meta?.total || 0}
                totalPages={meta?.totalPages || 1}
                onPageChange={(p) => setPage(p)}
                selectedIds={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                getRowId={(t) => t.id}
              />
            )}
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {(['open', 'assigned', 'in_progress', 'waiting_for_customer', 'resolved'] as TicketStatus[]).map((st) => {
            const colTickets = tickets.filter(t => t.status === st);
            const STATUS_COLORS: Record<string, string> = {
              open: 'bg-blue-500/10 text-blue-500',
              assigned: 'bg-purple-500/10 text-purple-500',
              in_progress: 'bg-cyan-500/10 text-cyan-500',
              waiting_for_customer: 'bg-amber-500/10 text-amber-500',
              resolved: 'bg-emerald-500/10 text-emerald-500',
            };
            return (
              <div key={st} className="kanban-col flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--surface-border)]">
                  <div className="flex items-center gap-2">
                    <TicketStatusBadge status={st} size="sm" />
                  </div>
                  <span className={clsx('text-[10px] font-extrabold px-2 py-0.5 rounded-full', STATUS_COLORS[st] || 'bg-[var(--surface-muted)] text-[var(--text-muted)]')}>
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[60vh] scrollbar-none">
                  {colTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
                      <AlertCircle className="w-8 h-8 opacity-20 mb-2" />
                      <p className="text-[10px]">No tickets</p>
                    </div>
                  ) : (
                    colTickets.map(t => (
                      <motion.div
                        key={t.id}
                        onClick={() => handleRowClick(t)}
                        whileHover={{ y: -2 }}
                        className="p-3.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-indigo-500/40 shadow-sm cursor-pointer transition-all hover:shadow-md hover:shadow-indigo-500/5"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-2">
                          <span className="font-mono font-bold text-indigo-400">{t.ticketNumber}</span>
                          <TicketPriorityBadge priority={t.priority} size="sm" showIcon={false} />
                        </div>
                        <h4 className="text-xs font-semibold text-[var(--text-primary)] line-clamp-2 mb-3 leading-relaxed">{t.subject}</h4>
                        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2.5 border-t border-[var(--surface-border)]">
                          <span className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[8px] font-bold flex items-center justify-center">
                              {t.assignee ? formatUtils.initials(t.assignee.fullName) : '?'}
                            </div>
                            {t.assignee?.fullName || 'Unassigned'}
                          </span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{dateUtils.formatRelative(t.updatedAt)}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-[11px] font-semibold text-[var(--text-muted)] hover:text-indigo-500 hover:bg-indigo-500/5 rounded-xl border border-dashed border-[var(--surface-border)] hover:border-indigo-500/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Ticket
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
