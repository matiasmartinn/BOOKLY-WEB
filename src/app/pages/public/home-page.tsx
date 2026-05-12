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
  Badge,
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

interface FeatureCardData {
  title: string;
  description: string;
  icon: IconDefinition;
  accent: string;
  points: string[];
}

const heroSignals: FeatureCardData[] = [
  {
    title: 'Turnos al dia',
    description: 'Agenda, reprograma y sigue cada reserva sin perder contexto.',
    icon: faCalendarCheck,
    accent: 'brand',
    points: ['Altas rapidas', 'Estados visibles'],
  },
  {
    title: 'Agenda real',
    description: 'Horarios base, bloqueos y excepciones dentro del mismo flujo.',
    icon: faClock,
    accent: 'info',
    points: ['Horarios', 'Excepciones'],
  },
  {
    title: 'Equipo conectado',
    description: 'Secretarios y permisos ordenados por servicio.',
    icon: faUsers,
    accent: 'success',
    points: ['Permisos', 'Cobertura'],
  },
  {
    title: 'Lectura continua',
    description: 'Actividad, historial y metricas para seguir la operacion.',
    icon: faClockRotateLeft,
    accent: 'violetAccent',
    points: ['Historico', 'Metricas'],
  },
];

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
        <Container size="lg">
          <SimpleGrid
            cols={{ base: 1, lg: 2 }}
            spacing={{ base: 'xl', lg: 52 }}
            className={classes.heroGrid}
          >
            <Stack gap="lg" className={classes.heroCopy}>
              <Badge variant="outline" radius="xl" className={classes.heroBadge}>
                Gestion de turnos con foco operativo
              </Badge>

              <Stack gap="md">
                <Title order={1} className={classes.heroTitle}>
                  Turnos, agenda y equipo en un mismo lugar.
                </Title>

                <Text size="lg" className={classes.heroDescription}>
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
                  Crear cuenta
                </Button>
                <Button
                  component={Link}
                  to={PATHS.auth.login}
                  variant="outline"
                  size="lg"
                  className={classes.secondaryButton}
                >
                  Iniciar sesion
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" className={classes.signalGrid}>
                {heroSignals.map((item) => (
                  <Paper key={item.title} p="md" radius="lg" className={classes.signalCard}>
                    <Group align="flex-start" wrap="nowrap">
                      <ThemeIcon color={item.accent} variant="light" radius="md" size={40}>
                        <FontAwesomeIcon icon={item.icon} />
                      </ThemeIcon>
                      <Stack gap={4}>
                        <Text fw={700} className={classes.signalTitle}>
                          {item.title}
                        </Text>
                        <Text size="sm" className={classes.signalDesc}>
                          {item.description}
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>

            <HeroProductMock />
          </SimpleGrid>
        </Container>
      </section>

      <section className={classes.section}>
        <Container size="lg">
          <Stack gap="lg">
            <SectionHeader
              eyebrow="Producto"
              title="Una agenda mas clara para trabajar con menos friccion."
              description="Cuatro bloques concentran lo importante: turnos, disponibilidad, equipo y lectura del negocio."
            />

            <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
              {featureCards.map((item) => (
                <Paper key={item.title} p="lg" radius="lg" className={classes.featureSurface}>
                  <Stack gap="md" h="100%">
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
        <Container size="lg">
          <Paper radius="lg" className={classes.finalCta}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'lg', md: 36 }}>
              <Stack gap={8}>
                <Badge variant="outline" radius="xl" className={classes.finalBadge}>
                  Empieza con Bookly
                </Badge>
                <Title order={2} className={classes.finalTitle}>
                  Ordena la agenda antes de que el dia se disperse.
                </Title>
                <Text className={classes.finalText}>
                  Configura tu servicio y empieza con una operacion mas clara.
                </Text>
              </Stack>

              <Group gap="sm" justify="flex-end" align="center" className={classes.finalActions}>
                <Button
                  component={Link}
                  to={PATHS.auth.register}
                  size="lg"
                  className={classes.primaryButton}
                >
                  Registrarse
                </Button>
                <Button
                  component={Link}
                  to={PATHS.auth.login}
                  variant="outline"
                  size="lg"
                  className={classes.secondaryButton}
                >
                  Iniciar sesion
                </Button>
              </Group>
            </SimpleGrid>
          </Paper>
        </Container>
      </section>
    </Box>
  );
}
