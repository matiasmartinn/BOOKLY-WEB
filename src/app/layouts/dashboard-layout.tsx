import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DashboardSidebar } from 'app/pages/dashboard/components';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  const [collapsed, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      navbar={{
        width: collapsed ? 72 : 248,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar>
        <DashboardSidebar collapsed={collapsed} onToggleSidebar={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
