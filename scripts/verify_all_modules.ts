import { readFileSync, existsSync } from 'fs';
import path from 'path';

// List of all feature page files that form the UI/UX surface
const PAGE_FILES = [
  'src/features/auth/pages/LoginPage.tsx',
  'src/features/auth/pages/RegisterPage.tsx',
  'src/features/auth/pages/ForgotPasswordPage.tsx',
  'src/features/auth/pages/ResetPasswordPage.tsx',
  'src/features/auth/pages/TwoFactorPage.tsx',
  'src/features/dashboard/pages/DashboardPage.tsx',
  'src/features/dashboard/pages/SystemLogsPage.tsx',
  'src/features/tickets/pages/TicketListPage.tsx',
  'src/features/tickets/pages/TicketDetailPage.tsx',
  'src/features/tickets/pages/CreateTicketPage.tsx',
  'src/features/users/pages/UsersListPage.tsx',
  'src/features/organizations/pages/OrganizationsListPage.tsx',
  'src/features/reports/pages/ReportsPage.tsx',
  'src/features/reports/pages/AnalyticsPage.tsx',
  'src/features/customers/pages/CustomersPage.tsx',
  'src/features/notifications/pages/NotificationsPage.tsx',
  'src/features/knowledge-base/pages/KnowledgeBasePage.tsx',
  'src/features/departments/pages/DepartmentsPage.tsx',
  'src/features/teams/pages/TeamsPage.tsx',
  'src/features/branches/pages/BranchesPage.tsx',
  'src/features/roles/pages/RolesPage.tsx',
  'src/features/sla/pages/SLAPoliciesPage.tsx',
  'src/features/workflows/pages/WorkflowsPage.tsx',
  'src/features/customer-portal/pages/CustomerPortalPage.tsx',
  'src/features/settings/pages/GeneralSettingsPage.tsx',
  'src/layouts/AppLayout/AppLayout.tsx',
  'src/layouts/AppLayout/AppLayoutSidebar.tsx',
  'src/layouts/AppLayout/AppLayoutHeader.tsx',
];

console.log('=== TICKETFLOW ENTERPRISE UI/UX MODULE INTEGRITY VERIFICATION ===\n');

let passedCount = 0;
let failedCount = 0;

for (const fileRelative of PAGE_FILES) {
  const absolutePath = path.resolve(process.cwd(), fileRelative);
  if (!existsSync(absolutePath)) {
    console.error(`❌ MISSING FILE: ${fileRelative}`);
    failedCount++;
    continue;
  }

  const content = readFileSync(absolutePath, 'utf-8');

  // Perform checks
  const hasExport = content.includes('export const ') || content.includes('export default ') || content.includes('export function ');
  const hasFC = content.includes(': FC') || content.includes('function ') || content.includes('() =>');

  if (!hasExport || !hasFC) {
    console.error(`❌ INVALID COMPONENT EXPORT in: ${fileRelative}`);
    failedCount++;
  } else {
    console.log(`✓ VERIFIED (${content.length} bytes): ${fileRelative}`);
    passedCount++;
  }
}

console.log(`\n=== SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED ===`);
if (failedCount > 0) process.exit(1);
