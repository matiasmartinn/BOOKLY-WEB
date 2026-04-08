import { Paper, Stack, Text } from '@mantine/core';

interface DashboardStatCardProps {
  label: string;
  value: string;
  description?: string;
}

export function DashboardStatCard({ label, value, description }: DashboardStatCardProps) {
  const hasDescription = Boolean(description);

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap={hasDescription ? 3 : 2}>
        <Text fz={hasDescription ? 30 : 36} fw={800} lh={1.05}>
          {value}
        </Text>
        <Text size={hasDescription ? 'xs' : 'sm'} fw={500} c="dimmed" lh={1.2}>
          {label}
        </Text>
        {hasDescription && (
          <Text size="sm" c="dimmed" lh={1.4}>
            {description}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
