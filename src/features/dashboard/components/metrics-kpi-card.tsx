import { Paper, Stack, Text } from '@mantine/core';
import { appColorVars } from 'shared/ui/theme/theme';

interface MetricsKpiCardProps {
  label: string;
  value: string;
  meta: string;
  accentColor?: string;
  accentBackground?: string;
}

export function MetricsKpiCard({
  label,
  value,
  meta,
  accentColor = 'var(--mantine-color-gray-3)',
  accentBackground = 'var(--mantine-color-gray-0)',
}: MetricsKpiCardProps) {
  return (
    <Paper
      radius="lg"
      p="md"
      withBorder
      shadow="xs"
      style={{
        height: '100%',
        backgroundColor: accentBackground,
        borderLeft: `4px solid ${accentColor}`,
        borderColor: appColorVars.border,
      }}
    >
      <Stack gap="sm" justify="space-between" h="100%">
        <Stack gap={4}>
          <Text size="xs" fw={700} c={appColorVars.textSecondary} tt="uppercase">
            {label}
          </Text>

          <Text fz={30} fw={800} lh={1.05}>
            {value}
          </Text>
        </Stack>

        <Text size="sm" c={appColorVars.textSecondary} lh={1.3} lineClamp={2}>
          {meta}
        </Text>
      </Stack>
    </Paper>
  );
}
