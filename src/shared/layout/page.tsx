import { Box, Container, Stack } from '@mantine/core';
import type { ReactNode } from 'react';

import { PageHeader } from './page-header';

export interface PageProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  contentMaxWidth?: number | string;
  children: ReactNode;
}

export function Page({ title, description, actions, contentMaxWidth, children }: PageProps) {
  return (
    <Container fluid px={0} m={0} w="100%" style={{ minWidth: 0 }}>
      <Box w="100%" maw={contentMaxWidth} style={{ minWidth: 0 }}>
        <Stack gap="lg" w="100%" style={{ minWidth: 0 }}>
          <PageHeader title={title} description={description} actions={actions} />

          {children}
        </Stack>
      </Box>
    </Container>
  );
}
