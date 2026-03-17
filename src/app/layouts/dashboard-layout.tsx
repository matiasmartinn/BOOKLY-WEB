import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import {
  DashboardSidebar,
  OWNER_PERMISSIONS,
  type SidebarUser,
} from './components/dashboard-sidebar';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-buisness-store';
import { useEffect } from 'react';

export function DashboardLayout() {
  const [mobileOpened, mobile] = useDisclosure(false);
  const [desktopCollapsed, desktop] = useDisclosure(false);

  const authUser = useAuthStore((s) => s.user);
  const { services, selectedService, selectService, loadServices, isLoading, initialized } =
    useBusinessStore();

  // Al refrescar, authUser viene rehidratado del localStorage (persist) pero los
  // servicios son in-memory y se pierden. Este efecto los recarga automáticamente.
  useEffect(() => {
    if (authUser && !initialized && !isLoading) {
      loadServices(authUser.id);
    }
  }, [authUser, initialized, isLoading, loadServices]);

  const handleSidebarNavigate = () => {
    if (window.innerWidth < 992) mobile.close();
  };

  // El AppShell siempre se renderiza — nunca hacemos return null aquí
  // para no romper la estructura del navbar de Mantine.
  // Si authUser todavía no existe (rehidratación en curso), el sidebar
  // recibe strings vacíos y se ve en blanco por un instante imperceptible.
  const sidebarUser: SidebarUser = authUser
    ? {
        name: `${authUser.firstName} ${authUser.lastName}`,
        initials: getInitials(authUser.firstName, authUser.lastName),
        role: 'owner', // TODO: derivar de authUser.role cuando exista el módulo de seguridad
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
          collapsed={desktopCollapsed}
          onToggleSidebar={desktop.toggle}
          onNavigate={handleSidebarNavigate}
          user={sidebarUser}
          permissions={OWNER_PERMISSIONS}
          services={services.map((s) => ({ id: String(s.id), name: s.name }))}
          activeServiceId={String(selectedService?.id ?? services[0]?.id ?? '')}
          onServiceChange={(id) => selectService(Number(id))}
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
