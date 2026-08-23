import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @RequirePermissions('AUDIT_VIEW')
  @ApiOperation({ summary: 'Get security audit logs for Tenant Organization' })
  async findAll(
    @TenantId() organizationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.auditLogsService.findAll(organizationId, Number(page), Number(limit));
  }
}
