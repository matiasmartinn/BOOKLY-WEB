import {
  faCalendarCheck,
  faClock,
  faClockRotateLeft,
  faPlus,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { useAppointmentSummary, useResolveExpiredAppointments } from 'features/appoiments/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageCard } from 'shared/layout';
import type { AppointmentSummaryDto } from 'shared/models';
import { appColorVars } from 'shared/ui/theme/theme';
import {
  compareLocalDateTime,
  formatDateOnly,
  formatTime,
  getCurrentBusinessDateOnly,
  getCurrentBusinessDateTime,
} from 'shared/utils';
import { useBusinessStore } from 'store/use-business-store';

import { DashboardStatCard, QuickActionCard } from '../components';
import { appointmentStatusIncludes } from '../utils';

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

export function OverviewPageContainer() {
  useResolveExpiredAppointments();
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
    () => [...appointments].sort((a, b) => compareLocalDateTime(a.startDateTime, b.startDateTime)),
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
          accentColor="var(--mantine-color-brand-5)"
          accentBackground={appColorVars.brandSoft}
        />
        <DashboardStatCard
          label="Proximos"
          value={getStatValue(appointmentSignals.upcomingCount)}
          accentColor="var(--mantine-color-brand-5)"
          accentBackground={appColorVars.brandSoft}
        />
        <DashboardStatCard
          label="Cancelado"
          value={getStatValue(appointmentSignals.cancelledToday)}
          accentColor="var(--mantine-color-warning-5)"
          accentBackground={appColorVars.warningSoft}
        />
        <DashboardStatCard
          label="No asistio"
          value={getStatValue(appointmentSignals.noShowToday)}
          accentColor="var(--mantine-color-error-5)"
          accentBackground={appColorVars.errorSoft}
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
              <Group
                justify="space-between"
                align="center"
                wrap="nowrap"
                gap="sm"
                style={{
                  padding: '0.55rem 0',
                  borderBottom: '1px solid var(--mantine-color-default-border)',
                  fontWeight: 600,
                }}
              >
                <Text size="sm" style={{ width: 80, flexShrink: 0 }}>
                  Hora
                </Text>
                <Text size="sm" style={{ flex: 1, minWidth: 140 }}>
                  Quien
                </Text>
                <Text size="sm" style={{ width: 130, flexShrink: 0 }}>
                  Teléfono
                </Text>
                <Text size="sm" style={{ flex: 1.2, minWidth: 180 }}>
                  Observaciones
                </Text>
              </Group>

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
                  <Text size="sm" fw={600} style={{ width: 80, flexShrink: 0 }}>
                    {formatTime(appointment.startDateTime)}
                  </Text>

                  <Text size="sm" style={{ flex: 1, minWidth: 140 }} truncate>
                    {appointment.clientName}
                  </Text>

                  <Text size="sm" c="dimmed" style={{ width: 130, flexShrink: 0 }} truncate>
                    {appointment.clientPhone || '-'}
                  </Text>

                  <Text size="sm" c="dimmed" style={{ flex: 1.2, minWidth: 180 }} truncate>
                    {appointment.clientNotes || '-'}
                  </Text>
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
    </Stack>
  );
}
