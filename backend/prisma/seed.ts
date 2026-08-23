import { PrismaClient, RoleType, TicketPriorityType, TicketStatusType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise ITSM Database Seeding...');

  // Create Demo Organization Tenant
  const org = await prisma.organization.upsert({
    where: { code: 'ACME' },
    update: {},
    create: {
      name: 'Acme Enterprises',
      code: 'ACME',
      email: 'admin@acme.com',
      phone: '+1 555-0199',
      timezone: 'America/New_York',
      status: 'active',
      subscriptionPlan: 'enterprise',
    },
  });

  console.log(`✅ Tenant Organization ensured: ${org.name} (${org.code})`);

  // Default Password: Admin123!
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Eleanor Vance',
      email: 'admin@acme.com',
      passwordHash,
      role: RoleType.ORGANIZATION_ADMIN,
      status: 'active',
      isEmailVerified: true,
    },
  });

  // Support Agent User
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@acme.com' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Sophia Martinez',
      email: 'agent@acme.com',
      passwordHash,
      role: RoleType.AGENT,
      status: 'active',
      isEmailVerified: true,
    },
  });

  console.log(`✅ Demo Admin & Support Agent users seeded.`);

  // Departments
  const deptSupport = await prisma.department.create({
    data: {
      organizationId: org.id,
      name: 'Technical Support',
      code: 'TECH-SUP',
      description: 'Tier 1 & Tier 2 customer incident resolution',
      managerId: adminUser.id,
    },
  });

  // Teams
  const teamL1 = await prisma.team.create({
    data: {
      organizationId: org.id,
      departmentId: deptSupport.id,
      name: 'L1 Incident Escalation Team',
      code: 'L1-ESC',
      leadId: agentUser.id,
    },
  });

  // Default SLA Policies
  const slaUrgent = await prisma.sLAPolicy.create({
    data: {
      organizationId: org.id,
      name: 'Critical Incident SLA',
      priority: TicketPriorityType.URGENT,
      responseTimeMinutes: 15,
      resolutionTimeMinutes: 240,
    },
  });

  const slaStandard = await prisma.sLAPolicy.create({
    data: {
      organizationId: org.id,
      name: 'Standard Service Request SLA',
      priority: TicketPriorityType.MEDIUM,
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 1440,
      isDefault: true,
    },
  });

  // Demo Tickets with TKT-000001 format
  const tkt1 = await prisma.ticket.create({
    data: {
      organizationId: org.id,
      ticketNumber: 'TKT-000001',
      title: 'Unable to connect to VPN after macOS Sequoia update',
      description: 'User reports handshake timeout when attempting to connect to corporate IPsec gateway.',
      priority: TicketPriorityType.HIGH,
      status: TicketStatusType.OPEN,
      requesterId: adminUser.id,
      assigneeId: agentUser.id,
      departmentId: deptSupport.id,
      teamId: teamL1.id,
      slaPolicyId: slaStandard.id,
      customerName: 'John Doe',
      customerEmail: 'john@acme.com',
      responseDueAt: new Date(Date.now() + 60 * 60000),
      resolutionDueAt: new Date(Date.now() + 1440 * 60000),
    },
  });

  // Sample Public Reply & Internal Note
  await prisma.ticketComment.create({
    data: {
      ticketId: tkt1.id,
      userId: agentUser.id,
      userName: agentUser.name,
      content: 'We are investigating the VPN gateway logs. Could you confirm if you are on Cisco AnyConnect 4.10?',
      isInternal: false,
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId: tkt1.id,
      userId: agentUser.id,
      userName: agentUser.name,
      content: 'Internal note: Potential DNS routes conflict with Sequoia network filter. Escalate to DevOps if unassigned after 2h.',
      isInternal: true,
    },
  });

  // Knowledge Base Articles
  await prisma.knowledgeArticle.create({
    data: {
      organizationId: org.id,
      title: 'Troubleshooting Corporate VPN Handshake Failure',
      summary: 'Step-by-step resolution for IPsec gateway connection drops.',
      content: '### Step 1\nVerify your client software version...\n### Step 2\nClear stale DNS resolver cache using `sudo dscacheutil -flushcache`.',
      category: 'Network',
      authorName: adminUser.name,
      views: 248,
      status: 'PUBLISHED',
    },
  });

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
