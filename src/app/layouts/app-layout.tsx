import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from './app-header';
import { DashboardSidebar } from 'app/pages/dashboard/components';

export function AppLayout() {
  const location = useLocation();
  const [collapsed, { toggle }] = useDisclosure(false);

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={
        isDashboardRoute
          ? { width: collapsed ? 72 : 248, breakpoint: 'sm' }
          : undefined
      }
      padding="md"
    >
      <AppShell.Header>
        <AppHeader
          mode={isDashboardRoute ? 'branding' : 'public'}
          showMenuButton={isDashboardRoute}
          onToggleSidebar={toggle}
        />
      </AppShell.Header>

      {isDashboardRoute && (
        <AppShell.Navbar>
          <DashboardSidebar collapsed={collapsed} />
        </AppShell.Navbar>
      )}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}