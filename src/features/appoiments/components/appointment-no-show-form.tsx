import { Button, Group, Stack, Text } from '@mantine/core';
import { useAppToast } from 'shared/ui/toast';
import { formatLocalDateTime } from 'shared/utils';
import { useMarkAppointmentAsNoShow } from 'features/appoiments/hooks';
import type { AppointmentViewModel } from 'features/appoiments/viewmodel';

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
  submitLabel = 'Marcar no asistio',
}: AppointmentNoShowFormProps) {
  const toast = useAppToast();
  const { mutate: markAsNoShow, isPending } = useMarkAppointmentAsNoShow(appointment.id);

  const handleSubmit = () => {
    markAsNoShow(undefined, {
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
          Se marcara como no asistido el turno de{' '}
          <Text span fw={600} c="dark">
            {appointment.clientName} del {formatLocalDateTime(appointment.startDateTime)}.
          </Text>
        </Text>
      </Stack>

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
