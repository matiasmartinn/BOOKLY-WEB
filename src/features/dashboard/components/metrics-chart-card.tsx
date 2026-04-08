import { Box, Center, Paper, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { appColorVars } from 'shared/ui/theme/theme';

interface MetricsChartCardProps {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  chartHeight?: number;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'xs' | 'sm' | 'md';
  titleSize?: 'md' | 'lg';
  backgroundColor?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function MetricsChartCard({
  title,
  description,
  footer,
  children,
  chartHeight = 240,
  padding = 'md',
  shadow = 'sm',
  titleSize = 'md',
  backgroundColor,
  gap = 'sm',
}: MetricsChartCardProps) {
  return (
    <Paper
      radius="lg"
      p={padding}
      withBorder
      shadow={shadow}
      style={{
        backgroundColor: backgroundColor ?? appColorVars.surface,
        borderColor: appColorVars.border,
      }}
    >
      <Stack gap={gap}>
        <Stack gap={4}>
          <Text fw={600} size={titleSize}>
            {title}
          </Text>
          {description ? (
            <Text size="sm" c={appColorVars.textSecondary}>
              {description}
            </Text>
          ) : null}
        </Stack>

        <Box h={chartHeight}>{children}</Box>

        {footer}
      </Stack>
    </Paper>
  );
}

export function EmptyChartState({ message }: { message: string }) {
  return (
    <Center h="100%">
      <Text size="sm" c={appColorVars.textSecondary} ta="center" maw={320}>
        {message}
      </Text>
    </Center>
  );
}
