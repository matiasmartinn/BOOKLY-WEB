import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Box,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useBusinessStore } from 'store/use-buisness-store';

import {
  useAppointmentAvailableDates,
  useAppointmentAvailableSlots,
  useCreateAppointment,
} from '../hooks';
import { appointmentFormSchema, type AppointmentFormValues } from '../schema';

import { AppointmentScheduleSection } from './appointment-schedule-section';

interface AppointmentFormProps {
  initialValues?: Partial<AppointmentFormValues>;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

const defaultValues: AppointmentFormValues = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientNotes: '',
  date: null,
  slot: '',
};

export function AppointmentForm({
  initialValues,
  onCancel,
  onSuccess,
  submitLabel = 'Guardar turno',
}: AppointmentFormProps) {
  const selectedService = useBusinessStore((s) => s.selectedService);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    mode: 'onTouched',
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  const selectedDate = watch('date');
  const selectedSlot = watch('slot');

  const [calendarDate, setCalendarDate] = useState<string | null>(selectedDate ?? null);

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
    mutate: createAppointment,
    isPending,
    isError: isSubmitError,
    error,
  } = useCreateAppointment();

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

  const onSubmit: SubmitHandler<AppointmentFormValues> = (values) => {
    if (!selectedService) {
      setError('root', {
        type: 'manual',
        message: 'Selecciona un servicio antes de crear un turno.',
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

    createAppointment(values, { onSuccess });
  };

  return (
    <form id="appointment-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg" style={{ minHeight: 0 }}>
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

        <Box style={{ minHeight: 0 }}>
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
        </Box>

        <Stack gap="md">
          <Stack gap={4}>
            <Text fw={600}>Datos del cliente</Text>
            <Text
              size="sm"
              style={{
                color: 'var(--app-color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              Completa la informacion necesaria para registrar y contactar al cliente.
            </Text>
          </Stack>

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
            label="Notas"
            placeholder="Observaciones del cliente"
            minRows={3}
            autosize
            {...register('clientNotes')}
            error={errors.clientNotes?.message}
            disabled={isPending}
          />
        </Stack>

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
