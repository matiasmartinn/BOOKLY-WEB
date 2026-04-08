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
import {
  faCalendarCheck,
  faCheck,
  faClock,
  faClockRotateLeft,
  faPlus,
  faUsers,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    description: 'Agenda, reprograma y sigue el estado de cada reserva.',
    icon: faCalendarCheck,
    accent: 'brand',
    points: ['Altas rapidas', 'Estados visibles'],
  },
  {
    title: 'Agenda real',
    description: 'Controla horarios base, bloqueos y excepciones sin perder contexto.',
    icon: faClock,
    accent: 'info',
    points: ['Horarios', 'Excepciones'],
  },
  {
    title: 'Equipo conectado',
    description: 'Asigna secretarios y organiza permisos por servicio.',
    icon: faUsers,
    accent: 'success',
    points: ['Permisos', 'Cobertura'],
  },
  {
    title: 'Seguimiento continuo',
    description: 'Consulta actividad, historico y metricas del negocio.',
    icon: faClockRotateLeft,
    accent: 'violetAccent',
    points: ['Historico', 'Metricas'],
  },
];

const steps = [
  {
    step: '01',
    title: 'Crea tu servicio',
    description: 'Define el servicio principal y ordena la operacion desde una base comun.',
  },
  {
    step: '02',
    title: 'Configura agenda y equipo',
    description: 'Carga horarios, excepciones y personas que participan del dia a dia.',
  },
  {
    step: '03',
    title: 'Empieza a gestionar turnos',
    description: 'Trabaja con reservas, seguimiento e informacion del negocio en un solo flujo.',
  },
];

const featureCards: FeatureCardData[] = [
  {
    title: 'Operacion de turnos',
    description: 'Alta, edicion, cambios de estado y lectura rapida de la jornada actual.',
    icon: faCalendarCheck,
    accent: 'brand',
    points: ['Crear y editar', 'Ver estado por turno', 'Trabajar por dia'],
  },
  {
    title: 'Horarios y excepciones',
    description:
      'Agenda base del servicio con bloqueos puntuales, vacaciones e indisponibilidades.',
    icon: faClock,
    accent: 'info',
    points: ['Franja por dia', 'Bloqueos manuales', 'Disponibilidad clara'],
  },
  {
    title: 'Equipo y permisos',
    description: 'Gestiona secretarios, servicios asignados y acceso segun la necesidad operativa.',
    icon: faUsers,
    accent: 'success',
    points: ['Equipo por servicio', 'Permisos por accion', 'Cobertura ordenada'],
  },
  {
    title: 'Historial y lectura del negocio',
    description:
      'Sigue actividad, historial de turnos y senales para entender como viene el servicio.',
    icon: faClockRotateLeft,
    accent: 'violetAccent',
    points: ['Historico filtrable', 'Actividad del servicio', 'Metricas del periodo'],
  },
];

export function HomePage() {
  return (
    <Box className={classes.page}>
      <section className={classes.heroSection}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: 'xl', lg: 56 }}>
            <Stack gap="xl" className={classes.heroCopy}>
              <Badge variant="light" color="brand" radius="xl" className={classes.heroBadge}>
                Gestion de turnos para servicios que necesitan orden real
              </Badge>

              <Stack gap="lg">
                <Title order={1} className={classes.heroTitle}>
                  Turnos, agenda y equipo en un mismo lugar.
                </Title>

                <Text size="xl" c="dimmed" className={classes.heroDescription}>
                  Bookly te ayuda a organizar horarios, manejar excepciones, coordinar secretarios y
                  seguir la operacion diaria sin depender de planillas ni mensajes sueltos.
                </Text>
              </Stack>

              <Group gap="sm" className={classes.heroActions}>
                <Button component={Link} to={PATHS.auth.register} color="brand" size="lg">
                  Crear cuenta
                </Button>
                <Button component={Link} to={PATHS.auth.login} variant="default" size="lg">
                  Iniciar sesion
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {heroSignals.map((item) => (
                  <Paper key={item.title} p="md" radius="xl" className={classes.signalCard}>
                    <Group align="flex-start" wrap="nowrap">
                      <ThemeIcon color={item.accent} variant="light" radius="lg" size={42}>
                        <FontAwesomeIcon icon={item.icon} />
                      </ThemeIcon>

                      <Stack gap={4}>
                        <Text fw={700}>{item.title}</Text>
                        <Text size="sm" c="dimmed">
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
          <Stack gap="xl">
            <SectionHeader
              eyebrow="Beneficios principales"
              title="Lo importante del negocio queda visible y ordenado."
              description="Bookly apunta a la operacion real del servicio: organizar reservas, cuidar la agenda y coordinar el trabajo diario."
            />

            <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
              {heroSignals.map((item) => (
                <Paper key={item.title} p="lg" radius="xl" className={classes.featureSurface}>
                  <Stack gap="md">
                    <ThemeIcon color={item.accent} variant="light" radius="lg" size={46}>
                      <FontAwesomeIcon icon={item.icon} />
                    </ThemeIcon>

                    <Stack gap={6}>
                      <Text fw={700} size="lg">
                        {item.title}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.description}
                      </Text>
                    </Stack>

                    <Group gap={8}>
                      {item.points.map((point) => (
                        <Badge key={point} variant="light" color={item.accent} radius="xl">
                          {point}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      <section className={classes.section}>
        <Container size="lg">
          <Stack gap="xl">
            <SectionHeader
              eyebrow="Funcionalidades destacadas"
              title="Bookly resuelve la agenda operativa y tambien la lectura del negocio."
              description="Cada bloque esta pensado para bajar friccion en el dia a dia y dejar informacion util para decidir mejor."
            />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {featureCards.map((item) => (
                <Paper key={item.title} p="lg" radius="xl" className={classes.detailCard}>
                  <Stack gap="lg">
                    <Group justify="space-between" align="flex-start" wrap="wrap">
                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        <ThemeIcon color={item.accent} variant="light" radius="lg" size={44}>
                          <FontAwesomeIcon icon={item.icon} />
                        </ThemeIcon>

                        <Stack gap={4}>
                          <Text fw={700} size="lg">
                            {item.title}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {item.description}
                          </Text>
                        </Stack>
                      </Group>

                      <Badge variant="light" color={item.accent} radius="xl">
                        Bookly
                      </Badge>
                    </Group>

                    <Stack gap="xs">
                      {item.points.map((point) => (
                        <div key={point} className={classes.featurePoint}>
                          <ThemeIcon color={item.accent} variant="light" radius="xl" size={26}>
                            <FontAwesomeIcon icon={faCheck} />
                          </ThemeIcon>
                          <Text size="sm">{point}</Text>
                        </div>
                      ))}
                    </Stack>

                    <div className={classes.inlinePreview}>
                      <div className={classes.inlinePreviewHeader}>
                        <Text fw={700} size="sm">
                          Vista rapida
                        </Text>
                        <div className={classes.inlinePreviewAction}>
                          <FontAwesomeIcon icon={faPlus} />
                        </div>
                      </div>

                      <div className={classes.inlinePreviewRows}>
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      <section className={classes.section}>
        <Container size="lg">
          <Paper p={{ base: 'xl', md: 'xl' }} radius="xl" className={classes.finalCta}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="md">
                <Badge variant="light" color="brand" radius="xl" className={classes.finalBadge}>
                  Empieza con Bookly
                </Badge>
                <Title order={2} className={classes.finalTitle}>
                  Centraliza turnos, agenda y equipo antes de que el dia se desordene.
                </Title>
                <Text size="lg" className={classes.finalText}>
                  Crea tu cuenta para configurar tu servicio y comenzar a trabajar con una agenda
                  mas clara desde el primer dia.
                </Text>
              </Stack>

              <Stack gap="sm" justify="center" align="flex-start" className={classes.finalActions}>
                <Button component={Link} to={PATHS.auth.register} color="brand" size="lg">
                  Registrarse
                </Button>
                <Button component={Link} to={PATHS.auth.login} variant="default" size="lg">
                  Iniciar sesion
                </Button>
              </Stack>
            </SimpleGrid>
          </Paper>
        </Container>
      </section>
    </Box>
  );
}
