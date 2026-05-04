import { GenericModal } from 'shared/components';

import { AppointmentForm } from '../appointment-form';

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
    <GenericModal
      opened={isOpen}
      onClose={onClose}
      title="Nuevo turno"
      size="lg"
      styles={{
        content: {
          maxHeight: 'min(calc(100dvh - 2rem), 840px)',
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          overflowY: 'auto',
          minHeight: 0,
          overscrollBehavior: 'contain',
          paddingInlineEnd: 'calc(var(--mantine-spacing-xl) - var(--mantine-spacing-xs))',
        },
      }}
    >
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
