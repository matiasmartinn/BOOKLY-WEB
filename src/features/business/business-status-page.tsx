import { useState } from 'react';
import { Alert, Badge, Button, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import {
  useActivateBusiness,
  useBusiness,
  useDeactivateBusiness,
} from 'features/business/hooks';
import { useSelectedServiceSchedules } from 'features/schedules/hooks';
import { useScheduleUnavailability } from 'features/unavailability/hooks';
import { PageCard, PageShell } from 'shared/layout';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-buisness-store';

type Feedback = {
  color: 'green' | 'red';
  message: string;
};

export function BusinessStatusPage() {
  const authUser = useAuthStore((s) => s.user);
  const selectedService = useBusinessStore((s) => s.selectedService);
  const selectService = useBusinessStore((s) => s.selectService);

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { data: serviceData } = useBusiness(selectedService?.id);
  const { data: schedules = [] } = useSelectedServiceSchedules();
  const { data: unavailabilities = [] } = useScheduleUnavailability();

  const currentService = serviceData ?? selectedService;
  const teamCount =
    currentService?.secretaryIds.filter((id): id is number => id != null).length ?? 0;

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

    setFeedback(null);

    try {
      await activateMutation.mutateAsync();
      await syncSelectedService();
      setFeedback({ color: 'green', message: 'El servicio quedó activado.' });
    } catch {
      setFeedback({ color: 'red', message: 'No se pudo activar el servicio.' });
    }
  };

  const handleDeactivate = async () => {
    if (!currentService) return;

    setFeedback(null);

    try {
      await deactivateMutation.mutateAsync();
      await syncSelectedService();
      setFeedback({ color: 'green', message: 'El servicio quedó inactivo.' });
    } catch {
      setFeedback({ color: 'red', message: 'No se pudo actualizar el estado del servicio.' });
    }
  };

  return (
    <PageShell
      title="Estado"
      description="Control del estado operativo del servicio y de las señales principales que lo acompañan."
    >
      <Stack gap="md">
        {!currentService && (
          <Alert color="yellow" variant="light">
            Selecciona un servicio para revisar su estado operativo.
          </Alert>
        )}

        {feedback && (
          <Alert color={feedback.color} variant="light">
            {feedback.message}
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
                      Activa o desactiva el servicio sin salir del dashboard.
                    </Text>
                  </Stack>

                  <Badge color={currentService.isActive ? 'green' : 'yellow'} variant="light">
                    {currentService.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Group>

                <Alert color={currentService.isActive ? 'green' : 'yellow'} variant="light">
                  {currentService.isActive
                    ? 'El servicio está disponible para operar con su configuración actual.'
                    : 'El servicio está marcado como inactivo y requiere reactivación para operar normalmente.'}
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

            <PageCard>
              <Stack gap="sm">
                <Text fw={600}>Señales relacionadas</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Stack gap={4}>
                    <Text>Horarios configurados: {schedules.length}</Text>
                    <Text>Excepciones cargadas: {unavailabilities.length}</Text>
                  </Stack>

                  <Stack gap={4}>
                    <Text>Equipo asignado: {teamCount}</Text>
                    <Text>Modo operativo: {currentService.mode}</Text>
                  </Stack>
                </SimpleGrid>
              </Stack>
            </PageCard>
          </>
        )}
      </Stack>
    </PageShell>
  );
}
