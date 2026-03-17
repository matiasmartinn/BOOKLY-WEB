import type { RouteObject } from 'react-router-dom';
import { RegisterForm } from 'features/auth/register-form/register-form';
import { LoginPage } from 'app/pages/auth/login-page';
import { RecoverAccountForm } from 'features/auth/recover-account-form/recover-account-form';
import { AppLayout, AuthLayout, DashboardLayout } from 'app/layouts';
import { SchedulesPage } from 'features/schedules/schedules-page';
import { UserProfilePage } from 'features/user-profile/user-profile-page';
import { SecretaryOnboardingForm } from 'features/auth/secretary-onboarding-form/secretary-onboarding-form';
import { UnavailabilitiesPage } from 'features/unavailability/unavailabilities-page';
import { BusinessWizardPage } from 'features/business/business-wizard/business-wizard-page';
import { AppointmentPage } from 'features/appoiments/appointment-page';

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
          { path: 'forgot-password', element: <RecoverAccountForm /> },
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
      { index: true, element: <Placeholder /> },
      { path: 'overview', element: <Placeholder /> },
      { path: 'appointments', element: <AppointmentPage /> },
      { path: 'schedules', element: <SchedulesPage /> },
      { path: 'business', element: <Placeholder /> },
      { path: 'unavailability', element: <UnavailabilitiesPage /> },
      { path: 'status', element: <Placeholder /> },
      { path: 'team', element: <Placeholder /> },
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'settings', element: <Placeholder /> },
    ],
  },
];
