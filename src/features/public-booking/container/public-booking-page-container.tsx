import {
  Anchor,
  Badge,
  Container,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PublicBookingForm, PublicBookingStatusView } from '../components';
import { usePublicService } from '../hooks';
import type { PublicBookingProblemState } from '../types/public-booking';
import { getPublicBookingProblemState, resolvePublicBookingProblemState } from '../utils';

const getModeLabel = (mode: string) => {
  switch (mode.trim().toLowerCase()) {
    case 'online':
      return 'Online';
    case 'presence':
      return 'Presencial';
    case 'hybrid':
      return 'Hibrido';
    default:
      return mode;
  }
};

function PublicBookingSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
      <Paper p={{ base: 'lg', sm: 'xl' }} radius="xl" withBorder>
        <Stack gap="md">
          <Skeleton h={26} w={120} radius="xl" />
          <Skeleton h={32} radius="md" />
          <Skeleton h={18} radius="md" />
          <Skeleton h={18} radius="md" />
          <Skeleton h={120} radius="lg" />
        </Stack>
      </Paper>

      <Paper p={{ base: 'lg', sm: 'xl' }} radius="xl" withBorder>
        <Stack gap="md">
          <Skeleton h={28} radius="md" />
          <Skeleton h={42} radius="md" />
          <Skeleton h={42} radius="md" />
          <Skeleton h={42} radius="md" />
          <Skeleton h={180} radius="lg" />
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}

export function PublicBookingPageContainer() {
  const { slug, token } = useParams<{ slug: string; token: string }>();
  const [terminalState, setTerminalState] = useState<PublicBookingProblemState | null>(null);
  const invalidAccessState = useMemo(() => getPublicBookingProblemState('invalid-access'), []);

  const serviceQuery = usePublicService(slug, token);
  const initialProblem = useMemo(
    () => resolvePublicBookingProblemState(serviceQuery.error),
    [serviceQuery.error],
  );
  const resolvedProblem = terminalState ?? initialProblem;

  useEffect(() => {
    setTerminalState(null);
  }, [slug, token]);

  if (!slug || !token) {
    return (
      <Container size="sm">
        <PublicBookingStatusView
          title={invalidAccessState.title}
          description={invalidAccessState.description}
          supportingText={invalidAccessState.supportingText}
        />
      </Container>
    );
  }

  if (resolvedProblem) {
    return (
      <Container size="sm">
        <PublicBookingStatusView
          title={resolvedProblem.title}
          description={resolvedProblem.description}
          supportingText={resolvedProblem.supportingText}
        />
      </Container>
    );
  }

  if (serviceQuery.isLoading) {
    return (
      <Container size="xl">
        <PublicBookingSkeleton />
      </Container>
    );
  }

  if (serviceQuery.isError || !serviceQuery.data) {
    return (
      <Container size="sm">
        <PublicBookingStatusView
          title="No pudimos cargar la reserva"
          description="Hubo un problema al preparar la informacion del servicio."
          supportingText="Intenta nuevamente en unos minutos."
          onAction={() => {
            setTerminalState(null);
            void serviceQuery.refetch();
          }}
        />
      </Container>
    );
  }

  const service = serviceQuery.data;
  const locationLabel = [service.placeName, service.address].filter(Boolean).join(' / ');

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Stack gap="sm" maw={760}>
          <Title order={1}>Agenda tu turno</Title>

          <Text size="lg" c="dimmed">
            Revisa los datos del servicio, elige una fecha disponible y confirma tu reserva en pocos
            pasos.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          <Paper
            p={{ base: 'lg', sm: '2rem' }}
            radius="xl"
            withBorder
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.98) 100%)',
              boxShadow: '0 22px 46px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Stack gap="lg">
              <Stack gap="sm">
                <Badge
                  color="brand"
                  variant="light"
                  radius="xl"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Servicio compartido
                </Badge>

                <Stack gap={6}>
                  <Title order={2}>{service.name}</Title>
                </Stack>
              </Stack>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {service.ownerName ? (
                  <Stack gap={4}>
                    <Text
                      size="xs"
                      fw={700}
                      c="dimmed"
                      style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                      Responsable
                    </Text>
                    <Text fw={600}>{service.ownerName}</Text>
                  </Stack>
                ) : null}

                <Stack gap={4}>
                  <Text
                    size="xs"
                    fw={700}
                    c="dimmed"
                    style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    Duracion
                  </Text>
                  <Text fw={600}>{service.durationMinutes} min</Text>
                </Stack>

                <Stack gap={4}>
                  <Text
                    size="xs"
                    fw={700}
                    c="dimmed"
                    style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    Modalidad
                  </Text>
                  <Text fw={600}>{getModeLabel(service.mode)}</Text>
                </Stack>

                {service.price != null ? (
                  <Stack gap={4}>
                    <Text
                      size="xs"
                      fw={700}
                      c="dimmed"
                      style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                      Precio
                    </Text>
                    <Text fw={600}>${service.price}</Text>
                  </Stack>
                ) : null}

                {locationLabel ? (
                  <Stack gap={4}>
                    <Text
                      size="xs"
                      fw={700}
                      c="dimmed"
                      style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                      Ubicacion
                    </Text>
                    <Text fw={600}>{locationLabel}</Text>
                  </Stack>
                ) : null}
              </SimpleGrid>

              {service.googleMapsUrl ? (
                <div>
                  <Anchor href={service.googleMapsUrl} target="_blank" rel="noreferrer" fw={600}>
                    Ver ubicacion en Google Maps
                  </Anchor>
                </div>
              ) : null}
            </Stack>
          </Paper>

          <Paper
            p={{ base: 'lg', sm: '2rem' }}
            radius="xl"
            withBorder
            style={{
              backgroundColor: 'white',
              boxShadow: '0 22px 46px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Stack gap="lg">
              <Stack gap={4}>
                <Title order={2}>Reserva tu turno</Title>
              </Stack>

              <PublicBookingForm
                service={service}
                slug={slug}
                token={token}
                onTerminalError={setTerminalState}
              />
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
