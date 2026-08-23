import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: { users: true, departments: true, teams: true, tickets: true },
        },
      },
    });

    if (!org) throw new NotFoundException('Organization tenant not found');
    return org;
  }

  async updateProfile(organizationId: string, data: { name?: string; phone?: string; address?: string; timezone?: string; logo?: string }) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  }
}
