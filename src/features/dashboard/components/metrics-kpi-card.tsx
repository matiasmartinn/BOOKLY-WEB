import { Badge, Paper, Stack, Text } from '@mantine/core';

type TrendTone = 'positive' | 'negative' | 'neutral' | 'muted';

interface MetricsKpiCardProps {
  label: string;
  value: string;
  caption: string;
  trendLabel?: string;
  trendTone?: TrendTone;
}

const trendColorByTone: Record<TrendTone, string> = {
  positive: 'green',
  negative: 'red',
  neutral: 'gray',
  muted: 'blue',
};

export function MetricsKpiCard({
  label,
  value,
  caption,
  trendLabel,
  trendTone = 'neutral',
}: MetricsKpiCardProps) {
  return (
    <Paper
      radius="lg"
      p="md"
      withBorder
      style={{
        height: '100%',
        background:
          'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,249,255,1) 100%)',
      }}
    >
      <Stack gap="xs" justify="space-between" h="100%">
        <Stack gap={6}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
            {label}
          </Text>

          <Text size="2rem" fw={700} lh={1}>
            {value}
          </Text>
        </Stack>

        <Stack gap={8}>
          {trendLabel && (
            <Badge color={trendColorByTone[trendTone]} variant="light" radius="sm" w="fit-content">
              {trendLabel}
            </Badge>
          )}

          <Text size="sm" c="dimmed">
            {caption}
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}
