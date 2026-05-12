import {
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  type MantineSpacing,
  type PaperProps,
} from '@mantine/core';
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
  p = 'xl',
  style,
  ...paperProps
}: FormSectionProps) {
  return (
    <Paper
      withBorder={withBorder}
      radius={radius}
      p={p}
      style={{
        background: 'var(--app-color-surface)',
        borderColor: 'var(--app-color-border)',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.03)',
        ...style,
      }}
      {...paperProps}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Stack gap={6} maw={560}>
            <Text
              size="lg"
              fw={700}
              style={{
                color: 'var(--app-color-text-primary)',
                letterSpacing: 0,
              }}
            >
              {title}
            </Text>

            {description ? (
              <Text
                size="sm"
                style={{
                  color: 'var(--app-color-text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                {description}
              </Text>
            ) : null}
          </Stack>

          {aside}
        </Group>

        <Divider color="var(--app-color-border)" />

        <Stack gap={contentGap}>{children}</Stack>
      </Stack>
    </Paper>
  );
}
