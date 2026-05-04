import { Alert, Stack } from '@mantine/core';
import { useAppointmentHistoryByService, useGetAppointments } from 'features/appoiments/hooks';
import { PageCard } from 'shared/layout';
import { useBusinessStore } from 'store/use-business-store';

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
    <Stack gap="md">
      {!selectedService && (
        <Alert color="yellow" variant="light">
          Selecciona un servicio para auditar la creacion y los cambios de estado de sus turnos.
        </Alert>
      )}

      {selectedService && isError && (
        <Alert color="red" variant="light">
          No se pudo cargar la actividad del servicio con los datos actuales.
        </Alert>
      )}

      <PageCard>
        <ActivityTable
          data={activityEvents}
          loading={isLoading}
          fetching={isFetching}
          isError={isError}
          resetPageKey={selectedService?.id ?? null}
          onRefetch={() => {
            void refetchAppointments();
            void refetchHistory();
          }}
        />
      </PageCard>
    </Stack>
  );
}
