import { Group, Paper, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { appColorVars } from 'shared/ui/theme/theme';

interface FilterSurfaceProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export const filterFieldStyles = {
  label: {
    color: appColorVars.textSecondary,
    fontSize: 'var(--mantine-font-size-xs)',
    fontWeight: 600,
    marginBottom: 4,
  },
} as const;

export function FilterSurface({ title, description, actions, children }: FilterSurfaceProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <Paper
      radius="lg"
      p="md"
      withBorder
      style={{
        backgroundColor: appColorVars.surface,
        borderColor: appColorVars.border,
        boxShadow: '0 8px 22px rgba(15, 23, 42, 0.035)',
      }}
    >
      <Stack gap="md">
        {hasHeader ? (
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
            <Stack gap={3} maw={560}>
              {title ? (
                <Text size="sm" fw={700} c={appColorVars.textPrimary}>
                  {title}
                </Text>
              ) : null}

              {description ? (
                <Text size="sm" c={appColorVars.textSecondary} lh={1.45}>
                  {description}
                </Text>
              ) : null}
            </Stack>

            {actions}
          </Group>
        ) : null}

        {children}
      </Stack>
    </Paper>
  );
}
