import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Stack, Text, Textarea } from '@mantine/core';
import type { AppointmentViewModel } from '../viewmodel';
import { cancelAppointmentFormSchema, type CancelAppointmentFormValues } from '../schema';
import { useCancelAppointment } from '../hooks';
import { formatLocalDateTime } from 'shared/utils';

interface AppointmentCancelFormProps {
  appointment: AppointmentViewModel;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

const defaultValues: CancelAppointmentFormValues = {
  reason: '',
};

export function AppointmentCancelForm({
  appointment,
  onCancel,
  onSuccess,
  submitLabel = 'Cancelar turno',
}: AppointmentCancelFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CancelAppointmentFormValues>({
    resolver: zodResolver(cancelAppointmentFormSchema),
    mode: 'onTouched',
    defaultValues,
  });

  const {
    mutate: cancelAppointment,
    isPending,
    isError: isSubmitError,
    error,
  } = useCancelAppointment(appointment.id);

  const onSubmit: SubmitHandler<CancelAppointmentFormValues> = (values) => {
    if (!appointment.id) {
      setError('root', {
        type: 'manual',
        message: 'No se pudo identificar el turno a cancelar.',
      });
      return;
    }

    cancelAppointment(values, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Text c="dimmed">
            Se cancelara el turno de{' '}
            <Text span fw={600} c="dark">
              {appointment.clientName} del {formatLocalDateTime(appointment.startDateTime)}.
            </Text>{' '}
          </Text>
        </Stack>

        {errors.root?.message && (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        )}

        {isSubmitError && error && (
          <Alert color="red" variant="light">
            {error.detail}
          </Alert>
        )}

        <Textarea
          label="Motivo"
          placeholder="Motivo de la cancelacion"
          minRows={3}
          autosize
          {...register('reason')}
          error={errors.reason?.message}
          disabled={isPending}
        />

        <Group justify="flex-end">
          {onCancel && (
            <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
              Volver
            </Button>
          )}

          <Button type="submit" color="red" loading={isPending}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
