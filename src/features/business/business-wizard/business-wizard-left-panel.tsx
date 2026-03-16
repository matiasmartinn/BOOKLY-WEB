import { Box, Group, ScrollArea, Stack, ThemeIcon, Text, Badge } from '@mantine/core';
import { StepIndicator, WizardProgress, type WizardStep } from './components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';

interface WizardLeftPanelProps {
  steps: WizardStep[];
  activeIndex: number;
  summaries: Record<string, { label: string; value: string }[]>;
  onStepClick: (index: number) => void;
}

export function WizardLeftPanel({
  steps,
  activeIndex,
  summaries,
  onStepClick,
}: WizardLeftPanelProps) {
  return (
    <Box
      w={340}
      style={{
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        background: 'linear-gradient(180deg, #1f245c 0%, #232968 55%, #2a2f78 100%)',
      }}
    >
      <ScrollArea style={{ flex: 1 }} px="xl" py="xl">
        <Stack gap="xl" h="100%">
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Group gap={12}>
                <ThemeIcon
                  size={42}
                  radius="md"
                  variant="filled"
                  color="white"
                  style={{ color: 'var(--mantine-color-brand-7)' }}
                >
                  <FontAwesomeIcon icon={faStore} style={{ fontSize: 16 }} />
                </ThemeIcon>

                <Stack gap={2}>
                  <Text
                    fw={800}
                    size="xl"
                    c="white"
                    style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
                  >
                    Bookly
                  </Text>
                  <Badge
                    variant="white"
                    color="gray"
                    radius="xl"
                    styles={{
                      root: {
                        background: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'white',
                      },
                    }}
                  >
                    Paso {activeIndex + 1} de {steps.length}
                  </Badge>
                </Stack>
              </Group>
            </Group>

            <Stack gap={8}>
              <Text
                fw={800}
                size="2rem"
                c="white"
                style={{ lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                Creando tu agenda
              </Text>
              <Text size="md" c="rgba(255,255,255,0.78)" style={{ lineHeight: 1.5, maxWidth: 260 }}>
                Estás a pocos pasos de dejar configurado tu servicio y empezar a recibir reservas.
              </Text>
            </Stack>

            <WizardProgress current={activeIndex} total={steps.length} dark />
          </Stack>

          <Stack gap={4}>
            {steps.map((step, index) => (
              <Box key={step.id}>
                <StepIndicator
                  step={step}
                  stepIndex={index}
                  activeIndex={activeIndex}
                  summary={summaries[step.id]}
                  onClick={() => onStepClick(index)}
                  dark
                />

                {index < steps.length - 1 && (
                  <Box
                    ml={26}
                    style={{
                      width: 1,
                      height: 16,
                      backgroundColor:
                        index < activeIndex ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.14)',
                      margin: '2px 0 2px 26px',
                    }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
      </ScrollArea>
    </Box>
  );
}
