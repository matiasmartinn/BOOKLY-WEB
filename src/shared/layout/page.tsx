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
    <Container fluid px={0}>
      <Stack gap="lg">
        <PageHeader title={title} description={description} actions={actions} />

        {children}
      </Stack>
    </Container>
  );
}
