import { Box, Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

import classes from './modal-header.module.css';

interface ModalHeaderProps {
  title?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
}

export function ModalHeader({ title, eyebrow, meta }: ModalHeaderProps) {
  return (
    <Group
      className={classes.root}
      data-with-meta={meta ? 'true' : undefined}
      align="flex-start"
      wrap="wrap"
      gap="md"
    >
      <Stack className={classes.copy} gap={6}>
        {eyebrow ? (
          <Text className={classes.eyebrow} size="xs" fw={700} tt="uppercase">
            {eyebrow}
          </Text>
        ) : null}

        {title ? (
          <Title order={3} className={classes.title}>
            {title}
          </Title>
        ) : null}
      </Stack>

      {meta ? <Box className={classes.meta}>{meta}</Box> : null}
    </Group>
  );
}
