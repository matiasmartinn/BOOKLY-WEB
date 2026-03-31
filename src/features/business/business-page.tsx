import { Alert, Badge, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSelectedServiceSchedules } from 'features/schedules/hooks';
import { PageCard, PageShell } from 'shared/layout';
import { useBusinessStore } from 'store/use-buisness-store';
import { BusinessProfileForm } from './components/business-profile-form';

export function BusinessPage() {
  const selectedService = useBusinessStore((state) => state.selectedService);
  const { data: schedules = [] } = useSelectedServiceSchedules();

  const teamCount =
    selectedService?.secretaryIds.filter((id): id is number => id != null).length ?? 0;

  return (
    <PageShell title="Mi servicio" description="Edita los datos base del servicio actual.">
      <Stack gap="md">
        {!selectedService && (
          <Alert color="yellow" variant="light">
            Selecciona un servicio desde el sidebar para editar su configuracion principal.
          </Alert>
        )}

        {selectedService && (
          <>
            <PageCard>
              <Stack gap="md">
                <Stack gap={4}>
                  <Text fw={600}>Datos principales</Text>
                </Stack>

                <Badge color={selectedService.isActive ? 'green' : 'yellow'} variant="light">
                  {selectedService.isActive ? 'Activo' : 'Inactivo'}
                </Badge>

                <BusinessProfileForm service={selectedService} />
              </Stack>
            </PageCard>

            <PageCard>
              <Stack gap="sm">
                <Text fw={600}>Contexto operativo</Text>
                <Text size="sm" c="dimmed">
                  Estos datos siguen visibles como referencia, pero su administracion continua en
                  los modulos especificos.
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Stack gap={4}>
                    <Text>Duracion por turno: {selectedService.durationMinutes} min</Text>
                    <Text>Capacidad: {selectedService.capacity}</Text>
                    <Text>Modo: {selectedService.mode}</Text>
                  </Stack>

                  <Stack gap={4}>
                    <Text>Horarios configurados: {schedules.length}</Text>
                    <Text>Equipo asignado: {teamCount}</Text>
                    <Text>
                      Precio:{' '}
                      {selectedService.price != null ? `$${selectedService.price}` : 'No definido'}
                    </Text>
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
