import { Group, Text } from '@mantine/core';

interface SummaryItemProps {
  label: string;
  value: string;
  light?: boolean;
}

export function SummaryItem({ label, value, light = false }: SummaryItemProps) {
  return (
    <Group justify="space-between" wrap="nowrap" gap={8}>
      <Text size="xs" c={light ? 'rgba(255,255,255,0.65)' : 'dimmed'} style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text
        size="xs"
        fw={500}
        ta="right"
        truncate
        c={light ? 'white' : undefined}
        style={{ maxWidth: '60%' }}
      >
        {value}
      </Text>
    </Group>
  );
}
