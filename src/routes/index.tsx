import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppLayout } from '@/layouts/AppLayout/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout';
import { RequireAuth } from './guards/RequireAuth';
import { RequireGuest } from './guards/RequireGuest';
import { SuspenseFallback } from '@/shared/components/feedback';

// ============================================================
// LAZY PAGE IMPORTS — Zero JS shipped until navigation
// ============================================================

// Auth
const LoginPage          = lazy(() => import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage       = lazy(() => import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage  = lazy(() => import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const TwoFactorPage      = lazy(() => import('@/features/auth/pages/TwoFactorPage').then((m) => ({ default: m.TwoFactorPage })));

// Dashboard
const DashboardPage      = lazy(() => import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));

// Tickets
const TicketListPage     = lazy(() => import('@/features/tickets/pages/TicketListPage').then((m) => ({ default: m.TicketListPage })));
const TicketDetailPage   = lazy(() => import('@/features/tickets/pages/TicketDetailPage').then((m) => ({ default: m.TicketDetailPage })));
const CreateTicketPage   = lazy(() => import('@/features/tickets/pages/CreateTicketPage').then((m) => ({ default: m.CreateTicketPage })));

// Users, Orgs, Roles, etc.
const UsersListPage        = lazy(() => import('@/features/users/pages/UsersListPage').then((m) => ({ default: m.UsersListPage })));
const OrganizationsListPage= lazy(() => import('@/features/organizations/pages/OrganizationsListPage').then((m) => ({ default: m.OrganizationsListPage })));
const ReportsPage          = lazy(() => import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const CustomersPage        = lazy(() => import('@/features/customers/pages/CustomersPage').then((m) => ({ default: m.CustomersPage })));
const NotificationsPage    = lazy(() => import('@/features/notifications/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const KnowledgeBasePage    = lazy(() => import('@/features/knowledge-base/pages/KnowledgeBasePage').then((m) => ({ default: m.KnowledgeBasePage })));
// Management & Settings
const DepartmentsPage      = lazy(() => import('@/features/departments/pages/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage })));
const TeamsPage            = lazy(() => import('@/features/teams/pages/TeamsPage').then((m) => ({ default: m.TeamsPage })));
const BranchesPage         = lazy(() => import('@/features/branches/pages/BranchesPage').then((m) => ({ default: m.BranchesPage })));
const RolesPage            = lazy(() => import('@/features/roles/pages/RolesPage').then((m) => ({ default: m.RolesPage })));
const SLAPoliciesPage      = lazy(() => import('@/features/sla/pages/SLAPoliciesPage').then((m) => ({ default: m.SLAPoliciesPage })));
const WorkflowsPage        = lazy(() => import('@/features/workflows/pages/WorkflowsPage').then((m) => ({ default: m.WorkflowsPage })));
const SystemLogsPage       = lazy(() => import('@/features/dashboard/pages/SystemLogsPage').then((m) => ({ default: m.SystemLogsPage })));
const CustomerPortalPage   = lazy(() => import('@/features/customer-portal/pages/CustomerPortalPage').then((m) => ({ default: m.CustomerPortalPage })));
const GeneralSettingsPage  = lazy(() => import('@/features/settings/pages/GeneralSettingsPage').then((m) => ({ default: m.GeneralSettingsPage })));

const AnalyticsPage        = lazy(() => import('@/features/reports/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));

function S(Component: React.ComponentType) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  // ─── LOGIN — Standalone fullscreen (no AuthLayout wrapper) ──
  {
    path: '/login',
    element: <RequireGuest>{S(LoginPage)}</RequireGuest>,
  },

  // ─── OTHER AUTH PAGES (use AuthLayout card wrapper) ─────────
  {
    element: <RequireGuest><AuthLayout /></RequireGuest>,
    children: [
      { path: '/register',        element: S(RegisterPage) },
      { path: '/forgot-password', element: S(ForgotPasswordPage) },
      { path: '/reset-password',  element: S(ResetPasswordPage) },
      { path: '/2fa',             element: S(TwoFactorPage) },
    ],
  },

  // ─── AUTHENTICATED APP ROUTES ────────────────────────────
  {
    element: <RequireAuth><AppLayout /></RequireAuth>,
    children: [
      // Root redirect
      { index: true, path: '/', element: <Navigate to="/dashboard" replace /> },

      // Dashboard
      { path: '/dashboard', element: S(DashboardPage) },

      // Customer Self-Service Portal
      { path: '/portal',    element: S(CustomerPortalPage) },

      // Tickets
      { path: '/tickets',           element: S(TicketListPage) },
      { path: '/tickets/new',       element: S(CreateTicketPage) },
      { path: '/tickets/:ticketId', element: S(TicketDetailPage) },

      // Management Sub-routes
      { path: '/settings/users',       element: S(UsersListPage) },
      { path: '/settings/departments', element: S(DepartmentsPage) },
      { path: '/settings/teams',       element: S(TeamsPage) },
      { path: '/settings/branches',    element: S(BranchesPage) },
      { path: '/settings/roles',       element: S(RolesPage) },
      { path: '/settings/sla',         element: S(SLAPoliciesPage) },
      { path: '/settings/workflows',   element: S(WorkflowsPage) },

      // System Logs (Super Admin)
      { path: '/system/logs',          element: S(SystemLogsPage) },

      // Organizations (Super Admin)
      { path: '/organizations',    element: S(OrganizationsListPage) },

      // Customers
      { path: '/customers',        element: S(CustomersPage) },

      // Reports & Analytics
      { path: '/reports',          element: S(ReportsPage) },
      { path: '/analytics',        element: S(AnalyticsPage) },

      // Knowledge Base
      { path: '/knowledge-base',   element: S(KnowledgeBasePage) },

      // Notifications
      { path: '/notifications',    element: S(NotificationsPage) },

      // Settings
      { path: '/settings',         element: <Navigate to="/settings/general" replace /> },
      { path: '/settings/general', element: S(GeneralSettingsPage) },
    ],
  },

  // ─── ERROR PAGES ─────────────────────────────────────────
  {
    path: '/unauthorized',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">403 — Unauthorized</h1>
        <p className="text-slate-500 mt-2">You don't have permission to view this page.</p>
      </div>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">404 — Page Not Found</h1>
        <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
      </div>
    ),
  },
]);
