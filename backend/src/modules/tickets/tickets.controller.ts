import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, TicketQueryDto, CreateCommentDto } from './tickets.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @RequirePermissions('TICKET_CREATE')
  @ApiOperation({ summary: 'Create a new Ticket (Auto-generates TKT-000001 per tenant)' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully with SLA parameters' })
  async create(
    @TenantId() organizationId: string,
    @CurrentUser('id') requesterId: string,
    @Body() dto: CreateTicketDto,
  ) {
    return this.ticketsService.create(organizationId, requesterId, dto);
  }

  @Get()
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'Get enterprise ticket list with search, status, priority, and pagination filters' })
  async findAll(
    @TenantId() organizationId: string,
    @Query() query: TicketQueryDto,
  ) {
    return this.ticketsService.findAll(organizationId, query);
  }

  @Get(':id')
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'Get single ticket details workspace by ID or Ticket Number (e.g. TKT-000001)' })
  async findOne(
    @TenantId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.ticketsService.findOne(organizationId, id);
  }

  @Patch(':id')
  @RequirePermissions('TICKET_UPDATE')
  @ApiOperation({ summary: 'Update ticket details (Status, Priority, Assignee, Team)' })
  async update(
    @TenantId() organizationId: string,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(organizationId, userId, id, dto);
  }

  @Post(':id/comments')
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'Add a Public Reply or Internal Note to ticket' })
  async addComment(
    @TenantId() organizationId: string,
    @CurrentUser('id') userId: string,
    @Param('id') ticketId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.ticketsService.addComment(organizationId, userId, ticketId, dto);
  }

  @Delete(':id')
  @RequirePermissions('TICKET_DELETE')
  @ApiOperation({ summary: 'Delete a ticket' })
  async remove(
    @TenantId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.ticketsService.remove(organizationId, id);
  }
}
