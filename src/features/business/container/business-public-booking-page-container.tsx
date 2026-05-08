import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Badge, Button, Group, Skeleton, Stack, Text, TextInput } from '@mantine/core';
import { isApiError } from 'app/api';
import { PATHS } from 'app/router/PATHS';
import { PublicBookingSharePanel } from 'features/public-booking/components';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import type { BusinessDto, ServicePublicBookingDto } from 'shared/models';
import { PageCard } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { useBusinessStore } from 'store/use-business-store';
import { z } from 'zod';

import { useBusiness, useUpdateBusiness } from '../hooks';

const publicBookingSlugSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Ingresa el slug del enlace publico')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minusculas, numeros y guiones'),
});

type PublicBookingSlugFormValues = z.infer<typeof publicBookingSlugSchema>;

const mapSlugValues = (service?: BusinessDto | null): PublicBookingSlugFormValues => ({
  slug: service?.slug ?? '',
});

export function BusinessPublicBookingPageContainer() {
  const navigate = useNavigate();
  const toast = useAppToast();
  const { serviceId: rawServiceId } = useParams<{ serviceId: string }>();
  const selectedService = useBusinessStore((state) => state.selectedService);
  const updateService = useBusinessStore((state) => state.updateService);

  const parsedServiceId = Number(rawServiceId);
  const serviceId =
    Number.isInteger(parsedServiceId) && parsedServiceId > 0 ? parsedServiceId : null;
  const selectedMatchesRoute = serviceId != null && selectedService?.id === serviceId;

  const serviceQuery = useBusiness(serviceId ?? undefined);
  const currentService = serviceQuery.data ?? (selectedMatchesRoute ? selectedService : null);

  const updateBusinessMutation = useUpdateBusiness(serviceId ?? 0, currentService?.ownerId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PublicBookingSlugFormValues>({
    resolver: zodResolver(publicBookingSlugSchema),
    mode: 'onTouched',
    defaultValues: mapSlugValues(currentService),
  });

  useEffect(() => {
    reset(mapSlugValues(currentService));
  }, [currentService, reset]);

  const handlePublicBookingUpdated = (publicBooking: ServicePublicBookingDto) => {
    if (!currentService) {
      return;
    }

    updateService({
      ...currentService,
      slug: publicBooking.slug,
      isPublicBookingEnabled: publicBooking.isEnabled,
      publicBookingCode: publicBooking.publicBookingCode,
      publicBookingCodeUpdatedAt: publicBooking.publicBookingCodeUpdatedAt ?? null,
    });
  };

  const onSubmit: SubmitHandler<PublicBookingSlugFormValues> = async (values) => {
    if (!currentService) {
      return;
    }

    try {
      const updatedService = await updateBusinessMutation.mutateAsync({
        slug: values.slug.trim(),
      });

      updateService(updatedService);
      reset(mapSlugValues(updatedService));
      toast.success('El slug del enlace publico se guardo correctamente.');
    } catch {
      // El error se muestra inline en el formulario.
    }
  };

  if (serviceId == null) {
    return (
      <Alert color="red" variant="light">
        El servicio indicado no es valido.
      </Alert>
    );
  }

  if (serviceQuery.isLoading && !currentService) {
    return (
      <PageCard>
        <Stack gap="lg">
          <Skeleton h={28} w={220} radius="sm" />
          <Skeleton h={18} radius="sm" />
          <Skeleton h={260} radius="lg" />
        </Stack>
      </PageCard>
    );
  }

  if (serviceQuery.isError && !currentService) {
    return (
      <Alert color="red" variant="light">
        {isApiError(serviceQuery.error)
          ? serviceQuery.error.detail
          : 'No se pudo cargar el servicio para gestionar la reserva publica.'}
      </Alert>
    );
  }

  if (!currentService) {
    return (
      <Alert color="yellow" variant="light">
        Selecciona un servicio antes de gestionar su reserva publica.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageCard>
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Stack gap={6} maw={640}>
              <Text fw={700} size="xl">
                Reserva Pública
              </Text>
              <Text size="sm" c="dimmed">
                Gestiona el enlace publico de {currentService.name} y comparte la reserva online con
                tus clientes.
              </Text>
            </Stack>

            <Group gap="sm" wrap="wrap" justify="flex-end">
              <Badge color={currentService.isActive ? 'green' : 'yellow'} variant="light" size="lg">
                {currentService.isActive ? 'Servicio activo' : 'Servicio inactivo'}
              </Badge>

              <Button variant="default" onClick={() => navigate(PATHS.dashboard.service)}>
                Volver a servicio
              </Button>
            </Group>
          </Group>

          {updateBusinessMutation.isError && updateBusinessMutation.error && (
            <Alert color="red" variant="light">
              {isApiError(updateBusinessMutation.error)
                ? updateBusinessMutation.error.detail
                : 'No se pudo guardar el slug del enlace publico.'}
            </Alert>
          )}

          <PublicBookingSharePanel
            serviceId={currentService.id}
            ownerId={currentService.ownerId}
            slug={currentService.slug}
            pendingSlug={watch('slug')}
            slugField={
              <TextInput
                label="Slug del enlace publico"
                placeholder="mi-servicio"
                description="Se usa para construir la URL publica de reserva."
                withAsterisk
                {...register('slug')}
                error={errors.slug?.message}
                disabled={updateBusinessMutation.isPending}
                styles={{
                  input: {
                    fontFamily: 'monospace',
                  },
                }}
              />
            }
            code={currentService.publicBookingCode}
            codeUpdatedAt={currentService.publicBookingCodeUpdatedAt}
            isEnabled={currentService.isPublicBookingEnabled}
            onPublicBookingUpdated={handlePublicBookingUpdated}
          />

          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text size="sm" c="dimmed">
              {isDirty
                ? 'Hay cambios pendientes en el slug del enlace.'
                : 'Sin cambios pendientes.'}
            </Text>

            <Group gap="sm">
              <Button
                type="button"
                variant="default"
                onClick={() => reset(mapSlugValues(currentService))}
                disabled={!isDirty || updateBusinessMutation.isPending}
              >
                Descartar cambios
              </Button>

              <Button type="submit" loading={updateBusinessMutation.isPending} disabled={!isDirty}>
                Guardar slug
              </Button>
            </Group>
          </Group>
        </Stack>
      </PageCard>
    </form>
  );
}
