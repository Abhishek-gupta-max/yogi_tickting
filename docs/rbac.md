# RBAC & Permission Matrix Documentation

## Roles Definition
- **SUPER_ADMIN**: Full system access across all tenant organizations (`*`).
- **ORGANIZATION_ADMIN**: Full administrative control within tenant organization.
- **TEAM_LEAD**: Team management, assignment, ticket operations, approvals, reports.
- **AGENT**: Ticket handling, status transitions, public replies, internal notes.
- **REQUESTER**: Customer ticket creation, self-viewing, knowledge base browsing.
- **VIEWER**: Read-only oversight.

## Permission Strings
- Tickets: `TICKET_VIEW`, `TICKET_CREATE`, `TICKET_UPDATE`, `TICKET_DELETE`, `TICKET_ASSIGN`, `TICKET_CLOSE`
- Users: `USER_VIEW`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`
- Teams: `TEAM_VIEW`, `TEAM_CREATE`, `TEAM_UPDATE`, `TEAM_DELETE`
- Reports: `REPORT_VIEW`, `REPORT_EXPORT`
- SLA: `SLA_VIEW`, `SLA_MANAGE`
- Approvals: `APPROVAL_VIEW`, `APPROVAL_APPROVE`, `APPROVAL_REJECT`
- Knowledge Base: `KNOWLEDGE_VIEW`, `KNOWLEDGE_CREATE`, `KNOWLEDGE_UPDATE`, `KNOWLEDGE_DELETE`
- Audit Logs: `AUDIT_VIEW`
- Settings: `SETTINGS_VIEW`, `SETTINGS_UPDATE`
