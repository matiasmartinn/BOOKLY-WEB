import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppHeader } from 'app/layouts/app-header';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './components';

export function DashboardLayout() {
  const [collapsed, { toggle }] = useDisclosure(false);

  const isAuth = "public"
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? 72 : 248,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader
          showMenuButton
          onToggleSidebar={toggle}
          mode={isAuth}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <DashboardSidebar collapsed={collapsed} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}