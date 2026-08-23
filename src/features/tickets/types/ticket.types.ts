// ============================================================
// TICKET DOMAIN TYPES
// ============================================================

export type TicketStatus =
  | 'new'
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'waiting_for_customer'
  | 'resolved'
  | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: string;
  ticketNumber: string;     // TKT-000001
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  subcategory?: string;
  tags: string[];
  // Relations
  organizationId: string;
  departmentId?: string;
  teamId?: string;
  assigneeId?: string;
  assignee?: TicketUser;
  customerId: string;
  customer?: TicketUser;
  // SLA
  dueDate?: string;
  slaStatus?: 'normal' | 'warning' | 'breached';
  slaBreachedAt?: string;
  // Counts
  commentCount: number;
  attachmentCount: number;
  watcherCount: number;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  firstResponseAt?: string;
}

export interface TicketUser {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  isEdited: boolean;
  author: TicketUser;
  attachments?: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedBy: TicketUser;
  createdAt: string;
}

export interface TicketTimelineEvent {
  id: string;
  ticketId: string;
  type: TimelineEventType;
  description: string;
  metadata?: Record<string, string | number | boolean>;
  actor: TicketUser;
  createdAt: string;
}

export type TimelineEventType =
  | 'created'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'unassigned'
  | 'transferred'
  | 'merged'
  | 'comment_added'
  | 'internal_note_added'
  | 'attachment_added'
  | 'watcher_added'
  | 'watcher_removed'
  | 'sla_breached'
  | 'reopened'
  | 'resolved'
  | 'closed';

export interface TicketFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  assigneeId?: string;
  customerId?: string;
  departmentId?: string;
  teamId?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  slaStatus?: 'normal' | 'warning' | 'breached';
}

export interface CreateTicketDto {
  subject: string;
  description: string;
  priority: TicketPriority;
  category?: string;
  subcategory?: string;
  departmentId?: string;
  teamId?: string;
  assigneeId?: string;
  customerId?: string;
  tags?: string[];
  dueDate?: string;
  attachments?: File[];
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {
  status?: TicketStatus;
}

// Lifecycle state machine
export const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  new:                  ['open'],
  open:                 ['assigned', 'closed'],
  assigned:             ['in_progress', 'open'],
  in_progress:          ['waiting_for_customer', 'resolved'],
  waiting_for_customer: ['in_progress', 'resolved', 'closed'],
  resolved:             ['closed', 'open'],
  closed:               ['open'],
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  new:                  'New',
  open:                 'Open',
  assigned:             'Assigned',
  in_progress:          'In Progress',
  waiting_for_customer: 'Waiting for Customer',
  resolved:             'Resolved',
  closed:               'Closed',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low:      'Low',
  medium:   'Medium',
  high:     'High',
  critical: 'Critical',
};
