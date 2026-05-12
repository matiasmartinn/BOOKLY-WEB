import { Paper, Stack, Text } from '@mantine/core';
import { appColorVars } from 'shared/ui/theme/theme';

interface DashboardStatCardProps {
  label: string;
  value: string;
  description?: string;
  accentColor?: string;
  accentBackground?: string;
}

export function DashboardStatCard({
  label,
  value,
  description,
  accentColor = 'var(--mantine-color-brand-5)',
  accentBackground = appColorVars.surface,
}: DashboardStatCardProps) {
  const hasDescription = Boolean(description);

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      style={{
        minHeight: hasDescription ? 142 : 118,
        height: '100%',
        background: accentBackground,
        borderLeft: `3px solid ${accentColor}`,
        borderColor: appColorVars.border,
        boxShadow: '0 8px 22px rgba(15, 23, 42, 0.035)',
      }}
    >
      <Stack gap={hasDescription ? 6 : 4} justify="space-between" h="100%">
        <Text fz={hasDescription ? 30 : 32} fw={800} lh={1.05} c={appColorVars.textPrimary}>
          {value}
        </Text>
        <Text size="xs" fw={700} c={appColorVars.textSecondary} lh={1.2}>
          {label}
        </Text>
        {hasDescription && (
          <Text size="sm" c={appColorVars.textSecondary} lh={1.4}>
            {description}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
