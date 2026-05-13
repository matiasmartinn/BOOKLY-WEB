import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { DynamicFieldsSection } from 'shared/components';
import {
  getActiveDynamicFieldDefinitions,
  mapAdditionalFieldsToFieldValues,
  normalizeBusinessLocalDateTime,
} from 'shared/utils';
import { useBusinessStore } from 'store/use-business-store';

import {
  useAppointmentAvailableDates,
  useAppointmentAvailableSlots,
  useCreateAppointment,
} from '../hooks';
import {
  appointmentFormDefaultValues,
  createAppointmentFormSchema,
  type AppointmentFormValues,
} from '../schema';
import type { CreateAppointmentDto } from '../services';

import { AppointmentScheduleSection } from './appointment-schedule-section';

interface AppointmentFormProps {
  initialValues?: Partial<AppointmentFormValues>;
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function AppointmentForm({
  initialValues,
  onCancel,
  onSuccess,
  submitLabel = 'Guardar turno',
}: AppointmentFormProps) {
  const selectedService = useBusinessStore((state) => state.selectedService);
  const fieldDefinitions = useMemo(
    () => getActiveDynamicFieldDefinitions(selectedService?.fieldDefinitions ?? []),
    [selectedService?.fieldDefinitions],
  );
  const canUseDynamicFields = Boolean(
    selectedService?.allowsExtraFields && fieldDefinitions.length > 0,
  );
  const schema = useMemo(
    () =>
      createAppointmentFormSchema({
        canUseDynamicFields,
        fieldDefinitions,
      }),
    [canUseDynamicFields, fieldDefinitions],
  );
  const defaultValues = useMemo(
    () => ({
      ...appointmentFormDefaultValues(),
      ...initialValues,
      additionalFields: initialValues?.additionalFields ?? {},
    }),
    [initialValues],
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    clearErrors,
    getValues,
    reset,
    setError,
    setValue,
    unregister,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues,
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

  useEffect(() => {
    unregister('additionalFields');
    reset({
      ...getValues(),
      additionalFields: {},
    });
    clearErrors('additionalFields');
  }, [canUseDynamicFields, clearErrors, getValues, reset, selectedService?.id, unregister]);

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

    const payload: CreateAppointmentDto = {
      serviceId: selectedService.id,
      clientName: values.clientName.trim(),
      clientPhone: values.clientPhone.trim(),
      clientEmail: values.clientEmail.trim(),
      clientNotes: values.clientNotes?.trim() || undefined,
      startDateTime: normalizeBusinessLocalDateTime(values.slot) ?? values.slot,
      fieldValues: canUseDynamicFields
        ? mapAdditionalFieldsToFieldValues(values.additionalFields, fieldDefinitions)
        : undefined,
    };

    createAppointment(payload, { onSuccess });
  };

  return (
    <form id="appointment-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg" style={{ minHeight: 0 }}>
        {errors.root?.message ? (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        ) : null}

        {isSubmitError ? (
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
            withAsterisk
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

        {canUseDynamicFields ? (
          <DynamicFieldsSection
            control={control}
            errors={errors}
            fieldDefinitions={fieldDefinitions}
            disabled={isPending}
          />
        ) : null}
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
