import { Paper } from '@mantine/core';
import type { ReactNode } from 'react';

interface PageCardProps {
  children: ReactNode;
}

export function PageCard({ children }: PageCardProps) {
  return (
    <Paper
      radius="lg"
      p="xl"
      withBorder
      style={{
        background: 'var(--app-color-surface)',
        borderColor: 'var(--app-color-border)',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)',
      }}
    >
      {children}
    </Paper>
  );
}
