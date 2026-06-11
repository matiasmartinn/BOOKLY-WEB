import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useAppToast } from 'shared/ui/toast';

import type { AppointmentViewModel } from '../viewmodel';

interface UseAppointmentModalsOptions {
  onMutationSuccess: () => void;
}

interface AppointmentRowModal {
  opened: boolean;
  open: (row: AppointmentViewModel) => void;
  close: () => void;
  onSuccess: () => void;
}

export const useAppointmentModals = ({ onMutationSuccess }: UseAppointmentModalsOptions) => {
  const toast = useAppToast();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentViewModel | null>(null);

  const [createOpened, createHandlers] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);
  const [rescheduleOpened, rescheduleHandlers] = useDisclosure(false);
  const [cancelOpened, cancelHandlers] = useDisclosure(false);
  const [attendedOpened, attendedHandlers] = useDisclosure(false);
  const [noShowOpened, noShowHandlers] = useDisclosure(false);

  const buildRowModal = (
    opened: boolean,
    handlers: ReturnType<typeof useDisclosure>[1],
    successMessage: string,
  ): AppointmentRowModal => ({
    opened,
    open: (row) => {
      setSelectedAppointment(row);
      handlers.open();
    },
    close: () => {
      handlers.close();
      setSelectedAppointment(null);
    },
    onSuccess: () => {
      handlers.close();
      setSelectedAppointment(null);
      onMutationSuccess();
      toast.success(successMessage);
    },
  });

  return {
    selectedAppointment,
    create: {
      opened: createOpened,
      open: createHandlers.open,
      close: createHandlers.close,
      onSuccess: () => {
        createHandlers.close();
        onMutationSuccess();
        toast.success('Turno creado correctamente.');
      },
    },
    edit: buildRowModal(editOpened, editHandlers, 'Turno actualizado correctamente.'),
    reschedule: buildRowModal(
      rescheduleOpened,
      rescheduleHandlers,
      'Turno reprogramado correctamente.',
    ),
    cancel: buildRowModal(cancelOpened, cancelHandlers, 'Turno cancelado correctamente.'),
    attended: buildRowModal(attendedOpened, attendedHandlers, 'Turno marcado como asistido.'),
    noShow: buildRowModal(noShowOpened, noShowHandlers, 'Turno marcado como no asistido.'),
  };
};
