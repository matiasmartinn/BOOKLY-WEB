import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import type { AppointmentViewModel } from '../viewmodel';
import { useMarkAppointmentAsAttended } from '../hooks';
import { formatLocalDateTime } from 'shared/utils';

interface AppointmentAttendedFormProps {
  appointment: AppointmentViewModel;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function AppointmentAttendedForm({
  appointment,
  onCancel,
  onSuccess,
  submitLabel = 'Marcar asistió',
}: AppointmentAttendedFormProps) {
  const {
    mutate: markAsAttended,
    isPending,
    isError: isSubmitError,
    error,
  } = useMarkAppointmentAsAttended(appointment.id);

  const handleSubmit = () => {
    markAsAttended(undefined, { onSuccess });
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text fw={600}>Marcar asistencia</Text>

        <Text size="sm" c="dimmed">
          Se marcará como asistido el turno de {appointment.clientName} del{' '}
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

        <Button onClick={handleSubmit} loading={isPending}>
          {submitLabel}
        </Button>
      </Group>
    </Stack>
  );
}
