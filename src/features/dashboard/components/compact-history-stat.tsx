import { Paper, Stack, Text } from '@mantine/core';
import { appColorVars } from 'shared/ui/theme/theme';

interface CompactHistoryStatProps {
  label: string;
  value: string;
  accentColor: string;
  backgroundColor: string;
}

export function CompactHistoryStat({
  label,
  value,
  accentColor,
  backgroundColor,
}: CompactHistoryStatProps) {
  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      style={{
        minHeight: 118,
        height: '100%',
        background: backgroundColor,
        borderLeft: `3px solid ${accentColor}`,
        borderColor: appColorVars.border,
        boxShadow: '0 8px 22px rgba(15, 23, 42, 0.035)',
      }}
    >
      <Stack gap={4} justify="space-between" h="100%">
        <Text fz={32} fw={800} lh={1.05} c={appColorVars.textPrimary}>
          {value}
        </Text>
        <Text size="xs" fw={700} c={appColorVars.textSecondary} lh={1.2}>
          {label}
        </Text>
      </Stack>
    </Paper>
  );
}
