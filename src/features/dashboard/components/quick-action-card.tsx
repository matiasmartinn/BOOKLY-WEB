import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';

import classes from './quick-action-card.module.css';

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
      className={classes.quickAction}
      data-disabled={disabled ? 'true' : undefined}
      style={{
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
