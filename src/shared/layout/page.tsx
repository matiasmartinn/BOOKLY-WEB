import { Container, Stack } from '@mantine/core';
import type { ReactNode } from 'react';

import { PageHeader } from './page-header';

export interface PageProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Page({ title, description, actions, children }: PageProps) {
  return (
    <Container fluid px={0} m={0} w="100%" style={{ minWidth: 0 }}>
      <Stack gap="lg" w="100%" style={{ minWidth: 0 }}>
        <PageHeader title={title} description={description} actions={actions} />

        {children}
      </Stack>
    </Container>
  );
}
