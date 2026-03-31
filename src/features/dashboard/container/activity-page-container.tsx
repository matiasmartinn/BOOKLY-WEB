import { Alert, Stack, Text } from '@mantine/core';
import { useAppointmentHistoryByService, useGetAppointments } from 'features/appoiments/hooks';
import { PageCard, PageShell } from 'shared/layout';
import { useBusinessStore } from 'store/use-buisness-store';
import { ActivityTable } from '../components';
import { mapAppointmentsToActivityEvents } from '../mapper/map-appointments-to-activity-events';

export function ActivityPageContainer() {
  const selectedService = useBusinessStore((s) => s.selectedService);

  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    isFetching: fetchingAppointments,
    isError: appointmentsError,
    refetch: refetchAppointments,
  } = useGetAppointments();

  const {
    data: history = [],
    isLoading: loadingHistory,
    isFetching: fetchingHistory,
    isError: historyError,
    refetch: refetchHistory,
  } = useAppointmentHistoryByService(selectedService?.id);

  const activityEvents = mapAppointmentsToActivityEvents(appointments, history);
  const isLoading = loadingAppointments || loadingHistory;
  const isFetching = fetchingAppointments || fetchingHistory;
  const isError = appointmentsError || historyError;

  return (
    <PageShell title="Actividad" description="Listado de eventos del negocio.">
      <Stack gap="md">
        {!selectedService && (
          <Alert color="yellow" variant="light">
            Selecciona un servicio para ver turnos creados, cancelados, reprogramados y no-show.
          </Alert>
        )}

        {selectedService && isError && (
          <Alert color="red" variant="light">
            No se pudo construir la actividad del servicio con los datos actuales de turnos.
          </Alert>
        )}

        <PageCard>
          <ActivityTable
            data={activityEvents}
            loading={isLoading}
            fetching={isFetching}
            isError={isError}
            onRefetch={() => {
              void refetchAppointments();
              void refetchHistory();
            }}
          />
        </PageCard>

        <PageCard>
          <Stack gap={6}>
            <Text fw={600}>Base preparada para evolucionar</Text>
          </Stack>
        </PageCard>
      </Stack>
    </PageShell>
  );
}
