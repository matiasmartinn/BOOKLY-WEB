import { Box, Group, Stack, Text } from '@mantine/core';

export function WizardProgress({
  current,
  total,
  dark = false,
}: {
  current: number;
  total: number;
  dark?: boolean;
}) {
  const pct = Math.round((current / total) * 100);

  return (
    <Stack gap={6}>
      <Group justify="space-between">
        <Text size="xs" c={dark ? 'rgba(255,255,255,0.7)' : 'dimmed'}>
          Progreso
        </Text>
        <Text size="xs" fw={600} c={dark ? 'white' : 'brand.6'}>
          {pct}%
        </Text>
      </Group>

      <Box
        h={5}
        style={{
          borderRadius: 999,
          backgroundColor: dark ? 'rgba(255,255,255,0.14)' : 'var(--mantine-color-default-border)',
          overflow: 'hidden',
        }}
      >
        <Box
          h="100%"
          style={{
            width: `${pct}%`,
            borderRadius: 999,
            backgroundColor: dark ? 'white' : 'var(--mantine-color-brand-6)',
            transition: 'width 300ms ease',
          }}
        />
      </Box>
    </Stack>
  );
}
