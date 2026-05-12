import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

import { AppointmentAttendedForm } from '../appointment-attend-form';

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
  return (
    <GenericModal
      opened={isOpen}
      onClose={onClose}
      title="Marcar asistencia"
      size="sm"
    >
      {isOpen && appointment ? (
        <AppointmentAttendedForm
          appointment={appointment}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      ) : null}
    </GenericModal>
  );
}
