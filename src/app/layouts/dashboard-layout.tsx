import { useEffect, useMemo } from 'react';
import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from 'app/router/PATHS';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-buisness-store';
import {
  DashboardSidebar,
  type SidebarUser,
} from './components/dashboard-sidebar';
import {
  buildSidebarPermissions,
  canAccessDashboardPath,
  getDefaultDashboardPath,
  normalizeUserRole,
} from './dashboard-navigation';

export function DashboardLayout() {
  const [mobileOpened, mobile] = useDisclosure(false);
  const [desktopCollapsed, desktop] = useDisclosure(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isMobile = useMediaQuery('(max-width: 48em)');
  const isCollapsed = isMobile ? false : desktopCollapsed;

  const authUser = useAuthStore((state) => state.user);
  const { services, selectedService, selectService, loadServices, isLoading, initialized } =
    useBusinessStore();

  useEffect(() => {
    if (authUser && !initialized && !isLoading) {
      void loadServices(authUser);
    }
  }, [authUser, initialized, isLoading, loadServices]);

  const sidebarRole = normalizeUserRole(authUser?.role);
  const permissions = useMemo(
    () => buildSidebarPermissions(authUser, selectedService),
    [authUser, selectedService],
  );

  useEffect(() => {
    if (!authUser || !initialized) {
      return;
    }

    const defaultPath = getDefaultDashboardPath(sidebarRole, permissions);
    const isAllowedPath = canAccessDashboardPath(pathname, sidebarRole, permissions);

    if (pathname === PATHS.dashboard.overview && sidebarRole !== 'owner') {
      navigate(defaultPath, { replace: true });
      return;
    }

    if (!isAllowedPath) {
      navigate(defaultPath, { replace: true });
    }
  }, [authUser, initialized, navigate, pathname, permissions, sidebarRole]);

  const handleSidebarNavigate = () => {
    if (window.innerWidth < 992) {
      mobile.close();
    }
  };

  const sidebarUser: SidebarUser = authUser
    ? {
        name: `${authUser.firstName} ${authUser.lastName}`.trim(),
        initials: getInitials(authUser.firstName, authUser.lastName),
        role: sidebarRole,
      }
    : { name: '', initials: '', role: 'owner' };

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
          collapsed={isCollapsed}
          onToggleSidebar={desktop.toggle}
          onNavigate={handleSidebarNavigate}
          ownerId={sidebarRole === 'owner' ? authUser?.id : undefined}
          user={sidebarUser}
          permissions={permissions}
          services={services.map((service) => ({ id: String(service.id), name: service.name }))}
          activeServiceId={String(selectedService?.id ?? services[0]?.id ?? '')}
          onServiceChange={(id) => {
            void selectService(Number(id));
          }}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.[0]?.toUpperCase() ?? '';
  const last = lastName?.[0]?.toUpperCase() ?? '';
  return `${first}${last}`;
}
