import { AuthShell } from 'features/auth/components';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
