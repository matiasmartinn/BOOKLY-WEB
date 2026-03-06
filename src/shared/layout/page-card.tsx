import { Paper } from '@mantine/core';
import type { ReactNode } from 'react';

interface PageCardProps {
  children: ReactNode;
}

export function PageCard({ children }: PageCardProps) {
  return (
    <Paper
      radius="lg"
      p="lg"
      withBorder
      style={{
        background: 'white',
      }}
    >
      {children}
    </Paper>
  );
}
