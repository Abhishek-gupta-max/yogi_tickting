import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('USER_CREATE')
  @ApiOperation({ summary: 'Create or Invite a User in Tenant Organization' })
  async create(@TenantId() organizationId: string, @Body() dto: CreateUserDto) {
    return this.usersService.create(organizationId, dto);
  }

  @Get()
  @RequirePermissions('USER_VIEW')
  @ApiOperation({ summary: 'Get all users in Tenant Organization' })
  async findAll(@TenantId() organizationId: string) {
    return this.usersService.findAll(organizationId);
  }

  @Get(':id')
  @RequirePermissions('USER_VIEW')
  @ApiOperation({ summary: 'Get single user profile' })
  async findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.usersService.findOne(organizationId, id);
  }

  @Patch(':id')
  @RequirePermissions('USER_UPDATE')
  @ApiOperation({ summary: 'Update user profile, role, department, or team' })
  async update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(organizationId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('USER_DELETE')
  @ApiOperation({ summary: 'Deactivate user account' })
  async deactivate(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.usersService.deactivate(organizationId, id);
  }
}
