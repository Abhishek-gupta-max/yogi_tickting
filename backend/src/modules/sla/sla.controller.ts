import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SLAService } from './sla.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { TicketPriorityType } from '@prisma/client';

@ApiTags('SLA Policies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('sla/policies')
export class SLAController {
  constructor(private readonly slaService: SLAService) {}

  @Post()
  @RequirePermissions('SLA_MANAGE')
  @ApiOperation({ summary: 'Create a new SLA Policy' })
  async create(
    @TenantId() organizationId: string,
    @Body() body: { name: string; priority: TicketPriorityType; responseTimeMinutes: number; resolutionTimeMinutes: number; description?: string },
  ) {
    return this.slaService.create(organizationId, body.name, body.priority, body.responseTimeMinutes, body.resolutionTimeMinutes, body.description);
  }

  @Get()
  @RequirePermissions('SLA_VIEW')
  @ApiOperation({ summary: 'List SLA policies for Tenant Organization' })
  async findAll(@TenantId() organizationId: string) {
    return this.slaService.findAll(organizationId);
  }

  @Delete(':id')
  @RequirePermissions('SLA_MANAGE')
  @ApiOperation({ summary: 'Delete SLA policy' })
  async remove(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.slaService.remove(organizationId, id);
  }
}
