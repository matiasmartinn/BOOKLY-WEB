import {
  Stack,
  Divider,
  Tooltip,
  Text,
  Group,
  ActionIcon,
  Box,
  UnstyledButton,
  Popover,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faChartPie,
  faRectangleList,
  faCalendarCheck,
  faClock,
  faClockRotateLeft,
  faChartColumn,
  faStore,
  faCalendarXmark,
  faToggleOn,
  faUsers,
  faUser,
  faGear,
  faChevronDown,
  faCheck,
  faLock,
  faPlus,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PATHS } from 'app/router/PATHS';
import { SubscriptionSidebarBanner } from 'features/subscriptions/components';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'secretary';

export interface Service {
  id: string;
  name: string;
}

export interface SidebarUser {
  name: string;
  initials: string;
  role: UserRole;
}

/**
 * Granular permission keys — one per nav item that can be restricted.
 * Owner always gets all true. Secretary gets a subset defined by the owner.
 * When the security module ships, replace the static object with one
 * fetched from the API and passed down through context/props.
 */
export interface SidebarPermissions {
  viewAppointments: boolean;
  viewSchedules: boolean;
  viewService: boolean;
  viewUnavailability: boolean;
  viewStatus: boolean;
  viewTeam: boolean;
  viewSettings: boolean;
}

export const OWNER_PERMISSIONS: SidebarPermissions = {
  viewAppointments: true,
  viewSchedules: true,
  viewService: true,
  viewUnavailability: true,
  viewStatus: true,
  viewTeam: true,
  viewSettings: true,
};

// ─── Nav definition ───────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: IconDefinition;
  path: string;
  /** If set, the item is hidden/dimmed when the user lacks this permission */
  permission?: keyof SidebarPermissions;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const PRIMARY_NAV_SECTIONS: NavSection[] = [
  {
    label: 'Panel',
    items: [
      { label: 'Resumen', icon: faChartPie, path: PATHS.dashboard.overview },
    ],
  },
  {
    label: 'Operación',
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
      { label: 'Histórico', icon: faClockRotateLeft, path: PATHS.dashboard.history },
      { label: 'Métricas', icon: faChartColumn, path: PATHS.dashboard.metrics },
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

const ACCOUNT_NAV_SECTION: NavSection = {
  label: 'Cuenta',
  items: [
    { label: 'Perfil', icon: faUser, path: PATHS.dashboard.profile },
    {
      label: 'Configuración',
      icon: faGear,
      path: PATHS.dashboard.settings,
      permission: 'viewSettings',
    },
  ],
};

const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { label: 'Cuenta', icon: faUser, path: PATHS.dashboard.account, permission: 'viewSettings' },
];

// ─── ServiceSwitcher ──────────────────────────────────────────────────────────

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
  const activeService = services.find((s) => s.id === activeServiceId) ?? services[0];
  const isEmpty = services.length === 0;

  const handleCreateService = () => {
    setOpened(false);
    navigate(PATHS.service.create, { state: { create: true } });
  };

  // ── Collapsed ──────────────────────────────────────────────────────────────

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
              border: `0.5px dashed var(--mantine-color-brand-4)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--mantine-color-brand-6)',
              transition: 'background-color 120ms ease',
            })}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--mantine-color-brand-0)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} />
          </UnstyledButton>
        </Tooltip>
      );
    }

    return (
      <Tooltip label={activeService!.name} position="right" withArrow>
        <Box
          w={8}
          h={8}
          mx="auto"
          style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-brand-6)' }}
        />
      </Tooltip>
    );
  }

  // ── Empty state (expanded) ─────────────────────────────────────────────────

  if (isEmpty) {
    return (
      <UnstyledButton
        onClick={handleCreateService}
        px="xs"
        py={7}
        style={(theme) => ({
          width: '100%',
          borderRadius: theme.radius.md,
          border: `0.5px dashed var(--mantine-color-brand-4)`,
          transition: 'background-color 120ms ease',
        })}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            'var(--mantine-color-brand-0)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}
      >
        <Group gap={8} wrap="nowrap">
          <FontAwesomeIcon
            icon={faPlus}
            style={{ fontSize: 10, color: 'var(--mantine-color-brand-6)', flexShrink: 0 }}
          />
          <Text size="xs" fw={500} c="brand.6">
            Crear servicio
          </Text>
        </Group>
      </UnstyledButton>
    );
  }

  // ── Switcher (expanded, with services) ────────────────────────────────────

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      width="target"
      shadow="sm"
      radius="md"
      offset={4}
    >
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          px="xs"
          py={6}
          style={(theme) => ({
            width: '100%',
            borderRadius: theme.radius.md,
            border: `0.5px solid ${
              opened ? 'var(--mantine-color-brand-4)' : 'var(--mantine-color-default-border)'
            }`,
            backgroundColor: opened
              ? 'var(--mantine-color-brand-0)'
              : 'var(--mantine-color-default)',
            transition: 'background-color 120ms ease, border-color 120ms ease',
          })}
        >
          <Group gap={8} wrap="nowrap">
            <Box
              w={7}
              h={7}
              style={{
                borderRadius: '50%',
                backgroundColor: 'var(--mantine-color-brand-6)',
                flexShrink: 0,
              }}
            />
            <Text size="xs" fw={500} flex={1} truncate>
              {activeService!.name}
            </Text>
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{
                fontSize: 9,
                color: 'var(--mantine-color-dimmed)',
                transition: 'transform 150ms ease',
                transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
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
                    backgroundColor: isActive ? 'var(--mantine-color-brand-0)' : 'transparent',
                    transition: 'background-color 100ms ease',
                  })}
                  onClick={() => {
                    onServiceChange(service.id);
                    setOpened(false);
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        'var(--mantine-color-default-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Group gap={8} wrap="nowrap">
                    <Box
                      w={6}
                      h={6}
                      style={{
                        borderRadius: '50%',
                        backgroundColor: isActive
                          ? 'var(--mantine-color-brand-6)'
                          : 'var(--mantine-color-dimmed)',
                        flexShrink: 0,
                      }}
                    />
                    <Text
                      size="xs"
                      fw={isActive ? 500 : 400}
                      c={isActive ? 'brand.6' : 'dimmed'}
                      flex={1}
                      truncate
                    >
                      {service.name}
                    </Text>
                    {isActive && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ fontSize: 9, color: 'var(--mantine-color-brand-6)' }}
                      />
                    )}
                  </Group>
                </UnstyledButton>
              );
            })}

            {/* ── Crear nuevo servicio ── */}
            <Divider my={4} />
            <UnstyledButton
              px="sm"
              py={8}
              style={(theme) => ({
                borderRadius: theme.radius.md,
                transition: 'background-color 100ms ease',
              })}
              onClick={handleCreateService}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--mantine-color-brand-0)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <Group gap={8} wrap="nowrap">
                <Box
                  w={16}
                  h={16}
                  style={{
                    borderRadius: 4,
                    border: `0.5px solid var(--mantine-color-brand-4)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ fontSize: 8, color: 'var(--mantine-color-brand-6)' }}
                  />
                </Box>
                <Text size="xs" fw={500} c="brand.6">
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

// ─── ServiceBadge (secretary — non-interactive) ───────────────────────────────

interface ServiceBadgeProps {
  serviceName: string;
  collapsed: boolean;
}

function ServiceBadge({ serviceName, collapsed }: ServiceBadgeProps) {
  if (collapsed) {
    return (
      <Tooltip label={serviceName} position="right" withArrow>
        <Box
          w={8}
          h={8}
          mx="auto"
          style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-brand-6)' }}
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
        backgroundColor: 'var(--mantine-color-brand-0)',
      }}
    >
      <Box
        w={7}
        h={7}
        style={{
          borderRadius: '50%',
          backgroundColor: 'var(--mantine-color-brand-6)',
          flexShrink: 0,
        }}
      />
      <Text size="xs" fw={500} c="brand.7" flex={1} truncate>
        {serviceName}
      </Text>
      <Tooltip label="Tu cuenta está vinculada a este servicio" position="right" withArrow>
        <FontAwesomeIcon
          icon={faLock}
          style={{ fontSize: 9, color: 'var(--mantine-color-brand-5)', cursor: 'default' }}
        />
      </Tooltip>
    </Group>
  );
}

// ─── NavItemButton ────────────────────────────────────────────────────────────

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  hasPermission: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItemButton({ item, isActive, hasPermission, collapsed, onClick }: NavItemButtonProps) {
  /**
   * Items without permission are dimmed and non-navigable.
   * Once the security module ships, swap the `dimmed` behaviour
   * for a full `display: none` if the owner opts to hide them entirely.
   */
  const button = (
    <UnstyledButton
      onClick={hasPermission ? onClick : undefined}
      px="xs"
      py={7}
      style={(theme) => ({
        width: '100%',
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 9,
        justifyContent: collapsed ? 'center' : 'flex-start',
        backgroundColor: isActive ? 'var(--mantine-color-brand-0)' : 'transparent',
        opacity: !hasPermission ? 0.35 : 1,
        cursor: !hasPermission ? 'default' : 'pointer',
        transition: 'background-color 100ms ease, opacity 100ms ease',
      })}
      onMouseEnter={(e) => {
        if (hasPermission && !isActive)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            'var(--mantine-color-default-hover)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
      }}
    >
      <ThemeIcon size={16} variant="transparent" c={isActive ? 'brand.6' : 'dimmed'}>
        <FontAwesomeIcon icon={item.icon} style={{ fontSize: 12 }} />
      </ThemeIcon>

      {!collapsed && (
        <Text size="xs" fw={isActive ? 500 : 400} c={isActive ? 'brand.6' : 'dimmed'}>
          {item.label}
        </Text>
      )}
    </UnstyledButton>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label} position="right" disabled={!collapsed}>
        {button}
      </Tooltip>
    );
  }

  return button;
}

// ─── UserFooter ───────────────────────────────────────────────────────────────

interface UserFooterProps {
  user: SidebarUser;
  collapsed: boolean;
}

function UserFooter({ user, collapsed }: UserFooterProps) {
  const roleLabel = user.role === 'owner' ? 'Owner' : 'Secretario/a';

  if (collapsed) {
    return (
      <Tooltip label={`${user.name} · ${roleLabel}`} position="right" withArrow>
        <Box
          w={28}
          h={28}
          mx="auto"
          style={{
            borderRadius: '50%',
            backgroundColor: 'var(--mantine-color-brand-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
          }}
        >
          <Text size="xs" fw={500} c="brand.7">
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
          backgroundColor: 'var(--mantine-color-brand-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Text size="xs" fw={500} c="brand.7">
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

// ─── DashboardSidebar ─────────────────────────────────────────────────────────

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onNavigate?: () => void;
  ownerId?: number;

  // User & role
  user: SidebarUser;
  permissions: SidebarPermissions;

  // Service context
  /** All services owned by this account. Pass a single-item array for secretaries. */
  services: Service[];
  activeServiceId: string;
  /** Called when the owner picks a different service from the switcher */
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

  const isOwner = user.role === 'owner';

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const hasPermission = (item: NavItem): boolean => {
    if (!item.permission) return true;
    return permissions[item.permission];
  };

  return (
    <Stack gap="sm" p="sm" h="100%" style={{ overflow: 'hidden' }}>
      <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
      {/* ── Brand + toggle ── */}
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

            {!collapsed && (
              <Text fw={800} c="brand.6">
                Bookly
              </Text>
            )}
          </Group>

          {!collapsed && (
            <ActionIcon
              variant="subtle"
              color="brand"
              onClick={onToggleSidebar}
              size="lg"
              visibleFrom="md"
            >
              <FontAwesomeIcon icon={faBars} />
            </ActionIcon>
          )}
        </Group>

        {collapsed && (
          <Group justify="center" visibleFrom="md">
            <ActionIcon variant="subtle" color="brand" onClick={onToggleSidebar} size="lg">
              <FontAwesomeIcon icon={faBars} />
            </ActionIcon>
          </Group>
        )}
      </Stack>

      {/* ── Service context ── */}
      {isOwner ? (
        <ServiceSwitcher
          services={services}
          activeServiceId={activeServiceId}
          onServiceChange={onServiceChange}
          collapsed={collapsed}
        />
      ) : (
        <ServiceBadge serviceName={services[0]?.name ?? ''} collapsed={collapsed} />
      )}

      <Divider />

      {/* ── Navigation ── */}
      <Box style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <Stack gap="sm" pr={collapsed ? 0 : 4}>
          {PRIMARY_NAV_SECTIONS.map((section, index) => (
            <Stack key={section.label} gap={2}>
              {index > 0 && <Divider my={4} />}

          {!collapsed && (
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
          )}

          {section.items.map((item) => (
            <NavItemButton
              key={item.path}
              item={item}
              isActive={pathname === item.path}
              hasPermission={hasPermission(item)}
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

      {/* ── Spacer ── */}

      <Divider />

      {/* ── User footer ── */}
      <Stack gap={2}>
        {!collapsed && (
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            px="xs"
            style={{ letterSpacing: '0.05em' }}
          >
            {ACCOUNT_NAV_SECTION.label}
          </Text>
        )}

        {ACCOUNT_NAV_ITEMS.map((item) => (
          <NavItemButton
            key={item.path}
            item={item}
            isActive={pathname === item.path}
            hasPermission={hasPermission(item)}
            collapsed={collapsed}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
      </Stack>

      {isOwner && ownerId != null && (
        <>
          <Divider />
          <SubscriptionSidebarBanner ownerId={ownerId} collapsed={collapsed} />
        </>
      )}

      <Divider />
      <UserFooter user={user} collapsed={collapsed} />
      </Stack>
    </Stack>
  );
}
