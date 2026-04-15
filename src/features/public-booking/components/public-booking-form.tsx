import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Divider,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { AppointmentDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import { formatDateTime, normalizeLocalDateTime } from 'shared/utils';

import {
  useCreatePublicAppointment,
  usePublicAvailableDates,
  usePublicAvailableSlots,
} from '../hooks';
import {
  createPublicAppointmentDefaultValues,
  createPublicAppointmentSchema,
  type PublicAppointmentFormValues,
} from '../schema/public-appointment.schema';
import type { PublicBookingProblemState, PublicServiceBookingDto } from '../types/public-booking';
import { resolvePublicBookingProblemState } from '../utils';

import { PublicBookingScheduleSection } from './public-booking-schedule-section';

interface PublicBookingFormProps {
  service: PublicServiceBookingDto;
  slug: string;
  code: string;
  onTerminalError?: (state: PublicBookingProblemState) => void;
}

export function PublicBookingForm({
  service,
  slug,
  code,
  onTerminalError,
}: PublicBookingFormProps) {
  const toast = useAppToast();
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<AppointmentDto | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setError,
    setValue,
    formState: { errors, submitCount },
  } = useForm<PublicAppointmentFormValues>({
    resolver: zodResolver(createPublicAppointmentSchema),
    mode: 'onTouched',
    defaultValues: createPublicAppointmentDefaultValues(),
  });

  const selectedDate = watch('date');
  const selectedSlot = watch('slot');

  const {
    data: availableDates = [],
    isLoading: isLoadingAvailableDates,
    isError: isAvailableDatesError,
    error: availableDatesError,
  } = usePublicAvailableDates(slug, code, calendarDate);

  const {
    data: slots = [],
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
    isError: isSlotsError,
    error: availableSlotsError,
  } = usePublicAvailableSlots(slug, code, selectedDate);

  const {
    mutateAsync,
    reset: resetMutation,
    isPending,
    isError: isSubmitError,
    error: submitError,
  } = useCreatePublicAppointment(slug, code);

  const availableDateSet = useMemo(
    () => new Set(availableDates.map((date) => date.trim())),
    [availableDates],
  );

  const resetFormState = useCallback(() => {
    reset(createPublicAppointmentDefaultValues());
    resetMutation();
    setCalendarDate(null);
  }, [reset, resetMutation]);

  useEffect(() => {
    resetFormState();
    setCreatedAppointment(null);
  }, [resetFormState, service.serviceId]);

  useEffect(() => {
    const terminalProblem =
      resolvePublicBookingProblemState(availableDatesError, code) ??
      resolvePublicBookingProblemState(availableSlotsError, code) ??
      resolvePublicBookingProblemState(submitError, code);

    if (terminalProblem) {
      onTerminalError?.(terminalProblem);
    }
  }, [availableDatesError, availableSlotsError, code, onTerminalError, submitError]);

  const handleDateChange = (value: string | null) => {
    setValue('date', value ?? null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCalendarDate(value ?? null);
    setValue('slot', '', {
      shouldDirty: true,
      shouldValidate: false,
    });
    clearErrors('slot');
  };

  const handleSlotChange = (value: string) => {
    setValue('slot', value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleResetAfterSuccess = () => {
    setCreatedAppointment(null);
    resetFormState();
  };

  const onSubmit: SubmitHandler<PublicAppointmentFormValues> = async (values) => {
    if (!slots.includes(values.slot)) {
      setError('slot', {
        type: 'manual',
        message: 'Selecciona un horario disponible.',
      });
      return;
    }

    try {
      const appointment = await mutateAsync({
        clientName: values.clientName.trim(),
        clientPhone: values.clientPhone.trim(),
        clientEmail: values.clientEmail.trim(),
        clientNotes: values.clientNotes?.trim() || undefined,
        startDateTime: normalizeLocalDateTime(values.slot) ?? values.slot,
      });

      setCreatedAppointment(appointment);
      resetFormState();
      toast.success('Tu turno se reservo correctamente.');
    } catch {
      // El error se expone inline o se transforma en estado terminal desde el effect.
    }
  };

  if (createdAppointment) {
    return (
      <Stack gap="md">
        <Alert color="green" variant="light">
          Tu turno quedo confirmado.
        </Alert>

        <Stack gap={4}>
          <Text fw={600}>{service.name}</Text>
          <Text size="sm" c="dimmed">
            {formatDateTime(createdAppointment.startDateTime)}
          </Text>
          <Text size="sm" c="dimmed">
            Reserva a nombre de {createdAppointment.clientName}.
          </Text>
        </Stack>

        <div>
          <Button type="button" variant="default" onClick={handleResetAfterSuccess}>
            Reservar otro turno
          </Button>
        </div>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="xl">
        {errors.root?.message ? (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        ) : null}

        {isSubmitError && submitError && !resolvePublicBookingProblemState(submitError, code) ? (
          <Alert color="red" variant="light">
            {submitError.detail}
          </Alert>
        ) : null}

        <Stack gap="sm">
          <Stack gap={4}>
            <Text fw={600}>Fecha y horario</Text>
            <Text size="sm" c="dimmed">
              Elige primero una fecha disponible para ver los horarios.
            </Text>
          </Stack>

          <PublicBookingScheduleSection
            availableDateSet={availableDateSet}
            calendarDate={calendarDate}
            dateError={errors.date?.message}
            isAvailableDatesError={isAvailableDatesError}
            isFetchingSlots={isFetchingSlots}
            isLoadingAvailableDates={isLoadingAvailableDates}
            isLoadingSlots={isLoadingSlots}
            isPending={isPending}
            isSlotsError={isSlotsError}
            onCalendarDateChange={setCalendarDate}
            onDateChange={handleDateChange}
            onSlotChange={handleSlotChange}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            slotError={submitCount > 0 ? errors.slot?.message : undefined}
            slots={slots}
          />
        </Stack>
        <Divider />
        <Stack gap="sm">
          <Stack gap={4}>
            <Text fw={600}>Tus datos</Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre"
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
            withAsterisk
            {...register('clientEmail')}
            error={errors.clientEmail?.message}
            disabled={isPending}
          />

          <Textarea
            label="Notas"
            placeholder="Observaciones para el servicio"
            minRows={3}
            autosize
            {...register('clientNotes')}
            error={errors.clientNotes?.message}
            disabled={isPending}
          />
        </Stack>

        <Button type="submit" loading={isPending} fullWidth>
          Confirmar turno
        </Button>
      </Stack>
    </form>
  );
}
