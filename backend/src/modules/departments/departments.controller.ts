import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @RequirePermissions('DEPARTMENT_MANAGE')
  @ApiOperation({ summary: 'Create department' })
  async create(
    @TenantId() organizationId: string,
    @Body() body: { name: string; code?: string; description?: string; managerId?: string },
  ) {
    return this.departmentsService.create(organizationId, body.name, body.code, body.description, body.managerId);
  }

  @Get()
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'List all departments' })
  async findAll(@TenantId() organizationId: string) {
    return this.departmentsService.findAll(organizationId);
  }

  @Get(':id')
  @RequirePermissions('TICKET_VIEW')
  @ApiOperation({ summary: 'Get department details' })
  async findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.departmentsService.findOne(organizationId, id);
  }

  @Patch(':id')
  @RequirePermissions('DEPARTMENT_MANAGE')
  @ApiOperation({ summary: 'Update department' })
  async update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; managerId?: string },
  ) {
    return this.departmentsService.update(organizationId, id, body.name, body.description, body.managerId);
  }

  @Delete(':id')
  @RequirePermissions('DEPARTMENT_MANAGE')
  @ApiOperation({ summary: 'Delete department' })
  async remove(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.departmentsService.remove(organizationId, id);
  }
}
