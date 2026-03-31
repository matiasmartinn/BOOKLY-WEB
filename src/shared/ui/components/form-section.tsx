import { Group, Paper, Stack, Text, type MantineSpacing, type PaperProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface FormSectionProps extends Omit<PaperProps, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  contentGap?: MantineSpacing;
}

export function FormSection({
  title,
  description,
  aside,
  children,
  contentGap = 'md',
  withBorder = true,
  radius = 'lg',
  p = 'lg',
  ...paperProps
}: FormSectionProps) {
  return (
    <Paper withBorder={withBorder} radius={radius} p={p} {...paperProps}>
      <Stack gap={contentGap}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Stack gap={4} maw={520}>
            <Text fw={600}>{title}</Text>

            {description ? (
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            ) : null}
          </Stack>

          {aside}
        </Group>

        {children}
      </Stack>
    </Paper>
  );
}
