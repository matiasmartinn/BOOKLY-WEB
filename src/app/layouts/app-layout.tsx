import { AppShell } from '@mantine/core';
import { AppHeader } from 'app/pages/components';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <AppShell header={{ height: '8dvh' }}>
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
