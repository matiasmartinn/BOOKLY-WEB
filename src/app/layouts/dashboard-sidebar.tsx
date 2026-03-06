import { NavLink, Stack, Divider, Tooltip, Text, Group, ActionIcon, Box } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faChartPie,
  faCalendarCheck,
  faClock,
  faStore,
  faCalendarXmark,
  faToggleOn,
  faUsers,
  faUser,
  faGear,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from 'app/router/PATHS';

interface NavItem {
  label: string;
  icon: IconDefinition;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Gestión',
    items: [
      { label: 'Resumen', icon: faChartPie, path: PATHS.dashboard.overview },
      { label: 'Turnos', icon: faCalendarCheck, path: PATHS.dashboard.appointments },
      { label: 'Horarios', icon: faClock, path: PATHS.dashboard.schedules },
    ],
  },
  {
    label: 'Servicio',
    items: [
      { label: 'Mi servicio', icon: faStore, path: PATHS.dashboard.service },
      { label: 'Excepciones', icon: faCalendarXmark, path: PATHS.dashboard.unavailability },
      { label: 'Estado', icon: faToggleOn, path: PATHS.dashboard.status },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { label: 'Equipo', icon: faUsers, path: PATHS.dashboard.team },
      { label: 'Perfil', icon: faUser, path: PATHS.dashboard.profile },
      { label: 'Configuración', icon: faGear, path: PATHS.dashboard.settings },
    ],
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onNavigate?: () => void;
}

export function DashboardSidebar({
  collapsed,
  onToggleSidebar,
  onNavigate,
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Stack gap="sm" p="sm" h="100%">
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

      <Divider />

      {NAV_SECTIONS.map((section, index) => (
        <Stack key={section.label} gap={4}>
          {index > 0 && <Divider my="xs" />}

          {!collapsed && (
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="sm">
              {section.label}
            </Text>
          )}

          {section.items.map((item) => (
            <Tooltip key={item.path} label={item.label} position="right" disabled={!collapsed}>
              <NavLink
                color="brand"
                label={collapsed ? undefined : item.label}
                leftSection={<FontAwesomeIcon icon={item.icon} />}
                active={pathname === item.path}
                onClick={() => handleNavigate(item.path)}
              />
            </Tooltip>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
