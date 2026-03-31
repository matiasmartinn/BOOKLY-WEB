import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { useMarkAppointmentAsNoShow } from 'features/appoiments/hooks';
import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { formatLocalDateTime } from 'shared/utils';

interface AppointmentNoShowFormProps {
  appointment: AppointmentViewModel;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function AppointmentNoShowForm({
  appointment,
  onCancel,
  onSuccess,
  submitLabel = 'Marcar no asistió',
}: AppointmentNoShowFormProps) {
  const {
    mutate: markAsNoShow,
    isPending,
    isError: isSubmitError,
    error,
  } = useMarkAppointmentAsNoShow(appointment.id);

  const handleSubmit = () => {
    markAsNoShow(undefined, { onSuccess });
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text fw={600}>Marcar no asistencia</Text>

        <Text size="sm" c="dimmed">
          Se marcará como no asistido el turno de {appointment.clientName} del{' '}
          {formatLocalDateTime(appointment.startDateTime)}.
        </Text>
      </Stack>

      {isSubmitError && error && (
        <Alert color="red" variant="light">
          {error.detail}
        </Alert>
      )}

      <Group justify="flex-end">
        {onCancel && (
          <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}

        <Button color="orange" onClick={handleSubmit} loading={isPending}>
          {submitLabel}
        </Button>
      </Group>
    </Stack>
  );
}
