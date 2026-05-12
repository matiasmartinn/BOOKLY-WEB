import { Alert, Stack } from '@mantine/core';
import { PageCard } from 'shared/layout';
import { useBusinessStore } from 'store/use-business-store';

import { BusinessProfileForm } from '../components/business-profile-form';

export function BusinessPageContainer() {
  const services = useBusinessStore((state) => state.services);
  const selectedService = useBusinessStore((state) => state.selectedService);

  return (
    <Stack gap="md">
      {!selectedService && (
        <Alert color="yellow" variant="light">
          {services.length === 0
            ? 'Todavía no creaste ningún servicio. Creá tu primer servicio para empezar a recibir turnos.'
            : 'Selecciona un servicio desde el sidebar para editar su configuración principal.'}
        </Alert>
      )}

      {selectedService && (
        <PageCard>
          <BusinessProfileForm service={selectedService} />
        </PageCard>
      )}
    </Stack>
  );
}
