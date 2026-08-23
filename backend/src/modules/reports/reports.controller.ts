import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Reports & Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @RequirePermissions('REPORT_VIEW')
  @ApiOperation({ summary: 'Get Operational Dashboard KPI metrics and status/priority breakdowns' })
  async getDashboardSummary(@TenantId() organizationId: string) {
    return this.reportsService.getDashboardSummary(organizationId);
  }

  @Get('trends')
  @RequirePermissions('REPORT_VIEW')
  @ApiOperation({ summary: 'Get 30-day ticket volume creation trends' })
  async getTicketTrends(@TenantId() organizationId: string) {
    return this.reportsService.getTicketTrends(organizationId);
  }
}
