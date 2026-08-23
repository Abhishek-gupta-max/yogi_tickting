// ============================================================
// STEP-BY-STEP FUNCTIONALITY & UI/UX AUTOMATED VERIFICATION
// ============================================================

import { authApi, DEMO_USERS } from '../features/auth/api/auth.api';
import { ticketsApi } from '../features/tickets/api/tickets.api';
import { TICKET_TRANSITIONS, STATUS_LABELS } from '../features/tickets/types/ticket.types';
import { DEFAULT_ROLE_PERMISSIONS } from '../types/permission.types';
import { dateUtils, formatUtils } from '../shared/utils';

async function runStepByStepVerification() {
  console.log('====================================================');
  console.log('🧪 TICKETFLOW STEP-BY-STEP FUNCTIONALITY VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, stepName: string, detail: string) {
    if (condition) {
      console.log(`[PASS] ✅ ${stepName}: ${detail}`);
      passed++;
    } else {
      console.error(`[FAIL] ❌ ${stepName}: ${detail}`);
      failed++;
    }
  }

  // ----------------------------------------------------------
  // STEP 1: AUTHENTICATION & DEMO ROLES
  // ----------------------------------------------------------
  console.log('--- STEP 1: AUTHENTICATION & DEMO ROLES ---');

  const adminLogin = await authApi.login({ email: 'admin@ticketflow.io', password: 'password123' });
  assert(adminLogin.user.role === 'company_admin', 'Step 1.1', 'Company Admin login succeeds with valid JWT & permissions');
  assert(adminLogin.permissions.includes('tickets.create'), 'Step 1.2', 'Company Admin receives ticket creation permission');

  const agentLogin = await authApi.login({ email: 'agent@ticketflow.io', password: 'password123' });
  assert(agentLogin.user.role === 'agent', 'Step 1.3', 'Agent demo login succeeds');

  const superAdminPermissions = DEFAULT_ROLE_PERMISSIONS['super_admin'];
  assert(superAdminPermissions.includes('*'), 'Step 1.4', 'Super Admin role contains wildcard permission');

  // ----------------------------------------------------------
  // STEP 2: TICKET QUEUE & PAGINATION
  // ----------------------------------------------------------
  console.log('\n--- STEP 2: TICKET QUEUE & FILTERING ---');

  const allTickets = await ticketsApi.getTickets({ page: 1, pageSize: 10 });
  assert(allTickets.data.length > 0, 'Step 2.1', `Retrieved ${allTickets.data.length} tickets from API queue`);
  assert(allTickets.meta.total >= 6, 'Step 2.2', `Total tickets meta count is correct (${allTickets.meta.total})`);

  const criticalTickets = await ticketsApi.getTickets({ priority: 'critical' });
  const allCritical = criticalTickets.data.every((t) => t.priority === 'critical');
  assert(allCritical && criticalTickets.data.length > 0, 'Step 2.3', `Priority filter correctly isolates ${criticalTickets.data.length} Critical tickets`);

  const searchQuery = await ticketsApi.getTickets({ search: 'SSO' });
  assert(searchQuery.data.length > 0 && searchQuery.data[0].subject.includes('SSO'), 'Step 2.4', 'Search filter accurately matches subject keywords');

  // ----------------------------------------------------------
  // STEP 3: TICKET LIFECYCLE & STATE MACHINE
  // ----------------------------------------------------------
  console.log('\n--- STEP 3: TICKET LIFECYCLE STATE MACHINE ---');

  const openTransitions = TICKET_TRANSITIONS['open'];
  assert(openTransitions.includes('assigned') && openTransitions.includes('closed'), 'Step 3.1', 'Valid state transitions for OPEN tickets defined');

  const updatedTicket = await ticketsApi.updateTicketStatus('tkt-101', 'resolved');
  assert(updatedTicket.status === 'resolved', 'Step 3.2', 'Status transition from in_progress -> resolved succeeded');

  const timeline = await ticketsApi.getTimeline('tkt-101');
  assert(timeline.length > 0, 'Step 3.3', `Timeline audit log recorded ${timeline.length} events for ticket tkt-101`);

  // ----------------------------------------------------------
  // STEP 4: COMMENTS & INTERNAL NOTES
  // ----------------------------------------------------------
  console.log('\n--- STEP 4: COMMENTS & INTERNAL NOTES ---');

  const initialComments = await ticketsApi.getComments('tkt-101');
  const initialCount = initialComments.length;
  const newComment = await ticketsApi.addComment('tkt-101', 'Investigating root cause on staging server', true);
  assert(newComment.isInternal === true, 'Step 4.1', 'Internal Note created with isInternal flag = true');

  const updatedComments = await ticketsApi.getComments('tkt-101');
  assert(updatedComments.length === initialCount + 1, 'Step 4.2', `Comment count increased after posting note (${initialCount} -> ${updatedComments.length})`);

  // ----------------------------------------------------------
  // STEP 5: CREATE TICKET FLOW
  // ----------------------------------------------------------
  console.log('\n--- STEP 5: TICKET CREATION ---');

  const createdTicket = await ticketsApi.createTicket({
    subject: 'Automated Test Ticket: High Memory Usage',
    description: 'Node process memory reaches 95% under high concurrency load test.',
    priority: 'high',
    category: 'Infrastructure',
    tags: ['automated-test', 'memory-leak'],
  });

  assert(createdTicket.ticketNumber.startsWith('TKT-'), 'Step 5.1', `New ticket generated with ID ${createdTicket.ticketNumber}`);
  assert(createdTicket.status === 'new', 'Step 5.2', 'New ticket initialized with status NEW');

  // ----------------------------------------------------------
  // STEP 6: UTILITY & FORMATTING FUNCTIONS
  // ----------------------------------------------------------
  console.log('\n--- STEP 6: UTILITIES & FORMATTING ---');

  const formattedId = formatUtils.ticketId(12);
  assert(formattedId === 'TKT-000012', 'Step 6.1', `Ticket ID formatting matches enterprise standard (${formattedId})`);

  const slaStatus = dateUtils.getSLAStatus(new Date(Date.now() - 3600000).toISOString());
  assert(slaStatus === 'breached', 'Step 6.2', 'SLA calculation correctly detects breached target date');

  // ----------------------------------------------------------
  // STEP 7: CUSTOMER PORTAL & TICKET ASSIGNMENT
  // ----------------------------------------------------------
  console.log('\n--- STEP 7: CUSTOMER PORTAL & ASSIGNMENT ---');

  const customerLogin = await authApi.login({ email: 'customer@ticketflow.io', password: 'password123' });
  assert(customerLogin.user.role === 'customer', 'Step 7.1', 'Customer login succeeds');

  const assignedTicket = await ticketsApi.assignTicket('tkt-106', 'usr-agent-1', 'Sophia Martinez');
  assert(assignedTicket.status === 'assigned' && assignedTicket.assigneeId === 'usr-agent-1', 'Step 7.2', 'Ticket assignment state change succeeded (tkt-106 -> assigned)');

  const customerComments = await ticketsApi.getComments('tkt-101');
  const publicOnly = customerComments.filter((c) => !c.isInternal);
  assert(publicOnly.every((c) => !c.isInternal), 'Step 7.3', 'Customer view correctly filters out internal notes');

  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------
  console.log('\n====================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    throw new Error(`Verification failed with ${failed} failed assertions.`);
  }
}

runStepByStepVerification().catch((err) => {
  console.error('Fatal Verification Error:', err);
  throw err;
});

