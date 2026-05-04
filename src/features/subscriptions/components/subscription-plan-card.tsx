import { Group, Paper, Stack, Text, Badge, Button } from '@mantine/core';
import type { SubscriptionPlanOptionDto } from 'shared/models';

import {
  formatPlanLimitsSummary,
  getPlanChangeTypeLabel,
  getSubscriptionPlanDisplayName,
} from '../utils/subscription.utils';

import styles from './subscription-plan-card.module.css';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlanOptionDto;
  isMutating: boolean;
  onSubmit: (plan: SubscriptionPlanOptionDto) => void;
}
const isFreePlan = (plan: SubscriptionPlanOptionDto) => plan.key?.trim().toLowerCase() === 'free';

export function SubscriptionPlanCard({ plan, isMutating, onSubmit }: SubscriptionPlanCardProps) {
  const changeTypeLabel = getPlanChangeTypeLabel(plan.changeType);
  const planName = getSubscriptionPlanDisplayName(plan);
  const normalizedPlanKey = plan.key?.trim().toLowerCase();
  const planToneClass =
    normalizedPlanKey === 'max'
      ? styles.planMax
      : normalizedPlanKey === 'pro'
        ? styles.planPro
        : styles.planFree;
  const canSubmitPlanChange = plan.canChange && Boolean(plan.key?.trim() || plan.code != null);
  const buttonColor = normalizedPlanKey === 'max' ? 'violetAccent' : 'brand';

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      className={[
        styles.card,
        planToneClass,
        plan.isCurrent ? styles.current : styles.interactive,
      ].join(' ')}
    >
      <Stack gap="md" className={styles.cardBody}>
        <Stack gap="xs">
          <Text size="lg" fw={700}>
            {planName}
          </Text>

          <Group gap={6} wrap="wrap">
            {plan.isCurrent && (
              <Badge color="brand" variant="light">
                ACTUAL
              </Badge>
            )}

            {changeTypeLabel && !plan.isCurrent && (
              <Badge color="info" variant="light">
                {changeTypeLabel}
              </Badge>
            )}

            {!isFreePlan(plan) && (
              <Badge color={buttonColor} variant="light">
                Mensual
              </Badge>
            )}
          </Group>
        </Stack>

        <Text size="sm" c="dimmed" className={styles.limits}>
          {formatPlanLimitsSummary(plan.limits)}
        </Text>

        {plan.isCurrent ? (
          <Button variant="default" disabled fullWidth className={styles.actionButton}>
            Plan actual
          </Button>
        ) : !canSubmitPlanChange ? (
          <Button variant="default" disabled fullWidth className={styles.actionButton}>
            No disponible
          </Button>
        ) : (
          <Button
            variant="light"
            color={buttonColor}
            onClick={() => onSubmit(plan)}
            disabled={isMutating}
            fullWidth
            className={styles.actionButton}
          >
            Cambiar plan
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
