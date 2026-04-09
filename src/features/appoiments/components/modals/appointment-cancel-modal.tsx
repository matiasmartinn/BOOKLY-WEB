import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

import { AppointmentCancelForm } from '../appointment-cancel-form';

interface AppointmentCancelModalProps {
  appointment: AppointmentViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentCancelModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: AppointmentCancelModalProps) {
  return (
    <GenericModal opened={isOpen} onClose={onClose} title="Cancelar turno" size="md">
      {isOpen && appointment ? (
        <AppointmentCancelForm appointment={appointment} onCancel={onClose} onSuccess={onSuccess} />
      ) : null}
    </GenericModal>
  );
}
