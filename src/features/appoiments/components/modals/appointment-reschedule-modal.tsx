import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { GenericModal } from 'shared/components';

import { AppointmentRescheduleForm } from '../appointment-reschedule-form';

interface AppointmentRescheduleModalProps {
  appointment: AppointmentViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentRescheduleModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: AppointmentRescheduleModalProps) {
  {
    `Reprogramar turno de ${appointment?.clientName}`;
  }
  return (
    <GenericModal
      opened={isOpen}
      onClose={onClose}
      title={`Reprogramar turno - ${appointment?.clientName}`}
      size="lg"
    >
      {isOpen && appointment ? (
        <AppointmentRescheduleForm
          appointment={appointment}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      ) : null}
    </GenericModal>
  );
}
