import { Stack } from '@mantine/core';
import type { ReactNode } from 'react';
import { PageHeader } from './page-header';

interface PageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, description, actions, children }: PageShellProps) {
  return (
    <Stack gap="lg">
      <PageHeader title={title} description={description} actions={actions} />

      {children}
    </Stack>
  );
}
