import { AppShell } from '@mantine/core';
import { AppHeader } from 'app/layouts/components';
import { Outlet, useLocation } from 'react-router-dom';

export function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppShell
      header={{ height: { base: 72, sm: 88 } }}
      padding={0}
      styles={{
        header: {
          background: 'rgba(17, 23, 46, 0.46)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        },
        main: {
          paddingTop: isHome ? 0 : undefined,
        },
      }}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
