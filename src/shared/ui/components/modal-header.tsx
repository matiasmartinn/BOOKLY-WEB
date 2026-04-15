import { Box, Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface ModalHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
}

export function ModalHeader({ title, description, eyebrow, meta }: ModalHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
      <Stack gap={6} maw={520}>
        {eyebrow ? (
          <Text size="xs" fw={700} tt="uppercase" c="brand.6">
            {eyebrow}
          </Text>
        ) : null}

        {title ? (
          <Title
            order={3}
            style={{
              color: 'var(--app-color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Title>
        ) : null}

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

      {meta ? <Box>{meta}</Box> : null}
    </Group>
  );
}
