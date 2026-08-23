import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ApprovalStatus } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(organizationId: string, requesterId: string, ticketId: string, approverId: string, comments?: string) {
    const ticket = await this.prisma.ticket.findFirst({ where: { id: ticketId, organizationId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.approvalRequest.create({
      data: {
        ticketId,
        requesterId,
        approverId,
        comments,
        status: ApprovalStatus.PENDING,
      },
      include: {
        approver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findPendingForUser(organizationId: string, userId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        approverId: userId,
        status: ApprovalStatus.PENDING,
        ticket: { organizationId },
      },
      include: {
        ticket: { select: { id: true, ticketNumber: true, title: true, priority: true } },
        requester: { select: { id: true, name: true, email: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async respond(organizationId: string, userId: string, requestId: string, approve: boolean, comments?: string) {
    const req = await this.prisma.approvalRequest.findUnique({
      where: { id: requestId },
      include: { ticket: true },
    });

    if (!req || req.ticket.organizationId !== organizationId) {
      throw new NotFoundException('Approval request not found');
    }

    if (req.approverId !== userId) {
      throw new ForbiddenException('Only assigned approver can respond to this request');
    }

    const newStatus = approve ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;

    const updated = await this.prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        comments: comments || req.comments,
        actionedAt: new Date(),
      },
    });

    // Write ticket history
    await this.prisma.ticketHistory.create({
      data: {
        ticketId: req.ticketId,
        organizationId,
        performedById: userId,
        action: `APPROVAL_${newStatus}`,
        newValue: `Request ${requestId} set to ${newStatus}`,
      },
    });

    return updated;
  }
}
