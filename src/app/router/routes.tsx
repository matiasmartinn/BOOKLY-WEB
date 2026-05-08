import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { AuthLayout } from 'app/layouts/auth-layout';
import { AppLayout } from 'app/layouts/app-layout';
import { HomePage } from 'app/pages/public/home-page';
import { NotFoundPage } from 'app/pages/public/not-found-page';

import { PATHS } from './PATHS';
import { RequireAuth, RequireDashboardAccess, RequireGuest, RequireOwner } from './auth-guards';

const DashboardLayout = lazy(() =>
  import('app/layouts/dashboard-layout').then((m) => ({ default: m.DashboardLayout })),
);

const PublicBookingLayout = lazy(() =>
  import('app/layouts/public-booking-layout').then((m) => ({ default: m.PublicBookingLayout })),
);

// Auth pages
const ConfirmEmailPage = lazy(() =>
  import('features/auth/confirm-email-page/confirm-email-page').then((m) => ({
    default: m.ConfirmEmailPage,
  })),
);

const LoginForm = lazy(() =>
  import('features/auth/login-form/login-form').then((m) => ({
    default: m.LoginForm,
  })),
);

const RecoverAccountForm = lazy(() =>
  import('features/auth/recover-account-form/recover-account-form').then((m) => ({
    default: m.RecoverAccountForm,
  })),
);

const RegisterForm = lazy(() =>
  import('features/auth/register-form/register-form').then((m) => ({
    default: m.RegisterForm,
  })),
);

const ResetPasswordForm = lazy(() =>
  import('features/auth/reset-password-form/reset-password-form').then((m) => ({
    default: m.ResetPasswordForm,
  })),
);

const SecretaryOnboardingForm = lazy(() =>
  import('features/auth/secretary-onboarding-form/secretary-onboarding-form').then((m) => ({
    default: m.SecretaryOnboardingForm,
  })),
);

// Dashboard pages
const OverviewPage = lazy(() =>
  import('features/dashboard/overview-page').then((m) => ({ default: m.OverviewPage })),
);

const EventsPage = lazy(() =>
  import('features/dashboard/activity-page').then((m) => ({ default: m.EventsPage })),
);

const HistoryPage = lazy(() =>
  import('features/dashboard/history-page').then((m) => ({ default: m.HistoryPage })),
);

const MetricsPage = lazy(() =>
  import('features/dashboard/metrics-page').then((m) => ({ default: m.MetricsPage })),
);

const WelcomePage = lazy(() =>
  import('features/dashboard/welcome-page').then((m) => ({ default: m.WelcomePage })),
);

// Business pages
const BusinessPage = lazy(() =>
  import('features/business/business-page').then((m) => ({
    default: m.BusinessPage,
  })),
);

const BusinessPublicBookingPage = lazy(() =>
  import('features/business/business-public-booking-page').then((m) => ({
    default: m.BusinessPublicBookingPage,
  })),
);

const BusinessStatusPage = lazy(() =>
  import('features/business/business-status-page').then((m) => ({
    default: m.BusinessStatusPage,
  })),
);

const BusinessWizardPage = lazy(() =>
  import('features/business/business-wizard/business-wizard-page').then((m) => ({
    default: m.BusinessWizardPage,
  })),
);

// Admin pages
const AdminDashboardPage = lazy(() =>
  import('features/admin/admin-dashboard-page').then((m) => ({
    default: m.AdminDashboardPage,
  })),
);

const AdminOwnersPage = lazy(() =>
  import('features/admin/admin-owners-page').then((m) => ({
    default: m.AdminOwnersPage,
  })),
);

const AdminServicesPage = lazy(() =>
  import('features/admin/admin-services-page').then((m) => ({
    default: m.AdminServicesPage,
  })),
);

const AdminServiceTypesPage = lazy(() =>
  import('features/admin/admin-service-types-page').then((m) => ({
    default: m.AdminServiceTypesPage,
  })),
);

// Other feature pages
const TeamPage = lazy(() =>
  import('features/users/team-page').then((m) => ({ default: m.TeamPage })),
);

const SettingsPage = lazy(() =>
  import('features/settings/settings-page').then((m) => ({ default: m.SettingsPage })),
);

const AppointmentPage = lazy(() =>
  import('features/appoiments/appointment-page').then((m) => ({ default: m.AppointmentPage })),
);

const PublicBookingPage = lazy(() =>
  import('features/public-booking/public-booking-page').then((m) => ({
    default: m.PublicBookingPage,
  })),
);

const SchedulesPage = lazy(() =>
  import('features/schedules/schedules-page').then((m) => ({ default: m.SchedulesPage })),
);

const UnavailabilitiesPage = lazy(() =>
  import('features/unavailability/unavailabilities-page').then((m) => ({
    default: m.UnavailabilitiesPage,
  })),
);

const PageLoader = () => <div />;

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

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
    element: withSuspense(<PublicBookingLayout />),
    children: [{ index: true, element: withSuspense(<PublicBookingPage />) }],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          { path: 'register', element: withSuspense(<RegisterForm />) },
          { path: 'login', element: withSuspense(<LoginForm />) },
        ],
      },
      { path: 'confirm-email', element: withSuspense(<ConfirmEmailPage />) },
      { path: 'forgot-password', element: withSuspense(<RecoverAccountForm />) },
      { path: 'reset-password', element: withSuspense(<ResetPasswordForm />) },
      { path: 'admin-invitation', element: withSuspense(<SecretaryOnboardingForm />) },
      { path: 'secretary-invitation', element: withSuspense(<SecretaryOnboardingForm />) },
      { path: 'secretary-password-form', element: withSuspense(<SecretaryOnboardingForm />) },
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
            element: withSuspense(<BusinessWizardPage />),
          },
        ],
      },
      {
        path: '/dashboard',
        element: <RequireDashboardAccess />,
        children: [
          {
            element: withSuspense(<DashboardLayout />),
            children: [
              { index: true, element: withSuspense(<OverviewPage />) },
              { path: 'overview', element: <Navigate to={PATHS.dashboard.overview} replace /> },
              { path: 'admin', element: withSuspense(<AdminDashboardPage />) },
              { path: 'admin/owners', element: withSuspense(<AdminOwnersPage />) },
              { path: 'admin/services', element: withSuspense(<AdminServicesPage />) },
              { path: 'admin/service-types', element: withSuspense(<AdminServiceTypesPage />) },
              { path: 'activity', element: <Navigate to={PATHS.dashboard.events} replace /> },
              { path: 'events', element: withSuspense(<EventsPage />) },
              { path: 'appointments', element: withSuspense(<AppointmentPage />) },
              { path: 'schedules', element: withSuspense(<SchedulesPage />) },
              { path: 'history', element: withSuspense(<HistoryPage />) },
              { path: 'metrics', element: withSuspense(<MetricsPage />) },
              { path: 'business', element: withSuspense(<BusinessPage />) },
              {
                path: 'business/:serviceId/public-booking',
                element: withSuspense(<BusinessPublicBookingPage />),
              },
              { path: 'unavailability', element: withSuspense(<UnavailabilitiesPage />) },
              { path: 'status', element: withSuspense(<BusinessStatusPage />) },
              { path: 'team', element: withSuspense(<TeamPage />) },
              { path: 'account', element: withSuspense(<SettingsPage />) },
              { path: 'profile', element: <Navigate to={PATHS.dashboard.account} replace /> },
              { path: 'settings', element: <Navigate to={PATHS.dashboard.account} replace /> },
              { path: 'welcome', element: withSuspense(<WelcomePage />) },
            ],
          },
        ],
      },
    ],
  },
];
