import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, name: string, departmentId?: string, leadId?: string, description?: string) {
    return this.prisma.team.create({
      data: {
        organizationId,
        name,
        departmentId,
        leadId,
        description,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.team.findMany({
      where: { organizationId },
      include: {
        department: { select: { id: true, name: true } },
        _count: { select: { members: true, tickets: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const team = await this.prisma.team.findFirst({
      where: { id, organizationId },
      include: {
        department: { select: { id: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
          },
        },
        _count: { select: { tickets: true } },
      },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async addMember(organizationId: string, teamId: string, userId: string) {
    const team = await this.prisma.team.findFirst({ where: { id: teamId, organizationId } });
    if (!team) throw new NotFoundException('Team not found');

    const existing = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (existing) throw new ConflictException('User is already a member of this team');

    return this.prisma.teamMember.create({
      data: { teamId, userId },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async removeMember(organizationId: string, teamId: string, userId: string) {
    const team = await this.prisma.team.findFirst({ where: { id: teamId, organizationId } });
    if (!team) throw new NotFoundException('Team not found');

    await this.prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });

    return { message: 'Member removed from team successfully' };
  }
}
