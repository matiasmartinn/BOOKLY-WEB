import { Outlet } from 'react-router-dom';
import { AuthShell } from 'features/auth/components';

export function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
