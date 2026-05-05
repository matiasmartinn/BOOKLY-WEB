import { Stack, Text } from '@mantine/core';
import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

interface AppointmentDeleteModalProps {
  row: AppointmentViewModel | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDeleteModal({ row, isOpen, onClose }: AppointmentDeleteModalProps) {
  return (
    <GenericModal opened={isOpen} onClose={onClose} title="Eliminar turno">
      {row ? (
        <Stack gap="sm">
          <Text size="sm">Turno seleccionado: {row.clientName}</Text>
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">
          Selecciona un turno para eliminar.
        </Text>
      )}
    </GenericModal>
  );
}
