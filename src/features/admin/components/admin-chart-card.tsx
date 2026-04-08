import { Box, Center, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { PageCard } from 'shared/layout';

interface AdminChartCardProps {
  title: string;
  description?: string;
  headerAside?: ReactNode;
  footer?: ReactNode;
  chartHeight?: number;
  children: ReactNode;
}

export function AdminChartCard({
  title,
  description,
  headerAside,
  footer,
  chartHeight = 288,
  children,
}: AdminChartCardProps) {
  return (
    <PageCard>
      <Stack gap="lg">
        <Stack gap="sm">
          <Text fw={600}>{title}</Text>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
          {headerAside}
        </Stack>

        <Box h={chartHeight}>{children}</Box>

        {footer}
      </Stack>
    </PageCard>
  );
}

export function AdminEmptyChartState({ message }: { message: string }) {
  return (
    <Center h="100%">
      <Text size="sm" c="dimmed" ta="center" maw={320}>
        {message}
      </Text>
    </Center>
  );
}
