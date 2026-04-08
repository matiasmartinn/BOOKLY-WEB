import { Alert, Badge, Button, Group, Stack, Text } from '@mantine/core';
import { useActivateBusiness, useBusiness, useDeactivateBusiness } from 'features/business/hooks';
import { PageCard } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-buisness-store';

export function BusinessStatusPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const selectedService = useBusinessStore((s) => s.selectedService);
  const selectService = useBusinessStore((s) => s.selectService);
  const toast = useAppToast();

  const { data: serviceData } = useBusiness(selectedService?.id);

  const currentService = serviceData ?? selectedService;

  const activateMutation = useActivateBusiness(currentService?.id ?? 0, authUser?.id);
  const deactivateMutation = useDeactivateBusiness(currentService?.id ?? 0, authUser?.id);

  const isMutating = activateMutation.isLoading || deactivateMutation.isLoading;

  const syncSelectedService = async () => {
    if (currentService) {
      await selectService(currentService.id);
    }
  };

  const handleActivate = async () => {
    if (!currentService) return;

    try {
      await activateMutation.mutateAsync();
      await syncSelectedService();
      toast.success('El servicio quedo activado.');
    } catch {
      toast.error('No se pudo activar el servicio.');
    }
  };

  const handleDeactivate = async () => {
    if (!currentService) return;

    try {
      await deactivateMutation.mutateAsync();
      await syncSelectedService();
      toast.success('El servicio quedo inactivo.');
    } catch {
      toast.error('No se pudo actualizar el estado del servicio.');
    }
  };

  return (
    <Stack gap="md">
      {!currentService && (
        <Alert color="yellow" variant="light">
          Selecciona un servicio para revisar su estado operativo.
        </Alert>
      )}

      {currentService && (
        <>
          <PageCard>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                <Stack gap={4}>
                  <Text fw={600}>Estado actual</Text>
                  <Text size="sm" c="dimmed">
                    Activa o desactiva el servicio.
                  </Text>
                </Stack>

                <Badge color={currentService.isActive ? 'green' : 'yellow'} variant="light">
                  {currentService.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </Group>

              <Alert color={currentService.isActive ? 'green' : 'yellow'} variant="light">
                {currentService.isActive
                  ? 'El servicio esta disponible para operar.'
                  : 'El servicio esta marcado como inactivo y requiere reactivacion para operar normalmente.'}
              </Alert>

              <Group gap="sm">
                <Button
                  onClick={() => {
                    void handleActivate();
                  }}
                  disabled={currentService.isActive || isMutating}
                >
                  Activar servicio
                </Button>
                <Button
                  color="red"
                  variant="light"
                  onClick={() => {
                    void handleDeactivate();
                  }}
                  disabled={!currentService.isActive || isMutating}
                >
                  Desactivar servicio
                </Button>
              </Group>
            </Stack>
          </PageCard>
        </>
      )}
    </Stack>
  );
}
