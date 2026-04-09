import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Group, Stack, UnstyledButton, Text } from '@mantine/core';

import type { WizardStep } from './business-wizard-step';
import { SummaryItem } from './summary-items';

type StepStatus = 'completed' | 'active' | 'pending';

function getStepStatus(stepIndex: number, activeIndex: number): StepStatus {
  if (stepIndex < activeIndex) return 'completed';
  if (stepIndex === activeIndex) return 'active';
  return 'pending';
}

interface StepIndicatorProps {
  step: WizardStep;
  stepIndex: number;
  activeIndex: number;
  summary?: { label: string; value: string }[];
  onClick: () => void;
  dark?: boolean;
}

export function StepIndicator({
  step,
  stepIndex,
  activeIndex,
  summary,
  onClick,
  dark = false,
}: StepIndicatorProps) {
  const status = getStepStatus(stepIndex, activeIndex);
  const isClickable = status === 'completed';

  const numberBg: Record<StepStatus, string> = dark
    ? {
        completed: 'rgba(255,255,255,0.22)',
        active: 'var(--mantine-color-brand-5)',
        pending: 'transparent',
      }
    : {
        completed: 'var(--mantine-color-brand-6)',
        active: 'var(--mantine-color-brand-6)',
        pending: 'var(--mantine-color-default)',
      };

  const numberColor: Record<StepStatus, string> = dark
    ? {
        completed: 'white',
        active: 'white',
        pending: 'rgba(255,255,255,0.7)',
      }
    : {
        completed: 'white',
        active: 'white',
        pending: 'var(--mantine-color-dimmed)',
      };

  const numberBorder: Record<StepStatus, string> = dark
    ? {
        completed: 'none',
        active: 'none',
        pending: '1px solid rgba(255,255,255,0.18)',
      }
    : {
        completed: 'none',
        active: 'none',
        pending: '0.5px solid var(--mantine-color-default-border)',
      };

  return (
    <UnstyledButton
      onClick={isClickable ? onClick : undefined}
      style={{
        width: '100%',
        cursor: isClickable ? 'pointer' : 'default',
        borderRadius: '14px',
        padding: '10px 12px',
        backgroundColor:
          status === 'active'
            ? dark
              ? 'rgba(255,255,255,0.08)'
              : 'var(--mantine-color-brand-0)'
            : 'transparent',
        transition: 'background-color 140ms ease',
      }}
      onMouseEnter={(e) => {
        if (!isClickable) return;
        (e.currentTarget as HTMLElement).style.backgroundColor = dark
          ? 'rgba(255,255,255,0.06)'
          : 'var(--mantine-color-default-hover)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          status === 'active'
            ? dark
              ? 'rgba(255,255,255,0.08)'
              : 'var(--mantine-color-brand-0)'
            : 'transparent';
      }}
    >
      <Group gap={10} wrap="nowrap" align="flex-start">
        <Box
          w={28}
          h={28}
          style={{
            borderRadius: '50%',
            backgroundColor: numberBg[status],
            border: numberBorder[status],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {status === 'completed' ? (
            <FontAwesomeIcon icon={faCheck} style={{ fontSize: 10, color: 'white' }} />
          ) : (
            <Text
              fw={700}
              style={{
                color: numberColor[status],
                fontSize: 11,
                lineHeight: 1,
              }}
            >
              {stepIndex + 1}
            </Text>
          )}
        </Box>

        <Stack gap={3} style={{ flex: 1, overflow: 'hidden' }}>
          <Text
            size="sm"
            fw={status === 'active' ? 700 : status === 'completed' ? 600 : 500}
            c={
              dark
                ? 'white'
                : status === 'pending'
                  ? 'dimmed'
                  : status === 'active'
                    ? 'brand.7'
                    : undefined
            }
          >
            {step.label}
          </Text>

          {status !== 'completed' && (
            <Text
              size="xs"
              c={dark ? 'rgba(255,255,255,0.68)' : 'dimmed'}
              style={{ lineHeight: 1.35 }}
            >
              {step.description}
            </Text>
          )}

          {status === 'completed' && summary && summary.length > 0 && (
            <Stack gap={4} mt={2}>
              {summary.map((s) => (
                <SummaryItem key={s.label} label={s.label} value={s.value} light={dark} />
              ))}
            </Stack>
          )}

          {status === 'active' && step.subSteps && (
            <Stack gap={4} mt={6}>
              {step.subSteps.map((sub) => (
                <Group key={sub.id} gap={7} wrap="nowrap">
                  <Box
                    w={5}
                    h={5}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: dark
                        ? 'rgba(255,255,255,0.65)'
                        : 'var(--mantine-color-brand-4)',
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    size="xs"
                    c={dark ? 'rgba(255,255,255,0.84)' : 'brand.6'}
                    style={{ lineHeight: 1.3 }}
                  >
                    {sub.label}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Group>
    </UnstyledButton>
  );
}
