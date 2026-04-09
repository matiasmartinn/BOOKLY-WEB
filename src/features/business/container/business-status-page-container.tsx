import { Alert, Badge, Button, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useBusiness, useDeactivateBusiness } from 'features/business/hooks';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-buisness-store';

export function BusinessStatusPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const selectedService = useBusinessStore((s) => s.selectedService);
  const selectService = useBusinessStore((s) => s.selectService);
  const toast = useAppToast();
  const [deactivateModalOpened, deactivateModalHandlers] = useDisclosure(false);

  const { data: serviceData } = useBusiness(selectedService?.id);

  const currentService = serviceData ?? selectedService;

  const deactivateMutation = useDeactivateBusiness(currentService?.id ?? 0, authUser?.id);

  const isMutating = deactivateMutation.isLoading;

  const syncSelectedService = async () => {
    if (currentService) {
      await selectService(currentService.id);
    }
  };

  const handleDeactivate = async () => {
    if (!currentService) return;

    try {
      await deactivateMutation.mutateAsync();
      await syncSelectedService();
      deactivateModalHandlers.close();
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
                    Desactiva el servicio para impedir nuevos turnos.
                  </Text>
                </Stack>

                <Badge color={currentService.isActive ? 'green' : 'yellow'} variant="light">
                  {currentService.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </Group>

              <Alert color={currentService.isActive ? 'green' : 'yellow'} variant="light">
                {currentService.isActive
                  ? 'El servicio esta disponible y se pueden agendar turnos sobre el mismo.'
                  : 'El servicio esta deshabilitado, no se pueden agendar turnos y solo un Admin puede volver a habilitarlo.'}
              </Alert>

              {currentService.isActive ? (
                <Group gap="sm">
                  <Button
                    color="red"
                    variant="light"
                    onClick={deactivateModalHandlers.open}
                    disabled={isMutating}
                  >
                    Desactivar servicio
                  </Button>
                </Group>
              ) : null}
            </Stack>
          </PageCard>
        </>
      )}

      <GenericModal
        opened={deactivateModalOpened}
        onClose={deactivateModalHandlers.close}
        title="Desactivar servicio"
        size="md"
        loading={isMutating}
        footer={
          <>
            <Button variant="default" onClick={deactivateModalHandlers.close} disabled={isMutating}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => {
                void handleDeactivate();
              }}
              loading={isMutating}
            >
              Confirmar deshabilitacion
            </Button>
          </>
        }
      >
        <Stack gap="sm">
          <Alert color="red" variant="light">
            Vas a deshabilitar el servicio, impidiendo agendar turnos sobre el mismo.
          </Alert>

          <Text size="sm" c="dimmed">
            Una vez desactivado, solo un Admin podra volver a habilitarlo.
          </Text>
        </Stack>
      </GenericModal>
    </Stack>
  );
}
