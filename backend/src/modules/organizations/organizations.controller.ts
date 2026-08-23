import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get('current')
  @RequirePermissions('SETTINGS_VIEW')
  @ApiOperation({ summary: 'Get current Tenant Organization profile' })
  async getProfile(@TenantId() organizationId: string) {
    return this.orgsService.getProfile(organizationId);
  }

  @Patch('current')
  @RequirePermissions('SETTINGS_UPDATE')
  @ApiOperation({ summary: 'Update Tenant Organization settings & profile' })
  async updateProfile(
    @TenantId() organizationId: string,
    @Body() body: { name?: string; phone?: string; address?: string; timezone?: string; logo?: string },
  ) {
    return this.orgsService.updateProfile(organizationId, body);
  }
}
