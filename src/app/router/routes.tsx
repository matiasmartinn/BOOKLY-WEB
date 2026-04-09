import { AppLayout } from 'app/layouts/app-layout';
import { AuthLayout } from 'app/layouts/auth-layout';
import { DashboardLayout } from 'app/layouts/dashboard-layout';
import { PublicBookingLayout } from 'app/layouts/public-booking-layout';
import { HomePage } from 'app/pages/public/home-page';
import { NotFoundPage } from 'app/pages/public/not-found-page';
import { OverviewPage } from 'features/dashboard/overview-page';
import { EventsPage } from 'features/dashboard/activity-page';
import { HistoryPage } from 'features/dashboard/history-page';
import { MetricsPage } from 'features/dashboard/metrics-page';
import { BusinessPage } from 'features/business/business-page';
import { BusinessStatusPage } from 'features/business/business-status-page';
import { TeamPage } from 'features/users/team-page';
import { SettingsPage } from 'features/settings/settings-page';
import { AdminDashboardPage } from 'features/admin/admin-dashboard-page';
import { AdminOwnersPage } from 'features/admin/admin-owners-page';
import { AdminServicesPage } from 'features/admin/admin-services-page';
import { AppointmentPage } from 'features/appoiments/appointment-page';
import { ConfirmEmailPage } from 'features/auth/confirm-email-page/confirm-email-page';
import { LoginForm } from 'features/auth/login-form/login-form';
import { RecoverAccountForm } from 'features/auth/recover-account-form/recover-account-form';
import { RegisterForm } from 'features/auth/register-form/register-form';
import { ResetPasswordForm } from 'features/auth/reset-password-form/reset-password-form';
import { SecretaryOnboardingForm } from 'features/auth/secretary-onboarding-form/secretary-onboarding-form';
import { BusinessWizardPage } from 'features/business/business-wizard/business-wizard-page';
import { PublicBookingPage } from 'features/public-booking/public-booking-page';
import { SchedulesPage } from 'features/schedules/schedules-page';
import { UnavailabilitiesPage } from 'features/unavailability/unavailabilities-page';
import { Navigate, type RouteObject } from 'react-router-dom';

import { RequireAuth, RequireDashboardAccess, RequireGuest, RequireOwner } from './auth-guards';
import { PATHS } from './PATHS';

export const appRoutes: RouteObject[] = [
  {
    path: PATHS.public.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: PATHS.public.booking,
    element: <PublicBookingLayout />,
    children: [{ index: true, element: <PublicBookingPage /> }],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          { path: 'register', element: <RegisterForm /> },
          { path: 'login', element: <LoginForm /> },
        ],
      },
      { path: 'confirm-email', element: <ConfirmEmailPage /> },
      { path: 'forgot-password', element: <RecoverAccountForm /> },
      { path: 'reset-password', element: <ResetPasswordForm /> },
      { path: 'admin-invitation', element: <SecretaryOnboardingForm /> },
      { path: 'secretary-invitation', element: <SecretaryOnboardingForm /> },
      { path: 'secretary-password-form', element: <SecretaryOnboardingForm /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RequireOwner />,
        children: [
          {
            path: 'service/new',
            element: <BusinessWizardPage />,
          },
        ],
      },
      {
        path: '/dashboard',
        element: <RequireDashboardAccess />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <OverviewPage /> },
              { path: 'overview', element: <Navigate to={PATHS.dashboard.overview} replace /> },
              { path: 'admin', element: <AdminDashboardPage /> },
              { path: 'admin/owners', element: <AdminOwnersPage /> },
              { path: 'admin/services', element: <AdminServicesPage /> },
              { path: 'activity', element: <Navigate to={PATHS.dashboard.events} replace /> },
              { path: 'events', element: <EventsPage /> },
              { path: 'appointments', element: <AppointmentPage /> },
              { path: 'schedules', element: <SchedulesPage /> },
              { path: 'history', element: <HistoryPage /> },
              { path: 'metrics', element: <MetricsPage /> },
              { path: 'business', element: <BusinessPage /> },
              { path: 'unavailability', element: <UnavailabilitiesPage /> },
              { path: 'status', element: <BusinessStatusPage /> },
              { path: 'team', element: <TeamPage /> },
              { path: 'account', element: <SettingsPage /> },
              { path: 'profile', element: <Navigate to={PATHS.dashboard.account} replace /> },
              { path: 'settings', element: <Navigate to={PATHS.dashboard.account} replace /> },
            ],
          },
        ],
      },
    ],
  },
];
