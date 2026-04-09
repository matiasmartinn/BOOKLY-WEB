import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useUpdateAppointment } from '../hooks';
import { updateAppointmentFormSchema, type UpdateAppointmentFormValues } from '../schema';
import type { AppointmentViewModel } from '../viewmodel';

interface AppointmentEditFormProps {
  appointment: AppointmentViewModel;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

const defaultValues: UpdateAppointmentFormValues = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientNotes: '',
};

export function AppointmentEditForm({
  appointment,
  onCancel,
  onSuccess,
  submitLabel = 'Guardar cambios',
}: AppointmentEditFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateAppointmentFormValues>({
    resolver: zodResolver(updateAppointmentFormSchema),
    mode: 'onTouched',
    defaultValues: {
      ...defaultValues,
      clientName: appointment.clientName ?? '',
      clientPhone: appointment.clientPhone ?? '',
      clientEmail: appointment.clientEmail ?? '',
      clientNotes: appointment.clientNotes ?? '',
    },
  });

  const {
    mutate: updateAppointment,
    isPending,
    isError: isSubmitError,
    error,
  } = useUpdateAppointment(appointment.id);

  const onSubmit: SubmitHandler<UpdateAppointmentFormValues> = (values) => {
    if (!appointment.id) {
      setError('root', {
        type: 'manual',
        message: 'No se pudo identificar el turno a editar.',
      });
      return;
    }

    updateAppointment(values, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="xl">
        {errors.root?.message ? (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        ) : null}

        {isSubmitError && error ? (
          <Alert color="red" variant="light">
            {error.detail}
          </Alert>
        ) : null}

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            label="Cliente"
            placeholder="Juan Perez"
            withAsterisk
            {...register('clientName')}
            error={errors.clientName?.message}
            disabled={isPending}
          />

          <TextInput
            label="Telefono"
            placeholder="3364..."
            withAsterisk
            {...register('clientPhone')}
            error={errors.clientPhone?.message}
            disabled={isPending}
          />
        </SimpleGrid>

        <TextInput
          label="Email"
          placeholder="cliente@correo.com"
          {...register('clientEmail')}
          error={errors.clientEmail?.message}
          disabled={isPending}
        />

        <Textarea
          label="Notas internas"
          placeholder="Observaciones del cliente"
          minRows={3}
          autosize
          {...register('clientNotes')}
          error={errors.clientNotes?.message}
          disabled={isPending}
        />

        <Divider />

        <Group justify="flex-end" wrap="wrap" gap="sm">
          {onCancel ? (
            <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
              Cancelar
            </Button>
          ) : null}

          <Button type="submit" loading={isPending}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
