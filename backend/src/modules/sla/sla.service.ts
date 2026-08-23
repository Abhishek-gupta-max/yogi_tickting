import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TicketPriorityType } from '@prisma/client';

@Injectable()
export class SLAService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, name: string, priority: TicketPriorityType, responseTimeMin: number, resolutionTimeMin: number, description?: string) {
    return this.prisma.sLAPolicy.create({
      data: {
        organizationId,
        name,
        priority,
        responseTimeMinutes: responseTimeMin,
        resolutionTimeMinutes: resolutionTimeMin,
        description,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.sLAPolicy.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(organizationId: string, id: string) {
    const policy = await this.prisma.sLAPolicy.findFirst({ where: { id, organizationId } });
    if (!policy) throw new NotFoundException('SLA policy not found');
    await this.prisma.sLAPolicy.delete({ where: { id } });
    return { message: 'SLA policy deleted' };
  }
}
