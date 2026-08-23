// ============================================================
// GLOBAL TYPES — Shared across all features
// ============================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MaybeNull<T> = T | null | undefined;

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}

export interface FilterState {
  [key: string]: string | string[] | boolean | number | null | undefined;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number | React.ReactNode;
  children?: NavItem[];
  permission?: string;
  roles?: string[];
  isExternal?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}
