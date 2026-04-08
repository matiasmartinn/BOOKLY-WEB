import { AppShell } from '@mantine/core';
import { AppHeader } from 'app/layouts/components';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <AppShell header={{ height: 76 }} padding={0}>
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
