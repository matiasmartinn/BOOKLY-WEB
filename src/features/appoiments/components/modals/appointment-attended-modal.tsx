import { Button, Stack, Text } from '@mantine/core';
import { GenericModal } from 'shared/components';
import { useMarkAppointmentAsAttended } from 'features/appoiments/hooks';
import type { AppointmentViewModel } from 'features/appoiments/viewmodel';

interface BaseStatusModalProps {
  appointment: AppointmentViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentAttendedModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: BaseStatusModalProps) {
  const mutation = useMarkAppointmentAsAttended(appointment?.id ?? 0);

  const handleConfirm = () => {
    if (!appointment) return;
    mutation.mutate(undefined, { onSuccess });
  };

  return (
    <GenericModal opened={isOpen} onClose={onClose} title="Marcar asistencia" size="sm">
      {appointment ? (
        <Stack>
          <Text>¿Marcar el turno de {appointment.clientName} como asistido?</Text>
          <Button loading={mutation.isPending} onClick={handleConfirm}>
            Confirmar
          </Button>
        </Stack>
      ) : null}
    </GenericModal>
  );
}
