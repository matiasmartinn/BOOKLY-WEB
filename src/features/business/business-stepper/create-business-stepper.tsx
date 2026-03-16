import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  SimpleGrid,
  SegmentedControl,
  Badge,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faGear,
  faCalendarDays,
  faArrowLeft,
  faArrowRight,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

// ─── Types ───────────────────────────────────────────────────────────────────

type Direction = 'forward' | 'backward';

interface StepDef {
  key: string;
  label: string;
  icon: React.ReactNode;
}

// ─── Step definitions ────────────────────────────────────────────────────────

const STEPS: StepDef[] = [
  { key: 'tipo', label: 'Tipo', icon: <FontAwesomeIcon icon={faLayerGroup} /> },
  { key: 'servicio', label: 'Servicio', icon: <FontAwesomeIcon icon={faGear} /> },
  { key: 'schedule', label: 'Schedule', icon: <FontAwesomeIcon icon={faCalendarDays} /> },
];

// ─── StepperHeader ───────────────────────────────────────────────────────────

function StepperHeader({
  steps,
  active,
  onStepClick,
}: {
  steps: StepDef[];
  active: number;
  onStepClick: (i: number) => void;
}) {
  const progress = (active / (steps.length - 1)) * 100;

  return (
    <Box style={{ position: 'relative' }}>
      {/* Track line */}
      <Box
        style={{
          position: 'absolute',
          top: 19,
          left: '16.66%',
          right: '16.66%',
          height: 2,
          background: 'var(--mantine-color-gray-2)',
          zIndex: 0,
        }}
      />
      {/* Progress line */}
      <Box
        style={{
          position: 'absolute',
          top: 19,
          left: '16.66%',
          width: `${(100 - 33.33) * (progress / 100)}%`,
          height: 2,
          background: 'var(--mantine-color-brand-6, var(--mantine-color-blue-6))',
          transition: 'width 320ms cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1,
        }}
      />

      {/* Step nodes */}
      <Group justify="space-between" style={{ position: 'relative', zIndex: 2 }}>
        {steps.map((step, i) => {
          const isDone = i < active;
          const isCurrent = i === active;
          const isReachable = i <= active;

          return (
            <Stack
              key={step.key}
              align="center"
              gap={8}
              style={{
                flex: 1,
                cursor: isReachable ? 'pointer' : 'default',
                userSelect: 'none',
              }}
              onClick={() => isReachable && onStepClick(i)}
            >
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
                  background:
                    isDone || isCurrent
                      ? 'var(--mantine-color-brand-6, var(--mantine-color-blue-6))'
                      : 'white',
                  color: isDone || isCurrent ? '#fff' : 'var(--mantine-color-gray-4)',
                  border: isCurrent
                    ? '2px solid var(--mantine-color-brand-7, var(--mantine-color-blue-7))'
                    : isDone
                      ? '2px solid var(--mantine-color-brand-6, var(--mantine-color-blue-6))'
                      : '2px solid var(--mantine-color-gray-3)',
                  boxShadow: isCurrent
                    ? '0 0 0 5px color-mix(in srgb, var(--mantine-color-brand-5, var(--mantine-color-blue-5)) 15%, transparent)'
                    : 'none',
                }}
              >
                {isDone ? <FontAwesomeIcon icon={faCheck} style={{ fontSize: 12 }} /> : step.icon}
              </Box>

              <Text
                size="xs"
                fw={isCurrent ? 600 : 400}
                c={isCurrent ? 'dark.7' : 'dimmed'}
                style={{ transition: 'all 260ms ease' }}
              >
                {step.label}
              </Text>
            </Stack>
          );
        })}
      </Group>
    </Box>
  );
}

// ─── Step content components ─────────────────────────────────────────────────

function Step1Tipo() {
  const [tipo, setTipo] = useState('presencial');
  return (
    <Stack gap="lg">
      <Box>
        <Text size="sm" fw={500} mb={6} c="dimmed">
          Modalidad
        </Text>
        <SegmentedControl
          fullWidth
          value={tipo}
          onChange={setTipo}
          data={[
            { label: 'Presencial', value: 'presencial' },
            { label: 'Virtual', value: 'virtual' },
            { label: 'Híbrido', value: 'hibrido' },
          ]}
        />
      </Box>
      <SimpleGrid cols={2} spacing="md">
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Categoría
          </Text>
          <Select
            placeholder="Seleccioná una categoría"
            data={['Consultoría', 'Desarrollo', 'Diseño', 'Marketing', 'Otro']}
          />
        </Box>
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Subcategoría
          </Text>
          <Select placeholder="Seleccioná" data={['Individual', 'Grupal', 'Corporativo']} />
        </Box>
      </SimpleGrid>
      <Box>
        <Text size="sm" fw={500} mb={6} c="dimmed">
          Etiquetas
        </Text>
        <Group gap={6}>
          {['Frontend', 'React', 'UX'].map((tag) => (
            <Badge key={tag} variant="light" size="sm" style={{ cursor: 'pointer' }}>
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" size="sm" style={{ cursor: 'pointer' }}>
            + Agregar
          </Badge>
        </Group>
      </Box>
    </Stack>
  );
}

function Step2Servicio() {
  return (
    <Stack gap="lg">
      <SimpleGrid cols={2} spacing="md">
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Nombre del servicio
          </Text>
          <TextInput placeholder="ej: Consultoría estratégica" />
        </Box>
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Precio
          </Text>
          <NumberInput placeholder="0.00" prefix="$" decimalScale={2} />
        </Box>
      </SimpleGrid>
      <Box>
        <Text size="sm" fw={500} mb={6} c="dimmed">
          Descripción
        </Text>
        <Textarea
          placeholder="Describí el servicio, qué incluye y qué beneficios ofrece..."
          minRows={3}
          autosize
        />
      </Box>
      <SimpleGrid cols={2} spacing="md">
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Duración por sesión
          </Text>
          <Select
            placeholder="Seleccioná"
            data={['30 min', '45 min', '60 min', '90 min', '120 min']}
          />
        </Box>
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Capacidad máxima
          </Text>
          <NumberInput placeholder="ej: 10" min={1} />
        </Box>
      </SimpleGrid>
    </Stack>
  );
}

function Step3Schedule() {
  const [freq, setFreq] = useState('semanal');
  return (
    <Stack gap="lg">
      <Box>
        <Text size="sm" fw={500} mb={6} c="dimmed">
          Frecuencia
        </Text>
        <SegmentedControl
          fullWidth
          value={freq}
          onChange={setFreq}
          data={[
            { label: 'Diaria', value: 'diaria' },
            { label: 'Semanal', value: 'semanal' },
            { label: 'Mensual', value: 'mensual' },
            { label: 'A demanda', value: 'demanda' },
          ]}
        />
      </Box>
      <SimpleGrid cols={2} spacing="md">
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Zona horaria
          </Text>
          <Select
            placeholder="Seleccioná tu zona"
            data={[
              'America/Buenos_Aires (GMT-3)',
              'America/New_York (GMT-5)',
              'Europe/Madrid (GMT+1)',
            ]}
          />
        </Box>
        <Box>
          <Text size="sm" fw={500} mb={6} c="dimmed">
            Anticipación mínima
          </Text>
          <Select
            placeholder="Tiempo previo"
            data={['Sin anticipación', '1 hora', '24 horas', '48 horas', '1 semana']}
          />
        </Box>
      </SimpleGrid>
      <Box>
        <Text size="sm" fw={500} mb={6} c="dimmed">
          Días disponibles
        </Text>
        <Group gap={6}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <Badge
              key={d}
              variant={['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].includes(d) ? 'filled' : 'light'}
              size="md"
              style={{ cursor: 'pointer', minWidth: 44, textAlign: 'center' }}
            >
              {d}
            </Badge>
          ))}
        </Group>
      </Box>
    </Stack>
  );
}

function StepCompleted() {
  return (
    <Stack align="center" gap="md" py="xl">
      <Box
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--mantine-color-brand-6, var(--mantine-color-blue-6))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 22,
        }}
      >
        <FontAwesomeIcon icon={faCheck} />
      </Box>
      <Title order={4}>¡Servicio creado!</Title>
      <Text size="sm" c="dimmed" ta="center" maw={300}>
        Tu servicio fue configurado correctamente. Ya podés compartirlo o ajustarlo desde el panel.
      </Text>
    </Stack>
  );
}

const STEP_CONTENTS = [Step1Tipo, Step2Servicio, Step3Schedule];

// ─── AnimatedStepContent ─────────────────────────────────────────────────────
// Two-phase animation: exit (current slides out) → enter (next slides in).
// Direction determines which way content slides.

const DURATION = 190;

function AnimatedStepContent({
  stepIndex,
  direction,
  isCompleted,
}: {
  stepIndex: number;
  direction: Direction;
  isCompleted: boolean;
}) {
  // What is currently rendered on screen
  const [displayIndex, setDisplayIndex] = useState(stepIndex);
  const [displayCompleted, setDisplayCompleted] = useState(isCompleted);

  // Animation phase
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');

  // Keep latest incoming values for when the timeout fires
  const pending = useRef({ stepIndex, isCompleted, direction });
  pending.current = { stepIndex, isCompleted, direction };

  useEffect(() => {
    if (stepIndex === displayIndex && isCompleted === displayCompleted) return;

    setPhase('exit');

    const t1 = setTimeout(() => {
      // Swap to new content while invisible, then trigger enter
      setDisplayIndex(pending.current.stepIndex);
      setDisplayCompleted(pending.current.isCompleted);

      // Force a reflow so the browser picks up the "enter" starting position
      // before the transition starts (requestAnimationFrame trick)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('enter');

          const t2 = setTimeout(() => setPhase('idle'), DURATION + 10);
          return () => clearTimeout(t2);
        });
      });
    }, DURATION);

    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, isCompleted]);

  const exitX = direction === 'forward' ? -28 : 28;
  const enterX = direction === 'forward' ? 28 : -28;

  const style: React.CSSProperties =
    phase === 'exit'
      ? {
          opacity: 0,
          transform: `translateX(${exitX}px)`,
          transition: `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`,
          pointerEvents: 'none',
        }
      : phase === 'enter'
        ? {
            // Start position — no transition so it snaps instantly
            opacity: 0,
            transform: `translateX(${enterX}px)`,
            transition: 'none',
          }
        : {
            // Idle: fully visible, no offset
            opacity: 1,
            transform: 'translateX(0)',
            transition: `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`,
          };

  const Content = displayCompleted
    ? StepCompleted
    : (STEP_CONTENTS[displayIndex] ?? STEP_CONTENTS[0]);

  return (
    <Box style={{ ...style, willChange: 'opacity, transform' }}>
      <Content />
    </Box>
  );
}

// ─── StepperNavigation ───────────────────────────────────────────────────────

function StepperNavigation({
  active,
  total,
  isCompleted,
  onPrev,
  onNext,
}: {
  active: number;
  total: number;
  isCompleted: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const isLast = active === total - 1;

  return (
    <Group justify="space-between">
      <Button
        variant="subtle"
        color="gray"
        leftSection={<FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 11 }} />}
        onClick={onPrev}
        style={{
          opacity: active === 0 || isCompleted ? 0 : 1,
          pointerEvents: active === 0 || isCompleted ? 'none' : 'auto',
          transition: 'opacity 200ms',
        }}
      >
        Volver
      </Button>

      {!isCompleted && (
        <Button
          rightSection={
            isLast ? (
              <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11 }} />
            ) : (
              <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
            )
          }
          onClick={onNext}
        >
          {isLast ? 'Completar' : 'Continuar'}
        </Button>
      )}
    </Group>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export function CreateBusinessStepper() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<Direction>('forward');

  const isCompleted = active === STEPS.length;

  const nextStep = () => {
    if (active >= STEPS.length) return;
    setDirection('forward');
    setActive((c) => c + 1);
  };

  const prevStep = () => {
    if (active <= 0) return;
    setDirection('backward');
    setActive((c) => c - 1);
  };

  const goToStep = (i: number) => {
    if (i === active) return;
    setDirection(i > active ? 'forward' : 'backward');
    setActive(i);
  };

  return (
    <Box maw={560} mx="auto" py="xl" px="md">
      <Stack gap={32}>
        {/* Título y progreso */}
        <Box>
          <Title order={3} fw={700} mb={2}>
            Crear servicio
          </Title>
          <Text size="sm" c="dimmed">
            {isCompleted ? '¡Listo!' : `Paso ${active + 1} de ${STEPS.length}`}
          </Text>
        </Box>

        {/* Header con línea de progreso y nodos */}
        {!isCompleted && <StepperHeader steps={STEPS} active={active} onStepClick={goToStep} />}

        {/* Contenido con animación slide+fade */}
        <Box mih={230} style={{ overflow: 'hidden' }}>
          <AnimatedStepContent
            stepIndex={Math.min(active, STEPS.length - 1)}
            direction={direction}
            isCompleted={isCompleted}
          />
        </Box>

        {/* Botones de navegación */}
        <StepperNavigation
          active={active}
          total={STEPS.length}
          isCompleted={isCompleted}
          onPrev={prevStep}
          onNext={nextStep}
        />
      </Stack>
    </Box>
  );
}
