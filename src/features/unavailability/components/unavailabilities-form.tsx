import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { isApiError } from 'app/api';
import { SelectDayTimePicker } from 'shared/ui/components';
import { useBusinessStore } from 'store/use-buisness-store';
import { useAddUnavailability } from '../hooks';

interface UnavailabilitiesFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
}

const unavailabilityFormSchema = z
  .object({
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    isFullDay: z.boolean(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    reason: z.string(),
  })
  .superRefine((values, ctx) => {
    if (!values.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Selecciona la fecha inicial.',
      });
    }

    if (!values.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'Selecciona la fecha final.',
      });
    }

    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'La fecha final no puede ser anterior a la inicial.',
      });
    }

    if (!values.isFullDay) {
      if (!values.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['startTime'],
          message: 'Selecciona una hora de inicio.',
        });
      }

      if (!values.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endTime'],
          message: 'Selecciona una hora de fin.',
        });
      }

      if (values.startTime && values.endTime && values.endTime <= values.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endTime'],
          message: 'La hora de fin debe ser posterior a la de inicio.',
        });
      }
    }
  });

type UnavailabilityFormValues = z.infer<typeof unavailabilityFormSchema>;

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
  submitLabel = 'Guardar excepcion',
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
        message: 'Selecciona un servicio antes de cargar una excepcion.',
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
      },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600}>Nueva excepcion</Text>
          <Text size="sm" c="dimmed">
            {selectedService
              ? `Servicio activo: ${selectedService.name}. Define el rango bloqueado y, si aplica, la franja horaria.`
              : 'Selecciona un servicio desde el sidebar para poder registrar excepciones.'}
          </Text>
        </Stack>

        {errors.root?.message && (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        )}

        {isError && error && (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo guardar la excepcion.'}
          </Alert>
        )}

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

                  if (!endDate || (value && endDate < value)) {
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
          label="Todo el dia"
          description="Si lo desactivas, podras bloquear una franja horaria puntual."
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
