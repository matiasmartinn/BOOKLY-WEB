import { Button, Group, Stack, Text } from '@mantine/core';
import { useAppToast } from 'shared/ui/toast';
import { formatLocalDateTime } from 'shared/utils';

import { useMarkAppointmentAsAttended } from '../hooks';
import type { AppointmentViewModel } from '../viewmodel';

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
  submitLabel = 'Marcar asistio',
}: AppointmentAttendedFormProps) {
  const toast = useAppToast();
  const { mutate: markAsAttended, isPending } = useMarkAppointmentAsAttended(appointment.id);

  const handleSubmit = () => {
    markAsAttended(undefined, {
      onSuccess,
      onError: (error) => {
        toast.error(error.detail);
      },
    });
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text c="dimmed">
          Se marcara como asistido el turno de{' '}
          <Text span fw={600} c="dark">
            {appointment.clientName} del {formatLocalDateTime(appointment.startDateTime)}.
          </Text>{' '}
        </Text>
      </Stack>

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
