import { Alert, Badge, Stack, Text } from '@mantine/core';
import { PageCard } from 'shared/layout';
import { useBusinessStore } from 'store/use-buisness-store';
import { BusinessProfileForm } from '../components/business-profile-form';

export function BusinessPageContainer() {
  const selectedService = useBusinessStore((state) => state.selectedService);

  return (
    <Stack gap="md">
      {!selectedService && (
        <Alert color="yellow" variant="light">
          Selecciona un servicio desde el sidebar para editar su configuracion principal.
        </Alert>
      )}

      {selectedService && (
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
      )}
    </Stack>
  );
}
