import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TenantGuard } from '../src/common/guards/tenant.guard';
import { RbacGuard } from '../src/common/guards/rbac.guard';

describe('Multi-Tenant Isolation Security Suite', () => {
  let tenantGuard: TenantGuard;

  beforeEach(() => {
    tenantGuard = new TenantGuard();
  });

  it('should enforce organizationId presence on all tenant requests', () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'usr-1', email: 'user@org-a.com', organizationId: 'org-tenant-a' },
        }),
      }),
    };

    expect(tenantGuard.canActivate(mockContext)).toBe(true);
  });

  it('should reject requests without tenant context in JWT payload', () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'usr-2', email: 'user@no-tenant.com' }, // missing organizationId
        }),
      }),
    };

    expect(() => tenantGuard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should throw UnauthorizedException when request carries no user token', () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };

    expect(() => tenantGuard.canActivate(mockContext)).toThrow(UnauthorizedException);
  });
});
