import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';

interface QuickActionCardProps {
  label: string;
  description: string;
  icon: IconDefinition;
  onClick: () => void;
  disabled?: boolean;
}

export function QuickActionCard({
  label,
  description,
  icon,
  onClick,
  disabled = false,
}: QuickActionCardProps) {
  return (
    <UnstyledButton
      onClick={disabled ? undefined : onClick}
      style={{
        width: '100%',
        borderRadius: 'var(--mantine-radius-lg)',
        border: '1px solid var(--mantine-color-default-border)',
        padding: '0.9rem',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <Group align="flex-start" wrap="nowrap" gap="sm">
        <ThemeIcon size="lg" radius="md" variant="light" color="brand">
          <FontAwesomeIcon icon={icon} />
        </ThemeIcon>

        <Stack gap={2} flex={1}>
          <Text fw={600}>{label}</Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
}
