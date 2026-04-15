import { Box, Group, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap">
      <Box maw={680}>
        <Title
          order={2}
          style={{
            color: 'var(--app-color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Title>

        {description && (
          <Text
            size="md"
            mt={6}
            style={{
              color: 'var(--app-color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Text>
        )}
      </Box>

      {actions}
    </Group>
  );
}
