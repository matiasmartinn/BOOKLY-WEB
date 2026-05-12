import { Paper, Stack, Text } from '@mantine/core';
import { appColorVars } from 'shared/ui/theme/theme';

interface MetricsKpiCardProps {
  label: string;
  value: string;
  meta: string;
  accentColor?: string;
  accentBackground?: string;
  metaMuted?: boolean;
}

export function MetricsKpiCard({
  label,
  value,
  meta,
  accentColor = 'var(--mantine-color-gray-3)',
  accentBackground = 'var(--mantine-color-gray-0)',
  metaMuted = false,
}: MetricsKpiCardProps) {
  return (
    <Paper
      radius="lg"
      p="md"
      withBorder
      style={{
        minHeight: 132,
        height: '100%',
        backgroundColor: accentBackground,
        borderLeft: `3px solid ${accentColor}`,
        borderColor: appColorVars.border,
        boxShadow: '0 8px 22px rgba(15, 23, 42, 0.035)',
      }}
    >
      <Stack gap="md" justify="space-between" h="100%">
        <Stack gap={6}>
          <Text size="xs" fw={700} c={appColorVars.textSecondary}>
            {label}
          </Text>

          <Text fz={32} fw={800} lh={1.05} c={appColorVars.textPrimary}>
            {value}
          </Text>
        </Stack>

        <Text
          size="sm"
          c={metaMuted ? appColorVars.textMuted : appColorVars.textSecondary}
          lh={1.35}
          lineClamp={2}
          style={
            metaMuted
              ? {
                  width: 'fit-content',
                  maxWidth: '100%',
                  padding: '4px 8px',
                  borderRadius: 'var(--mantine-radius-sm)',
                  backgroundColor: appColorVars.surfaceSoft,
                  border: `1px solid ${appColorVars.border}`,
                }
              : undefined
          }
        >
          {meta}
        </Text>
      </Stack>
    </Paper>
  );
}
