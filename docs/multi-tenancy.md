# Multi-Tenancy Architecture & Data Isolation

## Data Isolation Strategy
Every database table holding tenant data contains an `organization_id` column indexed for speed:

```sql
ALTER TABLE tickets ADD CONSTRAINT fk_tickets_organization FOREIGN KEY (organization_id) REFERENCES organizations(id);
CREATE INDEX idx_tickets_organization ON tickets(organization_id);
```

## Security Rule
`organization_id` provided in incoming REST request bodies or parameters is NEVER trusted for tenant isolation.

Tenant identity is extracted exclusively by `TenantGuard` from the authenticated user's JWT token:

```typescript
const tenantId = req.user.organizationId;
```

All repository query methods accept `organizationId` as a mandatory parameter:
```typescript
this.prisma.ticket.findMany({
  where: { organizationId, status: 'OPEN' }
});
```
