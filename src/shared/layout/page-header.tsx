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
      <Box>
        <Title order={2}>{title}</Title>

        {description && (
          <Text c="dimmed" size="sm" mt={4}>
            {description}
          </Text>
        )}
      </Box>

      {actions}
    </Group>
  );
}
