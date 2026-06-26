import {
  faCalendarCheck,
  faCheck,
  faClock,
  faClockRotateLeft,
  faUsers,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { PATHS } from 'app/router/PATHS';
import { Link } from 'react-router-dom';

import { HeroProductMock, SectionHeader } from './components';
import classes from './home-page.module.css';

const HOME_CONTAINER_SIZE = 'var(--app-layout-max-width)';

interface FeatureCardData {
  title: string;
  description: string;
  icon: IconDefinition;
  accent: string;
  points: string[];
}

const featureCards: FeatureCardData[] = [
  {
    title: 'Operacion de turnos',
    description: 'Alta, edicion, cambios de estado y lectura rapida de la jornada actual.',
    icon: faCalendarCheck,
    accent: 'brand',
    points: ['Crear y editar', 'Ver estado por turno'],
  },
  {
    title: 'Horarios y excepciones',
    description: 'Agenda base del servicio con bloqueos puntuales y disponibilidad clara.',
    icon: faClock,
    accent: 'info',
    points: ['Franja por dia', 'Bloqueos manuales'],
  },
  {
    title: 'Equipo y permisos',
    description: 'Gestiona secretarios, servicios asignados y acceso operativo.',
    icon: faUsers,
    accent: 'success',
    points: ['Equipo por servicio', 'Permisos por accion'],
  },
  {
    title: 'Historial del negocio',
    description: 'Consulta actividad y senales utiles para entender el servicio.',
    icon: faClockRotateLeft,
    accent: 'violetAccent',
    points: ['Historico filtrable', 'Metricas del periodo'],
  },
];

export function HomePage() {
  return (
    <Box className={classes.page}>
      <section className={classes.heroSection}>
        <Container size={HOME_CONTAINER_SIZE}>
          <div className={classes.heroGrid}>
            <Stack gap="lg" className={classes.heroCopy}>
              <Stack gap="sm">
                <Title order={1} className={classes.heroTitle}>
                  Turnos, agenda y equipo en un mismo lugar.
                </Title>

                <Text size="md" className={classes.heroDescription}>
                  Bookly organiza horarios, excepciones y trabajo diario sin depender de planillas
                  ni mensajes sueltos.
                </Text>
              </Stack>

              <Group gap="sm" className={classes.heroActions}>
                <Button
                  component={Link}
                  to={PATHS.auth.register}
                  size="lg"
                  className={classes.primaryButton}
                >
                  Empezar ahora
                </Button>
              </Group>
            </Stack>

            <HeroProductMock />
          </div>
        </Container>
      </section>

      <div className={classes.heroTransition} aria-hidden="true" />

      <section className={classes.featuresSection}>
        <Container size={HOME_CONTAINER_SIZE}>
          <Stack gap="md" className={classes.featuresContent}>
            <SectionHeader
              title="Una agenda mas clara para operar."
              description="Cuatro bloques concentran lo importante: turnos, disponibilidad, equipo y lectura del negocio."
            />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" className={classes.featureGrid}>
              {featureCards.map((item) => (
                <Paper key={item.title} p="md" radius="lg" className={classes.featureSurface}>
                  <Stack gap="sm" h="100%">
                    <ThemeIcon color={item.accent} variant="light" radius="md" size={44}>
                      <FontAwesomeIcon icon={item.icon} />
                    </ThemeIcon>

                    <Stack gap={6}>
                      <Text fw={700} size="lg" className={classes.featureTitle}>
                        {item.title}
                      </Text>
                      <Text size="sm" className={classes.featureDescription}>
                        {item.description}
                      </Text>
                    </Stack>

                    <Stack gap="xs" mt="auto">
                      {item.points.map((point) => (
                        <div key={point} className={classes.featurePoint}>
                          <ThemeIcon color={item.accent} variant="light" radius="xl" size={24}>
                            <FontAwesomeIcon icon={faCheck} />
                          </ThemeIcon>
                          <Text size="sm">{point}</Text>
                        </div>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      <section className={classes.ctaSection}>
        <Container size={HOME_CONTAINER_SIZE}>
          <Paper radius="lg" className={classes.finalCta}>
            <Group gap="md" justify="space-between" align="center" className={classes.finalLayout}>
              <Title order={2} className={classes.finalTitle}>
                Organizar mi agenda
              </Title>

              <Group gap="sm" justify="flex-end" align="center" className={classes.finalActions}>
                <Button
                  component={Link}
                  to={PATHS.auth.register}
                  size="lg"
                  className={classes.primaryButton}
                >
                  Empezar ahora
                </Button>
              </Group>
            </Group>
          </Paper>
        </Container>
      </section>
    </Box>
  );
}
