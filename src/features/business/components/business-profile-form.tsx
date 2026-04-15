import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
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
import { PublicBookingSharePanel } from 'features/public-booking/components';
import { useServiceTypes } from 'features/service-types/hooks';
import { useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { BusinessDto, ServicePublicBookingDto } from 'shared/models';
import { FormSection } from 'shared/ui/components';
import { useAppToast } from 'shared/ui/toast';
import { useBusinessStore } from 'store/use-buisness-store';

import { useUpdateBusiness } from '../hooks';
import {
  updateBusinessProfileSchema,
  type UpdateBusinessProfileFormValues,
} from '../schema/update-business-profile.schema';

interface BusinessProfileFormProps {
  service: BusinessDto;
}

const mapBusinessToFormValues = (service: BusinessDto): UpdateBusinessProfileFormValues => ({
  name: service.name,
  slug: service.slug ?? '',
  description: service.description ?? '',
  phoneNumber: service.phoneNumber ?? '',
  serviceTypeId: service.serviceTypeId,
  placeName: service.placeName ?? '',
  address: service.address ?? '',
  googleMapsUrl: service.googleMapsUrl ?? '',
});

export function BusinessProfileForm({ service }: BusinessProfileFormProps) {
  const updateService = useBusinessStore((state) => state.updateService);
  const toast = useAppToast();

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
  }, [service, reset]);

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

  const serviceTypeId = watch('serviceTypeId');
  const slugValue = watch('slug') ?? '';

  const handlePublicBookingUpdated = (publicBooking: ServicePublicBookingDto) => {
    updateService({
      ...service,
      slug: publicBooking.slug,
      isPublicBookingEnabled: publicBooking.isEnabled,
      publicBookingCode: publicBooking.publicBookingCode,
      publicBookingCodeUpdatedAt: publicBooking.publicBookingCodeUpdatedAt ?? null,
    });
  };

  const onSubmit: SubmitHandler<UpdateBusinessProfileFormValues> = async (values) => {
    try {
      const updatedService = await mutateAsync({
        name: values.name.trim(),
        slug: values.slug?.trim() ?? '',
        description: values.description?.trim() ?? '',
        phoneNumber: values.phoneNumber?.trim() ?? '',
        serviceTypeId: values.serviceTypeId,
        placeName: values.placeName?.trim() ?? '',
        address: values.address?.trim() ?? '',
        googleMapsUrl: values.googleMapsUrl?.trim() ?? '',
      });

      updateService(updatedService);
      reset(mapBusinessToFormValues(updatedService));
      toast.success('Los datos base del servicio se guardaron.');
    } catch {
      // El eror se refleja inline desde el estado del mutation.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="xl">
        {isError && error && (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo guardar la configuracion del servicio.'}
          </Alert>
        )}

        <FormSection
          title="Informacion del servicio"
          description="Define los datos principales con los que se identifica tu servicio."
        >
          <Stack gap="lg">
            <Group align="flex-start" wrap="wrap" gap="md">
              <Box style={{ flex: '1.7 1 320px' }}>
                <TextInput
                  label="Nombre del servicio"
                  placeholder="Ej: Peluqueria Nico"
                  size="md"
                  withAsterisk
                  {...register('name')}
                  error={errors.name?.message}
                  disabled={isPending}
                />
              </Box>

              <Box style={{ flex: '1 1 240px' }}>
                <Select
                  label="Tipo de servicio"
                  placeholder="Selecciona un tipo"
                  size="md"
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
              </Box>
            </Group>

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
        </FormSection>

        <FormSection
          title="Ubicacion y contacto"
          description="Completa la informacion que ayuda a ubicar tu servicio y a contactarte."
        >
          <Stack gap="lg">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Zona o barrio"
                placeholder="Ej: Centro o Barrio Norte"
                {...register('placeName')}
                error={errors.placeName?.message}
                disabled={isPending}
              />

              <TextInput
                label="Telefono de contacto"
                placeholder="Ej: +54 9 3364 000000"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                disabled={isPending}
              />
            </SimpleGrid>

            <TextInput
              label="Direccion"
              placeholder="Ej: Av. Siempre Viva 123"
              {...register('address')}
              error={errors.address?.message}
              disabled={isPending}
            />

            <TextInput
              label="Enlace de Google Maps"
              placeholder="https://maps.google.com/..."
              description="Opcional. Ayuda a que el cliente llegue mas facil."
              {...register('googleMapsUrl')}
              error={errors.googleMapsUrl?.message}
              disabled={isPending}
            />
          </Stack>
        </FormSection>

        <FormSection
          title="Publicacion y reserva publica"
          description="Aqui defines el slug del enlace, el estado de la reserva publica y el link que compartes con tus clientes."
          p="xl"
          style={{
            background:
              'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0.96) 100%)',
            borderColor: 'var(--app-color-brand-outline)',
            boxShadow: '0 14px 30px rgba(99, 102, 241, 0.08)',
          }}
        >
          <PublicBookingSharePanel
            serviceId={service.id}
            ownerId={service.ownerId}
            slug={service.slug}
            pendingSlug={slugValue}
            slugField={
              <TextInput
                label="Slug del enlace publico"
                placeholder="mi-servicio"
                size="md"
                description="Se usa para construir la URL publica de reserva."
                withAsterisk
                {...register('slug')}
                error={errors.slug?.message}
                disabled={isPending}
                styles={{
                  input: {
                    fontFamily: 'monospace',
                  },
                }}
              />
            }
            code={service.publicBookingCode}
            codeUpdatedAt={service.publicBookingCodeUpdatedAt}
            isEnabled={service.isPublicBookingEnabled}
            onPublicBookingUpdated={handlePublicBookingUpdated}
          />
        </FormSection>

        <Group
          justify="space-between"
          align="center"
          wrap="wrap"
          gap="sm"
          p="md"
          style={{
            borderRadius: 'var(--mantine-radius-lg)',
            backgroundColor: 'rgba(255,255,255,0.86)',
            border: '1px solid var(--app-color-border)',
          }}
        >
          <Text
            size="sm"
            style={{
              color: 'var(--app-color-text-secondary)',
            }}
          >
            {isDirty ? 'Hay cambios pendientes de guardado.' : 'Sin cambios pendientes.'}
          </Text>

          <Group gap="sm">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                reset(mapBusinessToFormValues(service));
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
