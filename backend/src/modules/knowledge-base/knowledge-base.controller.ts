import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KnowledgeBaseService } from './knowledge-base.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Knowledge Base')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RbacGuard)
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Post('articles')
  @RequirePermissions('KNOWLEDGE_CREATE')
  @ApiOperation({ summary: 'Create knowledge base article' })
  async create(
    @TenantId() organizationId: string,
    @Body() body: { title: string; content: string; category?: string; summary?: string; authorName?: string },
  ) {
    return this.kbService.create(organizationId, body.title, body.content, body.category, body.summary, body.authorName);
  }

  @Get('articles')
  @RequirePermissions('KNOWLEDGE_VIEW')
  @ApiOperation({ summary: 'Search articles' })
  async findAll(
    @TenantId() organizationId: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.kbService.findAll(organizationId, category, search);
  }

  @Get('articles/:id')
  @RequirePermissions('KNOWLEDGE_VIEW')
  @ApiOperation({ summary: 'Get article details' })
  async findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.kbService.findOne(organizationId, id);
  }
}
