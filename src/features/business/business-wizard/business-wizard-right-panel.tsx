import { Badge, Box, Button, Group, ScrollArea, Stack, Text, ThemeIcon } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { WizardStep } from './components';

interface WizardRightPanelProps {
  step: WizardStep;
  stepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  /** El formulario o contenido del paso activo */
  children?: React.ReactNode;
}

export function WizardRightPanel({
  step,
  isLastStep,
  onBack,
  onNext,
  onCancel,
  stepIndex,
  totalSteps,
  isSubmitting,
  children,
}: WizardRightPanelProps) {
  return (
    <Box
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <ScrollArea style={{ flex: 1 }}>
        <Box
          maw={880}
          mx="auto"
          px={{ base: 'md', sm: 'xl', lg: 56 }}
          pt={{ base: 'xl', sm: 40 }}
          pb={120}
        >
          <Stack gap={28}>
            {/* Header */}
            <Stack gap={10}>
              <Badge variant="light" color="brand" radius="xl" w="fit-content">
                Paso {stepIndex + 1} de {totalSteps}
              </Badge>

              <Stack gap={6}>
                <Text
                  fw={800}
                  size="2.25rem"
                  c="dark"
                  style={{ lineHeight: 1.05, letterSpacing: '-0.03em' }}
                >
                  {step.label}
                </Text>
                <Text size="md" c="dimmed" style={{ lineHeight: 1.55, maxWidth: 620 }}>
                  {step.description}
                </Text>
              </Stack>
            </Stack>

            {/* Contenido del paso — formulario real o placeholder */}
            {children ?? (
              <Box
                style={{
                  minHeight: 280,
                  border: '1px dashed var(--mantine-color-default-border)',
                  borderRadius: 20,
                  background: 'rgba(79, 70, 229, 0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 32,
                }}
              >
                <Stack align="center" gap={8}>
                  <ThemeIcon size={48} radius="xl" variant="light" color="brand">
                    <FontAwesomeIcon icon={step.icon} style={{ fontSize: 18 }} />
                  </ThemeIcon>
                  <Text size="md" c="dimmed" ta="center">
                    Formulario del paso{' '}
                    <Text span fw={700} c="brand.6">
                      {step.label}
                    </Text>{' '}
                    pendiente de implementación.
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Reemplazá este bloque por el componente real del paso.
                  </Text>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </ScrollArea>

      {/* Footer de navegación */}
      <Box
        style={{
          borderTop: '1px solid var(--mantine-color-default-border)',
          backgroundColor: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Box maw={880} mx="auto" px={{ base: 'md', sm: 'xl', lg: 56 }} py="md">
          <Group justify="space-between">
            <Button variant="subtle" color="gray" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>

            <Group gap="sm">
              {stepIndex > 0 && (
                <Button variant="default" onClick={onBack} disabled={isSubmitting}>
                  Anterior
                </Button>
              )}
              <Button color="brand" onClick={onNext} loading={isSubmitting}>
                {isLastStep ? 'Publicar servicio' : 'Continuar'}
              </Button>
            </Group>
          </Group>
        </Box>
      </Box>
    </Box>
  );
}
