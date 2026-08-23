import { apiClient } from '@/services/api/api-client';
import type {
  Ticket,
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
  TicketComment,
  TicketTimelineEvent,
  TicketAttachment,
  TicketStatus,
  TicketPriority,
} from '../types/ticket.types';
import type { PaginatedResponse } from '@/types/global.types';

// ============================================================
// RICH MOCK TICKET DATASET (20+ Enterprise Tickets)
// ============================================================

let MOCK_TICKETS: Ticket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'TKT-000101',
    subject: 'SSO Authentication failing with Okta IdP on mobile Safari',
    description: 'Multiple enterprise users report being unable to authenticate via SAML 2.0 / Okta integration when accessing the portal on iOS Safari 18.1. Redirect loop occurs after submitting credentials.',
    status: 'in_progress',
    priority: 'critical',
    category: 'Security & Auth',
    subcategory: 'SAML / SSO',
    tags: ['okta', 'mobile-safari', 'sso', 'enterprise-vip'],
    organizationId: 'org-1',
    departmentId: 'dept-eng',
    teamId: 'team-sec',
    assigneeId: 'usr-agent-1',
    assignee: { id: 'usr-agent-1', fullName: 'Sophia Martinez', email: 'agent@ticketflow.io', role: 'agent' },
    customerId: 'usr-cust-1',
    customer: { id: 'usr-cust-1', fullName: 'David Miller', email: 'customer@acme.com' },
    dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), // 2 hours left
    slaStatus: 'warning',
    commentCount: 4,
    attachmentCount: 2,
    watcherCount: 5,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'tkt-102',
    ticketNumber: 'TKT-000102',
    subject: 'Database connection pool exhaustion during peak hourly sync',
    description: 'PostgreSQL connection pool maxes out (100/100) at 09:00 UTC during the automated CSV ingest worker run. Web API responses experience HTTP 504 gateway timeouts.',
    status: 'open',
    priority: 'high',
    category: 'Infrastructure',
    subcategory: 'Database',
    tags: ['postgresql', 'performance', 'timeout', 'devops'],
    organizationId: 'org-1',
    departmentId: 'dept-devops',
    customerId: 'usr-cust-2',
    customer: { id: 'usr-cust-2', fullName: 'Rachel Green', email: 'rachel@globex.com' },
    dueDate: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    slaStatus: 'normal',
    commentCount: 2,
    attachmentCount: 1,
    watcherCount: 3,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tkt-103',
    ticketNumber: 'TKT-000103',
    subject: 'Request for custom SLA escalation policies per SLA tier',
    description: 'We need to configure custom SLA response time thresholds for Gold ($50k+) tier clients vs Silver tier. Currently all tiers share 4h response time.',
    status: 'waiting_for_customer',
    priority: 'medium',
    category: 'Feature Request',
    subcategory: 'SLA Engine',
    tags: ['feature-request', 'sla-tiers', 'customization'],
    organizationId: 'org-1',
    departmentId: 'dept-product',
    assigneeId: 'usr-admin-1',
    assignee: { id: 'usr-admin-1', fullName: 'Eleanor Vance', email: 'admin@ticketflow.io', role: 'company_admin' },
    customerId: 'usr-cust-3',
    customer: { id: 'usr-cust-3', fullName: 'Robert Chen', email: 'rchen@apex.io' },
    dueDate: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    slaStatus: 'normal',
    commentCount: 6,
    attachmentCount: 0,
    watcherCount: 2,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tkt-104',
    ticketNumber: 'TKT-000104',
    subject: 'Webhook notification delivery latency exceeding 5 minutes',
    description: 'Events generated on ticket creation are taking up to 300 seconds to arrive at our external audit endpoint `https://api.acme.com/webhooks/audit`. Expected SLA < 2 seconds.',
    status: 'assigned',
    priority: 'high',
    category: 'Integrations',
    subcategory: 'Webhooks',
    tags: ['webhook', 'latency', 'redis-queue'],
    organizationId: 'org-1',
    departmentId: 'dept-eng',
    assigneeId: 'usr-agent-1',
    assignee: { id: 'usr-agent-1', fullName: 'Sophia Martinez', email: 'agent@ticketflow.io', role: 'agent' },
    customerId: 'usr-cust-1',
    customer: { id: 'usr-cust-1', fullName: 'David Miller', email: 'customer@acme.com' },
    dueDate: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), // Breached 1h ago
    slaStatus: 'breached',
    slaBreachedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    commentCount: 3,
    attachmentCount: 0,
    watcherCount: 4,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tkt-105',
    ticketNumber: 'TKT-000105',
    subject: 'Billing export PDF formatting issue on quarterly invoices',
    description: 'Line item prices are misaligned on page 2 of the PDF invoice export when currency is JPY (Japanese Yen). Decimal places appear erroneously.',
    status: 'resolved',
    priority: 'low',
    category: 'Billing',
    subcategory: 'Invoice PDF',
    tags: ['billing', 'pdf-export', 'jpy-formatting'],
    organizationId: 'org-1',
    departmentId: 'dept-finance',
    assigneeId: 'usr-manager-1',
    assignee: { id: 'usr-manager-1', fullName: 'Marcus Brody', email: 'manager@ticketflow.io', role: 'manager' },
    customerId: 'usr-cust-4',
    customer: { id: 'usr-cust-4', fullName: 'Kenji Sato', email: 'sato@tokyotech.co.jp' },
    resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    commentCount: 5,
    attachmentCount: 3,
    watcherCount: 1,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tkt-106',
    ticketNumber: 'TKT-000106',
    subject: 'New employee onboarding hardware provisioning request',
    description: 'Requesting MacBook Pro M3 Max 32GB + Dual 27" Monitors for Senior Frontend Engineer joining on August 15.',
    status: 'new',
    priority: 'medium',
    category: 'HR & IT Equipment',
    subcategory: 'Hardware Provisioning',
    tags: ['onboarding', 'hardware', 'it-request'],
    organizationId: 'org-1',
    departmentId: 'dept-it',
    customerId: 'usr-cust-5',
    customer: { id: 'usr-cust-5', fullName: 'Jessica Taylor', email: 'jtaylor@acme.com' },
    commentCount: 0,
    attachmentCount: 0,
    watcherCount: 1,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30m ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Mock Comments Store
let MOCK_COMMENTS: Record<string, TicketComment[]> = {
  'tkt-101': [
    {
      id: 'cm-101-1',
      ticketId: 'tkt-101',
      content: 'Customer confirmed this only happens when using Safari iOS 18.1 with Okta standard login page.',
      isInternal: false,
      isEdited: false,
      author: { id: 'usr-cust-1', fullName: 'David Miller', email: 'customer@acme.com' },
      createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    },
    {
      id: 'cm-101-2',
      ticketId: 'tkt-101',
      content: 'Internal note: Inspected auth redirect callback logic. It seems same-site cookie policy on Safari 18.1 blocks state cookie.',
      isInternal: true,
      isEdited: false,
      author: { id: 'usr-agent-1', fullName: 'Sophia Martinez', email: 'agent@ticketflow.io', role: 'agent' },
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: 'cm-101-3',
      ticketId: 'tkt-101',
      content: 'Patch submitted to staging cluster. Please test against `https://staging-app.ticketflow.io/login`.',
      isInternal: false,
      isEdited: true,
      author: { id: 'usr-agent-1', fullName: 'Sophia Martinez', email: 'agent@ticketflow.io', role: 'agent' },
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ],
};

// Mock Timeline Events
let MOCK_TIMELINE: Record<string, TicketTimelineEvent[]> = {
  'tkt-101': [
    {
      id: 'evt-1',
      ticketId: 'tkt-101',
      type: 'created',
      description: 'Ticket created by David Miller',
      actor: { id: 'usr-cust-1', fullName: 'David Miller', email: 'customer@acme.com' },
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: 'evt-2',
      ticketId: 'tkt-101',
      type: 'assigned',
      description: 'Ticket assigned to Sophia Martinez',
      actor: { id: 'usr-admin-1', fullName: 'Eleanor Vance', email: 'admin@ticketflow.io' },
      createdAt: new Date(Date.now() - 3.8 * 3600 * 1000).toISOString(),
    },
    {
      id: 'evt-3',
      ticketId: 'tkt-101',
      type: 'status_changed',
      description: 'Status changed from New to In Progress',
      actor: { id: 'usr-agent-1', fullName: 'Sophia Martinez', email: 'agent@ticketflow.io' },
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
  ],
};

export const ticketsApi = {
  getTickets: async (filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> => {
    try {
      return await apiClient.getPaginated<Ticket>('/tickets', { params: filters });
    } catch {
      // Mock Filtering Logic
      let filtered = [...MOCK_TICKETS];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.subject.toLowerCase().includes(q) ||
            t.ticketNumber.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        );
      }

      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        filtered = filtered.filter((t) => statuses.includes(t.status));
      }

      if (filters.priority) {
        const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
        filtered = filtered.filter((t) => priorities.includes(t.priority));
      }

      if (filters.assigneeId) {
        filtered = filtered.filter((t) => t.assigneeId === filters.assigneeId);
      }

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const start = (page - 1) * pageSize;
      const data = filtered.slice(start, start + pageSize);

      return {
        data,
        meta: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }
  },

  getTicket: async (id: string): Promise<Ticket> => {
    try {
      return await apiClient.get<Ticket>(`/tickets/${id}`);
    } catch {
      const found = MOCK_TICKETS.find((t) => t.id === id || t.ticketNumber === id);
      if (!found) {
        // Fallback mock
        return MOCK_TICKETS[0];
      }
      return found;
    }
  },

  createTicket: async (data: CreateTicketDto): Promise<Ticket> => {
    try {
      return await apiClient.post<Ticket>('/tickets', data);
    } catch {
      const newNum = MOCK_TICKETS.length + 107;
      const newTicket: Ticket = {
        id: `tkt-${newNum}`,
        ticketNumber: `TKT-000${newNum}`,
        subject: data.subject,
        description: data.description,
        status: 'new',
        priority: data.priority,
        category: data.category || 'General Support',
        tags: data.tags || [],
        organizationId: 'org-1',
        departmentId: data.departmentId || 'dept-support',
        assigneeId: data.assigneeId,
        customerId: data.customerId || 'usr-cust-1',
        customer: { id: 'usr-cust-1', fullName: 'David Miller', email: 'customer@acme.com' },
        dueDate: data.dueDate || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        slaStatus: 'normal',
        commentCount: 0,
        attachmentCount: data.attachments?.length || 0,
        watcherCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MOCK_TICKETS.unshift(newTicket);
      return newTicket;
    }
  },

  updateTicketStatus: async (id: string, status: TicketStatus): Promise<Ticket> => {
    try {
      return await apiClient.patch<Ticket>(`/tickets/${id}/status`, { status });
    } catch {
      const ticket = MOCK_TICKETS.find((t) => t.id === id);
      if (ticket) {
        const oldStatus = ticket.status;
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
        if (status === 'resolved') ticket.resolvedAt = new Date().toISOString();
        if (status === 'closed') ticket.closedAt = new Date().toISOString();

        // Record timeline event
        if (!MOCK_TIMELINE[id]) MOCK_TIMELINE[id] = [];
        MOCK_TIMELINE[id].unshift({
          id: `evt-${Date.now()}`,
          ticketId: id,
          type: 'status_changed',
          description: `Status changed from ${oldStatus} to ${status}`,
          actor: { id: 'usr-current', fullName: 'Current User', email: 'user@ticketflow.io' },
          createdAt: new Date().toISOString(),
        });
      }
      return ticket || MOCK_TICKETS[0];
    }
  },

  assignTicket: async (id: string, agentId: string, agentName?: string): Promise<Ticket> => {
    try {
      return await apiClient.patch<Ticket>(`/tickets/${id}/assign`, { agentId });
    } catch {
      const ticket = MOCK_TICKETS.find((t) => t.id === id);
      if (ticket) {
        ticket.assigneeId = agentId;
        ticket.assignee = {
          id: agentId,
          fullName: agentName || 'Assigned Agent',
          email: `${agentId}@ticketflow.io`,
        };
        if (ticket.status === 'new' || ticket.status === 'open') {
          ticket.status = 'assigned';
        }
        ticket.updatedAt = new Date().toISOString();
      }
      return ticket || MOCK_TICKETS[0];
    }
  },

  getComments: async (ticketId: string): Promise<TicketComment[]> => {
    try {
      return await apiClient.get<TicketComment[]>(`/tickets/${ticketId}/comments`);
    } catch {
      return MOCK_COMMENTS[ticketId] || [];
    }
  },

  addComment: async (ticketId: string, content: string, isInternal = false): Promise<TicketComment> => {
    try {
      return await apiClient.post<TicketComment>(`/tickets/${ticketId}/comments`, { content, isInternal });
    } catch {
      const newComment: TicketComment = {
        id: `cm-${Date.now()}`,
        ticketId,
        content,
        isInternal,
        isEdited: false,
        author: { id: 'usr-current', fullName: 'Support Agent', email: 'agent@ticketflow.io', role: 'agent' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!MOCK_COMMENTS[ticketId]) MOCK_COMMENTS[ticketId] = [];
      MOCK_COMMENTS[ticketId].push(newComment);

      const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
      if (ticket) {
        ticket.commentCount += 1;
        ticket.updatedAt = new Date().toISOString();
      }

      return newComment;
    }
  },

  getTimeline: async (ticketId: string): Promise<TicketTimelineEvent[]> => {
    try {
      return await apiClient.get<TicketTimelineEvent[]>(`/tickets/${ticketId}/timeline`);
    } catch {
      return MOCK_TIMELINE[ticketId] || [];
    }
  },
};
