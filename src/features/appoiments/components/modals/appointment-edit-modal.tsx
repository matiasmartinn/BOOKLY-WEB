import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

import { AppointmentEditForm } from '../appointment-edit-form';

interface AppointmentEditModalProps {
  appointment: AppointmentViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentEditModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: AppointmentEditModalProps) {
  return (
    <GenericModal opened={isOpen} onClose={onClose} title="Editar turno" size="lg">
      {isOpen && appointment ? (
        <AppointmentEditForm appointment={appointment} onCancel={onClose} onSuccess={onSuccess} />
      ) : null}
    </GenericModal>
  );
}
