import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Approval Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post('requests')
  @RequirePermissions('TICKET_UPDATE')
  @ApiOperation({ summary: 'Submit an approval request for a ticket' })
  async createRequest(
    @TenantId() organizationId: string,
    @CurrentUser('id') requesterId: string,
    @Body() body: { ticketId: string; approverId: string; comments?: string },
  ) {
    return this.approvalsService.createRequest(organizationId, requesterId, body.ticketId, body.approverId, body.comments);
  }

  @Get('pending')
  @RequirePermissions('APPROVAL_VIEW')
  @ApiOperation({ summary: 'Get pending approval requests assigned to current user' })
  async findPending(
    @TenantId() organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.approvalsService.findPendingForUser(organizationId, userId);
  }

  @Patch('requests/:id')
  @RequirePermissions('APPROVAL_APPROVE')
  @ApiOperation({ summary: 'Approve or Reject an approval request' })
  async respond(
    @TenantId() organizationId: string,
    @CurrentUser('id') userId: string,
    @Param('id') requestId: string,
    @Body() body: { approve: boolean; comments?: string },
  ) {
    return this.approvalsService.respond(organizationId, userId, requestId, body.approve, body.comments);
  }
}
