import { ConfirmEmailPage } from 'features/auth/confirm-email-page/confirm-email-page';
import { Navigate, type RouteObject } from 'react-router-dom';
import { RegisterForm } from 'features/auth/register-form/register-form';
import { LoginPage } from 'app/pages/auth/login-page';
import { RecoverAccountForm } from 'features/auth/recover-account-form/recover-account-form';
import { ResetPasswordForm } from 'features/auth/reset-password-form/reset-password-form';
import { AppLayout, AuthLayout, DashboardLayout } from 'app/layouts';
import { SchedulesPage } from 'features/schedules/schedules-page';
import { SecretaryOnboardingForm } from 'features/auth/secretary-onboarding-form/secretary-onboarding-form';
import { UnavailabilitiesPage } from 'features/unavailability/unavailabilities-page';
import { BusinessWizardPage } from 'features/business/business-wizard/business-wizard-page';
import { AppointmentPage } from 'features/appoiments/appointment-page';
import { OverviewPage } from 'features/dashboard/overview-page';
import { EventsPage } from 'features/dashboard/activity-page';
import { HistoryPage } from 'features/dashboard/history-page';
import { MetricsPage } from 'features/dashboard/metrics-page';
import { BusinessPage } from 'features/business/business-page';
import { BusinessStatusPage } from 'features/business/business-status-page';
import { TeamPage } from 'features/users/team-page';
import { SettingsPage } from 'features/settings/settings-page';
import { PATHS } from 'app/router/PATHS';

const Placeholder = () => <div style={{ padding: 24 }}>Pantalla</div>;

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Placeholder /> },
      { path: 'pepito400', element: <Placeholder /> },

      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'register', element: <RegisterForm /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'confirm-email', element: <ConfirmEmailPage /> },
          { path: 'forgot-password', element: <RecoverAccountForm /> },
          { path: 'reset-password', element: <ResetPasswordForm /> },
          { path: 'secretary-invitation', element: <SecretaryOnboardingForm /> },
          { path: 'secretary-password-form', element: <SecretaryOnboardingForm /> },
        ],
      },

      // ── Wizard de creación de servicio ────────────────────────────────────
      // Vive fuera del DashboardLayout a propósito — pantalla completa,
      // sin sidebar, sin AppShell. Mismo patrón que auth/create-service.
      // Accesible desde dos lugares:
      //   1. ServiceSwitcher (owner sin servicios): navigate(PATHS.service.create)
      //   2. Botón "Nuevo servicio" en Mi Servicio: navigate(PATHS.service.create)
    ],
  },
  {
    path: 'service/new',
    element: <BusinessWizardPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'overview', element: <Navigate to={PATHS.dashboard.overview} replace /> },
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
];
