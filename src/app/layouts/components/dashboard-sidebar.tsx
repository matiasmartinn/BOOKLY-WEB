import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCalendarCheck,
  faCalendarXmark,
  faChartColumn,
  faChartPie,
  faCheck,
  faChevronDown,
  faClock,
  faClockRotateLeft,
  faLock,
  faPlus,
  faRectangleList,
  faStore,
  faToggleOn,
  faUser,
  faUsers,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from 'app/router/PATHS';
import { SubscriptionSidebarBanner } from 'features/subscriptions/components';

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
    label: 'Seguimiento',
    items: [
      { label: 'Eventos', icon: faRectangleList, path: PATHS.dashboard.events },
      { label: 'Historico', icon: faClockRotateLeft, path: PATHS.dashboard.history },
      { label: 'Metricas', icon: faChartColumn, path: PATHS.dashboard.metrics },
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
        label: 'Estado',
        icon: faToggleOn,
        path: PATHS.dashboard.status,
        permission: 'viewStatus',
      },
    ],
  },
  {
    label: 'Equipo',
    items: [
      {
        label: 'Equipo',
        icon: faUsers,
        path: PATHS.dashboard.team,
        permission: 'viewTeam',
      },
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
}

function ServiceSwitcher({
  services,
  activeServiceId,
  onServiceChange,
  collapsed,
}: ServiceSwitcherProps) {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];
  const isEmpty = services.length === 0;

  const handleCreateService = () => {
    setOpened(false);
    navigate(PATHS.service.create, { state: { create: true } });
  };

  if (collapsed) {
    if (isEmpty) {
      return (
        <Tooltip label="Crear primer servicio" position="right" withArrow>
          <UnstyledButton
            onClick={handleCreateService}
            style={(theme) => ({
              width: 28,
              height: 28,
              borderRadius: theme.radius.md,
              border: '1px dashed var(--app-color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--app-color-text-secondary)',
            })}
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} />
          </UnstyledButton>
        </Tooltip>
      );
    }

    return (
      <Tooltip label={activeService?.name ?? 'Servicio'} position="right" withArrow>
        <Box
          w={8}
          h={8}
          mx="auto"
          style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-brand-5)' }}
        />
      </Tooltip>
    );
  }

  if (isEmpty) {
    return (
      <UnstyledButton
        onClick={handleCreateService}
        px="xs"
        py={7}
        style={(theme) => ({
          width: '100%',
          borderRadius: theme.radius.md,
          border: '1px dashed var(--app-color-border)',
          backgroundColor: 'var(--app-color-surface)',
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

      <Popover.Dropdown p={4}>
        <ScrollArea.Autosize mah={240}>
          <Stack gap={2}>
            {services.map((service) => {
              const isActive = service.id === activeServiceId;

              return (
                <UnstyledButton
                  key={service.id}
                  px="sm"
                  py={8}
                  style={(theme) => ({
                    borderRadius: theme.radius.md,
                    backgroundColor: isActive ? 'var(--app-color-surface-hover)' : 'transparent',
                  })}
                  onClick={() => {
                    onServiceChange(service.id);
                    setOpened(false);
                  }}
                >
                  <Group gap={8} wrap="nowrap">
                    <Box
                      w={6}
                      h={6}
                      style={{
                        borderRadius: '50%',
                        backgroundColor: isActive
                          ? 'var(--mantine-color-brand-5)'
                          : 'var(--app-color-text-muted)',
                        flexShrink: 0,
                      }}
                    />
                    <Text
                      size="xs"
                      fw={isActive ? 500 : 400}
                      c={isActive ? 'var(--app-color-text-primary)' : 'dimmed'}
                      flex={1}
                      truncate
                    >
                      {service.name}
                    </Text>
                    {isActive ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ fontSize: 9, color: 'var(--mantine-color-brand-5)' }}
                      />
                    ) : null}
                  </Group>
                </UnstyledButton>
              );
            })}

            <Divider my={4} />

            <UnstyledButton px="sm" py={8} onClick={handleCreateService}>
              <Group gap={8} wrap="nowrap">
                <Box
                  w={16}
                  h={16}
                  style={{
                    borderRadius: 4,
                    border: '1px solid var(--app-color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ fontSize: 8, color: 'var(--mantine-color-brand-5)' }}
                  />
                </Box>
                <Text size="xs" fw={500} c="dimmed">
                  Nuevo servicio
                </Text>
              </Group>
            </UnstyledButton>
          </Stack>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}

function ServiceBadge({
  serviceName,
  collapsed,
}: {
  serviceName: string;
  collapsed: boolean;
}) {
  if (collapsed) {
    return (
      <Tooltip label={serviceName || 'Servicio asignado'} position="right" withArrow>
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
    <Group
      gap={8}
      px="xs"
      py={6}
      wrap="nowrap"
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--app-color-surface-soft)',
        border: '1px solid var(--app-color-border)',
      }}
    >
      <Box
        w={7}
        h={7}
        style={{
          borderRadius: '50%',
          backgroundColor: 'var(--mantine-color-brand-5)',
          flexShrink: 0,
        }}
      />
      <Text size="xs" fw={500} c="var(--app-color-text-primary)" flex={1} truncate>
        {serviceName || 'Servicio asignado'}
      </Text>
      <Tooltip label="Tu cuenta opera sobre este servicio" withArrow>
        <FontAwesomeIcon
          icon={faLock}
          style={{ fontSize: 9, color: 'var(--app-color-text-muted)' }}
        />
      </Tooltip>
    </Group>
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
        backgroundColor: 'var(--app-color-surface-soft)',
        border: '1px solid var(--app-color-border)',
      }}
    >
      <Text size="xs" fw={500} c="var(--app-color-text-primary)">
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
      style={(theme) => ({
        width: '100%',
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 9,
        justifyContent: collapsed ? 'center' : 'flex-start',
        backgroundColor: isActive ? 'var(--app-color-surface-soft)' : 'transparent',
        border: isActive ? '1px solid var(--app-color-border)' : '1px solid transparent',
      })}
    >
      <ThemeIcon size={16} variant="transparent" c={isActive ? 'brand.5' : 'dimmed'}>
        <FontAwesomeIcon icon={item.icon} style={{ fontSize: 12 }} />
      </ThemeIcon>

      {!collapsed ? (
        <Text
          size="xs"
          fw={isActive ? 600 : 500}
          c={isActive ? 'var(--app-color-text-primary)' : 'dimmed'}
        >
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

function UserFooter({ user, collapsed }: { user: SidebarUser; collapsed: boolean }) {
  const roleLabel =
    user.role === 'owner'
      ? 'Owner'
      : user.role === 'admin'
        ? 'Admin'
        : 'Secretario/a';

  if (collapsed) {
    return (
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

  const visibleSections = NAV_SECTIONS_BY_ROLE[user.role]
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => (item.permission ? permissions[item.permission] : true)),
    }))
    .filter((section) => section.items.length > 0);

  const accountItems =
    user.role === 'admin'
      ? []
      : ACCOUNT_NAV_ITEMS.filter((item) =>
          item.permission ? permissions[item.permission] : true,
        );

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Stack gap="sm" p="sm" h="100%" style={{ overflow: 'hidden' }}>
      <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
        <Stack gap={collapsed ? 8 : 0}>
          <Group
            justify={collapsed ? 'center' : 'space-between'}
            align="center"
            px={collapsed ? 0 : 'xs'}
          >
            <Group gap="sm" wrap="nowrap" justify={collapsed ? 'center' : 'flex-start'}>
              <Box
                w={28}
                h={28}
                style={{
                  borderRadius: 8,
                  backgroundColor: 'var(--mantine-color-brand-6)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
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

        {user.role === 'owner' ? (
          <ServiceSwitcher
            services={services}
            activeServiceId={activeServiceId}
            onServiceChange={onServiceChange}
            collapsed={collapsed}
          />
        ) : user.role === 'secretary' ? (
          <ServiceBadge
            serviceName={
              services.find((service) => service.id === activeServiceId)?.name ?? services[0]?.name ?? ''
            }
            collapsed={collapsed}
          />
        ) : (
          <AdminBadge collapsed={collapsed} />
        )}

        <Divider />

        <Box style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <Stack gap="sm" pr={collapsed ? 0 : 4}>
            {visibleSections.map((section, index) => (
              <Stack key={section.label} gap={2}>
                {index > 0 ? <Divider my={4} /> : null}

                {!collapsed ? (
                  <Text
                    size="xs"
                    fw={700}
                    c="dimmed"
                    tt="uppercase"
                    px="xs"
                    style={{ letterSpacing: '0.05em' }}
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
          </Stack>
        </Box>
      </Stack>

      <Stack gap="sm">
        {accountItems.length > 0 ? (
          <>
            <Divider />
            <Stack gap={2}>
              {!collapsed ? (
                <Text
                  size="xs"
                  fw={700}
                  c="dimmed"
                  tt="uppercase"
                  px="xs"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Cuenta
                </Text>
              ) : null}

              {accountItems.map((item) => (
                <NavItemButton
                  key={item.path}
                  item={item}
                  isActive={pathname === item.path || pathname === PATHS.dashboard.profile || pathname === PATHS.dashboard.settings}
                  collapsed={collapsed}
                  onClick={() => handleNavigate(item.path)}
                />
              ))}
            </Stack>
          </>
        ) : null}

        {user.role === 'owner' && ownerId != null ? (
          <>
            <Divider />
            <SubscriptionSidebarBanner ownerId={ownerId} collapsed={collapsed} />
          </>
        ) : null}

        <Divider />
        <UserFooter user={user} collapsed={collapsed} />
      </Stack>
    </Stack>
  );
}
