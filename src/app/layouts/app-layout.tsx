import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../pages/public/components/app-header';

export function AppLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
