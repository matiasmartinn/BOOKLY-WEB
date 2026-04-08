import { Badge, Button, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { PageCard } from 'shared/layout';
import { appColorVars } from 'shared/ui/theme/theme';

export interface AdminSectionBadge {
  label: string;
  value: string;
  color: string;
}

interface AdminSectionCardProps {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonTo: string;
  badges: AdminSectionBadge[];
  footer?: string;
}

export function AdminSectionCard({
  title,
  description,
  buttonLabel,
  buttonTo,
  badges,
  footer,
}: AdminSectionCardProps) {
  return (
    <PageCard>
      <Stack gap="lg">
        <Group
          justify="space-between"
          align={description ? 'flex-start' : 'center'}
          gap="md"
          wrap="wrap"
        >
          <Stack gap={2} maw={520}>
            <Text fw={600}>{title}</Text>
            {description ? (
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            ) : null}
          </Stack>

          <Button component={Link} to={buttonTo} variant="default" style={{ flexShrink: 0 }}>
            {buttonLabel}
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {badges.map((badge) => (
            <Group
              key={badge.label}
              justify="space-between"
              align="center"
              gap="sm"
              p="md"
              style={{
                border: `1px solid ${appColorVars.borderSoft}`,
                borderRadius: 12,
                background: appColorVars.surfaceSoft,
              }}
            >
              <Text size="sm" fw={500} c="dimmed">
                {badge.label}
              </Text>
              <Badge color={badge.color} variant="light" radius="sm">
                {badge.value}
              </Badge>
            </Group>
          ))}
        </SimpleGrid>

        {footer ? (
          <Text size="sm" c="dimmed">
            {footer}
          </Text>
        ) : null}
      </Stack>
    </PageCard>
  );
}
