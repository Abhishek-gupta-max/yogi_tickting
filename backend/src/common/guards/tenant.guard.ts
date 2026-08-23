import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication token required to establish tenant context');
    }

    if (!user.organizationId) {
      throw new ForbiddenException('User account is not bound to a valid organization tenant');
    }

    // Attach verified tenant ID explicitly to request object
    request.tenantId = user.organizationId;
    return true;
  }
}
