import { Badge, Stack, Text, Title } from '@mantine/core';

import classes from '../home-page.module.css';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <Stack gap="sm" maw={700}>
      {eyebrow && (
        <Badge variant="light" color="brand" radius="xl" className={classes.sectionBadge}>
          {eyebrow}
        </Badge>
      )}
      <Title order={2} className={classes.sectionTitle}>
        {title}
      </Title>
      <Text size="md" c="dimmed" className={classes.sectionDescription}>
        {description}
      </Text>
    </Stack>
  );
}
