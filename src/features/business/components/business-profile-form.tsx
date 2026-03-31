import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { isApiError } from 'app/api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useServiceTypes } from 'features/service-types/hooks';
import type { BusinessDto } from 'shared/models';
import { useBusinessStore } from 'store/use-buisness-store';
import { useUpdateBusiness } from '../hooks';
import {
  updateBusinessProfileSchema,
  type UpdateBusinessProfileFormValues,
} from '../schema/update-business-profile.schema';

interface BusinessProfileFormProps {
  service: BusinessDto;
}

type Feedback = {
  color: 'green' | 'red';
  message: string;
};

const mapBusinessToFormValues = (service: BusinessDto): UpdateBusinessProfileFormValues => ({
  name: service.name,
  slug: service.slug ?? '',
  description: service.description ?? '',
  serviceTypeId: service.serviceTypeId,
  placeName: service.placeName ?? '',
  address: service.address ?? '',
  googleMapsUrl: service.googleMapsUrl ?? '',
});

export function BusinessProfileForm({ service }: BusinessProfileFormProps) {
  const updateService = useBusinessStore((state) => state.updateService);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { data: serviceTypes = [], isLoading: isLoadingServiceTypes } = useServiceTypes();
  const { mutateAsync, isPending, isError, error } = useUpdateBusiness(service.id, service.ownerId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateBusinessProfileFormValues>({
    resolver: zodResolver(updateBusinessProfileSchema),
    mode: 'onTouched',
    defaultValues: mapBusinessToFormValues(service),
  });

  useEffect(() => {
    reset(mapBusinessToFormValues(service));
    setFeedback(null);
  }, [service.id, reset]);

  const serviceTypeOptions = useMemo(() => {
    const options = serviceTypes.map((item) => ({
      value: String(item.id),
      label: item.name,
    }));

    if (!options.some((item) => Number(item.value) === service.serviceTypeId)) {
      options.push({
        value: String(service.serviceTypeId),
        label: `Tipo actual (${service.serviceTypeId})`,
      });
    }

    return options.sort((a, b) => a.label.localeCompare(b.label, 'es-AR'));
  }, [service.serviceTypeId, serviceTypes]);

  const slug = watch('slug') ?? '';
  const serviceTypeId = watch('serviceTypeId');

  const onSubmit: SubmitHandler<UpdateBusinessProfileFormValues> = async (values) => {
    setFeedback(null);

    try {
      const updatedService = await mutateAsync({
        name: values.name.trim(),
        slug: values.slug?.trim() ?? '',
        description: values.description?.trim() ?? '',
        serviceTypeId: values.serviceTypeId,
        placeName: values.placeName?.trim() ?? '',
        address: values.address?.trim() ?? '',
        googleMapsUrl: values.googleMapsUrl?.trim() ?? '',
      });

      updateService(updatedService);
      reset(mapBusinessToFormValues(updatedService));
      setFeedback({ color: 'green', message: 'Los datos base del servicio se guardaron.' });
    } catch {
      setFeedback(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {feedback && (
          <Alert color={feedback.color} variant="light">
            {feedback.message}
          </Alert>
        )}

        {isError && error && (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo guardar la configuracion del servicio.'}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Ej: Peluqueria Nico"
              withAsterisk
              {...register('name')}
              error={errors.name?.message}
              disabled={isPending}
            />

            <TextInput
              label="Slug"
              placeholder="mi-servicio"
              description="Se usa en la URL publica del servicio."
              {...register('slug')}
              error={errors.slug?.message}
              disabled={isPending}
            />

            <Text size="xs" c="dimmed">
              URL publica: {slug ? `bookly.app/${slug}` : 'Sin slug definido'}
            </Text>

            <Select
              label="Tipo de servicio"
              placeholder="Selecciona un tipo"
              withAsterisk
              data={serviceTypeOptions}
              value={serviceTypeId ? String(serviceTypeId) : null}
              disabled={isPending || isLoadingServiceTypes}
              error={errors.serviceTypeId?.message}
              onChange={(value) =>
                setValue('serviceTypeId', value ? Number(value) : undefined!, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />

            <Textarea
              label="Descripcion"
              placeholder="Describe brevemente el servicio"
              description="Opcional. Maximo 500 caracteres."
              autosize
              minRows={4}
              maxRows={8}
              maxLength={500}
              {...register('description')}
              error={errors.description?.message}
              disabled={isPending}
            />
          </Stack>

          <Stack gap="md">
            <TextInput
              label="Lugar"
              placeholder="Ej: Sucursal Centro"
              {...register('placeName')}
              error={errors.placeName?.message}
              disabled={isPending}
            />

            <TextInput
              label="Direccion"
              placeholder="Ej: Av. Siempre Viva 123"
              {...register('address')}
              error={errors.address?.message}
              disabled={isPending}
            />

            <TextInput
              label="Google Maps URL"
              placeholder="https://maps.google.com/..."
              {...register('googleMapsUrl')}
              error={errors.googleMapsUrl?.message}
              disabled={isPending}
            />
          </Stack>
        </SimpleGrid>

        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Text size="sm" c="dimmed">
            {isDirty ? 'Hay cambios pendientes de guardado.' : 'Sin cambios pendientes.'}
          </Text>

          <Group gap="sm">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                reset(mapBusinessToFormValues(service));
                setFeedback(null);
              }}
              disabled={!isDirty || isPending}
            >
              Descartar cambios
            </Button>

            <Button type="submit" loading={isPending} disabled={!isDirty}>
              Guardar cambios
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
