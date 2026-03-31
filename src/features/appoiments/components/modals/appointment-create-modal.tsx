import { GenericModal } from 'shared/components';
import { AppointmentForm } from '../appoitnment-form';

interface AppointmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string | null;
}

export function AppointmentCreateModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
}: AppointmentCreateModalProps) {
  return (
    <GenericModal opened={isOpen} onClose={onClose} title="Nuevo turno" size="lg">
      {isOpen ? (
        <AppointmentForm
          initialValues={initialDate ? { date: initialDate } : undefined}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      ) : null}
    </GenericModal>
  );
}
