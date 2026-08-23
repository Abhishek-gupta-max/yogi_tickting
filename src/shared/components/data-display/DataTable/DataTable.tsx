import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState, LoadingSpinner } from '@/shared/components/feedback';

export interface Column<T> {
  key: string;
  header: string | ReactNode;
  cell?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  // Sorting
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  // Pagination
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Selection
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  getRowId?: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters to find what you are looking for.',
  onRowClick,
  sortField,
  sortOrder,
  onSort,
  page = 1,
  total = 0,
  totalPages = 1,
  onPageChange,
  selectedIds,
  onSelectRow,
  onSelectAll,
  getRowId,
}: DataTableProps<T>) {
  const isAllSelected = data.length > 0 && selectedIds && data.every((row) => selectedIds.includes(getRowId ? getRowId(row) : row.id));

  return (
    <div className="surface-card overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto min-h-[300px] flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-card-alt)]">
              {onSelectRow && getRowId && (
                <th className="px-4 py-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-[var(--surface-border)] text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    className={clsx(
                      'px-4 py-3.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider select-none',
                      col.sortable && 'cursor-pointer hover:text-[var(--text-primary)] transition-colors',
                      col.className
                    )}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-[var(--text-muted)]">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-bg)]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
                    <LoadingSpinner size="lg" />
                    <span className="text-sm">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} size="md" />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const rowId = getRowId ? getRowId(row) : row.id;
                const isSelected = selectedIds?.includes(rowId);

                return (
                  <tr
                    key={rowId || idx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={clsx(
                      'transition-colors hover:bg-[var(--surface-hover)]',
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-indigo-500/5 dark:bg-indigo-500/10'
                    )}
                  >
                    {onSelectRow && getRowId && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow(rowId)}
                          className="w-4 h-4 rounded border-[var(--surface-border)] text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key} className={clsx('px-4 py-3.5 text-sm text-[var(--text-primary)]', col.className)}>
                        {col.cell ? col.cell(row, idx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 0 && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--surface-border)] bg-[var(--surface-card-alt)] text-xs text-[var(--text-muted)]">
          <div>
            Showing <span className="font-medium text-[var(--text-primary)]">{data.length}</span> of{' '}
            <span className="font-medium text-[var(--text-primary)]">{total}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
              className="p-1.5 rounded-lg border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-[var(--text-primary)]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || isLoading}
              className="p-1.5 rounded-lg border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
