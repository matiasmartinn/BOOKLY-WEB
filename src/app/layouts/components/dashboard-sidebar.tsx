import {
  faBars,
  faCalendarCheck,
  faCalendarXmark,
  faChartColumn,
  faChartPie,
  faChevronDown,
  faClock,
  faClockRotateLeft,
  faPlus,
  faRectangleList,
  faRightFromBracket,
  faStore,
  faToggleOn,
  faUser,
  faUsers,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Popover,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { BusinessOptions } from 'features/business/components';
import { SubscriptionSidebarBanner } from 'features/subscriptions/components';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store/use-auth-store';

import classes from './dashboard-sidebar.module.css';

export type UserRole = 'owner' | 'secretary' | 'admin';

export interface Service {
  id: string;
  name: string;
}

export interface SidebarUser {
  name: string;
  initials: string;
  role: UserRole;
}

export interface SidebarPermissions {
  viewAppointments: boolean;
  viewSchedules: boolean;
  viewService: boolean;
  viewUnavailability: boolean;
  viewStatus: boolean;
  viewTeam: boolean;
  viewSettings: boolean;
}

interface NavItem {
  label: string;
  icon: IconDefinition;
  path: string;
  permission?: keyof SidebarPermissions;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const OWNER_NAV_SECTIONS: NavSection[] = [
  {
    label: 'Panel',
    items: [{ label: 'Resumen', icon: faChartPie, path: PATHS.dashboard.overview }],
  },
  {
    label: 'Operacion',
    items: [
      {
        label: 'Turnos',
        icon: faCalendarCheck,
        path: PATHS.dashboard.appointments,
        permission: 'viewAppointments',
      },
      {
        label: 'Horarios',
        icon: faClock,
        path: PATHS.dashboard.schedules,
        permission: 'viewSchedules',
      },
      {
        label: 'Excepciones',
        icon: faCalendarXmark,
        path: PATHS.dashboard.unavailability,
        permission: 'viewUnavailability',
      },
    ],
  },
  {
    label: 'Servicio',
    items: [
      {
        label: 'Mi servicio',
        icon: faStore,
        path: PATHS.dashboard.service,
        permission: 'viewService',
      },
      {
        label: 'Equipo',
        icon: faUsers,
        path: PATHS.dashboard.team,
        permission: 'viewTeam',
      },
      {
        label: 'Estado',
        icon: faToggleOn,
        path: PATHS.dashboard.status,
        permission: 'viewStatus',
      },
    ],
  },
  {
    label: 'Seguimiento',
    items: [
      { label: 'Auditoría', icon: faRectangleList, path: PATHS.dashboard.events },
      { label: 'Historico', icon: faClockRotateLeft, path: PATHS.dashboard.history },
      { label: 'Metricas', icon: faChartColumn, path: PATHS.dashboard.metrics },
    ],
  },
];

const SECRETARY_NAV_SECTIONS: NavSection[] = [
  {
    label: 'Operacion',
    items: [
      {
        label: 'Turnos',
        icon: faCalendarCheck,
        path: PATHS.dashboard.appointments,
        permission: 'viewAppointments',
      },
      {
        label: 'Horarios',
        icon: faClock,
        path: PATHS.dashboard.schedules,
        permission: 'viewSchedules',
      },
      {
        label: 'Excepciones',
        icon: faCalendarXmark,
        path: PATHS.dashboard.unavailability,
        permission: 'viewUnavailability',
      },
    ],
  },
];

const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    label: 'Administracion',
    items: [
      { label: 'Resumen', icon: faChartPie, path: PATHS.dashboard.adminOverview },
      { label: 'Owners', icon: faUsers, path: PATHS.dashboard.adminOwners },
      { label: 'Servicios', icon: faStore, path: PATHS.dashboard.adminServices },
      {
        label: 'Tipos de servicio',
        icon: faRectangleList,
        path: PATHS.dashboard.adminServiceTypes,
      },
    ],
  },
];

const ACCOUNT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Cuenta',
    icon: faUser,
    path: PATHS.dashboard.account,
    permission: 'viewSettings',
  },
];

const NAV_SECTIONS_BY_ROLE: Record<UserRole, NavSection[]> = {
  owner: OWNER_NAV_SECTIONS,
  secretary: SECRETARY_NAV_SECTIONS,
  admin: ADMIN_NAV_SECTIONS,
};

interface ServiceSwitcherProps {
  services: Service[];
  activeServiceId: string;
  onServiceChange: (serviceId: string) => void;
  collapsed: boolean;
  allowCreate?: boolean;
  emptyLabel?: string;
}

function ServiceSwitcher({
  services,
  activeServiceId,
  onServiceChange,
  collapsed,
  allowCreate = true,
  emptyLabel = 'Sin servicios asignados',
}: ServiceSwitcherProps) {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];
  const isEmpty = services.length === 0;

  const handleCreateService = () => {
    if (!allowCreate) {
      return;
    }

    setOpened(false);
    navigate(PATHS.service.create, { state: { create: true } });
  };

  if (isEmpty) {
    if (collapsed) {
      if (!allowCreate) {
        return (
          <Tooltip label={emptyLabel} position="right" withArrow>
            <Box
              w={8}
              h={8}
              mx="auto"
              style={{ borderRadius: '50%', backgroundColor: 'var(--app-color-text-muted)' }}
            />
          </Tooltip>
        );
      }

      return (
        <Tooltip label="Crear primer servicio" position="right" withArrow>
          <UnstyledButton
            onClick={handleCreateService}
            style={(theme) => ({
              width: 28,
              height: 28,
              borderRadius: theme.radius.md,
              border: '1px dashed var(--app-color-brand-outline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--mantine-color-brand-6)',
              backgroundColor: 'var(--app-color-brand-soft)',
            })}
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} />
          </UnstyledButton>
        </Tooltip>
      );
    }

    if (!allowCreate) {
      return (
        <Box
          px="xs"
          py={6}
          style={{
            borderRadius: 'var(--mantine-radius-md)',
            backgroundColor: 'var(--app-color-surface-soft)',
            border: '1px solid var(--app-color-border)',
          }}
        >
          <Text size="xs" fw={500} c="dimmed">
            {emptyLabel}
          </Text>
        </Box>
      );
    }

    return (
      <UnstyledButton
        onClick={handleCreateService}
        px="xs"
        py={7}
        style={(theme) => ({
          width: '100%',
          borderRadius: theme.radius.md,
          border: '1px dashed var(--app-color-brand-outline)',
          backgroundColor: 'var(--app-color-brand-soft)',
        })}
      >
        <Group gap={8} wrap="nowrap">
          <FontAwesomeIcon
            icon={faPlus}
            style={{ fontSize: 10, color: 'var(--mantine-color-brand-5)' }}
          />
          <Text size="xs" fw={500} c="brand.5">
            Crear servicio
          </Text>
        </Group>
      </UnstyledButton>
    );
  }

  if (collapsed) {
    return (
      <Popover
        opened={opened}
        onChange={setOpened}
        position="right-start"
        width={220}
        radius="md"
        offset={8}
      >
        <Popover.Target>
          <UnstyledButton
            onClick={() => setOpened((current) => !current)}
            style={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <Tooltip
              label={activeService?.name ?? 'Servicio'}
              position="right"
              withArrow
              disabled={opened}
            >
              <Box
                w={8}
                h={8}
                style={{
                  borderRadius: '50%',
                  backgroundColor: 'var(--mantine-color-brand-5)',
                }}
              />
            </Tooltip>
          </UnstyledButton>
        </Popover.Target>

        <BusinessOptions
          services={services}
          activeServiceId={activeServiceId}
          onServiceChange={onServiceChange}
          onServiceClose={() => setOpened(false)}
          allowCreate={allowCreate}
          onCreateService={handleCreateService}
        />
      </Popover>
    );
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      width="target"
      radius="md"
      offset={4}
    >
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpened((current) => !current)}
          px="xs"
          py={6}
          style={(theme) => ({
            width: '100%',
            borderRadius: theme.radius.md,
            border: `1px solid ${opened ? 'var(--app-color-border)' : 'var(--app-color-border-soft)'}`,
            backgroundColor: opened ? 'var(--app-color-surface-soft)' : 'var(--app-color-surface)',
          })}
        >
          <Group gap={8} wrap="nowrap">
            <Box
              w={7}
              h={7}
              style={{
                borderRadius: '50%',
                backgroundColor: 'var(--mantine-color-brand-5)',
                flexShrink: 0,
              }}
            />
            <Text size="xs" fw={500} flex={1} truncate>
              {activeService?.name ?? 'Servicio'}
            </Text>
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{
                fontSize: 9,
                color: 'var(--mantine-color-dimmed)',
                transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            />
          </Group>
        </UnstyledButton>
      </Popover.Target>

      <BusinessOptions
        services={services}
        activeServiceId={activeServiceId}
        onServiceChange={onServiceChange}
        onServiceClose={() => setOpened(false)}
        allowCreate={allowCreate}
        onCreateService={handleCreateService}
      />
    </Popover>
  );
}

function AdminBadge({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <Tooltip label="Administracion" position="right" withArrow>
        <Box
          w={8}
          h={8}
          mx="auto"
          style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-brand-5)' }}
        />
      </Tooltip>
    );
  }

  return (
    <Box
      px="xs"
      py={6}
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--app-color-brand-soft)',
        border: '1px solid var(--app-color-brand-outline)',
      }}
    >
      <Text size="xs" fw={600} c="brand.6">
        Administracion
      </Text>
    </Box>
  );
}

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItemButton({ item, isActive, collapsed, onClick }: NavItemButtonProps) {
  const button = (
    <UnstyledButton
      onClick={onClick}
      px="xs"
      py={7}
      className={`${classes.navItem} ${collapsed ? classes.navItemCollapsed : ''}`}
      data-active={isActive ? 'true' : undefined}
    >
      <ThemeIcon size={16} variant="transparent" className={classes.navIcon}>
        <FontAwesomeIcon icon={item.icon} style={{ fontSize: 12 }} />
      </ThemeIcon>

      {!collapsed ? (
        <Text size="xs" fw={isActive ? 600 : 500}>
          {item.label}
        </Text>
      ) : null}
    </UnstyledButton>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label} position="right" withArrow>
        {button}
      </Tooltip>
    );
  }

  return button;
}

function UserFooter({
  user,
  collapsed,
  onLogout,
  isLoggingOut,
}: {
  user: SidebarUser;
  collapsed: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const roleLabel =
    user.role === 'owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Secretario/a';

  if (collapsed) {
    return (
      <Stack gap="xs" align="center">
        <Tooltip label={`${user.name} - ${roleLabel}`} position="right" withArrow>
          <Box
            w={28}
            h={28}
            mx="auto"
            style={{
              borderRadius: '50%',
              backgroundColor: 'var(--app-color-surface-soft)',
              border: '1px solid var(--app-color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xs" fw={600}>
              {user.initials}
            </Text>
          </Box>
        </Tooltip>

        <Tooltip label="Cerrar sesion" position="right" withArrow>
          <ActionIcon variant="default" size="md" onClick={onLogout} disabled={isLoggingOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Group gap={8} wrap="nowrap" px={4}>
      <Box
        w={28}
        h={28}
        style={{
          borderRadius: '50%',
          backgroundColor: 'var(--app-color-surface-soft)',
          border: '1px solid var(--app-color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Text size="xs" fw={600}>
          {user.initials}
        </Text>
      </Box>
      <Box style={{ overflow: 'hidden' }}>
        <Text size="xs" fw={500} truncate>
          {user.name}
        </Text>
        <Text size="xs" c="dimmed" truncate>
          {roleLabel}
        </Text>
      </Box>
      <Tooltip label="Cerrar sesion" withArrow>
        <ActionIcon
          variant="default"
          ml="auto"
          onClick={onLogout}
          disabled={isLoggingOut}
          aria-label="Cerrar sesion"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onNavigate?: () => void;
  ownerId?: number;
  user: SidebarUser;
  permissions: SidebarPermissions;
  services: Service[];
  activeServiceId: string;
  onServiceChange: (serviceId: string) => void;
}

export function DashboardSidebar({
  collapsed,
  onToggleSidebar,
  onNavigate,
  ownerId,
  user,
  permissions,
  services,
  activeServiceId,
  onServiceChange,
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const visibleSections = NAV_SECTIONS_BY_ROLE[user.role]
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.permission ? permissions[item.permission] : true,
      ),
    }))
    .filter((section) => section.items.length > 0);

  const accountItems =
    user.role === 'admin'
      ? []
      : ACCOUNT_NAV_ITEMS.filter((item) => (item.permission ? permissions[item.permission] : true));

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      navigate(PATHS.auth.login, { replace: true });
      onNavigate?.();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Stack gap="sm" p="sm" h="100%" className={classes.sidebarRoot}>
      <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
        <Stack gap={collapsed ? 8 : 0}>
          <Group
            justify={collapsed ? 'center' : 'space-between'}
            align="center"
            px={collapsed ? 0 : 'xs'}
          >
            <Group gap="sm" wrap="nowrap" justify={collapsed ? 'center' : 'flex-start'}>
              <Box className={classes.brandMark}>
                B
              </Box>

              {!collapsed ? (
                <Text fw={800} style={{ color: 'var(--app-color-text-primary)' }}>
                  Bookly
                </Text>
              ) : null}
            </Group>

            {!collapsed ? (
              <ActionIcon variant="default" onClick={onToggleSidebar} size="lg" visibleFrom="md">
                <FontAwesomeIcon icon={faBars} />
              </ActionIcon>
            ) : null}
          </Group>

          {collapsed ? (
            <Group justify="center" visibleFrom="md">
              <ActionIcon variant="default" onClick={onToggleSidebar} size="lg">
                <FontAwesomeIcon icon={faBars} />
              </ActionIcon>
            </Group>
          ) : null}
        </Stack>

        {user.role === 'owner' || user.role === 'secretary' ? (
          <ServiceSwitcher
            services={services}
            activeServiceId={activeServiceId}
            onServiceChange={onServiceChange}
            collapsed={collapsed}
            allowCreate={user.role === 'owner'}
            emptyLabel={user.role === 'owner' ? 'Sin servicios creados' : 'Sin servicios asignados'}
          />
        ) : (
          <AdminBadge collapsed={collapsed} />
        )}

        <Divider className={classes.separator} />

        <Box style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <Stack gap="sm" pr={collapsed ? 0 : 4}>
            {visibleSections.map((section, index) => (
              <Stack key={section.label} gap={2}>
                {index > 0 ? <Divider my={4} className={classes.separator} /> : null}

                {!collapsed ? (
                  <Text
                    className={classes.sectionLabel}
                    size="xs"
                    fw={700}
                    tt="uppercase"
                    px="xs"
                  >
                    {section.label}
                  </Text>
                ) : null}

                {section.items.map((item) => (
                  <NavItemButton
                    key={item.path}
                    item={item}
                    isActive={pathname === item.path}
                    collapsed={collapsed}
                    onClick={() => handleNavigate(item.path)}
                  />
                ))}
              </Stack>
            ))}

            {accountItems.length > 0 ? (
              <Stack gap={2}>
                <Divider my={4} className={classes.separator} />

                {!collapsed ? (
                  <Text
                    className={classes.sectionLabel}
                    size="xs"
                    fw={700}
                    tt="uppercase"
                    px="xs"
                  >
                    Cuenta
                  </Text>
                ) : null}

                {accountItems.map((item) => (
                  <NavItemButton
                    key={item.path}
                    item={item}
                    isActive={
                      pathname === item.path ||
                      pathname === PATHS.dashboard.profile ||
                      pathname === PATHS.dashboard.settings
                    }
                    collapsed={collapsed}
                    onClick={() => handleNavigate(item.path)}
                  />
                ))}
              </Stack>
            ) : null}
          </Stack>
        </Box>
      </Stack>

      <Stack gap="sm">
        {user.role === 'owner' && ownerId != null ? (
          <>
            <Divider className={classes.separator} />
            <SubscriptionSidebarBanner ownerId={ownerId} collapsed={collapsed} />
          </>
        ) : null}

        <Divider className={classes.separator} />
        <UserFooter
          user={user}
          collapsed={collapsed}
          onLogout={() => {
            void handleLogout();
          }}
          isLoggingOut={isLoggingOut}
        />
      </Stack>
    </Stack>
  );
}
