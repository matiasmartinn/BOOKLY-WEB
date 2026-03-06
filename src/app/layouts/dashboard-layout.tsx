import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardLayout() {
  const [mobileOpened, mobile] = useDisclosure(false);
  const [desktopCollapsed, desktop] = useDisclosure(false);

  const handleSidebarNavigate = () => {
    if (window.innerWidth < 992) {
      mobile.close();
      return;
    }
  };

  return (
    <AppShell
      header={{ height: { base: 60, md: 0 } }}
      navbar={{
        width: desktopCollapsed ? 84 : 260,
        breakpoint: 'md',
        collapsed: {
          mobile: !mobileOpened,
          desktop: false,
        },
      }}
      padding="md"
      styles={{
        main: { backgroundColor: '#f7f8fc' },
      }}
    >
      <AppShell.Header hiddenFrom="md">
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={mobileOpened} onClick={mobile.toggle} hiddenFrom="md" size="sm" />
            <Text fw={800} c="brand.6">
              Bookly
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <DashboardSidebar
          collapsed={desktopCollapsed}
          onToggleSidebar={desktop.toggle}
          onNavigate={handleSidebarNavigate}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
