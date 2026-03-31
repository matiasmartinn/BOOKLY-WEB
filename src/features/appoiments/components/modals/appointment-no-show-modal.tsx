import { Button, Stack, Text } from '@mantine/core';
import { useMarkAppointmentAsNoShow } from 'features/appoiments/hooks';
import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

interface BaseStatusModalProps {
  appointment: AppointmentViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentNoShowModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: BaseStatusModalProps) {
  const mutation = useMarkAppointmentAsNoShow(appointment?.id ?? 0);

  const handleConfirm = () => {
    if (!appointment) return;
    mutation.mutate(undefined, { onSuccess });
  };

  return (
    <GenericModal opened={isOpen} onClose={onClose} title="Marcar no asistencia" size="sm">
      {appointment ? (
        <Stack>
          <Text>¿Marcar el turno de {appointment.clientName} como no asistido?</Text>
          <Button loading={mutation.isPending} onClick={handleConfirm}>
            Confirmar
          </Button>
        </Stack>
      ) : null}
    </GenericModal>
  );
}
