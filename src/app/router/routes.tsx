import type { RouteObject } from 'react-router-dom';
import { RegisterForm } from 'features/auth/user-form/register-form';
import { LoginPage } from 'app/pages/auth/login-page';
import { RecoverAccountForm } from 'features/auth/recover-account-form/recover-account-form';
import { SecretaryPasswordForm } from 'features/auth/secretary-password-form/secretary-password-form';
import { AppLayout, AuthLayout, DashboardLayout } from 'app/layouts';
import { SchedulesPage } from 'features/schedules/schedules-page';
import { UserProfilePage } from 'features/user-profile/user-profile-page';

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
          { path: 'secretary-password-form', element: <SecretaryPasswordForm /> },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Placeholder /> },
      { path: 'overview', element: <Placeholder /> },
      { path: 'appointments', element: <Placeholder /> },
      { path: 'schedules', element: <SchedulesPage /> },
      { path: 'service', element: <Placeholder /> },
      { path: 'unavailability', element: <Placeholder /> },
      { path: 'status', element: <Placeholder /> },
      { path: 'team', element: <Placeholder /> },
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'settings', element: <Placeholder /> },
    ],
  },
];
