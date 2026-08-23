import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ORGANIZATION_ADMIN: [
    'TICKET_VIEW', 'TICKET_CREATE', 'TICKET_UPDATE', 'TICKET_DELETE', 'TICKET_ASSIGN', 'TICKET_CLOSE',
    'USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
    'TEAM_VIEW', 'TEAM_CREATE', 'TEAM_UPDATE', 'TEAM_DELETE',
    'REPORT_VIEW', 'REPORT_EXPORT',
    'SLA_VIEW', 'SLA_MANAGE',
    'APPROVAL_VIEW', 'APPROVAL_APPROVE', 'APPROVAL_REJECT',
    'KNOWLEDGE_VIEW', 'KNOWLEDGE_CREATE', 'KNOWLEDGE_UPDATE', 'KNOWLEDGE_DELETE',
    'AUTOMATION_VIEW', 'AUTOMATION_CREATE', 'AUTOMATION_UPDATE', 'AUTOMATION_DELETE',
    'AUDIT_VIEW', 'SETTINGS_VIEW', 'SETTINGS_UPDATE'
  ],
  TEAM_LEAD: [
    'TICKET_VIEW', 'TICKET_CREATE', 'TICKET_UPDATE', 'TICKET_ASSIGN', 'TICKET_CLOSE',
    'USER_VIEW', 'TEAM_VIEW', 'TEAM_UPDATE',
    'REPORT_VIEW', 'SLA_VIEW',
    'APPROVAL_VIEW', 'APPROVAL_APPROVE', 'APPROVAL_REJECT',
    'KNOWLEDGE_VIEW', 'KNOWLEDGE_CREATE', 'KNOWLEDGE_UPDATE',
    'AUTOMATION_VIEW'
  ],
  AGENT: [
    'TICKET_VIEW', 'TICKET_CREATE', 'TICKET_UPDATE', 'TICKET_ASSIGN', 'TICKET_CLOSE',
    'USER_VIEW', 'TEAM_VIEW', 'KNOWLEDGE_VIEW', 'KNOWLEDGE_CREATE'
  ],
  REQUESTER: [
    'TICKET_VIEW', 'TICKET_CREATE', 'KNOWLEDGE_VIEW'
  ],
  VIEWER: [
    'TICKET_VIEW', 'KNOWLEDGE_VIEW', 'REPORT_VIEW'
  ],
};

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role undefined for permission check');
    }

    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    const userPermissions = ROLE_PERMISSIONS_MAP[user.role] || [];
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes('*') || userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Required permission '${requiredPermissions.join(', ')}' missing for role '${user.role}'`
      );
    }

    return true;
  }
}
