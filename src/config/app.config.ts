// ============================================================
// APP CONFIGURATION
// ============================================================

export const APP_CONFIG = {
  name:        'TicketFlow',
  tagline:     'Enterprise Ticket Management',
  version:     '1.0.0',
  description: 'Centralized platform for Customer Support, IT Helpdesk, HR Requests & Internal Service Desk',
  supportEmail: 'support@ticketflow.io',
  docsUrl:     'https://docs.ticketflow.io',
} as const;

export const PAGINATION_DEFAULTS = {
  page:      1,
  pageSize:  20,
  pageSizes: [10, 20, 50, 100] as const,
} as const;

export const DATE_FORMATS = {
  display:   'MMM d, yyyy',
  displayFull: 'MMMM d, yyyy',
  datetime:  'MMM d, yyyy HH:mm',
  time:      'HH:mm',
  iso:       "yyyy-MM-dd'T'HH:mm:ss",
  short:     'MM/dd/yyyy',
} as const;

export const FILE_UPLOAD = {
  maxSizeBytes:   10 * 1024 * 1024, // 10 MB
  maxSizeMB:      10,
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv',
    'application/zip',
  ],
  allowedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.txt', '.csv', '.zip',
  ],
} as const;

export const DEBOUNCE_DELAYS = {
  search:     300,
  autoSave:   1000,
  validation: 400,
} as const;

export const SESSION = {
  warningBeforeExpiryMs: 5 * 60 * 1000,  // 5 minutes
  checkIntervalMs:       30 * 1000,        // 30 seconds
} as const;
