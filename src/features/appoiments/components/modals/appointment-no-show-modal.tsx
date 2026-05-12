import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

import { AppointmentNoShowForm } from '../appointment-no-show-form';

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
  return (
    <GenericModal
      opened={isOpen}
      onClose={onClose}
      title="Marcar no asistencia"
      size="sm"
    >
      {isOpen && appointment ? (
        <AppointmentNoShowForm appointment={appointment} onCancel={onClose} onSuccess={onSuccess} />
      ) : null}
    </GenericModal>
  );
}
