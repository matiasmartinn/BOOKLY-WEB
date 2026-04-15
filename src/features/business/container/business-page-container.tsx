import { Alert, Badge, Group, Stack, Text } from '@mantine/core';
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

              <Badge
                color={selectedService.isActive ? 'green' : 'yellow'}
                variant="light"
                size="lg"
                radius="sm"
              >
                {selectedService.isActive ? 'Servicio activo' : 'Servicio inactivo'}
              </Badge>
            </Group>

            <BusinessProfileForm service={selectedService} />
          </Stack>
        </PageCard>
      )}
    </Stack>
  );
}
