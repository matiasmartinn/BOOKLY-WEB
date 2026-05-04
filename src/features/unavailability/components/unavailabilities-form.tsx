import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, SimpleGrid, Stack, Switch, Text, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { isApiError } from 'app/api';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { SelectDayTimePicker } from 'shared/ui/components';
import { compareDateOnly } from 'shared/utils';
import { useBusinessStore } from 'store/use-business-store';

import { useAddUnavailability } from '../hooks';
import { unavailabilityFormSchema, type UnavailabilityFormValues } from '../schema';

interface UnavailabilitiesFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

const defaultValues: UnavailabilityFormValues = {
  startDate: null,
  endDate: null,
  isFullDay: true,
  startTime: null,
  endTime: null,
  reason: '',
};

export function UnavailabilitiesForm({
  onCancel,
  onSuccess,
  submitLabel = 'Guardar excepción',
}: UnavailabilitiesFormProps) {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<UnavailabilityFormValues>({
    resolver: zodResolver(unavailabilityFormSchema),
    mode: 'onTouched',
    defaultValues,
  });

  const { mutate: addUnavailability, isPending, isError, error } = useAddUnavailability();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const isFullDay = watch('isFullDay');
  const isFormDisabled = !selectedService;

  const onSubmit: SubmitHandler<UnavailabilityFormValues> = (values) => {
    if (!selectedService) {
      setError('root', {
        type: 'manual',
        message: 'Seleccioná un servicio antes de cargar una excepción.',
      });
      return;
    }

    addUnavailability(
      {
        startDate: values.startDate!,
        endDate: values.endDate!,
        startTime: values.isFullDay ? null : values.startTime,
        endTime: values.isFullDay ? null : values.endTime,
        reason: values.reason.trim() || null,
        cancelAffectedAppointments: true,
      },
      {
        onSuccess,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {errors.root?.message && (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        )}

        {isError && error && (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo guardar la excepción.'}
          </Alert>
        )}

        <Alert color="yellow" variant="light">
          Al crear esta inhabilitación, los turnos existentes dentro del rango seleccionado serán
          cancelados automáticamente.
        </Alert>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Controller
            control={control}
            name="startDate"
            render={({ field, fieldState }) => (
              <DatePickerInput
                label="Desde"
                placeholder="Fecha inicial"
                withAsterisk
                value={field.value}
                onChange={(value) => {
                  field.onChange(value ?? null);

                  if (!endDate || (value && compareDateOnly(endDate, value) < 0)) {
                    setValue('endDate', value ?? null, { shouldValidate: true });
                  }
                }}
                error={fieldState.error?.message}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                disabled={isPending || isFormDisabled}
              />
            )}
          />

          <Controller
            control={control}
            name="endDate"
            render={({ field, fieldState }) => (
              <DatePickerInput
                label="Hasta"
                placeholder="Fecha final"
                withAsterisk
                value={field.value}
                minDate={startDate ?? undefined}
                onChange={(value) => field.onChange(value ?? null)}
                error={fieldState.error?.message}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                disabled={isPending || isFormDisabled}
              />
            )}
          />
        </SimpleGrid>

        <Switch
          label="Todo el día"
          description="Si lo desactivás, podrás bloquear una franja horaria puntual."
          checked={isFullDay}
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            setValue('isFullDay', checked, { shouldValidate: true });

            if (checked) {
              setValue('startTime', null, { shouldValidate: true });
              setValue('endTime', null, { shouldValidate: true });
              clearErrors(['startTime', 'endTime']);
            }
          }}
          disabled={isPending || isFormDisabled}
        />

        {!isFullDay && (
          <Stack gap="xs">
            <Text fw={500}>Franja horaria</Text>
            <SelectDayTimePicker
              startValue={startTime}
              endValue={endTime}
              onStartChange={(value) =>
                setValue('startTime', value, { shouldValidate: true, shouldTouch: true })
              }
              onEndChange={(value) =>
                setValue('endTime', value, { shouldValidate: true, shouldTouch: true })
              }
              disabled={isPending || isFormDisabled}
            />

            {(errors.startTime?.message || errors.endTime?.message) && (
              <Text size="sm" c="red">
                {errors.startTime?.message || errors.endTime?.message}
              </Text>
            )}
          </Stack>
        )}

        <Textarea
          label="Motivo"
          placeholder="Vacaciones, feriado, mantenimiento..."
          minRows={3}
          autosize
          {...register('reason')}
          disabled={isPending || isFormDisabled}
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
