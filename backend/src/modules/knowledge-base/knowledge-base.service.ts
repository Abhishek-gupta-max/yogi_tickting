import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, title: string, content: string, category?: string, summary?: string, authorName?: string) {
    return this.prisma.knowledgeArticle.create({
      data: {
        organizationId,
        title,
        content,
        category: category || 'General',
        summary,
        authorName: authorName || 'System Admin',
        status: 'PUBLISHED',
      },
    });
  }

  async findAll(organizationId: string, category?: string, search?: string) {
    const where: any = { organizationId, status: 'PUBLISHED' };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.knowledgeArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const article = await this.prisma.knowledgeArticle.findFirst({
      where: { id, organizationId },
    });
    if (!article) throw new NotFoundException('Article not found');

    // Increment view counter asynchronously
    await this.prisma.knowledgeArticle.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return article;
  }
}
