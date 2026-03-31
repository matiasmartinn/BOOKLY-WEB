import { useMemo } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faClock,
  faClockRotateLeft,
  faPlus,
  faUsers,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'app/router/PATHS';
import { useAppointmentSummary } from 'features/appoiments/hooks';
import type { AppointmentSummaryDto } from 'shared/models';
import { PageCard, PageShell } from 'shared/layout';
import {
  compareLocalDateTime,
  formatDateOnly,
  formatTime,
  getCurrentBusinessDateOnly,
  getCurrentBusinessDateTime,
} from 'shared/utils';
import { useBusinessStore } from 'store/use-buisness-store';
import { DashboardStatCard } from '../components';
import {
  appointmentStatusIncludes,
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from '../utils';

const isCancelledAppointment = (status?: string | null) =>
  appointmentStatusIncludes(status, 'CANCEL');

const isNoShowAppointment = (status?: string | null) =>
  appointmentStatusIncludes(status, 'NO_SHOW', 'NOSHOW');

const isAttendedAppointment = (status?: string | null) =>
  appointmentStatusIncludes(status, 'ATTEND', 'CONFIRM');

const isClosedAppointment = (status?: string | null) =>
  isCancelledAppointment(status) || isNoShowAppointment(status) || isAttendedAppointment(status);

const isUpcomingAppointment = (
  appointment: AppointmentSummaryDto,
  currentBusinessDateTime: string,
) => {
  return (
    compareLocalDateTime(appointment.startDateTime, currentBusinessDateTime) >= 0 &&
    !isClosedAppointment(appointment.status)
  );
};

interface QuickActionCardProps {
  label: string;
  description: string;
  icon: IconDefinition;
  onClick: () => void;
  disabled?: boolean;
}

function QuickActionCard({
  label,
  description,
  icon,
  onClick,
  disabled = false,
}: QuickActionCardProps) {
  return (
    <UnstyledButton
      onClick={disabled ? undefined : onClick}
      style={{
        width: '100%',
        borderRadius: 'var(--mantine-radius-lg)',
        border: '1px solid var(--mantine-color-default-border)',
        padding: '0.9rem',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <Group align="flex-start" wrap="nowrap" gap="sm">
        <ThemeIcon size="lg" radius="md" variant="light" color="brand">
          <FontAwesomeIcon icon={icon} />
        </ThemeIcon>

        <Stack gap={2} flex={1}>
          <Text fw={600}>{label}</Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
}

export function OverviewPageContainer() {
  const navigate = useNavigate();
  const selectedService = useBusinessStore((state) => state.selectedService);
  const todayDate = useMemo(() => getCurrentBusinessDateOnly(), []);
  const todayLabel = useMemo(() => formatDateOnly(todayDate), [todayDate]);

  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    isError: appointmentsError,
  } = useAppointmentSummary(selectedService?.id, todayDate);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) => compareLocalDateTime(a.startDateTime, b.startDateTime),
      ),
    [appointments],
  );

  const appointmentSignals = useMemo(() => {
    const currentBusinessDateTime = getCurrentBusinessDateTime();
    const upcomingAppointments = sortedAppointments.filter((item) =>
      isUpcomingAppointment(item, currentBusinessDateTime),
    );

    return {
      totalToday: sortedAppointments.length,
      cancelledToday: sortedAppointments.filter((item) => isCancelledAppointment(item.status))
        .length,
      noShowToday: sortedAppointments.filter((item) => isNoShowAppointment(item.status)).length,
      upcomingCount: upcomingAppointments.length,
      nextAppointments: upcomingAppointments.slice(0, 4),
    };
  }, [sortedAppointments]);

  const quickActions = useMemo(
    () => [
      {
        label: 'Turnos del dia',
        description: 'Abre la operacion diaria y el listado principal de turnos.',
        icon: faCalendarCheck,
        path: PATHS.dashboard.appointments,
      },
      {
        label: 'Nuevo turno',
        description: 'Abre Turnos para cargar un turno nuevo desde el flujo actual.',
        icon: faPlus,
        path: PATHS.dashboard.appointments,
      },
      {
        label: 'Configurar horarios',
        description: 'Ajusta la agenda base del servicio seleccionado.',
        icon: faClock,
        path: PATHS.dashboard.schedules,
      },
      {
        label: 'Ver historico',
        description: 'Consulta cambios de estado y movimientos pasados.',
        icon: faClockRotateLeft,
        path: PATHS.dashboard.history,
      },
      {
        label: 'Gestionar equipo',
        description: 'Revisa y actualiza el equipo vinculado al servicio.',
        icon: faUsers,
        path: PATHS.dashboard.team,
      },
    ],
    [],
  );

  const getStatValue = (value: number) => {
    if (!selectedService) return '-';
    if (loadingAppointments) return '...';
    if (appointmentsError) return '-';
    return String(value);
  };

  return (
    <PageShell
      title="Resumen"
      description="Panel rapido del servicio actual para entender que pasa hoy y navegar al flujo correcto."
    >
      <Stack gap="md">
        {!selectedService && (
          <Alert color="yellow" variant="light">
            Selecciona un servicio desde el sidebar para completar este resumen con senales del dia.
          </Alert>
        )}

        {selectedService && appointmentsError && (
          <Alert color="red" variant="light">
            No se pudieron cargar las senales de turnos del dia para {todayLabel}.
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          <DashboardStatCard
            label="Turnos hoy"
            value={getStatValue(appointmentSignals.totalToday)}
            description={`Cantidad total de turnos registrados para ${todayLabel}.`}
          />
          <DashboardStatCard
            label="Proximos"
            value={getStatValue(appointmentSignals.upcomingCount)}
            description="Turnos vigentes que aun no comenzaron."
          />
          <DashboardStatCard
            label="Cancelado"
            value={getStatValue(appointmentSignals.cancelledToday)}
            description="Turnos de hoy con estado cancelado."
          />
          <DashboardStatCard
            label="No asistio"
            value={getStatValue(appointmentSignals.noShowToday)}
            description="Ausencias marcadas sobre turnos de hoy."
          />
        </SimpleGrid>

        <PageCard>
          <Stack gap="md">
            <Stack gap={4}>
              <Text fw={600}>Proximos turnos</Text>
            </Stack>

            {!selectedService ? (
              <Text size="sm" c="dimmed">
                Selecciona un servicio para ver sus proximos turnos del dia.
              </Text>
            ) : appointmentsError ? (
              <Text size="sm" c="dimmed">
                No se pudieron cargar los proximos turnos con los datos disponibles.
              </Text>
            ) : appointmentSignals.nextAppointments.length === 0 ? (
              <Text size="sm" c="dimmed">
                No hay proximos turnos vigentes para hoy.
              </Text>
            ) : (
              <Stack gap={0}>
                {appointmentSignals.nextAppointments.map((appointment, index) => (
                  <Group
                    key={appointment.id}
                    justify="space-between"
                    align="center"
                    wrap="nowrap"
                    gap="sm"
                    style={{
                      padding: '0.55rem 0',
                      borderBottom:
                        index < appointmentSignals.nextAppointments.length - 1
                          ? '1px solid var(--mantine-color-default-border)'
                          : undefined,
                    }}
                  >
                    <Text size="sm" fw={600} style={{ minWidth: 84, flexShrink: 0 }}>
                      {formatTime(appointment.startDateTime)}
                    </Text>

                    <Text size="sm" ta="center" flex={1} truncate>
                      {appointment.clientName}
                    </Text>

                    <Badge
                      color={getAppointmentStatusColor(appointment.status)}
                      variant="light"
                      style={{ flexShrink: 0 }}
                    >
                      {getAppointmentStatusLabel(appointment.status)}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            )}

            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => {
                  navigate(PATHS.dashboard.appointments);
                }}
              >
                Ir a Turnos
              </Button>
            </Group>
          </Stack>
        </PageCard>

        <PageCard>
          <Stack gap="md">
            <Stack gap={4}>
              <Text fw={600}>Accesos rapidos</Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.label}
                  label={action.label}
                  description={action.description}
                  icon={action.icon}
                  onClick={() => {
                    navigate(action.path);
                  }}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </PageCard>

        {/* <PageCard>
          <Stack gap="md">
            <Stack gap={4}>
              <Text fw={600}>Servicio seleccionado</Text>
            </Stack>

            {selectedService ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Servicio
                  </Text>
                  <Text fw={600}>{selectedService.name}</Text>
                  <Badge color={selectedService.isActive ? 'green' : 'yellow'} variant="light">
                    {selectedService.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Stack>

                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Operacion
                  </Text>
                  <Text>Duracion: {selectedService.durationMinutes} min</Text>
                  <Text>Capacidad: {selectedService.capacity}</Text>
                  <Text>Modo: {selectedService.mode}</Text>
                </Stack>

                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Agenda
                  </Text>
                  <Text>Horarios configurados: {schedulesCount}</Text>
                  <Text>Equipo asignado: {teamCount}</Text>
                </Stack>

                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    Referencia
                  </Text>
                  <Text>Slug: {selectedService.slug || 'Sin slug'}</Text>
                  <Text>{selectedService.description || 'Sin descripcion cargada.'}</Text>
                </Stack>
              </SimpleGrid>
            ) : (
              <Text size="sm" c="dimmed">
                Este bloque se completa automaticamente cuando haya un servicio activo en contexto.
              </Text>
            )}
          </Stack>
        </PageCard> */}
      </Stack>
    </PageShell>
  );
}
