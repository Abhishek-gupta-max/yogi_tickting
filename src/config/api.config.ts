// ============================================================
// API CONFIGURATION
// ============================================================

export const API_CONFIG = {
  baseUrl:       (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:4000/api/v1',
  timeout:       30_000,
  retryAttempts: 3,
  retryDelay:    1_000,
  retryStatuses: [408, 429, 500, 502, 503, 504] as number[],
} as const;

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login:           '/auth/login',
    register:        '/auth/register',
    logout:          '/auth/logout',
    refresh:         '/auth/refresh',
    forgotPassword:  '/auth/forgot-password',
    resetPassword:   '/auth/reset-password',
    verifyEmail:     '/auth/verify-email',
    twoFactor: {
      setup:  '/auth/2fa/setup',
      verify: '/auth/2fa/verify',
      disable:'/auth/2fa/disable',
    },
  },
  // Users
  users:         '/users',
  user:          (id: string) => `/users/${id}`,
  userProfile:   '/users/me',
  userPassword:  '/users/me/password',
  // Organizations
  organizations: '/organizations',
  organization:  (id: string) => `/organizations/${id}`,
  // Departments
  departments:   '/departments',
  department:    (id: string) => `/departments/${id}`,
  // Teams
  teams:         '/teams',
  team:          (id: string) => `/teams/${id}`,
  // Roles
  roles:         '/roles',
  role:          (id: string) => `/roles/${id}`,
  // Tickets
  tickets:       '/tickets',
  ticket:        (id: string) => `/tickets/${id}`,
  ticketAssign:  (id: string) => `/tickets/${id}/assign`,
  ticketMerge:   (id: string) => `/tickets/${id}/merge`,
  ticketTransfer:(id: string) => `/tickets/${id}/transfer`,
  ticketClose:   (id: string) => `/tickets/${id}/close`,
  ticketReopen:  (id: string) => `/tickets/${id}/reopen`,
  ticketResolve: (id: string) => `/tickets/${id}/resolve`,
  // Ticket sub-resources
  ticketComments:    (id: string) => `/tickets/${id}/comments`,
  ticketComment:     (tid: string, cid: string) => `/tickets/${tid}/comments/${cid}`,
  ticketAttachments: (id: string) => `/tickets/${id}/attachments`,
  ticketTimeline:    (id: string) => `/tickets/${id}/timeline`,
  ticketWatchers:    (id: string) => `/tickets/${id}/watchers`,
  ticketRelated:     (id: string) => `/tickets/${id}/related`,
  // SLA
  slaPolicies:  '/sla/policies',
  slaPolicy:    (id: string) => `/sla/policies/${id}`,
  // Workflows
  workflows:    '/workflows',
  workflow:     (id: string) => `/workflows/${id}`,
  // Notifications
  notifications:      '/notifications',
  notificationsRead:  '/notifications/read-all',
  notification:       (id: string) => `/notifications/${id}`,
  // Reports
  reports: {
    agentPerformance:    '/reports/agent-performance',
    departmentAnalytics: '/reports/department-analytics',
    slaCompliance:       '/reports/sla-compliance',
    resolutionTime:      '/reports/resolution-time',
    ticketTrends:        '/reports/ticket-trends',
    dashboard:           '/reports/dashboard',
  },
  // Knowledge Base
  kbCategories: '/knowledge-base/categories',
  kbArticles:   '/knowledge-base/articles',
  kbArticle:    (id: string) => `/knowledge-base/articles/${id}`,
  // Customers
  customers:    '/customers',
  customer:     (id: string) => `/customers/${id}`,
  // Settings
  settings:     '/settings',
} as const;
