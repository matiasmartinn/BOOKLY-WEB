import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Divider, Group, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { extractDateOnly, normalizeLocalDateTime } from 'shared/utils';
import { useBusinessStore } from 'store/use-buisness-store';

import {
  useAppointmentAvailableDates,
  useAppointmentAvailableSlots,
  useRescheduleAppointment,
} from '../hooks';
import { rescheduleAppointmentFormSchema, type RescheduleAppointmentFormValues } from '../schema';
import type { AppointmentViewModel } from '../viewmodel';


import { AppointmentScheduleSection } from './appointment-schedule-section';

interface AppointmentRescheduleFormProps {
  appointment: AppointmentViewModel;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

const defaultValues: RescheduleAppointmentFormValues = {
  date: null,
  slot: '',
};

export function AppointmentRescheduleForm({
  appointment,
  onCancel,
  onSuccess,
  submitLabel = 'Reprogramar turno',
}: AppointmentRescheduleFormProps) {
  const selectedService = useBusinessStore((s) => s.selectedService);

  const initialDate = extractDateOnly(appointment.startDateTime);

  const {
    handleSubmit,
    watch,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RescheduleAppointmentFormValues>({
    resolver: zodResolver(rescheduleAppointmentFormSchema),
    mode: 'onTouched',
    defaultValues: {
      ...defaultValues,
      date: initialDate,
      slot: normalizeLocalDateTime(appointment.startDateTime) ?? appointment.startDateTime ?? '',
    },
  });

  const selectedDate = watch('date');
  const selectedSlot = watch('slot');

  const [calendarDate, setCalendarDate] = useState<string | null>(selectedDate ?? initialDate);

  const {
    data: availableDates = [],
    isLoading: isLoadingAvailableDates,
    isError: isAvailableDatesError,
  } = useAppointmentAvailableDates(calendarDate);

  const {
    data: slots = [],
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
    isError: isSlotsError,
  } = useAppointmentAvailableSlots(selectedDate);

  const {
    mutate: rescheduleAppointment,
    isPending,
    isError: isSubmitError,
    error,
  } = useRescheduleAppointment(appointment.id);

  const availableDateSet = useMemo(
    () => new Set(availableDates.map((date) => date.trim())),
    [availableDates],
  );

  const isFormDisabled = !selectedService;

  const handleDateChange = (value: string | null) => {
    setValue('date', value ?? null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCalendarDate(value ?? null);
    setValue('slot', '', {
      shouldDirty: true,
      shouldValidate: true,
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

  const onSubmit: SubmitHandler<RescheduleAppointmentFormValues> = (values) => {
    if (!selectedService) {
      setError('root', {
        type: 'manual',
        message: 'Selecciona un servicio antes de reprogramar un turno.',
      });
      return;
    }

    if (!slots.includes(values.slot)) {
      setError('slot', {
        type: 'manual',
        message: 'Selecciona un horario disponible.',
      });
      return;
    }

    rescheduleAppointment(values, { onSuccess });
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

        <AppointmentScheduleSection
          availableDateSet={availableDateSet}
          calendarDate={calendarDate}
          dateError={errors.date?.message}
          isAvailableDatesError={isAvailableDatesError && Boolean(selectedService)}
          isFetchingSlots={isFetchingSlots}
          isFormDisabled={isFormDisabled}
          isLoadingAvailableDates={isLoadingAvailableDates}
          isLoadingSlots={isLoadingSlots}
          isPending={isPending}
          isSlotsError={isSlotsError}
          onCalendarDateChange={setCalendarDate}
          onDateChange={handleDateChange}
          onSlotChange={handleSlotChange}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          slots={slots}
        />

        <Divider />

        <Group justify="flex-end" align="center" wrap="wrap" gap="sm">
          <Group gap="sm">
            {onCancel ? (
              <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
                Cancelar
              </Button>
            ) : null}

            <Button type="submit" loading={isPending} disabled={isFormDisabled}>
              {submitLabel}
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
