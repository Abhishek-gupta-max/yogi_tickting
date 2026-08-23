import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, name: string, code?: string, description?: string, managerId?: string) {
    return this.prisma.department.create({
      data: {
        organizationId,
        name,
        code,
        description,
        managerId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.department.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { users: true, teams: true, tickets: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const dept = await this.prisma.department.findFirst({
      where: { id, organizationId },
      include: {
        users: { select: { id: true, name: true, email: true, role: true } },
        teams: { select: { id: true, name: true, code: true } },
      },
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async update(organizationId: string, id: string, name?: string, description?: string, managerId?: string) {
    return this.prisma.department.update({
      where: { id },
      data: { name, description, managerId },
    });
  }

  async remove(organizationId: string, id: string) {
    await this.prisma.department.delete({ where: { id } });
    return { message: 'Department deleted' };
  }
}
