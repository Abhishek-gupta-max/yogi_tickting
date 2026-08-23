import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTicketDto, UpdateTicketDto, TicketQueryDto, CreateCommentDto } from './tickets.dto';
import { TicketPriorityType, TicketStatusType } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, requesterId: string, dto: CreateTicketDto) {
    // Generate sequential ticket number TKT-000001 per tenant organization
    const count = await this.prisma.ticket.count({
      where: { organizationId },
    });
    const ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;

    // Lookup default SLA policy for priority
    const slaPolicy = await this.prisma.sLAPolicy.findFirst({
      where: {
        organizationId,
        priority: dto.priority || TicketPriorityType.MEDIUM,
      },
    });

    const now = new Date();
    const responseTimeMin = slaPolicy?.responseTimeMinutes || 60;
    const resolutionTimeMin = slaPolicy?.resolutionTimeMinutes || 1440;

    const responseDueAt = new Date(now.getTime() + responseTimeMin * 60000);
    const resolutionDueAt = new Date(now.getTime() + resolutionTimeMin * 60000);

    const ticket = await this.prisma.ticket.create({
      data: {
        organizationId,
        ticketNumber,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || TicketPriorityType.MEDIUM,
        status: TicketStatusType.NEW,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        requesterId,
        assigneeId: dto.assigneeId,
        teamId: dto.teamId,
        departmentId: dto.departmentId,
        categoryId: dto.categoryId,
        slaPolicyId: slaPolicy?.id,
        responseDueAt,
        resolutionDueAt,
      },
      include: {
        requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        department: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
      },
    });

    // Record Immutable Ticket History
    await this.prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        organizationId,
        performedById: requesterId,
        action: 'TICKET_CREATED',
        newValue: `Created ${ticketNumber}: ${dto.title}`,
      },
    });

    return ticket;
  }

  async findAll(organizationId: string, query: TicketQueryDto) {
    const { status, priority, assigneeId, teamId, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (teamId) where.teamId = teamId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.ticket.count({ where }),
      this.prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
          assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
          department: { select: { id: true, name: true } },
          team: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(organizationId: string, id: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        organizationId,
        OR: [{ id }, { ticketNumber: id }],
      },
      include: {
        requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        department: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        category: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, role: true } },
          },
        },
        attachments: true,
        history: {
          orderBy: { createdAt: 'asc' },
        },
        approvalRequests: {
          include: {
            approver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket '${id}' not found in tenant organization`);
    }

    return ticket;
  }

  async update(organizationId: string, userId: string, id: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, organizationId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found in tenant organization');
    }

    const dataToUpdate: any = {};
    const historyEntries: any[] = [];

    if (dto.title && dto.title !== ticket.title) {
      dataToUpdate.title = dto.title;
      historyEntries.push({ fieldChanged: 'Title', oldValue: ticket.title, newValue: dto.title });
    }
    if (dto.status && dto.status !== ticket.status) {
      dataToUpdate.status = dto.status;
      if (dto.status === TicketStatusType.RESOLVED) dataToUpdate.resolvedAt = new Date();
      if (dto.status === TicketStatusType.CLOSED) dataToUpdate.closedAt = new Date();
      historyEntries.push({ fieldChanged: 'Status', oldValue: ticket.status, newValue: dto.status });
    }
    if (dto.priority && dto.priority !== ticket.priority) {
      dataToUpdate.priority = dto.priority;
      historyEntries.push({ fieldChanged: 'Priority', oldValue: ticket.priority, newValue: dto.priority });
    }
    if (dto.assigneeId !== undefined && dto.assigneeId !== ticket.assigneeId) {
      dataToUpdate.assigneeId = dto.assigneeId;
      historyEntries.push({ fieldChanged: 'Assignee', oldValue: ticket.assigneeId || 'Unassigned', newValue: dto.assigneeId || 'Unassigned' });
    }

    const updated = await this.prisma.ticket.update({
      where: { id },
      data: dataToUpdate,
      include: {
        requester: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    // Write history entries
    for (const entry of historyEntries) {
      await this.prisma.ticketHistory.create({
        data: {
          ticketId: id,
          organizationId,
          performedById: userId,
          action: 'TICKET_UPDATED',
          ...entry,
        },
      });
    }

    return updated;
  }

  async addComment(organizationId: string, userId: string, ticketId: string, dto: CreateCommentDto) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, organizationId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found in tenant organization');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const comment = await this.prisma.ticketComment.create({
      data: {
        ticketId,
        userId,
        userName: user?.name || 'Agent',
        content: dto.content,
        isInternal: dto.isInternal || false,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });

    // Record activity history
    await this.prisma.ticketHistory.create({
      data: {
        ticketId,
        organizationId,
        performedById: userId,
        action: dto.isInternal ? 'INTERNAL_NOTE_ADDED' : 'PUBLIC_REPLY_ADDED',
        newValue: dto.content.slice(0, 100),
      },
    });

    return comment;
  }

  async remove(organizationId: string, id: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, organizationId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.prisma.ticket.delete({
      where: { id },
    });

    return { message: 'Ticket deleted successfully' };
  }
}
