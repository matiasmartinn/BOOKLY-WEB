import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { isApiError } from 'app/api';
import { useServiceTypes } from 'features/service-types/hooks';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import type { BusinessDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import { useBusinessStore } from 'store/use-business-store';

import { useUpdateBusiness } from '../hooks';
import {
  updateBusinessProfileSchema,
  type UpdateBusinessProfileFormValues,
} from '../schema/update-business-profile.schema';

interface BusinessProfileFormProps {
  service: BusinessDto;
}

interface LocalSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const mapBusinessToFormValues = (service: BusinessDto): UpdateBusinessProfileFormValues => ({
  name: service.name,
  description: service.description ?? '',
  phoneNumber: service.phoneNumber ?? '',
  durationMinutes: service.durationMinutes,
  price: service.price ?? undefined,
  placeName: service.placeName ?? '',
  address: service.address ?? '',
});

function LocalSection({ title, description, children }: LocalSectionProps) {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 'var(--mantine-radius-lg)',
        backgroundColor: 'var(--app-color-soft-surface, rgba(248, 250, 252, 0.72))',
        border: '1px solid var(--app-color-border)',
      }}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={800} size="md" c="var(--app-color-text-primary)">
            {title}
          </Text>

          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>

        <Stack gap="lg">{children}</Stack>
      </Stack>
    </Box>
  );
}

export function BusinessProfileForm({ service }: BusinessProfileFormProps) {
  const updateService = useBusinessStore((state) => state.updateService);
  const toast = useAppToast();

  const { data: serviceTypes = [] } = useServiceTypes();
  const { mutateAsync, isPending, isError, error } = useUpdateBusiness(service.id, service.ownerId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateBusinessProfileFormValues>({
    resolver: zodResolver(updateBusinessProfileSchema),
    mode: 'onTouched',
    defaultValues: mapBusinessToFormValues(service),
  });

  useEffect(() => {
    reset(mapBusinessToFormValues(service));
  }, [service, reset]);

  const currentServiceTypeLabel = useMemo(
    () =>
      serviceTypes.find((item) => item.id === service.serviceTypeId)?.name ??
      `Tipo actual (${service.serviceTypeId})`,
    [service.serviceTypeId, serviceTypes],
  );

  const onSubmit: SubmitHandler<UpdateBusinessProfileFormValues> = async (values) => {
    try {
      const updatedService = await mutateAsync({
        name: values.name.trim(),
        description: values.description?.trim() ?? '',
        phoneNumber: values.phoneNumber?.trim() ?? '',
        durationMinutes: values.durationMinutes,
        price: values.price ?? (service.price != null ? null : undefined),
        placeName: values.placeName?.trim() ?? '',
        address: values.address?.trim() ?? '',
      });

      updateService(updatedService);
      reset(mapBusinessToFormValues(updatedService));
      toast.success('Los datos del servicio se guardaron.');
    } catch {
      // El error se refleja inline desde el estado del mutation.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {isError && error && (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo guardar la configuración del servicio.'}
          </Alert>
        )}

        <LocalSection title="Datos principales">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre del servicio"
              placeholder="Ej: Peluquería Nico"
              size="md"
              withAsterisk
              {...register('name')}
              error={errors.name?.message}
              disabled={isPending}
            />

            <TextInput
              label="Tipo de servicio"
              size="md"
              value={currentServiceTypeLabel}
              readOnly
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              name="durationMinutes"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Duración del turno"
                  placeholder="Ej: 45"
                  min={1}
                  max={480}
                  step={5}
                  suffix=" min"
                  error={errors.durationMinutes?.message}
                  disabled={isPending}
                  onChange={(value) =>
                    field.onChange(typeof value === 'number' ? value : undefined)
                  }
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Precio por turno"
                  placeholder="Ej: 5000"
                  min={0}
                  decimalScale={2}
                  prefix="$ "
                  error={errors.price?.message}
                  disabled={isPending}
                  onChange={(value) =>
                    field.onChange(typeof value === 'number' ? value : undefined)
                  }
                />
              )}
            />
          </SimpleGrid>

          <Textarea
            label="Descripción"
            autosize
            minRows={4}
            maxRows={8}
            maxLength={500}
            {...register('description')}
            error={errors.description?.message}
            disabled={isPending}
          />
        </LocalSection>

        <LocalSection title="Atención y configuración">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Zona o barrio"
              placeholder="Ej: Centro o Barrio Norte"
              {...register('placeName')}
              error={errors.placeName?.message}
              disabled={isPending}
            />

            <TextInput
              label="Teléfono de contacto"
              placeholder="Ej: +54 9 3364 000000"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
              disabled={isPending}
            />
          </SimpleGrid>

          <TextInput
            label="Dirección"
            placeholder="Ej: Av. Siempre Viva 123"
            {...register('address')}
            error={errors.address?.message}
            disabled={isPending}
          />
        </LocalSection>

        <Group
          justify="space-between"
          align="center"
          wrap="wrap"
          gap="sm"
          pt="lg"
          style={{
            borderTop: '1px solid var(--app-color-border)',
          }}
        >
          <Text size="sm" c="dimmed">
            {isDirty ? 'Hay cambios pendientes de guardado.' : 'Sin cambios pendientes.'}
          </Text>

          <Group gap="sm">
            <Button
              type="button"
              variant="default"
              onClick={() => reset(mapBusinessToFormValues(service))}
              disabled={!isDirty || isPending}
            >
              Descartar cambios
            </Button>

            <Button type="submit" color="brand" loading={isPending} disabled={!isDirty}>
              Guardar cambios
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
