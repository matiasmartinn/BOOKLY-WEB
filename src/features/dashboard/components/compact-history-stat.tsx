import { Group, Paper, Text } from '@mantine/core';

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
      radius="md"
      p="sm"
      style={{
        background: backgroundColor,
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
          {label}
        </Text>
        <Text size="lg" fw={600}>
          {value}
        </Text>
      </Group>
    </Paper>
  );
}
