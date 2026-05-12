import { Badge, Box, Button, Group, Progress, ScrollArea, Stack, Text } from '@mantine/core';

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
        <Box hiddenFrom="sm">
          <Progress
            value={((stepIndex + 1) / totalSteps) * 100}
            size="sm"
            color="brand"
            radius={0}
          />
        </Box>
        <Box
          maw={880}
          w="100%"
          ml={{ base: 0, lg: 48, xl: 96 }}
          mr="auto"
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
                  style={{ lineHeight: 1.05, letterSpacing: 0 }}
                >
                  {step.label}
                </Text>
                <Text size="md" c="dimmed" style={{ lineHeight: 1.55, maxWidth: 620 }}>
                  {step.description}
                </Text>
              </Stack>
            </Stack>

            {/* Contenido del paso */}
            {children}
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
        <Box
          maw={880}
          w="100%"
          ml={{ base: 0, lg: 48, xl: 96 }}
          mr="auto"
          px={{ base: 'md', sm: 'xl', lg: 56 }}
          py="md"
        >
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
