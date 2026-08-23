import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password || 'ChangeMe123!', 12);

    const user = await this.prisma.user.create({
      data: {
        organizationId,
        name: dto.name,
        email: dto.email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role: dto.role || 'AGENT',
        departmentId: dto.departmentId,
        teamId: dto.teamId,
        phone: dto.phone,
        status: 'active',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        organizationId: true,
        departmentId: true,
        teamId: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        department: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        department: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found in organization');
    }

    return user;
  }

  async update(organizationId: string, id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        avatarUrl: true,
        departmentId: true,
        teamId: true,
        updatedAt: true,
      },
    });
  }

  async deactivate(organizationId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: 'User account deactivated successfully' };
  }
}
