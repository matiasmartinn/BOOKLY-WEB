import { Alert, Badge, Button, Group, Stack, Text } from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { useNavigate } from 'react-router-dom';
import { PageCard } from 'shared/layout';
import { useBusinessStore } from 'store/use-business-store';

import { BusinessProfileForm } from '../components/business-profile-form';

export function BusinessPageContainer() {
  const navigate = useNavigate();
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
          <Stack gap="xl">
            <Group
              justify="space-between"
              align="flex-start"
              wrap="wrap"
              gap="md"
              p="lg"
              style={{
                borderRadius: 'var(--mantine-radius-xl)',
                background:
                  'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0.88) 100%)',
                border: '1px solid var(--app-color-brand-outline)',
              }}
            >
              <Stack gap={6} maw={620}>
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.08em',
                    color: 'var(--mantine-color-brand-6)',
                  }}
                >
                  Configuracion principal
                </Text>

                <Text
                  fw={700}
                  size="xl"
                  style={{
                    color: 'var(--app-color-text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Datos del servicio
                </Text>
              </Stack>

              <Group gap="sm" wrap="wrap" justify="flex-end">
                <Badge
                  color={selectedService.isActive ? 'green' : 'yellow'}
                  variant="light"
                  size="lg"
                  radius="sm"
                >
                  {selectedService.isActive ? 'Servicio activo' : 'Servicio inactivo'}
                </Badge>

                <Button
                  variant="light"
                  onClick={() =>
                    navigate(
                      PATHS.dashboard.servicePublicBooking.replace(
                        ':serviceId',
                        String(selectedService.id),
                      ),
                    )
                  }
                >
                  Gestionar reserva publica
                </Button>
              </Group>
            </Group>

            <BusinessProfileForm service={selectedService} />
          </Stack>
        </PageCard>
      )}
    </Stack>
  );
}
