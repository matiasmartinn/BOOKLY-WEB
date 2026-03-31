import { useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { appointmentFormSchema, type AppointmentFormValues } from '../schema';
import {
  useAppointmentAvailableDates,
  useAppointmentAvailableSlots,
  useCreateAppointment,
} from '../hooks';
import { useBusinessStore } from 'store/use-buisness-store';
import { formatLocalDateTime, formatTime } from 'shared/utils';

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
    control,
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

  const shouldDisableDate = (date: string) => !availableDateSet.has(date.trim());
  const isFormDisabled = !selectedService;

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

  const getDayProps = (date: string) => {
    const isAvailable = availableDateSet.has(date.trim());

    return {
      style: isAvailable
        ? {
            fontWeight: 700,
            border: '1px solid var(--mantine-color-green-6)',
          }
        : undefined,
    };
  };

  return (
    <form id="appointment-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600}>Datos del turno</Text>

          <Text size="sm" c="dimmed">
            {selectedService
              ? `Servicio activo: ${selectedService.name}. Duracion por turno: ${selectedService.durationMinutes ?? '--'} min.`
              : 'Selecciona un servicio desde el sidebar para poder crear turnos.'}
          </Text>
        </Stack>

        {isAvailableDatesError && selectedService && (
          <Alert color="red" variant="light">
            No se pudieron cargar las fechas disponibles del servicio.
          </Alert>
        )}

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

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <DatePickerInput
              label="Fecha"
              placeholder="Selecciona una fecha"
              withAsterisk
              value={field.value ?? null} // 👈 nunca undefined
              date={calendarDate ?? undefined} // 👈 nunca null
              onDateChange={(value) => setCalendarDate(value ?? null)}
              onChange={(value) => {
                field.onChange(value ?? null);
                setCalendarDate(value ?? null);
                setValue('slot', '');
                clearErrors('slot');
              }}
              getDayProps={getDayProps}
              error={fieldState.error?.message}
              clearable={false}
              valueFormat="DD/MM/YYYY"
              excludeDate={shouldDisableDate}
              disabled={isFormDisabled || isPending || isLoadingAvailableDates}
            />
          )}
        />

        <Stack gap="xs">
          <Text fw={500}>Horarios disponibles</Text>

          {!selectedDate && (
            <Text size="sm" c="dimmed">
              Primero selecciona una fecha para ver los horarios disponibles.
            </Text>
          )}

          {selectedDate && (isLoadingSlots || isFetchingSlots) && (
            <Stack gap="xs">
              <Skeleton h={36} radius="md" />
              <Skeleton h={36} radius="md" />
              <Skeleton h={36} radius="md" />
            </Stack>
          )}

          {selectedDate && isSlotsError && (
            <Alert color="red" variant="light">
              No se pudieron cargar los horarios disponibles para la fecha seleccionada.
            </Alert>
          )}

          {selectedDate &&
            !isLoadingSlots &&
            !isFetchingSlots &&
            !isSlotsError &&
            slots.length === 0 && (
              <Alert color="yellow" variant="light">
                No hay horarios disponibles para ese día.
              </Alert>
            )}

          {selectedDate &&
            !isLoadingSlots &&
            !isFetchingSlots &&
            !isSlotsError &&
            slots.length > 0 && (
              <Controller
                control={control}
                name="slot"
                render={({ field, fieldState }) => (
                  <Stack gap="xs">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
                      {slots.map((slot) => {
                        const selected = field.value === slot;

                        return (
                          <Button
                            key={slot}
                            type="button"
                            variant={selected ? 'filled' : 'default'}
                            onClick={() => field.onChange(slot)}
                            disabled={isPending}
                          >
                            {formatTime(slot)}
                          </Button>
                        );
                      })}
                    </SimpleGrid>

                    {fieldState.error?.message && (
                      <Text size="sm" c="red">
                        {fieldState.error.message}
                      </Text>
                    )}
                  </Stack>
                )}
              />
            )}

          {selectedSlot && (
            <Text size="sm" c="dimmed">
              Turno seleccionado: {formatLocalDateTime(selectedSlot)}
            </Text>
          )}
        </Stack>

        <Textarea
          label="Notas"
          placeholder="Observaciones del cliente"
          minRows={3}
          autosize
          {...register('clientNotes')}
          error={errors.clientNotes?.message}
          disabled={isPending}
        />

        <Group justify="flex-end">
          {onCancel && (
            <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
              Cancelar
            </Button>
          )}

          <Button type="submit" loading={isPending} disabled={isFormDisabled}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
