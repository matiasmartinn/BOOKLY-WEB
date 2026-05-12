import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Skeleton, Stack, TextInput } from '@mantine/core';
import { isApiError } from 'app/api';
import { PublicBookingSharePanel } from 'features/public-booking/components';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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
    .min(1, 'Ingresa el slug del enlace público')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
});

type PublicBookingSlugFormValues = z.infer<typeof publicBookingSlugSchema>;

const mapSlugValues = (service?: BusinessDto | null): PublicBookingSlugFormValues => ({
  slug: service?.slug ?? '',
});

export function BusinessPublicBookingPageContainer() {
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
    if (!currentService) return;

    updateService({
      ...currentService,
      slug: publicBooking.slug,
      isPublicBookingEnabled: publicBooking.isEnabled,
      publicBookingCode: publicBooking.publicBookingCode,
      publicBookingCodeUpdatedAt: publicBooking.publicBookingCodeUpdatedAt ?? null,
    });
  };

  const onSubmit: SubmitHandler<PublicBookingSlugFormValues> = async (values) => {
    if (!currentService) return;

    try {
      const updatedService = await updateBusinessMutation.mutateAsync({
        slug: values.slug.trim(),
      });

      updateService(updatedService);
      reset(mapSlugValues(updatedService));
      toast.success('El slug del enlace público se guardó correctamente.');
    } catch {
      // El error se muestra inline en el formulario.
    }
  };

  if (serviceId == null) {
    return (
      <Alert color="red" variant="light">
        El servicio indicado no es válido.
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
          : 'No se pudo cargar el servicio para gestionar la reserva pública.'}
      </Alert>
    );
  }

  if (!currentService) {
    return (
      <Alert color="yellow" variant="light">
        Selecciona un servicio antes de gestionar su reserva pública.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <PageCard>
          <Stack gap="xl">
            {updateBusinessMutation.isError && updateBusinessMutation.error && (
              <Alert color="red" variant="light">
                {isApiError(updateBusinessMutation.error)
                  ? updateBusinessMutation.error.detail
                  : 'No se pudo guardar el slug del enlace público.'}
              </Alert>
            )}

            <PublicBookingSharePanel
              serviceId={currentService.id}
              ownerId={currentService.ownerId}
              slug={currentService.slug}
              slugField={
                <TextInput
                  placeholder="mi-servicio"
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

            <Group justify="space-between" align="center" wrap="wrap" gap="sm" pt="md">
              <span style={{ color: 'var(--app-color-text-secondary)', fontSize: 14 }}>
                {isDirty ? 'Hay cambios pendientes.' : 'Sin cambios pendientes.'}
              </span>

              <Group gap="sm">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => reset(mapSlugValues(currentService))}
                  disabled={!isDirty || updateBusinessMutation.isPending}
                >
                  Descartar
                </Button>

                <Button
                  type="submit"
                  color="brand"
                  loading={updateBusinessMutation.isPending}
                  disabled={!isDirty}
                >
                  Guardar slug
                </Button>
              </Group>
            </Group>
          </Stack>
        </PageCard>
      </Stack>
    </form>
  );
}
