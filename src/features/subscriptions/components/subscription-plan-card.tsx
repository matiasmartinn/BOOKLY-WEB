import { Group, Paper, Stack, Text, Badge, Button } from '@mantine/core';
import type { SubscriptionPlanOptionDto } from 'shared/models';

import {
  formatPlanLimitsSummary,
  getPlanChangeTypeLabel,
  getSubscriptionPlanDisplayName,
} from '../utils/subscription.utils';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlanOptionDto;
  isMutating: boolean;
  onSubmit: (plan: SubscriptionPlanOptionDto) => void;
}
const isFreePlan = (plan: SubscriptionPlanOptionDto) => plan.key?.trim().toLowerCase() === 'free';

export function SubscriptionPlanCard({ plan, isMutating, onSubmit }: SubscriptionPlanCardProps) {
  const changeTypeLabel = getPlanChangeTypeLabel(plan.changeType);
  const planName = getSubscriptionPlanDisplayName(plan);
  const canSubmitPlanChange = plan.canChange && Boolean(plan.key?.trim() || plan.code != null);

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{
        borderColor: plan.isCurrent ? 'var(--app-color-brand-outline)' : 'var(--app-color-border)',
        backgroundColor: plan.isCurrent ? 'var(--app-color-surface-soft)' : 'var(--app-color-surface)',
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Stack gap={4} flex={1}>
            <Group gap="xs" wrap="wrap">
              <Text fw={600}>{planName}</Text>

              {plan.isCurrent && (
                <Badge color="brand" variant="light">
                  Actual
                </Badge>
              )}

              {changeTypeLabel && !plan.isCurrent && (
                <Badge color="info" variant="light">
                  {changeTypeLabel}
                </Badge>
              )}

              {!isFreePlan(plan) && (
                <Badge color="violetAccent" variant="light">
                  Mes automatico
                </Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed">
              {formatPlanLimitsSummary(plan.limits)}
            </Text>

            {!canSubmitPlanChange && (
              <Text size="sm" c="error.4">
                {plan.unavailableReason || 'Este plan no se puede seleccionar en este momento.'}
              </Text>
            )}
          </Stack>

          {plan.isCurrent ? (
            <Button variant="default" disabled>
              Plan actual
            </Button>
          ) : !canSubmitPlanChange ? (
            <Button variant="default" disabled>
              No disponible
            </Button>
          ) : (
            <Button variant="light" onClick={() => onSubmit(plan)} disabled={isMutating}>
              Cambiar plan
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
