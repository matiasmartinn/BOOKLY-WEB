import type { RouteObject } from 'react-router-dom';
import { AuthLayout } from 'app/pages/public/auth/auth-layout';
import { RegisterForm } from 'features/auth/user-form/register-form';
import { LoginPage } from 'app/pages/public/auth/login-page';
import { RecoverAccountForm } from 'features/auth/recover-account-form/recover-account-form';
import { SecretaryPasswordForm } from 'features/auth/secretary-password-form/secretary-password-form';
import { AppLayout } from 'app/layouts';

const Placeholder = () => <div style={{ padding: 24 }}>Pantalla</div>;

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Placeholder /> },

      // cualquier ruta random tipo pepito400
      { path: 'pepito400', element: <Placeholder /> },

      // auth
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

      // dashboard (rutas hijas reales)
      {
        path: 'dashboard',
        children: [
          { index: true, element: <Placeholder /> },
          { path: 'overview', element: <Placeholder /> },
          { path: 'appointments', element: <Placeholder /> },
          { path: 'schedules', element: <Placeholder /> },
          // etc
        ],
      },
    ],
  },
];