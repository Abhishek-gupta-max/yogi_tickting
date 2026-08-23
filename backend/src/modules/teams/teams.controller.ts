import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @RequirePermissions('TEAM_MANAGE')
  @ApiOperation({ summary: 'Create a new Team' })
  async create(
    @TenantId() organizationId: string,
    @Body() body: { name: string; departmentId?: string; leadId?: string; description?: string },
  ) {
    return this.teamsService.create(organizationId, body.name, body.departmentId, body.leadId, body.description);
  }

  @Get()
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'List all teams in Tenant Organization' })
  async findAll(@TenantId() organizationId: string) {
    return this.teamsService.findAll(organizationId);
  }

  @Get(':id')
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'Get team details and members' })
  async findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.teamsService.findOne(organizationId, id);
  }

  @Post(':id/members')
  @RequirePermissions('TEAM_MANAGE')
  @ApiOperation({ summary: 'Add a user to a team' })
  async addMember(
    @TenantId() organizationId: string,
    @Param('id') teamId: string,
    @Body() body: { userId: string },
  ) {
    return this.teamsService.addMember(organizationId, teamId, body.userId);
  }

  @Delete(':id/members/:userId')
  @RequirePermissions('TEAM_MANAGE')
  @ApiOperation({ summary: 'Remove a user from a team' })
  async removeMember(
    @TenantId() organizationId: string,
    @Param('id') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.removeMember(organizationId, teamId, userId);
  }
}
