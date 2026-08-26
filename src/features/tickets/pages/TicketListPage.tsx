import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ticket as TicketIcon, Plus, Search, LayoutGrid,
  List as ListIcon, RefreshCw, Tag, MessageSquare, Filter,
  Download, Eye, X, ChevronDown, CheckSquare, Square,
  Trash2, UserCheck, ArrowUpDown, AlertCircle,
  Clock, ChevronRight, Upload,
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

/* ────────────────────────────────────────────────────────────
   SKELETON / EMPTY STATE
   ──────────────────────────────────────────────────────────── */
const SkeletonRow: FC = () => (
  <tr>
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className={clsx('skeleton h-4 rounded', i === 1 ? 'w-48' : i === 0 ? 'w-24' : 'w-20')} />
      </td>
    ))}
  </tr>
);

const EmptyState: FC<{ filtered: boolean; onClear: () => void }> = ({ filtered, onClear }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6">
    <div className="w-16 h-16 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center mb-4">
      <TicketIcon className="w-8 h-8 text-[var(--color-primary)] opacity-60" />
    </div>
    <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">
      {filtered ? 'No tickets match your filters' : 'No tickets yet'}
    </h3>
    <p className="text-caption text-[var(--text-muted)] text-center max-w-xs mb-5">
      {filtered
        ? 'Try changing your filters or create a new ticket.'
        : 'Create your first support ticket to get started.'}
    </p>
    {filtered ? (
      <button onClick={onClear} className="btn-enterprise btn-enterprise-secondary btn-sm">
        <X className="w-3.5 h-3.5" /> Clear All Filters
      </button>
    ) : (
      <button className="btn-enterprise btn-enterprise-primary">
        <Plus className="w-4 h-4" /> Create Ticket
      </button>
    )}
  </div>
);

/* ────────────────────────────────────────────────────────────
   CONSTANTS
   ──────────────────────────────────────────────────────────── */
const STATUS_TABS = [
  { id: 'all',                   label: 'All',          count: '142' },
  { id: 'new',                   label: 'New',          count: '12'  },
  { id: 'open',                  label: 'Open',         count: '38'  },
  { id: 'assigned',              label: 'Assigned',     count: '24'  },
  { id: 'in_progress',           label: 'In Progress',  count: '18'  },
  { id: 'waiting_for_customer',  label: 'Pending',      count: '8'   },
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

const PAGE_SIZES = [25, 50, 100];

/* ────────────────────────────────────────────────────────────
   TICKET LIST PAGE
   ──────────────────────────────────────────────────────────── */
export const TicketListPage: FC = () => {
  const navigate = useNavigate();

  const [viewMode,       setViewMode]       = useState<'table' | 'kanban'>('table');
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page,           setPage]           = useState(1);
  const [pageSize,       setPageSize]       = useState(25);
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
    pageSize,
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

  // Columns
  const columns = COLUMNS_CONFIG
    .filter(c => visibleCols.includes(c.key))
    .map(col => {
      const def: any = { key: col.key, header: col.label };
      if (col.key === 'ticketNumber') {
        def.width = '110px';
        def.cell = (t: Ticket) => (
          <span className="font-mono text-[13px] font-semibold text-[var(--color-primary)]">{t.ticketNumber}</span>
        );
      }
      if (col.key === 'subject') {
        def.cell = (t: Ticket) => (
          <div className="max-w-sm">
            <div className="font-medium text-[var(--text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1">{t.subject}</div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)]">
              <span>{t.category || 'General'}</span>
              {t.tags?.length > 0 && (
                <><span>·</span><span className="inline-flex items-center gap-0.5 text-[var(--color-primary)]"><Tag className="w-2.5 h-2.5" />#{t.tags[0]}</span></>
              )}
            </div>
          </div>
        );
      }
      if (col.key === 'status')   def.cell = (t: Ticket) => <TicketStatusBadge status={t.status} size="sm" />;
      if (col.key === 'priority') def.cell = (t: Ticket) => <TicketPriorityBadge priority={t.priority} size="sm" />;
      if (col.key === 'category') {
        def.width = '120px';
        def.cell = (t: Ticket) => <span className="text-[13px] text-[var(--text-secondary)]">{t.category || '—'}</span>;
      }
      if (col.key === 'assignee') {
        def.width = '150px';
        def.cell = (t: Ticket) => t.assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
              {formatUtils.initials(t.assignee.fullName)}
            </div>
            <span className="text-[13px] text-[var(--text-primary)] truncate">{t.assignee.fullName}</span>
          </div>
        ) : <span className="text-[13px] text-[var(--text-muted)] italic">Unassigned</span>;
      }
      if (col.key === 'updatedAt') {
        def.width = '130px';
        def.cell = (t: Ticket) => (
          <div className="text-[13px] text-[var(--text-muted)]">
            <div>{dateUtils.formatRelative(t.updatedAt)}</div>
            {t.commentCount > 0 && (
              <div className="flex items-center gap-1 text-[11px] mt-0.5">
                <MessageSquare className="w-2.5 h-2.5" /> {t.commentCount}
              </div>
            )}
          </div>
        );
      }
      return def;
    });

  return (
    <div className="space-y-6 animate-fade-in pb-8">

      {/* ─── Page Header ──────────────────────────────── */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="text-page-title text-[var(--text-primary)]">Tickets</h1>
          <p className="text-body-std text-[var(--text-secondary)]">Manage, assign and track service requests.</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} title="Refresh" className="btn-enterprise btn-enterprise-secondary btn-icon-sm">
            <RefreshCw className={clsx('w-[18px] h-[18px]', isLoading && 'animate-spin')} />
          </button>
          <button onClick={() => toast.success('Importing…')} className="btn-enterprise btn-enterprise-secondary btn-sm hidden sm:flex">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button onClick={() => toast.success('Exporting CSV…')} className="btn-enterprise btn-enterprise-secondary btn-sm hidden sm:flex">
            <Download className="w-4 h-4" /> Export
          </button>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-lg h-[32px]">
            <button
              onClick={() => setViewMode('table')}
              className={clsx('h-7 px-2 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1', viewMode === 'table' ? 'bg-[var(--surface-card)] text-[var(--color-primary)] shadow-xs' : 'text-[var(--text-muted)]')}
            >
              <ListIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={clsx('h-7 px-2 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1', viewMode === 'kanban' ? 'bg-[var(--surface-card)] text-[var(--color-primary)] shadow-xs' : 'text-[var(--text-muted)]')}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
          </div>

          <button onClick={() => setIsCreateOpen(true)} className="btn-enterprise btn-enterprise-primary">
            <Plus className="w-4 h-4" /> Create Ticket
          </button>
        </div>
      </div>

      {/* ─── Filter Card ──────────────────────────────── */}
      <div className="surface-card p-4 space-y-4">
        {/* Status Tabs — underline style */}
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none border-b border-[var(--surface-border)] -mx-4 px-4">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id); setPage(1); }}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap border-b-2 -mb-px',
                statusFilter === tab.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              {tab.label}
              <span className={clsx(
                'text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                statusFilter === tab.id ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search ticket ID or subject…"
              className="field-input field-input-sm pl-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                className="field-input field-input-sm pr-8 cursor-pointer appearance-none"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx('btn-enterprise btn-enterprise-secondary btn-sm', showFilters && 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[var(--color-primary)]')}
            >
              <Filter className="w-4 h-4" /> More {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </button>

            <div className="relative">
              <button onClick={() => setShowColMenu(!showColMenu)} className="btn-enterprise btn-enterprise-secondary btn-sm">
                <Eye className="w-4 h-4" /> Columns
              </button>
              {showColMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-1 z-50 shadow-lg animate-scale-in">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider px-2 py-1 font-semibold">Visible Columns</p>
                  {COLUMNS_CONFIG.map(col => (
                    <button
                      key={col.key}
                      onClick={() => toggleCol(col.key)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      {visibleCols.includes(col.key) ? <CheckSquare className="w-4 h-4 text-[var(--color-primary)]" /> : <Square className="w-4 h-4 text-[var(--text-muted)]" />}
                      {col.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isFiltered && (
              <button onClick={handleClearFilters} className="btn-enterprise btn-sm bg-red-500/10 text-red-600 hover:bg-red-500/15 border border-red-500/20">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-3 border-t border-[var(--surface-border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="form-field">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date Range</label>
                  <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="field-input field-input-sm">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last Quarter</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Assignee</label>
                  <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="field-input field-input-sm">
                    <option value="">All Agents</option>
                    <option value="me">Assigned to Me</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="sophia">Sophia Martinez</option>
                    <option value="marcus">Marcus Brody</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Department</label>
                  <select className="field-input field-input-sm">
                    <option>All Departments</option>
                    <option>IT Helpdesk</option>
                    <option>Engineering</option>
                    <option>DevOps</option>
                    <option>Billing</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">SLA Status</label>
                  <select className="field-input field-input-sm">
                    <option>All</option>
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

      {/* ─── Bulk Actions ─────────────────────────────── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" />
              {selectedIds.length} selected
            </span>
            <div className="flex-1 h-px bg-white/20" />
            <button onClick={() => { toast.success(`Assigned ${selectedIds.length} ticket(s)`); setSelectedIds([]); }} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 transition-colors">
              <UserCheck className="w-3.5 h-3.5" /> Assign
            </button>
            <button onClick={() => { toast.success(`Status updated`); setSelectedIds([]); }} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5" /> Status
            </button>
            <button onClick={() => { toast.success(`Exported ${selectedIds.length} ticket(s)`); setSelectedIds([]); }} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={() => { toast.error(`Archived ${selectedIds.length} ticket(s)`); setSelectedIds([]); }} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/40 hover:bg-red-500/60 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Archive
            </button>
            <button onClick={() => setSelectedIds([])} className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Table View ───────────────────────────────── */}
      {viewMode === 'table' ? (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <table className="table-enterprise">
                <thead>
                  <tr>
                    {['', 'ID', 'Subject', 'Status', 'Priority', 'Assignee', 'Activity'].map((h, i) => (
                      <th key={i}>{h}</th>
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

          {/* Page Size + Pagination Footer */}
          {!isLoading && tickets.length > 0 && meta && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--surface-border)]">
              <div className="flex items-center gap-2 text-caption text-[var(--text-muted)]">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="text-[13px] bg-transparent border-none text-[var(--text-primary)] font-medium cursor-pointer"
                >
                  {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-caption text-[var(--text-muted)]">
                Showing {((meta.page - 1) * pageSize) + 1}–{Math.min(meta.page * pageSize, meta.total)} of {meta.total}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── Kanban View ──────────────────────────────── */
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {(['open', 'assigned', 'in_progress', 'waiting_for_customer', 'resolved'] as TicketStatus[]).map((st) => {
            const colTickets = tickets.filter(t => t.status === st);
            return (
              <div key={st} className="kanban-col flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--surface-border)]">
                  <TicketStatusBadge status={st} size="sm" />
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[60vh] scrollbar-none">
                  {colTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
                      <AlertCircle className="w-6 h-6 opacity-20 mb-1" />
                      <p className="text-[11px]">No tickets</p>
                    </div>
                  ) : (
                    colTickets.map(t => (
                      <div
                        key={t.id}
                        onClick={() => handleRowClick(t)}
                        className="p-3 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-[var(--color-primary)] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-2">
                          <span className="font-mono font-semibold text-[var(--color-primary)]">{t.ticketNumber}</span>
                          <TicketPriorityBadge priority={t.priority} size="sm" showIcon={false} />
                        </div>
                        <h4 className="text-[13px] font-medium text-[var(--text-primary)] line-clamp-2 mb-2 leading-relaxed">{t.subject}</h4>
                        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--surface-border)]">
                          <span className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[8px] font-semibold flex items-center justify-center">
                              {t.assignee ? formatUtils.initials(t.assignee.fullName) : '?'}
                            </div>
                            {t.assignee?.fullName || 'Unassigned'}
                          </span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{dateUtils.formatRelative(t.updatedAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-2 w-full flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] rounded-md border border-dashed border-[var(--surface-border)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            );
          })}
        </div>
      )}

      <CreateTicketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
