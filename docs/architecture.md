# System Architecture — ServiceNow-Inspired ITSM Platform

## 1. Overview
The platform is designed as a **Modular Monolith** engineered for enterprise SaaS deployment. It uses a **Next.js App Router** frontend paired with a **NestJS** backend connected to a **PostgreSQL** database via **Prisma ORM**.

```
[ Next.js 15 Frontend ] <--- REST API / JWT ---> [ NestJS Backend Monolith ] <--- Prisma ORM ---> [ PostgreSQL 16 ]
```

## 2. Key Architecture Pillars

### Multi-Tenancy & Isolation
- Organization is the primary tenant.
- Every tenant table stores `organization_id`.
- `TenantGuard` extracts tenant identity exclusively from signed JWT payload (`req.user.organizationId`).
- Automatic Prisma query scoping ensures cross-tenant data leaks are physically impossible.

### RBAC Permission Engine
- Role-based authorization evaluated on every route controller action via `RbacGuard` and `@RequirePermissions()`.
- Standard roles: `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `TEAM_LEAD`, `AGENT`, `REQUESTER`, `VIEWER`.

### Core Ticket Lifecycle State Machine
`NEW` → `OPEN` → `IN_PROGRESS` → (`PENDING` / `ON_HOLD`) → `RESOLVED` → `CLOSED` / `CANCELLED`

- Sequential auto-incrementing ticket numbers per tenant: `TKT-000001`, `TKT-000002`.
- SLA Engine automatically calculates response and resolution due times based on policy priority.
