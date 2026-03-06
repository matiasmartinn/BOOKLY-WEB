import { NavLink, Stack, Divider, Tooltip, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
}

export function DashboardSidebar({ collapsed }: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Stack gap="xs" p="sm" h="100%">
      {NAV_SECTIONS.map((section, index) => (
        <Stack key={section.label} gap={4}>
          {index > 0 && <Divider my="xs" />}

          {!collapsed && (
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="sm">
              {section.label}
            </Text>
          )}

          {section.items.map((item) => (
            <Tooltip
              key={item.path}
              label={item.label}
              position="right"
              disabled={!collapsed}
            >
              <NavLink
                color="brand"
                label={collapsed ? undefined : item.label}
                leftSection={<FontAwesomeIcon icon={item.icon} />}
                active={pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            </Tooltip>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}