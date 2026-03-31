import { Paper, Stack, Text } from '@mantine/core';

interface DashboardStatCardProps {
  label: string;
  value: string;
  description: string;
}

export function DashboardStatCard({ label, value, description }: DashboardStatCardProps) {
  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap={6}>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
          {label}
        </Text>
        <Text size="xl" fw={700}>
          {value}
        </Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
    </Paper>
  );
}
